import React, { useEffect, useState } from 'react';
import { Users, FileText, MessageCircle, Heart } from 'lucide-react';
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
    users: 0,
    posts: 0,
    comments: 0,
    likes: 0,
    todayUsers: 0,
    todayPosts: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    // 从localStorage加载实际数据
    const posts = JSON.parse(localStorage.getItem('shenxiaoyou_posts') || '[]');
    const users = JSON.parse(localStorage.getItem('shenxiaoyou_users') || '[]');
    
    // 统计评论数
    let commentsCount = 0;
    posts.forEach((post: any) => {
      const comments = JSON.parse(localStorage.getItem(`shenxiaoyou_comments_${post.id}`) || '[]');
      commentsCount += comments.length;
    });

    // 统计点赞数
    let likesCount = 0;
    posts.forEach((post: any) => {
      likesCount += post.likes_count || 0;
    });

    // 统计今日新增（基于创建时间）
    const today = new Date().toDateString();
    const todayPosts = posts.filter((post: any) => {
      const postDate = new Date(post.created_at).toDateString();
      return postDate === today;
    }).length;

    const todayUsers = users.filter((user: any) => {
      const userDate = new Date(user.created_at || Date.now()).toDateString();
      return userDate === today;
    }).length;
    
    setStats({
      posts: posts.length,
      users: users.length,
      comments: commentsCount,
      likes: likesCount,
      todayUsers: todayUsers,
      todayPosts: todayPosts,
    });
  };

  const statCards = [
    { 
      label: '总用户数', 
      value: stats.users, 
      icon: Users, 
      color: 'bg-blue-500'
    },
    { 
      label: '总帖子数', 
      value: stats.posts, 
      icon: FileText, 
      color: 'bg-emerald-500'
    },
    { 
      label: '总评论数', 
      value: stats.comments, 
      icon: MessageCircle, 
      color: 'bg-purple-500'
    },
    { 
      label: '总点赞数', 
      value: stats.likes, 
      icon: Heart, 
      color: 'bg-pink-500'
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
              <div className="flex items-center mt-4 text-sm text-gray-400">
                <span>实时数据</span>
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
                <span className="text-gray-600">政策文章数</span>
                <span className="font-semibold text-gray-800">
                  {JSON.parse(localStorage.getItem('shenxiaoyou_policy_articles') || '[]').length} 篇
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">保健文章数</span>
                <span className="font-semibold text-gray-800">
                  {JSON.parse(localStorage.getItem('shenxiaoyou_health_articles') || '[]').length} 篇
                </span>
              </div>
            </div>
          </div>

          {/* Content Overview */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-800 mb-4">内容概览</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span className="text-gray-700">总用户数</span>
                </div>
                <span className="font-semibold text-blue-600">{stats.users} 人</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                  <span className="text-gray-700">总帖子数</span>
                </div>
                <span className="font-semibold text-emerald-600">{stats.posts} 篇</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
                  <span className="text-gray-700">总评论数</span>
                </div>
                <span className="font-semibold text-purple-600">{stats.comments} 条</span>
              </div>
            </div>
          </div>
        </div>


      </div>
    </AdminLayout>
  );
}