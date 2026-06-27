import React, { useState } from 'react';
import { X, Link as LinkIcon, Check } from 'lucide-react';

interface Post {
  id: string;
  user_name: string;
  title: string;
  content?: string;
  images?: string[];
  user_avatar?: string;
  created_at?: string;
  likes_count?: number;
  comments_count?: number;
  category?: string;
  user_id?: string;
}

interface ShareModalProps {
  post: Post;
  onClose: () => void;
}

export default function ShareModal({ post, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/#/post/${post.id}`;

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      const textarea = document.createElement('textarea');
      textarea.value = shareUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-sm w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">分享</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-600 text-sm mb-4 text-center">"{post.title}"</p>
          
          <button
            onClick={copyLink}
            className={`w-full flex items-center justify-center space-x-2 py-3 rounded-xl transition-colors ${
              copied 
                ? 'bg-green-500 text-white' 
                : 'bg-emerald-500 text-white hover:bg-emerald-600'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-5 h-5" />
                <span className="font-medium">已复制链接</span>
              </>
            ) : (
              <>
                <LinkIcon className="w-5 h-5" />
                <span className="font-medium">复制链接</span>
              </>
            )}
          </button>

          <p className="text-gray-400 text-xs text-center mt-4">
            链接已自动复制到剪贴板，可分享至微信朋友/微信朋友圈
          </p>
        </div>
      </div>
    </div>
  );
}