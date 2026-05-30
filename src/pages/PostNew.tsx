import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Image, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function PostNew() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('分享');
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [compressing, setCompressing] = useState(false);

  const categories = ['分享', '求助', '交流'];

  // 压缩图片
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas context not available'));
            return;
          }

          // 计算压缩后的尺寸
          let width = img.width;
          let height = img.height;
          const maxDimension = 1200; // 最大边长
          
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = (height / width) * maxDimension;
              width = maxDimension;
            } else {
              width = (width / height) * maxDimension;
              height = maxDimension;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          // 压缩到300KB以下
          let quality = 0.9;
          let compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          
          // 计算base64大小（约等于文件大小）
          const getBase64Size = (base64: string) => {
            const base64Length = base64.split(',')[1].length;
            return (base64Length * 3) / 4 / 1024; // KB
          };

          // 如果超过300KB，逐步降低质量
          while (getBase64Size(compressedDataUrl) > 300 && quality > 0.1) {
            quality -= 0.1;
            compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          }

          resolve(compressedDataUrl);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件');
      return;
    }

    setCompressing(true);
    try {
      const compressedImage = await compressImage(file);
      setImages([...images, compressedImage]);
    } catch (error) {
      console.error('图片压缩失败:', error);
      alert('图片处理失败，请重试');
    }
    setCompressing(false);
    
    // 清空input，允许重复选择同一文件
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!user) {
      alert('请先登录');
      return;
    }
    if (!title.trim() || !content.trim()) {
      alert('请填写标题和内容');
      return;
    }

    setIsSubmitting(true);

    // 创建新帖子
    const newPost = {
      id: 'post_' + Date.now(),
      user_id: user.id,
      user_name: user.nickname,
      user_avatar: user.avatar_url || '',
      title,
      content,
      category,
      images,
      likes_count: 0,
      comments_count: 0,
      created_at: new Date().toISOString()
    };

    // 保存到localStorage
    const savedPosts = localStorage.getItem('shenxiaoyou_posts');
    const posts = savedPosts ? JSON.parse(savedPosts) : [];
    posts.unshift(newPost);
    localStorage.setItem('shenxiaoyou_posts', JSON.stringify(posts));

    setIsSubmitting(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-14 md:top-16 z-40 bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            <span>返回</span>
          </button>
          <h1 className="font-semibold text-gray-800">发布帖子</h1>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || compressing}
            className="px-4 py-1.5 bg-emerald-500 text-white rounded-full text-sm font-medium hover:bg-emerald-600 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? '发布中...' : compressing ? '压缩中...' : '发布'}
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 py-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          {/* Category */}
          <div className="flex space-x-3 mb-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === cat
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="请输入标题..."
            className="w-full text-lg font-semibold text-gray-800 placeholder-gray-400 border-b border-gray-200 pb-3 mb-4 outline-none focus:border-emerald-500 transition-colors"
          />

          {/* Content */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="分享你的故事、经验或问题..."
            rows={8}
            className="w-full text-gray-600 placeholder-gray-400 resize-none outline-none"
          />

          {/* Images */}
          {images.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img 
                    src={image} 
                    alt={`图片 ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload Button */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <label className={`flex items-center space-x-2 text-gray-500 cursor-pointer hover:text-emerald-500 transition-colors ${compressing ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <Image className="w-5 h-5" />
              <span className="text-sm">{compressing ? '压缩中...' : '添加图片（自动压缩至300KB以下）'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={compressing}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-4 p-4 bg-emerald-50 rounded-xl">
          <h4 className="font-medium text-emerald-800 mb-2">发布小贴士</h4>
          <ul className="text-sm text-emerald-700 space-y-1">
            <li>• 分享真实经历，帮助更多肾友</li>
            <li>• 求助时请详细描述情况，便于他人帮助</li>
            <li>• 保持友善交流，共建温暖社区</li>
            <li>• 图片自动压缩至300KB以下，支持多张上传</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
