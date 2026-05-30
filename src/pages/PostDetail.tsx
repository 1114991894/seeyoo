import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Share2, ArrowLeft, Send } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { formatDistanceToNow } from '../utils/format';
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

interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  user_name: string;
  user_avatar: string;
  content: string;
  created_at: string;
}

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    // 加载帖子
    const savedPosts = localStorage.getItem('shenxiaoyou_posts');
    if (savedPosts) {
      const posts = JSON.parse(savedPosts);
      const foundPost = posts.find((p: Post) => p.id === id);
      if (foundPost) {
        setPost(foundPost);
      }
    }

    // 加载评论
    const savedComments = localStorage.getItem(`shenxiaoyou_comments_${id}`);
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    } else {
      // 初始化示例评论
      const initialComments: Comment[] = [
        {
          id: 'comment_1',
          post_id: id!,
          user_id: 'user_2',
          user_name: '坚强的小李',
          user_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=strong',
          content: '加油！我们一起努力！保持好心态最重要。',
          created_at: new Date(Date.now() - 1800000).toISOString()
        },
        {
          id: 'comment_2',
          post_id: id!,
          user_id: 'user_3',
          user_name: '希望之光',
          user_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hope',
          content: '感同身受，透析确实不容易，但我们要坚强！',
          created_at: new Date(Date.now() - 3600000).toISOString()
        }
      ];
      setComments(initialComments);
      localStorage.setItem(`shenxiaoyou_comments_${id}`, JSON.stringify(initialComments));
    }
  }, [id]);

  const handleLike = () => {
    if (!user) {
      alert('请先登录');
      return;
    }
    if (!post) return;

    setIsLiked(!isLiked);
    const newCount = isLiked ? post.likes_count - 1 : post.likes_count + 1;
    setPost({ ...post, likes_count: newCount });

    // 更新存储
    const savedPosts = localStorage.getItem('shenxiaoyou_posts');
    if (savedPosts) {
      const posts = JSON.parse(savedPosts);
      const updatedPosts = posts.map((p: Post) => 
        p.id === id ? { ...p, likes_count: newCount } : p
      );
      localStorage.setItem('shenxiaoyou_posts', JSON.stringify(updatedPosts));
    }

    // 发送通知
    if (!isLiked && post.user_id !== user.id) {
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
  };

  const handleComment = () => {
    if (!user) {
      alert('请先登录');
      return;
    }
    if (!newComment.trim() || !post) return;

    const comment: Comment = {
      id: 'comment_' + Date.now(),
      post_id: id!,
      user_id: user.id,
      user_name: user.nickname,
      user_avatar: user.avatar_url || '',
      content: newComment,
      created_at: new Date().toISOString()
    };

    const updatedComments = [comment, ...comments];
    setComments(updatedComments);
    localStorage.setItem(`shenxiaoyou_comments_${id}`, JSON.stringify(updatedComments));

    // 更新帖子评论数
    const newCount = post.comments_count + 1;
    setPost({ ...post, comments_count: newCount });
    
    const savedPosts = localStorage.getItem('shenxiaoyou_posts');
    if (savedPosts) {
      const posts = JSON.parse(savedPosts);
      const updatedPosts = posts.map((p: Post) => 
        p.id === id ? { ...p, comments_count: newCount } : p
      );
      localStorage.setItem('shenxiaoyou_posts', JSON.stringify(updatedPosts));
    }

    // 发送通知
    if (post.user_id !== user.id) {
      addNotification({
        user_id: post.user_id,
        sender_id: user.id,
        sender_name: user.nickname,
        sender_avatar: user.avatar_url || '',
        type: 'comment',
        content: `评论了你的帖子：${newComment.slice(0, 20)}...`,
        post_id: post.id,
        post_title: post.title
      });
    }

    setNewComment('');
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">帖子不存在</p>
      </div>
    );
  }

  const categoryColors: Record<string, string> = {
    '分享': 'bg-blue-100 text-blue-600',
    '求助': 'bg-orange-100 text-orange-600',
    '交流': 'bg-emerald-100 text-emerald-600',
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="sticky top-14 md:top-16 z-40 bg-white border-b border-gray-200 px-4 py-3">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          <span>返回</span>
        </button>
      </div>

      {/* Post Content */}
      <div className="max-w-3xl mx-auto px-4 py-4">
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          {/* Author */}
          <div className="flex items-center space-x-3 mb-4">
            <img 
              src={post.user_avatar} 
              alt={post.user_name}
              className="w-10 h-10 rounded-full border border-gray-200"
            />
            <div>
              <h4 className="font-medium text-gray-800">{post.user_name}</h4>
              <span className="text-gray-400 text-xs">{formatDistanceToNow(post.created_at)}</span>
            </div>
            <span className={`ml-auto px-2 py-1 rounded-full text-xs font-medium ${categoryColors[post.category] || 'bg-gray-100 text-gray-600'}`}>
              {post.category}
            </span>
          </div>

          {/* Content */}
          <h1 className="text-lg font-bold text-gray-800 mb-3">{post.title}</h1>
          <p className="text-gray-600 mb-4 whitespace-pre-wrap">{post.content}</p>

          {/* Images */}
          {post.images.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mb-4">
              {post.images.map((image, index) => (
                <img 
                  key={index}
                  src={image}
                  alt={`图片 ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <button 
              onClick={handleLike}
              className={`flex items-center space-x-1 transition-colors ${
                isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span>{post.likes_count}</span>
            </button>
            <div className="flex items-center space-x-1 text-gray-500">
              <MessageCircle className="w-5 h-5" />
              <span>{post.comments_count}</span>
            </div>
            <button 
              onClick={() => setShowShare(true)}
              className="flex items-center space-x-1 text-gray-500 hover:text-emerald-500 transition-colors"
            >
              <Share2 className="w-5 h-5" />
              <span>分享</span>
            </button>
          </div>
        </div>

        {/* Comments */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="font-semibold text-gray-800 mb-4">评论 ({comments.length})</h3>
          
          {/* Comment Input */}
          <div className="flex items-start space-x-3 mb-6">
            <img 
              src={user?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'} 
              alt="我"
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1 flex space-x-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onClick={() => {
                  if (!user) {
                    navigate('/login');
                  }
                }}
                placeholder={user ? '写下你的评论...' : '点击登录后评论'}
                readOnly={!user}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none cursor-pointer"
              />
              <button
                onClick={handleComment}
                disabled={!user || !newComment.trim()}
                className="p-2 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Comment List */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex items-start space-x-3">
                <img 
                  src={comment.user_avatar} 
                  alt={comment.user_name}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-800">{comment.user_name}</span>
                    <span className="text-gray-400 text-xs">{formatDistanceToNow(comment.created_at)}</span>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShare && (
        <ShareModal post={post} onClose={() => setShowShare(false)} />
      )}
    </div>
  );
}
