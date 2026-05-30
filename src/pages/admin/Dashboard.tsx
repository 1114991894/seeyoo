import React, { useEffect, useState } from 'react';
import { Users, FileText, MessageCircle, Heart, TrendingUp, TrendingDown } from 'lucide-react';
import AdminLayout from './AdminLayout';

interface Stats {
  users: number;
  posts: number;
  comments: number;
  likes: number;
  todayUsers: number;
  todayPosts: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    users: 1234,
    posts: 5678,
    comments: 12345,
    likes: 45678,
    todayUsers: 23,
    todayPosts: 45,
  });

  useEffect(() => {
    // 从localStorage加载实际数据
    const posts = JSON.parse(localStorage.getItem('shenxiaoyou_posts') || '[]');
    const users = JSON.parse(localStorage.getItem('shenxiaoyou_users') || '[]');
    
    setStats(prev => ({
      ...prev,
      posts: posts.length,
      users: users.length || 1234,
    }));
  }, []);

  const statCards = [
    { 
      label: '总用户数', 
      value: stats.users, 
      icon: Users, 
      color: 'bg-blue-500',
      change: '+12',
      changeType: 'up'
    },
    { 
      label: '总帖子数', 
      value: stats.posts, 
      icon: FileText, 
      color: 'bg-emerald-500',
      change: '+8',
      changeType: 'up'
    },
    { 
      label: '总评论数', 
      value: stats.comments, 
      icon: MessageCircle, 
      color: 'bg-purple-500',
      change: '+23',
      changeType: 'up'
    },
    { 
      label: '总点赞数', 
      value: stats.likes, 
      icon: Heart, 
      color: 'bg-pink-500',
      change: '+156',
      changeType: 'up'
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">数据概览</h1>
          <p className="text-gray-500 mt-1">实时监控平台运营数据</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card) => (
            <div key={card.label} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{card.label}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {card.value.toLocaleString()}
                  </p>
                </div>
                <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                {card.changeType === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span className={card.changeType === 'up' ? 'text-emerald-500' : 'text-red-500'}>
                  {card.change}
                </span>
                <span className="text-gray-400 ml-1">较昨日</span>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Stats */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-800 mb-4">今日数据</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">新增用户</span>
                <span className="font-semibold text-gray-800">{stats.todayUsers} 人</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">新增帖子</span>
                <span className="font-semibold text-gray-800">{stats.todayPosts} 篇</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">活跃用户数</span>
                <span className="font-semibold text-gray-800">156 人</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">页面访问量</span>
                <span className="font-semibold text-gray-800">2,345 次</span>
              </div>
            </div>
          </div>

          {/* Pending Review */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-800 mb-4">待处理事项</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  <span className="text-gray-700">待审核帖子</span>
                </div>
                <span className="font-semibold text-yellow-600">12 篇</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="text-gray-700">举报内容</span>
                </div>
                <span className="font-semibold text-red-600">3 条</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span className="text-gray-700">用户反馈</span>
                </div>
                <span className="font-semibold text-blue-600">8 条</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
