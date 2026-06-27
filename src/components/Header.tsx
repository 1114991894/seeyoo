import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Search, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';

export default function Header() {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-emerald-500 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-7 bg-white/20 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-xs">肾小友</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-white/90 hover:text-white font-medium">首页</Link>
            <Link to="/community" className="text-white/90 hover:text-white font-medium">社区</Link>
            <Link to="/policy" className="text-white/90 hover:text-white font-medium">政策</Link>
            <Link to="/health" className="text-white/90 hover:text-white font-medium">保健</Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-3 md:space-x-4">
            {/* Search - Desktop */}
            <button 
              onClick={() => navigate('/search')}
              className="hidden md:flex items-center space-x-2 px-4 py-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
            >
              <Search className="w-4 h-4 text-white" />
              <span className="text-sm text-white">搜索</span>
            </button>

            {/* Search - Mobile */}
            <button 
              onClick={() => navigate('/search')}
              className="md:hidden p-2 hover:bg-white/20 rounded-full"
            >
              <Search className="w-5 h-5 text-white" />
            </button>

            {/* Notifications */}
            <Link to="/notifications" className="relative p-2 hover:bg-white/20 rounded-full">
              <Bell className="w-5 h-5 text-white" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Link>

            {/* User Avatar */}
            {user ? (
              <Link to="/profile" className="flex items-center space-x-2">
                <img 
                  src={user.avatar_url} 
                  alt={user.nickname}
                  className="w-8 h-8 rounded-full border-2 border-white/50"
                />
              </Link>
            ) : (
              <Link 
                to="/login" 
                className="flex items-center space-x-1 px-3 py-1.5 bg-white text-emerald-500 rounded-full text-sm hover:bg-white/90 transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">登录</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
