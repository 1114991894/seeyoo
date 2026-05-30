import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, FileText, Heart, User } from 'lucide-react';

export default function BottomNav() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: Home, label: '首页' },
    { path: '/community', icon: Users, label: '社区' },
    { path: '/policy', icon: FileText, label: '政策' },
    { path: '/health', icon: Heart, label: '保健' },
    { path: '/profile', icon: User, label: '我的' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full space-y-1 ${
                isActive ? 'text-emerald-600' : 'text-gray-500'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-emerald-600' : 'text-gray-400'}`} />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
