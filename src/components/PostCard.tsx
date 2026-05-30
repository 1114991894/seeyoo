import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Heart, Share2, Clock } from 'lucide-react';
import { formatDistanceToNow } from '../utils/format';

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

interface PostCardProps {
  post: Post;
  onLike: () => void;
  onShare: () => void;
}

export default function PostCard({ post, onLike, onShare }: PostCardProps) {
  const categoryColors: Record<string, string> = {
    '分享': 'bg-blue-100 text-blue-600',
    '求助': 'bg-orange-100 text-orange-600',
    '交流': 'bg-emerald-100 text-emerald-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <img 
            src={post.user_avatar} 
            alt={post.user_name}
            className="w-10 h-10 rounded-full border border-gray-200"
          />
          <div>
            <h4 className="font-medium text-gray-800">{post.user_name}</h4>
            <div className="flex items-center text-gray-400 text-xs">
              <Clock className="w-3 h-3 mr-1" />
              {formatDistanceToNow(post.created_at)}
            </div>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[post.category] || 'bg-gray-100 text-gray-600'}`}>
          {post.category}
        </span>
      </div>

      {/* Content */}
      <Link to={`/post/${post.id}`}>
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{post.title}</h3>
        <p className="text-gray-600 text-sm line-clamp-3 mb-3">{post.content}</p>
      </Link>

      {/* Images */}
      {post.images.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-3">
          {post.images.slice(0, 3).map((image, index) => (
            <img 
              key={index}
              src={image}
              alt={`图片 ${index + 1}`}
              className="w-full h-24 object-cover rounded-lg"
            />
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <button 
          onClick={onLike}
          className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors"
        >
          <Heart className="w-4 h-4" />
          <span className="text-sm">{post.likes_count}</span>
        </button>
        <Link 
          to={`/post/${post.id}`}
          className="flex items-center space-x-1 text-gray-500 hover:text-emerald-500 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="text-sm">{post.comments_count}</span>
        </Link>
        <button 
          onClick={onShare}
          className="flex items-center space-x-1 text-gray-500 hover:text-emerald-500 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          <span className="text-sm">分享</span>
        </button>
      </div>
    </div>
  );
}
