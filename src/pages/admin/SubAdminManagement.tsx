import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Save, X, Shield, UserPlus, Check, Ban } from 'lucide-react';
import AdminLayout from './AdminLayout';

interface SubAdmin {
  id: string;
  username: string;
  password: string;
  nickname: string;
  email: string;
  avatar_url: string;
  permissions: string[];
  status: 'active' | 'banned';
  created_at: string;
}

const allPermissions = [
  { key: 'dashboard', label: '数据概览' },
  { key: 'users', label: '用户管理' },
  { key: 'posts', label: '帖子管理' },
  { key: 'review', label: '内容审核' },
  { key: 'stats', label: '数据统计' },
  { key: 'media', label: '图片库' },
  { key: 'policy', label: '政策管理' },
  { key: 'health', label: '保健管理' },
];

export default function SubAdminManagement() {
  const [subAdmins, setSubAdmins] = useState<SubAdmin[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<SubAdmin | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    nickname: '',
    email: '',
    permissions: [] as string[],
  });

  useEffect(() => {
    loadSubAdmins();
  }, []);

  const loadSubAdmins = () => {
    const saved = localStorage.getItem('shenxiaoyou_sub_admins');
    if (saved) {
      setSubAdmins(JSON.parse(saved));
    } else {
      const initial: SubAdmin[] = [
        {
          id: 'subadmin_1',
          username: 'subadmin1',
          password: '123456',
          nickname: '内容管理员',
          email: 'subadmin1@example.com',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=subadmin1',
          permissions: ['posts', 'review', 'media'],
          status: 'active',
          created_at: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: 'subadmin_2',
          username: 'subadmin2',
          password: '123456',
          nickname: '用户管理员',
          email: 'subadmin2@example.com',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=subadmin2',
          permissions: ['users', 'stats'],
          status: 'active',
          created_at: new Date(Date.now() - 172800000).toISOString(),
        },
      ];
      setSubAdmins(initial);
      localStorage.setItem('shenxiaoyou_sub_admins', JSON.stringify(initial));
    }
  };

  const saveSubAdmins = (newAdmins: SubAdmin[]) => {
    setSubAdmins(newAdmins);
    localStorage.setItem('shenxiaoyou_sub_admins', JSON.stringify(newAdmins));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();

    if (editingAdmin) {
      saveSubAdmins(subAdmins.map(admin =>
        admin.id === editingAdmin.id
          ? { ...admin, ...formData, updated_at: now }
          : admin
      ));
    } else {
      const newAdmin: SubAdmin = {
        id: `subadmin_${Date.now()}`,
        ...formData,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.username}`,
        status: 'active',
        created_at: now,
      };
      saveSubAdmins([newAdmin, ...subAdmins]);
    }

    setShowModal(false);
    setEditingAdmin(null);
    setFormData({
      username: '',
      password: '',
      nickname: '',
      email: '',
      permissions: [],
    });
  };

  const handleEdit = (admin: SubAdmin) => {
    setEditingAdmin(admin);
    setFormData({
      username: admin.username,
      password: admin.password,
      nickname: admin.nickname,
      email: admin.email,
      permissions: admin.permissions,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm('确定要删除这个分管理员吗？')) return;
    saveSubAdmins(subAdmins.filter(a => a.id !== id));
  };

  const handleToggleStatus = (id: string) => {
    saveSubAdmins(subAdmins.map(admin =>
      admin.id === id
        ? { ...admin, status: admin.status === 'active' ? 'banned' : 'active' }
        : admin
    ));
  };

  const handleTogglePermission = (perm: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter(p => p !== perm)
        : [...prev.permissions, perm],
    }));
  };

  const filteredAdmins = subAdmins.filter(admin =>
    admin.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">分管理员管理</h1>
            <p className="text-gray-500 mt-1">管理分管理员账号及权限分配</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>添加分管理员</span>
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索分管理员昵称或用户名"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none w-64"
              />
            </div>
          </div>
          <div className="text-gray-500">
            共 {filteredAdmins.length} 位分管理员
          </div>
        </div>

        {/* Sub Admins Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">管理员信息</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用户名</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">邮箱</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">权限</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">创建时间</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAdmins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{admin.nickname}</p>
                      <p className="text-xs text-gray-500">分管理员</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{admin.username}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{admin.email}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {admin.permissions.map(perm => {
                        const permLabel = allPermissions.find(p => p.key === perm)?.label || perm;
                        return (
                          <span
                            key={perm}
                            className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-100 text-emerald-800"
                          >
                            {permLabel}
                          </span>
                        );
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      admin.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {admin.status === 'active' ? '正常' : '已禁用'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(admin.created_at).toLocaleDateString('zh-CN')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(admin)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="编辑"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(admin.id)}
                        className={`p-1 rounded ${
                          admin.status === 'active'
                            ? 'text-red-600 hover:bg-red-50'
                            : 'text-emerald-600 hover:bg-emerald-50'
                        }`}
                        title={admin.status === 'active' ? '禁用' : '启用'}
                      >
                        {admin.status === 'active' ? <Ban className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDelete(admin.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="删除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                {editingAdmin ? '编辑分管理员' : '添加分管理员'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingAdmin(null);
                  setFormData({
                    username: '',
                    password: '',
                    nickname: '',
                    email: '',
                    permissions: [],
                  });
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">用户名</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="请输入用户名"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="请输入密码"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">昵称</label>
                <input
                  type="text"
                  value={formData.nickname}
                  onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="请输入昵称"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="请输入邮箱"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">权限分配</label>
                <div className="grid grid-cols-2 gap-2">
                  {allPermissions.map(perm => (
                    <label
                      key={perm.key}
                      className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                        formData.permissions.includes(perm.key)
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(perm.key)}
                        onChange={() => handleTogglePermission(perm.key)}
                        className="w-4 h-4 text-emerald-500 rounded focus:ring-emerald-500"
                      />
                      <span className="text-sm text-gray-700">{perm.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingAdmin(null);
                    setFormData({
                      username: '',
                      password: '',
                      nickname: '',
                      email: '',
                      permissions: [],
                    });
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingAdmin ? '保存' : '添加'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}