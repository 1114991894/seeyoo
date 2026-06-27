import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, TrendingUp, MessageCircle, UserPlus, Plus, PenSquare } from 'lucide-react';
import PostCard from '../components/PostCard';
import ShareModal from '../components/ShareModal';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';

interface Post {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar: string;
  title: string;
  content: string;
  category: string;
  images: string[];
  likes_count: number;
  comments_count: number;
  created_at: string;
}

interface User {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  posts_count: number;
}

export default function Community() {
  const { user: currentUser } = useAuth();
  const { addNotification } = useNotifications();
  const [posts, setPosts] = useState<Post[]>([]);
  const [sharePost, setSharePost] = useState<Post | null>(null);
  const [activeTab, setActiveTab] = useState('hot');
  const navigate = useNavigate();

  const [users] = useState<User[]>([
    { id: '1', name: '阳光肾友', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sunshine', bio: '透析3年，积极乐观', posts_count: 45 },
    { id: '2', name: '坚强的小李', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=strong', bio: '等待移植中', posts_count: 32 },
    { id: '3', name: '希望之光', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hope', bio: '肾移植术后2年', posts_count: 28 },
    { id: '4', name: '微笑面对', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=smile', bio: '刚确诊，学习中', posts_count: 15 },
    { id: '5', name: '春暖花开', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=spring', bio: '腹透患者', posts_count: 56 },
  ]);

  useEffect(() => {
    const savedPosts = localStorage.getItem('shenxiaoyou_posts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }
  }, []);

  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  const handleLike = (postId: string) => {
    if (!currentUser) {
      if (confirm('请先登录')) {
        navigate('/login');
      }
      return;
    }
    
    setPosts(prev => {
      const updatedPosts = prev.map(post => {
        if (post.id === postId) {
          const isLiked = likedPosts.has(postId);
          const newCount = isLiked ? post.likes_count - 1 : post.likes_count + 1;
          if (!isLiked && post.user_id !== currentUser.id) {
            addNotification({
              user_id: post.user_id,
              sender_id: currentUser.id,
              sender_name: currentUser.nickname,
              sender_avatar: currentUser.avatar_url || '',
              type: 'like',
              content: `点赞了您的帖子《${post.title}》`,
              post_id: post.id,
              post_title: post.title
            });
          }
          return { ...post, likes_count: newCount };
        }
        return post;
      });
      localStorage.setItem('shenxiaoyou_posts', JSON.stringify(updatedPosts));
      return updatedPosts;
    });
    setLikedPosts(prev => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId); else next.add(postId);
      return next;
    });
  };

  const handleFollow = (user: User) => {
    if (!currentUser) {
      if (confirm('请先登录')) {
        navigate('/login');
      }
      return;
    }
    addNotification({
      user_id: user.id,
      sender_id: currentUser.id,
      sender_name: currentUser.nickname,
      sender_avatar: currentUser.avatar_url || '',
      type: 'follow',
      content: '关注了你'
    });
    alert(`已关注 ${user.name}`);
  };

  const tabs = [
    { id: 'hot', label: '热门', icon: TrendingUp },
    { id: 'new', label: '最新', icon: MessageCircle },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-3 mb-2">
            <Users className="w-8 h-8 text-gray-800" />
            <h1 className="text-2xl font-bold text-gray-800">社区广场</h1>
          </div>
          <p className="text-gray-600">发现志同道合的肾友，一起交流互助</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-14 md:top-16 z-40 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex space-x-6">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id 
                      ? 'border-purple-500 text-purple-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
            <Link
              to="/post/new"
              className="flex items-center space-x-1 px-3 py-1.5 bg-emerald-500 text-white rounded-full text-sm font-medium hover:bg-emerald-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>发布帖子</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Posts Feed */}
          <div className="lg:col-span-2 space-y-4">
            {posts.slice(0, 5).map(post => (
              <PostCard 
                key={post.id} 
                post={post} 
                onLike={() => handleLike(post.id)}
                onShare={() => setSharePost(post)}
              />
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Active Users */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="font-semibold text-gray-800 mb-4">活跃肾友</h3>
              <div className="space-y-3">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h4 className="font-medium text-gray-800 text-sm">{user.name}</h4>
                        <p className="text-gray-400 text-xs">{user.bio}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleFollow(user)}
                      className="p-1.5 text-purple-500 hover:bg-purple-50 rounded-full transition-colors"
                    >
                      <UserPlus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Floating Action Button - Mobile */}
      <Link
        to="/post/new"
        className="md:hidden fixed bottom-20 right-4 w-14 h-14 bg-purple-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-purple-600 transition-colors z-40"
      >
        <Plus className="w-6 h-6" />
      </Link>

      {/* Share Modal */}
      {sharePost && (
        <ShareModal post={sharePost} onClose={() => setSharePost(null)} />
      )}
    </div>
  );
}