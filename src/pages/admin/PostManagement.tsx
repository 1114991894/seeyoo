import React, { useState, useEffect } from 'react';
import { Search, Trash2, Eye, MoreHorizontal } from 'lucide-react';
import AdminLayout from './AdminLayout';

interface Post {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar: string;
  title: string;
  content: string;
  category: string;
  likes_count: number;
  comments_count: number;
  status: 'active' | 'deleted';
  created_at: string;
}

export default function PostManagement() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | '分享' | '求助' | '交流'>('all');

  useEffect(() => {
    const savedPosts = localStorage.getItem('shenxiaoyou_posts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || post.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDeletePost = (postId: string) => {
    if (confirm('确定要删除这篇帖子吗？')) {
      setPosts(prev => prev.filter(post => post.id !== postId));
      // 更新localStorage
      const savedPosts = localStorage.getItem('shenxiaoyou_posts');
      if (savedPosts) {
        const updatedPosts = JSON.parse(savedPosts).filter((p: Post) => p.id !== postId);
        localStorage.setItem('shenxiaoyou_posts', JSON.stringify(updatedPosts));
      }
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">帖子管理</h1>
          <p className="text-gray-500 mt-1">管理平台所有帖子内容</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索帖子标题或内容"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none w-64"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
            >
              <option value="all">全部分类</option>
              <option value="分享">分享</option>
              <option value="求助">求助</option>
              <option value="交流">交流</option>
            </select>
          </div>
          <div className="text-gray-500">
            共 {filteredPosts.length} 篇帖子
          </div>
        </div>

        {/* Posts Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">帖子信息</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">作者</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">分类</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">互动</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">发布时间</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-800 line-clamp-1">{post.title}</p>
                      <p className="text-sm text-gray-500 line-clamp-1">{post.content}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <img 
                        src={post.user_avatar} 
                        alt={post.user_name}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="text-gray-600">{post.user_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      post.category === '分享' ? 'bg-blue-100 text-blue-800' :
                      post.category === '求助' ? 'bg-orange-100 text-orange-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {post.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <div className="flex items-center space-x-4">
                      <span>{post.likes_count} 赞</span>
                      <span>{post.comments_count} 评论</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(post.created_at).toLocaleDateString('zh-CN')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="查看详情"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="删除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
