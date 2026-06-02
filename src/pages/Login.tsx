import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (phone.length !== 11) {
      setError('请输入正确的手机号');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('密码至少6位');
      setIsLoading(false);
      return;
    }

    try {
      const success = await login(phone, password);
      if (success) {
        navigate('/');
      } else {
        setError('手机号或密码错误');
      }
    } catch (err: any) {
      setError(err?.message || '登录失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (phone.length !== 11) {
      setError('请先输入手机号');
      return;
    }
    try {
      if (supabase) {
        // 使用 email 派生的账号发送重置密码邮件
        const { error } = await supabase.auth.resetPasswordForEmail(`${phone}@example.com`);
        if (error) setError(error.message);
        else alert('重置密码链接已发送到您绑定的邮箱（模拟手机号->邮箱转换）');
      } else {
        alert('密码重置功能需要配置 Supabase 环境变量');
      }
    } catch (e: any) {
      setError(e?.message || '发送失败');
    } finally {
      setShowForgotPassword(false);
    }
  };

  // 忘记密码弹窗
  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">忘记密码</h2>
          <p className="text-gray-500 mb-6">我们将向您的手机发送重置密码链接</p>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">手机号</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                placeholder="请输入手机号"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          <div className="flex space-x-3">
            <button
              onClick={() => setShowForgotPassword(false)}
              className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              返回
            </button>
            <button
              onClick={handleForgotPassword}
              className="flex-1 py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
            >
              发送链接
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
              <path d="M12 6c-2.5 0-4.5 2-4.5 4.5 0 2.5 2 4.5 4.5 4.5s4.5-2 4.5-4.5S14.5 6 12 6z"/>
              <path d="M12 15c-2.5 0-5 1.5-5 4v1h10v-1c0-2.5-2.5-4-5-4z"/>
              <circle cx="12" cy="10.5" r="2"/>
              <path d="M7 19c0-2.5 2.5-4 5-4s5 1.5 5 4"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">欢迎加入肾小友</h1>
          <p className="text-gray-500 mt-2">温暖的肾病互助社区</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">手机号</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                placeholder="请输入手机号"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">密码</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码（至少6位）"
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline"
            >
              忘记密码？
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? '登录中...' : '登录 / 注册'}
          </button>
        </form>

        {/* Terms */}
        <p className="text-xs text-gray-500 text-center mt-6">
          登录即表示您同意
          <a href="#/terms" className="text-emerald-600 hover:underline">用户协议</a>
          和
          <a href="#/privacy" className="text-emerald-600 hover:underline">隐私政策</a>
        </p>
      </div>
    </div>
  );
}
