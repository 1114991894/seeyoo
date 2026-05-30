import React, { useRef, useState } from 'react';
import { X, Download, Share2 } from 'lucide-react';
import html2canvas from 'html2canvas';

interface Post {
  id: string;
  user_name: string;
  user_avatar: string;
  title: string;
  content: string;
  category: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
}

interface ShareModalProps {
  post: Post;
  onClose: () => void;
}

export default function ShareModal({ post, onClose }: ShareModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateImage = async () => {
    if (!cardRef.current) return;
    
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
      });
      
      const link = document.createElement('a');
      link.download = `肾小友-${post.title.slice(0, 20)}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('生成分享图失败:', error);
      alert('生成分享图失败，请重试');
    }
    setIsGenerating(false);
  };

  const shareToWechat = () => {
    alert('请保存图片后分享到微信/朋友圈');
    generateImage();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">分享到</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Preview Card */}
        <div className="p-4 bg-gray-50 overflow-auto max-h-[60vh]">
          <div 
            ref={cardRef}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            {/* Logo */}
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">肾</span>
              </div>
              <span className="text-lg font-bold text-emerald-600">肾小友</span>
            </div>

            {/* Author */}
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src={post.user_avatar} 
                alt={post.user_name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h4 className="font-medium text-gray-800">{post.user_name}</h4>
                <span className="text-gray-400 text-xs">来自肾小友社区</span>
              </div>
            </div>

            {/* Content */}
            <h3 className="font-bold text-gray-800 mb-2">{post.title}</h3>
            <p className="text-gray-600 text-sm line-clamp-4 mb-4">{post.content}</p>

            {/* Stats */}
            <div className="flex items-center space-x-4 text-sm text-gray-400 border-t border-gray-100 pt-4">
              <span>{post.likes_count} 赞</span>
              <span>{post.comments_count} 评论</span>
            </div>

            {/* QR Code Placeholder */}
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
              <div className="text-xs text-gray-400">
                <p>扫码加入肾小友</p>
                <p>温暖的肾病互助社区</p>
              </div>
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-xs text-gray-400">二维码</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={generateImage}
              disabled={isGenerating}
              className="flex items-center justify-center space-x-2 py-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              <Download className="w-5 h-5 text-gray-600" />
              <span className="text-gray-600 font-medium">
                {isGenerating ? '生成中...' : '保存图片'}
              </span>
            </button>
            <button
              onClick={shareToWechat}
              className="flex items-center justify-center space-x-2 py-3 bg-emerald-500 rounded-xl hover:bg-emerald-600 transition-colors"
            >
              <Share2 className="w-5 h-5 text-white" />
              <span className="text-white font-medium">微信分享</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
