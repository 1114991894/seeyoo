import React, { useState, useEffect } from 'react';
import { Search, Ban, CheckCircle, MoreHorizontal, Eye, EyeOff, Save, X, Mail } from 'lucide-react';
import AdminLayout from './AdminLayout';

interface User {
  id: string;
  phone: string;
  nickname: string;
  password?: string;
  email?: string;
  avatar_url: string;
  bio: string;
  posts_count: number;
  status: 'active' | 'banned';
  created_at: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'banned'>('all');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editingPassword, setEditingPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // 加载用户数据
    const savedUsers = localStorage.getItem('shenxiaoyou_users');
    if (savedUsers) {
      const loadedUsers = JSON.parse(savedUsers);
      // 确保每个用户都有 posts_count
      const usersWithCount = loadedUsers.map((u: any) => ({
        ...u,
        posts_count: u.posts_count || Math.floor(Math.random() * 20) + 1
      }));
      setUsers(usersWithCount);
    } else {
      // 示例数据
      setUsers([
        {
          id: 'user_1',
          phone: '138****1234',
          nickname: '阳光肾友',
          password: '123456',
          email: 'user1@example.com',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sunshine',
          bio: '透析3年，积极乐观',
          posts_count: 45,
          status: 'active',
          created_at: '2024-01-15T10:30:00Z'
        },
        {
          id: 'user_2',
          phone: '139****5678',
          nickname: '坚强的小李',
          password: '654321',
          email: 'user2@example.com',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=strong',
          bio: '等待移植中',
          posts_count: 32,
          status: 'active',
          created_at: '2024-02-20T14:20:00Z'
        },
      ]);
    }
  }, []);

  const saveUsers = (newUsers: User[]) => {
    setUsers(newUsers);
    localStorage.setItem('shenxiaoyou_users', JSON.stringify(newUsers));
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.phone.includes(searchQuery);
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleBanUser = (userId: string) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        const newStatus: 'active' | 'banned' = user.status === 'banned' ? 'active' : 'banned';
        return { ...user, status: newStatus };
      }
      return user;
    });
    saveUsers(updatedUsers);
  };

  const handleEditPassword = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setEditingUserId(userId);
      setEditingPassword(user.password || '');
      setShowPassword(false);
    }
  };

  const handleSavePassword = () => {
    if (editingUserId && editingPassword.length >= 6) {
      saveUsers(users.map(user => 
        user.id === editingUserId ? { ...user, password: editingPassword } : user
      ));
      setEditingUserId(null);
      setEditingPassword('');
      alert('密码修改成功');
    } else {
      alert('密码至少需要6位');
    }
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setEditingPassword('');
    setShowPassword(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">用户管理</h1>
          <p className="text-gray-500 mt-1">管理平台注册用户</p>
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
                placeholder="搜索用户昵称或手机号"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none w-64"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
            >
              <option value="all">全部状态</option>
              <option value="active">正常</option>
              <option value="banned">已封禁</option>
            </select>
          </div>
          <div className="text-gray-500">
            共 {filteredUsers.length} 位用户
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用户信息</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">手机号</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">邮箱</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">密码</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">帖子数</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">注册时间</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={user.avatar_url} 
                        alt={user.nickname}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{user.nickname}</p>
                        <p className="text-xs text-gray-500">{user.bio}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.phone}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {user.email ? (
                      <div className="flex items-center space-x-1">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span>{user.email}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">未设置</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingUserId === user.id ? (
                      <div className="flex items-center space-x-2">
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={editingPassword}
                            onChange={(e) => setEditingPassword(e.target.value)}
                            className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="新密码"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        <button
                          onClick={handleSavePassword}
                          className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                          title="保存"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                          title="取消"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="text-gray-600">••••••</span>
                        <button
                          onClick={() => handleEditPassword(user.id)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="修改密码"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.posts_count}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      user.status === 'active' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status === 'active' ? '正常' : '已封禁'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(user.created_at).toLocaleDateString('zh-CN')}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleBanUser(user.id)}
                      className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm transition-colors ${
                        user.status === 'active'
                          ? 'text-red-600 hover:bg-red-50'
                          : 'text-emerald-600 hover:bg-emerald-50'
                      }`}
                    >
                      {user.status === 'active' ? (
                        <>
                          <Ban className="w-4 h-4" />
                          <span>封禁</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span>解封</span>
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}