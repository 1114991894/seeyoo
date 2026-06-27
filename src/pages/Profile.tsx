import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Settings, Edit3, LogOut, FileText, Heart, MessageCircle, ChevronRight, Camera, UserPlus, Share2, X, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState(user?.nickname || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [email, setEmail] = useState(user?.email || '');
  const [uploading, setUploading] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteCopied, setInviteCopied] = useState(false);

  // 从实际数据计算统计
  const [stats, setStats] = useState([
    { label: '帖子', value: 0, icon: FileText },
    { label: '获赞', value: 0, icon: Heart },
    { label: '评论', value: 0, icon: MessageCircle },
    { label: '被关注', value: 0, icon: UserPlus },
  ]);

  useEffect(() => {
    if (user) {
      const savedPosts = localStorage.getItem('shenxiaoyou_posts');
      if (savedPosts) {
        const posts = JSON.parse(savedPosts);
        const myPosts = posts.filter((p: any) => p.user_id === user.id);
        const postsCount = myPosts.length;
        const likesCount = myPosts.reduce((sum: number, p: any) => sum + (p.likes_count || 0), 0);
        const commentsCount = myPosts.reduce((sum: number, p: any) => sum + (p.comments_count || 0), 0);

        setStats([
          { label: '帖子', value: postsCount, icon: FileText },
          { label: '获赞', value: likesCount, icon: Heart },
          { label: '评论', value: commentsCount, icon: MessageCircle },
          { label: '被关注', value: 0, icon: UserPlus },
        ]);
      }
    }
  }, [user]);

  const inviteUrl = `${window.location.origin}/#/login`;

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteUrl).then(() => {
      setInviteCopied(true);
      setTimeout(() => setInviteCopied(false), 2000);
    }).catch(() => {
      const textarea = document.createElement('textarea');
      textarea.value = inviteUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setInviteCopied(true);
      setTimeout(() => setInviteCopied(false), 2000);
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">请先登录</p>
          <Link 
            to="/login"
            className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            去登录
          </Link>
        </div>
      </div>
    );
  }

  // 压缩图片至50KB以下
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas context not available'));
            return;
          }

          let width = img.width;
          let height = img.height;
          const maxDimension = 200;
          
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

          let quality = 0.9;
          let compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          
          const getBase64Size = (base64: string) => {
            const base64Length = base64.split(',')[1].length;
            return (base64Length * 3) / 4 / 1024;
          };

          while (getBase64Size(compressedDataUrl) > 50 && quality > 0.1) {
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

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件');
      return;
    }

    setUploading(true);
    try {
      const compressedAvatar = await compressImage(file);
      updateProfile({ avatar_url: compressedAvatar });
      alert('头像上传成功');
    } catch (error) {
      console.error('头像压缩失败:', error);
      alert('头像上传失败，请重试');
    }
    setUploading(false);
    e.target.value = '';
  };

  const handleSave = () => {
    updateProfile({ nickname, bio, email });
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { label: '我的帖子', icon: FileText, path: '/my-posts' },
    { label: '我的收藏', icon: Heart, path: '/my-favorites' },
    { label: '消息通知', icon: MessageCircle, path: '/notifications' },
    { label: '邀请注册', icon: Share2, path: '' },
    { label: '建议与反馈', icon: Settings, path: '/feedback' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header Card */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img 
                  src={user.avatar_url} 
                  alt={user.nickname}
                  className="w-20 h-20 rounded-full border-4 border-white/30 object-cover"
                />
                <button
                  onClick={handleAvatarClick}
                  disabled={uploading}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors"
                >
                  {uploading ? (
                    <span className="text-xs text-gray-600">...</span>
                  ) : (
                    <Camera className="w-4 h-4 text-gray-600" />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="bg-white/20 text-white placeholder-white/60 rounded px-2 py-1 outline-none"
                    placeholder="昵称"
                  />
                ) : (
                  <h1 className="text-xl font-bold">{user.nickname}</h1>
                )}
                <p className="text-emerald-100 text-sm mt-1">{user.email || 'GitHub 用户'}</p>
              </div>
            </div>
            <button 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
            >
              <Edit3 className="w-5 h-5" />
            </button>
          </div>

          {/* Bio */}
          <div className="mt-4">
            {isEditing ? (
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-white/20 text-white placeholder-white/60 rounded-lg p-3 outline-none resize-none"
                rows={2}
                placeholder="个人简介"
              />
            ) : (
              <p className="text-emerald-100">{user.bio || '还没有个人简介'}</p>
            )}
          </div>

          {/* Email */}
          <div className="mt-3">
            {isEditing ? (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/20 text-white placeholder-white/60 rounded px-3 py-1 outline-none text-sm"
                placeholder="邮箱地址"
              />
            ) : (
              <p className="text-emerald-200 text-sm flex items-center">
                {user.email ? (
                  <>
                    <span className="mr-2">📧</span>
                    {user.email}
                  </>
                ) : (
                  <>
                    <span className="mr-2">📧</span>
                    <span className="text-emerald-300/60">未设置邮箱</span>
                  </>
                )}
              </p>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-around mt-6 pt-6 border-t border-white/20">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex items-center justify-center space-x-1">
                  <stat.icon className="w-4 h-4 text-emerald-200" />
                  <span className="text-2xl font-bold">{stat.value}</span>
                </div>
                <span className="text-emerald-200 text-sm">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm">
          {menuItems.map((item, index) => (
            item.label === '邀请注册' ? (
              <button
                key={item.label}
                onClick={() => setShowInvite(true)}
                className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${
                  index !== menuItems.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-emerald-500" />
                  </div>
                  <span className="font-medium text-gray-800">{item.label}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            ) : (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${
                  index !== menuItems.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-emerald-500" />
                  </div>
                  <span className="font-medium text-gray-800">{item.label}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </Link>
            )
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full mt-6 p-4 bg-white rounded-xl shadow-sm flex items-center justify-center space-x-2 text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">退出登录</span>
        </button>
      </div>

      {/* Invite Modal */}
      {showInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowInvite(false)}>
          <div className="bg-white rounded-2xl max-w-sm w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">邀请注册</h3>
              <button 
                onClick={() => setShowInvite(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-gray-600 text-sm text-center">
                邀请好友加入肾小友社区，一起交流互助
              </p>

              {/* QR Code */}
              <div className="flex justify-center">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(inviteUrl)}`}
                  alt="邀请注册二维码"
                  className="w-40 h-40"
                />
              </div>

              {/* Invite Link */}
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-2">邀请链接：</p>
                <p className="text-sm text-gray-700 break-all">{inviteUrl}</p>
              </div>

              {/* Copy Button */}
              <button
                onClick={copyInviteLink}
                className={`w-full flex items-center justify-center space-x-2 py-3 rounded-xl transition-colors ${
                  inviteCopied 
                    ? 'bg-green-500 text-white' 
                    : 'bg-emerald-500 text-white hover:bg-emerald-600'
                }`}
              >
                {inviteCopied ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span className="font-medium">已复制链接</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-5 h-5" />
                    <span className="font-medium">复制邀请链接</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}