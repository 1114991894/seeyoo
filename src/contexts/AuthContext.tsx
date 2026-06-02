import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';

interface User {
  id: string;
  phone: string;
  nickname: string;
  avatar_url?: string;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (phone: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    const session = supabase.auth.getSession();

    // 监听 auth 状态变化
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const u = mapSupabaseUser(session.user);
        setUser(u);
        localStorage.setItem('shenxiaoyou_user', JSON.stringify(u));
      } else {
        setUser(null);
        localStorage.removeItem('shenxiaoyou_user');
      }
      setIsLoading(false);
    });

    // 尝试从 localStorage 恢复（快速显示）
    const savedUser = localStorage.getItem('shenxiaoyou_user');
    if (savedUser) setUser(JSON.parse(savedUser));

    // 获取当前 session（首次加载）
    session.then(res => {
      if (res.data?.session?.user) {
        setUser(mapSupabaseUser(res.data.session.user));
      }
      setIsLoading(false);
    }).catch(() => setIsLoading(false));

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const mapSupabaseUser = (sUser: any): User => {
    return {
      id: sUser.id,
      phone: sUser.user_metadata?.phone || '',
      nickname: sUser.user_metadata?.nickname || sUser.email || '',
      avatar_url: sUser.user_metadata?.avatar_url || undefined,
      bio: sUser.user_metadata?.bio || undefined
    };
  };

  const login = async (phone: string, password: string): Promise<boolean> => {
    if (!supabase) {
      // 模拟登录，使用 localStorage
      const mockUser: User = {
        id: `user_${Date.now()}`,
        phone,
        nickname: `肾友${phone.slice(-4)}`,
      };
      setUser(mockUser);
      localStorage.setItem('shenxiaoyou_user', JSON.stringify(mockUser));
      return true;
    }

    const email = `${phone}@example.com`;

    // 先尝试登录，失败时再注册
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (!signInError) {
      return true;
    }

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          phone,
          nickname: `肾友${phone.slice(-4)}`
        }
      }
    });

    return !signUpError;
  };

  const logout = async (): Promise<void> => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem('shenxiaoyou_user');
  };

  const updateProfile = async (data: Partial<User>): Promise<void> => {
    if (!user) return;
    if (supabase) {
      // 仅更新 user_metadata
      const updates = {
        id: user.id,
        user_metadata: { ...data }
      };
      await supabase.auth.updateUser(updates as any);
    }
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem('shenxiaoyou_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
