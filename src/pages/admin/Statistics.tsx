import React from 'react';
import { Users, FileText, MessageCircle, Heart, TrendingUp, Calendar } from 'lucide-react';
import AdminLayout from './AdminLayout';

export default function Statistics() {
  // 模拟数据
  const weeklyData = [
    { day: '周一', users: 12, posts: 8, comments: 45 },
    { day: '周二', users: 15, posts: 12, comments: 56 },
    { day: '周三', users: 18, posts: 15, comments: 67 },
    { day: '周四', users: 14, posts: 10, comments: 48 },
    { day: '周五', users: 22, posts: 18, comments: 89 },
    { day: '周六', users: 28, posts: 25, comments: 112 },
    { day: '周日', users: 25, posts: 20, comments: 98 },
  ];

  const categoryStats = [
    { category: '分享', count: 2345, percentage: 45 },
    { category: '求助', count: 1234, percentage: 24 },
    { category: '交流', count: 1567, percentage: 31 },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">数据统计</h1>
          <p className="text-gray-500 mt-1">平台运营数据分析</p>
        </div>

        {/* Weekly Stats */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-800">近7天数据趋势</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>2024年6月1日 - 6月7日</span>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-4">
            {weeklyData.map((data) => (
              <div key={data.day} className="text-center">
                <div className="text-sm text-gray-500 mb-2">{data.day}</div>
                <div className="space-y-2">
                  <div className="bg-blue-100 rounded-lg p-2">
                    <div className="text-xs text-blue-600">用户</div>
                    <div className="text-lg font-bold text-blue-700">{data.users}</div>
                  </div>
                  <div className="bg-emerald-100 rounded-lg p-2">
                    <div className="text-xs text-emerald-600">帖子</div>
                    <div className="text-lg font-bold text-emerald-700">{data.posts}</div>
                  </div>
                  <div className="bg-purple-100 rounded-lg p-2">
                    <div className="text-xs text-purple-600">评论</div>
                    <div className="text-lg font-bold text-purple-700">{data.comments}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-800 mb-6">帖子分类分布</h3>
            <div className="space-y-4">
              {categoryStats.map((stat) => (
                <div key={stat.category}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700">{stat.category}</span>
                    <span className="text-gray-500">{stat.count} 篇 ({stat.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        stat.category === '分享' ? 'bg-blue-500' :
                        stat.category === '求助' ? 'bg-orange-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${stat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-800 mb-6">用户活跃度</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">日活跃用户</p>
                    <p className="text-sm text-gray-500">过去24小时</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-gray-800">156</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <FileText className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">日均发帖</p>
                    <p className="text-sm text-gray-500">过去7天平均</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-gray-800">15.4</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">日均评论</p>
                    <p className="text-sm text-gray-500">过去7天平均</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-gray-800">73.6</span>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">总用户数</p>
                <p className="text-3xl font-bold mt-1">1,234</p>
              </div>
              <Users className="w-10 h-10 text-blue-200" />
            </div>
            <div className="flex items-center mt-4 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+12% 较上月</span>
            </div>
          </div>
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm">总帖子数</p>
                <p className="text-3xl font-bold mt-1">5,678</p>
              </div>
              <FileText className="w-10 h-10 text-emerald-200" />
            </div>
            <div className="flex items-center mt-4 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+8% 较上月</span>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">总评论数</p>
                <p className="text-3xl font-bold mt-1">12,345</p>
              </div>
              <MessageCircle className="w-10 h-10 text-purple-200" />
            </div>
            <div className="flex items-center mt-4 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+23% 较上月</span>
            </div>
          </div>
          <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-100 text-sm">总点赞数</p>
                <p className="text-3xl font-bold mt-1">45,678</p>
              </div>
              <Heart className="w-10 h-10 text-pink-200" />
            </div>
            <div className="flex items-center mt-4 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+15% 较上月</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
