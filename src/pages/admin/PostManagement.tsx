import React, { useState, useEffect } from 'react';
import { Search, Trash2, Eye, Star, X } from 'lucide-react';
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
  is_recommended?: boolean;
  recommended_at?: string;
}

export default function PostManagement() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | '分享' | '求助' | '交流'>('all');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    const savedPosts = localStorage.getItem('shenxiaoyou_posts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }
  }, []);

  const savePosts = (newPosts: Post[]) => {
    setPosts(newPosts);
    localStorage.setItem('shenxiaoyou_posts', JSON.stringify(newPosts));
  };

  const groupPostsByDate = (postsToGroup: Post[]) => {
    const groups: { [key: string]: Post[] } = {};
    postsToGroup.forEach(post => {
      const date = new Date(post.created_at).toLocaleDateString('zh-CN');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(post);
    });
    return groups;
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || post.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedPosts = groupPostsByDate(filteredPosts);
  const sortedDates = Object.keys(groupedPosts).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  const handleDeletePost = (postId: string) => {
    if (confirm('确定要删除这篇帖子吗？')) {
      savePosts(posts.filter(post => post.id !== postId));
    }
  };

  const handleToggleRecommend = (postId: string) => {
    savePosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          is_recommended: !post.is_recommended,
          recommended_at: !post.is_recommended ? new Date().toISOString() : undefined
        };
      }
      return post;
    }));
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

        {/* Posts List */}
        <div className="space-y-4">
          {sortedDates.map(date => (
            <div key={date} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-6 py-3 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-800">{date}</span>
                <span className="text-xs text-gray-500">{groupedPosts[date].length} 篇</span>
              </div>
              <div className="divide-y divide-gray-200">
                {groupedPosts[date].map((post) => (
                  <div key={post.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center space-x-2 mb-1">
                        {post.is_recommended && (
                          <span className="inline-flex items-center px-1.5 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                            <Star className="w-3 h-3 mr-0.5" />
                            推荐
                          </span>
                        )}
                        <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                          post.category === '分享' ? 'bg-blue-100 text-blue-800' :
                          post.category === '求助' ? 'bg-orange-100 text-orange-800' :
                          'bg-emerald-100 text-emerald-800'
                        }`}>
                          {post.category}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-gray-800 line-clamp-1">{post.title}</p>
                      <p className="text-xs text-gray-600 line-clamp-1">{post.content}</p>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                        <span>{post.user_name}</span>
                        <span>{post.likes_count} 赞</span>
                        <span>{post.comments_count} 评论</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => setSelectedPost(post)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="查看详情"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleRecommend(post.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          post.is_recommended
                            ? 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                        title={post.is_recommended ? '取消推荐' : '推荐'}
                      >
                        <Star className={`w-4 h-4 ${post.is_recommended ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="删除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500">暂无帖子</p>
          </div>
        )}
      </div>

      {/* Post Detail Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">帖子详情</h2>
              <button
                onClick={() => setSelectedPost(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <img 
                  src={selectedPost.user_avatar} 
                  alt={selectedPost.user_name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-medium text-gray-800">{selectedPost.user_name}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(selectedPost.created_at).toLocaleString('zh-CN')}
                  </p>
                </div>
                {selectedPost.is_recommended && (
                  <span className="ml-auto inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                    <Star className="w-3 h-3 mr-1" />
                    已推荐
                  </span>
                )}
              </div>
              <div>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full mb-3 ${
                  selectedPost.category === '分享' ? 'bg-blue-100 text-blue-800' :
                  selectedPost.category === '求助' ? 'bg-orange-100 text-orange-800' :
                  'bg-emerald-100 text-emerald-800'
                }`}>
                  {selectedPost.category}
                </span>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{selectedPost.title}</h3>
                <p className="text-gray-600 whitespace-pre-wrap">{selectedPost.content}</p>
              </div>
              <div className="flex items-center space-x-6 pt-4 border-t border-gray-200">
                <span className="text-gray-600">{selectedPost.likes_count} 赞</span>
                <span className="text-gray-600">{selectedPost.comments_count} 评论</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
