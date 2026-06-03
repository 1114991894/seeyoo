import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import AdminLayout from './AdminLayout';

interface PolicyArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  cover_url: string;
  created_at: string;
  updated_at: string;
}

const categories = [
  { value: 'insurance', label: '医保政策' },
  { value: 'transplant', label: '移植政策' },
  { value: 'welfare', label: '福利政策' },
];

export default function PolicyManagement() {
  const [articles, setArticles] = useState<PolicyArticle[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState<PolicyArticle | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'insurance',
    cover_url: '',
  });

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = () => {
    const saved = localStorage.getItem('shenxiaoyou_policy_articles');
    if (saved) {
      setArticles(JSON.parse(saved));
    } else {
      const initial: PolicyArticle[] = [
        {
          id: 'policy_1',
          title: '关于2024年肾病医疗报销政策调整的通知',
          content: '为进一步减轻肾病患者医疗负担，2024年医保政策做出以下调整...',
          category: 'insurance',
          cover_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          updated_at: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: 'policy_2',
          title: '肾移植术后康复期注意事项',
          content: '肾移植手术后的康复期需要特别注意以下几点...',
          category: 'transplant',
          cover_url: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=400',
          created_at: new Date(Date.now() - 172800000).toISOString(),
          updated_at: new Date(Date.now() - 172800000).toISOString(),
        },
      ];
      setArticles(initial);
      localStorage.setItem('shenxiaoyou_policy_articles', JSON.stringify(initial));
    }
  };

  const saveArticles = (newArticles: PolicyArticle[]) => {
    setArticles(newArticles);
    localStorage.setItem('shenxiaoyou_policy_articles', JSON.stringify(newArticles));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    
    if (editingArticle) {
      saveArticles(articles.map(article => 
        article.id === editingArticle.id
          ? { ...article, ...formData, updated_at: now }
          : article
      ));
    } else {
      const newArticle: PolicyArticle = {
        id: `policy_${Date.now()}`,
        ...formData,
        created_at: now,
        updated_at: now,
      };
      saveArticles([newArticle, ...articles]);
    }
    
    setShowModal(false);
    setEditingArticle(null);
    setFormData({
      title: '',
      content: '',
      category: 'insurance',
      cover_url: '',
    });
  };

  const handleEdit = (article: PolicyArticle) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      content: article.content,
      category: article.category,
      cover_url: article.cover_url,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm('确定要删除这篇文章吗？')) return;
    saveArticles(articles.filter(a => a.id !== id));
  };

  const getCategoryLabel = (category: string) => {
    return categories.find(c => c.value === category)?.label || category;
  };

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">政策资讯管理</h1>
            <p className="text-gray-500 mt-1">管理政策类资讯内容</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>添加文章</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索文章标题"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-full md:w-96"
            />
          </div>
        </div>

        <div className="grid gap-4">
          {filteredArticles.map(article => (
            <div key={article.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="flex items-stretch">
                <div className="w-48 h-32 flex-shrink-0">
                  <img
                    src={article.cover_url}
                    alt={article.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect fill="%23e5e7eb" width="400" height="300"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" alignment-baseline="middle"%3E暂无图片%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
                <div className="flex-1 p-6 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {getCategoryLabel(article.category)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(article.created_at).toLocaleDateString('zh-CN')}
                      </span>
                    </div>
                    <h3 className="text-sm font-medium text-gray-800 mb-1">{article.title}</h3>
                    <p className="text-xs text-gray-600 line-clamp-2">{article.content}</p>
                  </div>
                  <div className="flex items-center space-x-2 ml-6">
                    <button
                      onClick={() => handleEdit(article)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="编辑"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="删除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-sm">暂无政策资讯</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                {editingArticle ? '编辑文章' : '添加文章'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingArticle(null);
                  setFormData({
                    title: '',
                    content: '',
                    category: 'insurance',
                    cover_url: '',
                  });
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  文章标题
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="请输入文章标题"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  分类
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  封面图片URL
                </label>
                <input
                  type="url"
                  value={formData.cover_url}
                  onChange={(e) => setFormData({ ...formData, cover_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="请输入封面图片URL"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  文章内容
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-48 resize-none"
                  placeholder="请输入文章内容"
                  required
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingArticle(null);
                    setFormData({
                      title: '',
                      content: '',
                      category: 'insurance',
                      cover_url: '',
                    });
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingArticle ? '保存' : '添加'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
