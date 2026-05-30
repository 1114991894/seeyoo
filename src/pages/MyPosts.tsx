import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
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

export default function MyPosts() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [sharePost, setSharePost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const savedPosts = localStorage.getItem('shenxiaoyou_posts');
      if (savedPosts) {
        const allPosts = JSON.parse(savedPosts);
        const myPosts = allPosts.filter((p: Post) => p.user_id === user.id);
        setPosts(myPosts);
      }
    }
    setLoading(false);
  }, [user]);

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return { ...post, likes_count: post.likes_count + 1 };
      }
      return post;
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-14 md:top-16 z-40 bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center space-x-3">
          <Link to="/profile" className="text-gray-600 hover:text-gray-800">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-semibold text-gray-800">我的帖子</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-4">
        {posts.length === 0 ? (
          <div className="min-h-[60vh] flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-gray-400 text-lg mb-1">空空如也</p>
            <p className="text-gray-400">还没有帖子</p>
            <Link 
              to="/post/new"
              className="mt-6 px-6 py-2 bg-emerald-500 text-white rounded-full text-sm hover:bg-emerald-600 transition-colors"
            >
              去发帖
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map(post => (
              <PostCard 
                key={post.id} 
                post={post} 
                onLike={() => handleLike(post.id)}
                onShare={() => setSharePost(post)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Share Modal */}
      {sharePost && (
        <ShareModal post={sharePost} onClose={() => setSharePost(null)} />
      )}
    </div>
  );
}
