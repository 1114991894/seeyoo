 import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

interface User {
  id: string;
  nickname: string;
  email?: string;
  avatar_url?: string;
  bio?: string;
  github_id?: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (userData: User) => Promise<boolean>;
  emailLogin: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (email: string, password: string, nickname: string) => Promise<{ success: boolean; message: string; needsVerification?: boolean }>;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  resendVerification: (email: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapSupabaseUser(sUser: any): User {
  const meta = sUser.user_metadata || {};
  return {
    id: sUser.id,
    nickname: meta.nickname || meta.full_name || sUser.email || '',
    email: sUser.email,
    avatar_url: meta.avatar_url || '',
    bio: meta.bio || '',
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 从 localStorage 恢复用户会话
    const savedUser = localStorage.getItem('shenxiaoyou_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
      } catch (e) {
        localStorage.removeItem('shenxiaoyou_user');
      }
    }

    // 检查 URL 中是否有 GitHub OAuth 回调传递的用户数据
    const hash = window.location.hash;
    if (hash.includes('github_user=')) {
      try {
        const params = new URLSearchParams(hash.split('?')[1] || '');
        const userParam = params.get('github_user');
        if (userParam) {
          const githubUser: User = JSON.parse(decodeURIComponent(userParam));
          setUser(githubUser);
          localStorage.setItem('shenxiaoyou_user', JSON.stringify(githubUser));
          window.location.hash = '#/';
          setIsLoading(false);
          return;
        }
      } catch (e) {
        console.error('[Auth] 解析 GitHub 用户数据失败:', e);
      }
    }

    // 检查 Supabase 会话（如果用户是通过邮箱注册/登录的）
    if (supabase) {
      supabase.auth.getSession().then(res => {
        if (res.data?.session?.user) {
          const su = mapSupabaseUser(res.data.session.user);
          setUser(su);
          localStorage.setItem('shenxiaoyou_user', JSON.stringify(su));
        }
        setIsLoading(false);
      }).catch(() => setIsLoading(false));

      // 监听 auth 状态变化（邮箱验证、会话刷新等）
      const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
        if (session?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED')) {
          const su = mapSupabaseUser(session.user);
          setUser(su);
          localStorage.setItem('shenxiaoyou_user', JSON.stringify(su));
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem('shenxiaoyou_user');
        }
      });

      return () => {
        listener?.subscription.unsubscribe();
      };
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (userData: User): Promise<boolean> => {
    try {
      setUser(userData);
      localStorage.setItem('shenxiaoyou_user', JSON.stringify(userData));
      return true;
    } catch (e) {
      console.error('[Auth] 登录失败:', e);
      return false;
    }
  }, []);

  // 邮箱 + 密码登录（通过 Supabase）
  const emailLogin = useCallback(async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      if (!supabase) {
        return { success: false, message: '认证服务未配置，请联系管理员' };
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        console.error('[Auth] Supabase 登录错误:', error.message);
        if (error.message.includes('Invalid login credentials')) {
          return { success: false, message: '邮箱或密码错误' };
        }
        if (error.message.includes('Email not confirmed')) {
          return {
            success: false,
            message: `请先验证 ${email.trim().toLowerCase()}，查收验证邮件后重试`,
          };
        }
        return { success: false, message: '登录失败，请联系管理员' };
      }

      // 获取用户信息
      const { data: { user: sUser } } = await supabase.auth.getUser();
      if (sUser) {
        const su = mapSupabaseUser(sUser);
        setUser(su);
        localStorage.setItem('shenxiaoyou_user', JSON.stringify(su));
      }

      return { success: true, message: '登录成功' };
    } catch (e: any) {
      console.error('[Auth] 邮箱登录失败:', e);
      return { success: false, message: '登录失败，请重试' };
    }
  }, []);

  // 邮箱 + 密码注册（通过 Supabase，自动发送验证邮件）
  const register = useCallback(async (email: string, password: string, nickname: string): Promise<{ success: boolean; message: string; needsVerification?: boolean }> => {
    try {
      if (!supabase) {
        return { success: false, message: '认证服务未配置，请联系管理员' };
      }

      if (password.length < 6) {
        return { success: false, message: '密码至少需要6位' };
      }

      if (!email.includes('@') || !email.includes('.')) {
        return { success: false, message: '请输入正确的邮箱地址' };
      }

      if (!nickname || nickname.trim().length === 0) {
        return { success: false, message: '请输入昵称' };
      }

      const { error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            nickname: nickname.trim(),
          },
          emailRedirectTo: 'https://seeyoo.vip',
        },
      });

      if (error) {
        console.error('[Auth] Supabase 注册错误:', error.message);
        if (error.message.includes('already registered') || error.message.includes('User already')) {
          return { success: false, message: '该邮箱已被注册，请直接登录' };
        }
        return { success: false, message: '注册失败，请联系管理员' };
      }

      // Supabase 默认会发送验证邮件（配置了腾讯企业邮箱 SMTP）
      return {
        success: true,
        message: '注册成功！请查收验证邮件，完成邮箱验证后即可登录。',
        needsVerification: true,
      };
    } catch (e: any) {
      console.error('[Auth] 注册失败:', e);
      return { success: false, message: '注册失败，请重试' };
    }
  }, []);

  // 发送重置密码邮件
  const resetPassword = useCallback(async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      if (!supabase) {
        return { success: false, message: '认证服务未配置，请联系管理员' };
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase());
      if (error) {
        console.error('[Auth] 重置密码错误:', error.message);
        return { success: false, message: '发送失败，请检查邮箱是否正确' };
      }

      return { success: true, message: '密码已发送至注册账户邮箱' };
    } catch (e: any) {
      console.error('[Auth] 重置密码失败:', e);
      return { success: false, message: '发送失败，请重试' };
    }
  }, []);

  // 重新发送邮箱验证邮件
  const resendVerification = useCallback(async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      if (!supabase) {
        return { success: false, message: '认证服务未配置，请联系管理员' };
      }

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo: 'https://seeyoo.vip',
        },
      });

      if (error) {
        console.error('[Auth] 重新发送验证邮件错误:', error.message);
        if (error.message.includes('already confirmed') || error.message.includes('Email already confirmed')) {
          return { success: false, message: '该邮箱已验证，请直接登录' };
        }
        return { success: false, message: '发送失败，请检查邮箱是否正确' };
      }

      return { success: true, message: '验证邮件已发送，请查收邮件并点击验证链接' };
    } catch (e: any) {
      console.error('[Auth] 重新发送验证邮件失败:', e);
      return { success: false, message: '发送失败，请重试' };
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem('shenxiaoyou_user');
  }, []);

  const updateProfile = useCallback(async (data: Partial<User>): Promise<void> => {
    if (!user) return;

    // 如果是 Supabase 用户，同步更新到 Supabase
    if (supabase && user.email) {
      try {
        await supabase.auth.updateUser({
          data: { ...data },
        } as any);
      } catch (e) {
        console.error('[Auth] 更新 Supabase 用户信息失败:', e);
      }
    }

    // 更新本地状态
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem('shenxiaoyou_user', JSON.stringify(updated));
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, emailLogin, register, resetPassword, resendVerification, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('请确保在 AuthProvider 内部使用 useAuth');
  }
  return context;
}