import React, { useEffect, useState } from 'react';
import { Users, FileText, MessageCircle, Heart, Calendar } from 'lucide-react';
import AdminLayout from './AdminLayout';

interface WeeklyData {
  day: string;
  users: number;
  posts: number;
  comments: number;
}

interface CategoryStat {
  category: string;
  count: number;
  percentage: number;
}

export default function Statistics() {
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const [avgDailyPosts, setAvgDailyPosts] = useState(0);
  const [avgDailyComments, setAvgDailyComments] = useState(0);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = () => {
    const posts = JSON.parse(localStorage.getItem('shenxiaoyou_posts') || '[]');
    const users = JSON.parse(localStorage.getItem('shenxiaoyou_users') || '[]');

    // 统计评论数
    let commentsCount = 0;
    let likesCount = 0;
    posts.forEach((post: any) => {
      const comments = JSON.parse(localStorage.getItem(`shenxiaoyou_comments_${post.id}`) || '[]');
      commentsCount += comments.length;
      likesCount += post.likes_count || 0;
    });

    setTotalUsers(users.length);
    setTotalPosts(posts.length);
    setTotalComments(commentsCount);
    setTotalLikes(likesCount);

    // 计算过去7天的数据
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const weekly: WeeklyData[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      const dayName = days[date.getDay()];

      const dayPosts = posts.filter((post: any) => {
        const postDate = new Date(post.created_at).toDateString();
        return postDate === dateStr;
      }).length;

      const dayUsers = users.filter((user: any) => {
        const userDate = new Date(user.created_at || Date.now()).toDateString();
        return userDate === dateStr;
      }).length;

      let dayComments = 0;
      posts.forEach((post: any) => {
        const comments = JSON.parse(localStorage.getItem(`shenxiaoyou_comments_${post.id}`) || '[]');
        dayComments += comments.filter((comment: any) => {
          const commentDate = new Date(comment.created_at).toDateString();
          return commentDate === dateStr;
        }).length;
      });

      weekly.push({
        day: dayName,
        users: dayUsers,
        posts: dayPosts,
        comments: dayComments,
      });
    }
    setWeeklyData(weekly);

    // 计算分类统计
    const categories: Record<string, number> = {};
    posts.forEach((post: any) => {
      const cat = post.category || '未分类';
      categories[cat] = (categories[cat] || 0) + 1;
    });

    const total = posts.length || 1;
    const stats: CategoryStat[] = Object.entries(categories).map(([category, count]) => ({
      category,
      count,
      percentage: Math.round((count / total) * 100),
    }));
    setCategoryStats(stats);

    // 计算平均值
    const activeDays = weekly.filter(d => d.posts > 0).length || 1;
    const activeCommentDays = weekly.filter(d => d.comments > 0).length || 1;
    setAvgDailyPosts(Number((posts.length / activeDays).toFixed(1)));
    setAvgDailyComments(Number((commentsCount / activeCommentDays).toFixed(1)));
  };

  // 获取日期范围
  const getDateRange = () => {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 6);
    return `${weekAgo.getFullYear()}年${weekAgo.getMonth() + 1}月${weekAgo.getDate()}日 - ${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;
  };

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
              <span>{getDateRange()}</span>
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
            {categoryStats.length > 0 ? (
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
            ) : (
              <div className="text-center text-gray-500 py-8">
                <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>暂无帖子数据</p>
              </div>
            )}
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
                    <p className="font-medium text-gray-800">总用户数</p>
                    <p className="text-sm text-gray-500">注册用户总数</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-gray-800">{totalUsers}</span>
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
                <span className="text-2xl font-bold text-gray-800">{avgDailyPosts}</span>
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
                <span className="text-2xl font-bold text-gray-800">{avgDailyComments}</span>
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
                <p className="text-3xl font-bold mt-1">{totalUsers.toLocaleString()}</p>
              </div>
              <Users className="w-10 h-10 text-blue-200" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm">总帖子数</p>
                <p className="text-3xl font-bold mt-1">{totalPosts.toLocaleString()}</p>
              </div>
              <FileText className="w-10 h-10 text-emerald-200" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">总评论数</p>
                <p className="text-3xl font-bold mt-1">{totalComments.toLocaleString()}</p>
              </div>
              <MessageCircle className="w-10 h-10 text-purple-200" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-100 text-sm">总点赞数</p>
                <p className="text-3xl font-bold mt-1">{totalLikes.toLocaleString()}</p>
              </div>
              <Heart className="w-10 h-10 text-pink-200" />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}