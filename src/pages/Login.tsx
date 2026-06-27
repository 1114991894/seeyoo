import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Github, Mail, Lock, User as UserIcon, Eye, EyeOff, KeyRound } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AUTH_SERVER_URL = process.env.AUTH_SERVER_URL || 'http://localhost:3001';

function getEmailLoginUrl(email: string): string | null {
  const domain = email.split('@')[1]?.toLowerCase() || '';
  const emailUrls: Record<string, string> = {
    'qq.com': 'https://mail.qq.com',
    'foxmail.com': 'https://mail.qq.com',
    '163.com': 'https://mail.163.com',
    '126.com': 'https://mail.126.com',
    'sina.com': 'https://mail.sina.com.cn',
    'sina.cn': 'https://mail.sina.com.cn',
    'gmail.com': 'https://mail.google.com',
    'outlook.com': 'https://outlook.live.com',
    'hotmail.com': 'https://outlook.live.com',
    'live.com': 'https://outlook.live.com',
    'aliyun.com': 'https://mail.aliyun.com',
    'icloud.com': 'https://www.icloud.com/mail',
    'yeah.net': 'https://mail.yeah.net',
    'sohu.com': 'https://mail.sohu.com',
    '189.cn': 'https://mail.189.cn',
    '139.com': 'https://mail.10086.cn',
    'exmail.qq.com': 'https://exmail.qq.com/login',
  };
  if (emailUrls[domain]) return emailUrls[domain];
  return `https://mail.${domain}`;
}

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [registered, setRegistered] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [resendSent, setResendSent] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');

  const { emailLogin, register, resetPassword, resendVerification, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    const urlError = searchParams.get('error');
    const errorCode = searchParams.get('error_code');
    const errorDesc = searchParams.get('error_description');

    if (urlError) {
      if (urlError === 'access_denied' && (errorDesc?.includes('otp_expired') || errorCode === 'otp_expired')) {
        setError('验证链接已过期，请重新发起验证');
        setShowResendVerification(true);
      } else if (urlError === 'access_denied') {
        setError('验证链接无效或已过期，请重新注册');
      } else {
        switch (urlError) {
          case 'no_code':
            setError('授权失败：未获取到授权码');
            break;
          case 'token_failed':
            setError('授权失败：获取访问令牌失败');
            break;
          case 'auth_failed':
            setError('授权失败：认证过程出错');
            break;
          default:
            setError(errorDesc || '登录失败，请重试');
        }
      }
    }
  }, [searchParams]);

  const switchMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setError('');
    setEmail('');
    setPassword('');
    setNickname('');
    setRegistered(false);
    setShowForgotPassword(false);
    setForgotSent(false);
    setShowResendVerification(false);
    setResendSent(false);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const result = await emailLogin(email, password);
        if (result.success) {
          navigate('/');
        } else {
          setError(result.message);
        }
      } else {
        const result = await register(email, password, nickname);
        if (result.success) {
          if (result.needsVerification) {
            setRegistered(true);
          } else {
            navigate('/');
          }
        } else {
          setError(result.message);
        }
      }
    } catch (err: any) {
      setError(err?.message || '操作失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.includes('@')) {
      setError('请先输入邮箱地址');
      return;
    }
    setForgotLoading(true);
    setError('');
    const result = await resetPassword(email);
    if (result.success) {
      setForgotSent(true);
    } else {
      setError(result.message);
    }
    setForgotLoading(false);
  };

  const handleResendVerification = async () => {
    if (!email.includes('@')) {
      setError('请先输入邮箱地址');
      return;
    }
    setResendLoading(true);
    setError('');
    const result = await resendVerification(email);
    if (result.success) {
      setResendSent(true);
      setError('');
      const emailUrl = getEmailLoginUrl(email);
      if (emailUrl) {
        window.open(emailUrl, '_blank');
      }
    } else {
      setError(result.message);
    }
    setResendLoading(false);
  };

  const handleGithubLogin = () => {
    setIsLoading(true);
    setError('');
    window.location.href = `${AUTH_SERVER_URL}/auth/github`;
  };

  if (registered) {
    const emailUrl = getEmailLoginUrl(email);
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">注册成功！</h2>
          <p className="text-gray-500 mb-6">
            验证邮件已发送至 <strong className="text-gray-700">{email}</strong>
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-700 mb-6 text-left">
            <p className="font-medium mb-1">📧 请完成邮箱验证</p>
            <p>前往您的邮箱，点击验证链接完成注册。完成后即可使用邮箱和密码登录。</p>
          </div>
          <div className="flex space-x-3">
            {emailUrl && (
              <a
                href={emailUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 border-2 border-emerald-500 text-emerald-600 rounded-lg font-medium hover:bg-emerald-50 transition-colors text-center"
              >
                打开邮箱
              </a>
            )}
            <button
              onClick={() => switchMode('login')}
              className={`py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors ${emailUrl ? 'flex-1' : 'w-full'}`}
            >
              去登录
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <KeyRound className="w-8 h-8 text-emerald-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">找回密码</h2>
            <p className="text-gray-500 mt-2 text-sm">我们将向您的邮箱发送重置密码链接</p>
          </div>

          {forgotSent ? (
            <div className="text-center">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-700 mb-6">
                <p className="font-medium">✅ 密码已发送至注册账户邮箱</p>
                <p className="mt-1">请登录您的邮箱查收重置密码邮件。</p>
              </div>
              <div className="flex space-x-3">
                {getEmailLoginUrl(email) && (
                  <a
                    href={getEmailLoginUrl(email)!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 border-2 border-emerald-500 text-emerald-600 rounded-lg font-medium hover:bg-emerald-50 transition-colors text-center"
                  >
                    打开邮箱
                  </a>
                )}
                <button
                  onClick={() => { setShowForgotPassword(false); setForgotSent(false); }}
                  className={`py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors ${getEmailLoginUrl(email) ? 'flex-1' : 'w-full'}`}
                >
                  返回登录
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">邮箱</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="请输入注册邮箱"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  />
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>
              )}

              <button
                onClick={handleForgotPassword}
                disabled={forgotLoading}
                className="w-full py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-3"
              >
                {forgotLoading ? '发送中...' : '发送重置密码邮件'}
              </button>

              <button
                onClick={() => { setShowForgotPassword(false); setForgotSent(false); }}
                className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                返回登录
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
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

        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => switchMode('login')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
              mode === 'login'
                ? 'bg-white text-emerald-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            登录
          </button>
          <button
            onClick={() => switchMode('register')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
              mode === 'register'
                ? 'bg-white text-emerald-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            注册
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
            {showResendVerification && (
              <div className="mt-3 space-y-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="请输入注册邮箱"
                  className="w-full px-3 py-2 border border-red-200 rounded text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                {resendSent ? (
                  <div className="space-y-2">
                    <div className="bg-green-50 border border-green-200 rounded p-2 text-green-700 text-xs">
                      ✅ 验证邮件已发送（24小时内有效）
                    </div>
                    <a
                      href={getEmailLoginUrl(email) || `https://mail.${email.split('@')[1]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-2 bg-emerald-500 text-white rounded text-sm font-medium hover:bg-emerald-600 transition-colors text-center"
                    >
                      进入注册邮箱进行验证
                    </a>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={resendLoading}
                    className="w-full py-2 bg-emerald-500 text-white rounded text-sm font-medium hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {resendLoading ? '发送中...' : '重新发起验证'}
                  </button>
                )}
              </div>
            )}
            {error.includes('请先验证') && email && !showResendVerification && (
              <div className="mt-2">
                <a
                  href={getEmailLoginUrl(email) || `https://mail.${email.split('@')[1]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200 transition-colors"
                >
                  打开邮箱
                </a>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleEmailSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">昵称</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="请输入昵称"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">邮箱</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="请输入邮箱地址"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">密码</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'register' ? '请设置密码（至少6位）' : '请输入密码'}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
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

          {mode === 'login' && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline"
              >
                找回密码
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? '处理中...' : mode === 'login' ? '登录' : '注册'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-400">其他方式</span>
          </div>
        </div>

        <button
          onClick={handleGithubLogin}
          disabled={isLoading}
          className="w-full py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-3"
        >
          <Github className="w-5 h-5" />
          <span>{isLoading ? '正在跳转...' : '使用 GitHub 账号登录'}</span>
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          登录即表示您同意
          <a href="#/terms" className="text-emerald-600 hover:underline"> 用户协议 </a>
          和
          <a href="#/privacy" className="text-emerald-600 hover:underline"> 隐私政策 </a>
        </p>
      </div>
    </div>
  );
}