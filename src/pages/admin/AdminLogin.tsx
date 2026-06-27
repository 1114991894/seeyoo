import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Eye, EyeOff } from 'lucide-react';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 管理员账号验证
      if (username === 'xiaoyou001' && password === 'seeyoo.vip') {
        localStorage.setItem('shenxiaoyou_admin', JSON.stringify({ username, role: 'admin' }));
        console.log('[AdminLogin] 管理员登录成功');
        navigate('/admin/dashboard');
        return;
      }
      
      // 检查分管理员账号
      const subAdminsData = localStorage.getItem('shenxiaoyou_sub_admins');
      if (subAdminsData) {
        const subAdmins = JSON.parse(subAdminsData);
        const subAdmin = subAdmins.find((a: any) => 
          a.username === username && 
          a.password === password && 
          a.status === 'active'
        );
        if (subAdmin) {
          localStorage.setItem('shenxiaoyou_admin', JSON.stringify({
            username: subAdmin.username,
            role: 'subadmin',
            permissions: subAdmin.permissions,
          }));
          console.log('[AdminLogin] 分管理员登录成功');
          navigate('/admin/dashboard');
          return;
        }
      }
      
      setError('用户名或密码错误');
    } catch (err) {
      console.error('[AdminLogin] 登录错误:', err);
      setError('登录失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">肾小友—管理员后台</h1>
          <p className="text-gray-500 mt-2">肾病患者互助平台</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">用户名</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入用户名"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all"
            />
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
                placeholder="请输入密码"
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all"
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
            className="w-full py-3 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? '登录中...' : '登录'}
          </button>
        </form>

        {/* Back to home */}
        <a href="#/" className="block text-center text-sm text-gray-500 mt-6 hover:text-gray-700">
          返回首页
        </a>
      </div>
    </div>
  );
}