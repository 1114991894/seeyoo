import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Heart, Share2, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import PostCard from '../components/PostCard';
import ShareModal from '../components/ShareModal';

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

export default function Home() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [posts, setPosts] = useState<Post[]>([]);
  const [sharePost, setSharePost] = useState<Post | null>(null);
  const [activeTab, setActiveTab] = useState('recommend');

  useEffect(() => {
    // 从localStorage加载帖子
    const savedPosts = localStorage.getItem('shenxiaoyou_posts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      // 初始化示例帖子
      const initialPosts: Post[] = [
        {
          id: 'post_1',
          user_id: 'user_1',
          user_name: '阳光肾友',
          user_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sunshine',
          title: '我的透析日常分享',
          content: '今天是我透析的第三年，想和大家分享一下我的心得。保持乐观的心态真的很重要，每天坚持适量运动，饮食控制也很关键。希望和大家一起加油！',
          category: '分享',
          images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'],
          likes_count: 24,
          comments_count: 8,
          created_at: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 'post_2',
          user_id: 'user_2',
          user_name: '坚强的小李',
          user_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=strong',
          title: '求助：关于饮食控制的问题',
          content: '最近检查结果不太好，医生说要严格控制钾和磷的摄入。想问问大家有什么好的食谱推荐吗？特别是早餐，感觉选择很少。',
          category: '求助',
          images: [],
          likes_count: 12,
          comments_count: 15,
          created_at: new Date(Date.now() - 7200000).toISOString()
        },
        {
          id: 'post_3',
          user_id: 'user_3',
          user_name: '希望之光',
          user_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hope',
          title: '肾移植等待中，分享一些经验',
          content: '已经排队等待肾移植两年了，这期间学到了很多关于配型、术前准备的知识。如果有同样在等待的朋友，欢迎交流。',
          category: '交流',
          images: ['https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400'],
          likes_count: 45,
          comments_count: 22,
          created_at: new Date(Date.now() - 86400000).toISOString()
        }
      ];
      setPosts(initialPosts);
      localStorage.setItem('shenxiaoyou_posts', JSON.stringify(initialPosts));
    }
  }, []);

  const handleLike = (postId: string) => {
    if (!user) {
      alert('请先登录');
      return;
    }
    
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const newCount = post.likes_count + 1;
        // 模拟发送通知给帖子作者
        if (post.user_id !== user.id) {
          addNotification({
            user_id: post.user_id,
            sender_id: user.id,
            sender_name: user.nickname,
            sender_avatar: user.avatar_url || '',
            type: 'like',
            content: '赞了你的帖子',
            post_id: post.id,
            post_title: post.title
          });
        }
        return { ...post, likes_count: newCount };
      }
      return post;
    }));
  };

  const tabs = [
    { id: 'recommend', label: '推荐' },
    { id: 'follow', label: '关注' },
    { id: 'latest', label: '最新' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Tabs */}
      <div className="sticky top-14 md:top-16 z-40 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id 
                    ? 'border-emerald-500 text-emerald-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-4">
            {posts.map(post => (
              <PostCard 
                key={post.id} 
                post={post} 
                onLike={() => handleLike(post.id)}
                onShare={() => setSharePost(post)}
              />
            ))}
          </div>

          {/* Sidebar - Desktop */}
          <div className="hidden lg:block space-y-4">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="font-semibold text-gray-800 mb-3">快速操作</h3>
              <Link 
                to="/post/new"
                className="flex items-center justify-center space-x-2 w-full py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>发布帖子</span>
              </Link>
            </div>

            {/* Hot Topics */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="font-semibold text-gray-800 mb-3">热门话题</h3>
              <div className="space-y-2">
                {['#透析经验分享', '#饮食控制', '#肾移植等待', '#心理调节', '#运动康复'].map((tag, i) => (
                  <div key={i} className="flex items-center justify-between py-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <span className="text-emerald-600 text-sm">{tag}</span>
                    <span className="text-gray-400 text-xs">{100 - i * 15} 讨论</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Tips */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
              <h3 className="font-semibold text-emerald-800 mb-2">每日健康小贴士</h3>
              <p className="text-emerald-700 text-sm">
                透析患者每日饮水量应控制在500-800ml以内，包括汤、粥、水果等含水量。
              </p>
            </div>
          </div>
        </div>
      </div>


      {/* Share Modal */}
      {sharePost && (
        <ShareModal 
          post={sharePost} 
          onClose={() => setSharePost(null)} 
        />
      )}
    </div>
  );
}
