import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Save, X, ChevronDown, ChevronRight, Image as ImageIcon } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { supabase } from '../../lib/supabaseClient';
import ImagePicker from '../../components/ImagePicker';

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
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    setLoading(true);
    try {
      if (!supabase) {
        alert('数据库连接未配置，请联系管理员');
        return;
      }

      const { data, error } = await supabase
        .from('policy_articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Error loading policy articles:', error);
      alert('加载文章失败，请检查数据库连接');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();

    try {
      if (!supabase) {
        alert('数据库连接未配置，请联系管理员');
        return;
      }

      if (editingArticle) {
        const { error } = await supabase
          .from('policy_articles')
          .update({ ...formData, updated_at: now })
          .eq('id', editingArticle.id);
        if (error) throw error;
      } else {
        const { data: existing } = await supabase
          .from('policy_articles')
          .select('id')
          .eq('title', formData.title)
          .maybeSingle();

        if (existing) {
          const { error } = await supabase
            .from('policy_articles')
            .update({ ...formData, updated_at: now })
            .eq('id', existing.id);
          if (error) throw error;
          alert('已更新现有文章（相同标题）');
        } else {
          const { error } = await supabase
            .from('policy_articles')
            .insert([{ ...formData, created_at: now, updated_at: now }]);
          if (error) throw error;
        }
      }

      setShowModal(false);
      setEditingArticle(null);
      setFormData({
        title: '',
        content: '',
        category: 'insurance',
        cover_url: '',
      });
      await loadArticles();
    } catch (error) {
      console.error('Error saving article:', error);
      alert('保存文章失败，请检查数据库连接');
    }
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

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这篇文章吗？')) return;

    try {
      if (!supabase) {
        alert('数据库连接未配置，请联系管理员');
        return;
      }

      const { error } = await supabase
        .from('policy_articles')
        .delete()
        .eq('id', id);
      if (error) throw error;
      await loadArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('删除失败，请检查数据库连接');
    }
  };

  const getCategoryLabel = (category: string) => {
    return categories.find(c => c.value === category)?.label || category;
  };

  // Group articles by date
  const groupedArticles = articles.reduce((groups, article) => {
    const date = new Date(article.created_at).toLocaleDateString('zh-CN');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(article);
    return groups;
  }, {} as Record<string, PolicyArticle[]>);

  const toggleDate = (date: string) => {
    const newExpanded = new Set(expandedDates);
    if (newExpanded.has(date)) {
      newExpanded.delete(date);
    } else {
      newExpanded.add(date);
    }
    setExpandedDates(newExpanded);
  };

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">政策管理</h1>
            <p className="text-gray-500 mt-1">管理政策资讯文章</p>
          </div>
          <button
            onClick={() => {
              setEditingArticle(null);
              setFormData({
                title: '',
                content: '',
                category: 'insurance',
                cover_url: '',
              });
              setShowModal(true);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>添加文章</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索文章..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* Articles List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-500 mx-auto mb-4"></div>
            <p className="text-gray-500">加载中...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedArticles).map(([date, dateArticles]) => (
              <div key={date} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <button
                  onClick={() => toggleDate(date)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    {expandedDates.has(date) ? (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                    <span className="font-medium text-gray-800">{date}</span>
                    <span className="text-sm text-gray-500">({dateArticles.length} 篇)</span>
                  </div>
                </button>
                {expandedDates.has(date) && (
                  <div className="border-t border-gray-100">
                    {dateArticles.map((article) => (
                      <div
                        key={article.id}
                        className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                              {getCategoryLabel(article.category)}
                            </span>
                            <h3 className="font-medium text-gray-800 truncate">{article.title}</h3>
                          </div>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-1">{article.content}</p>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => handleEdit(article)}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(article.id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingArticle ? '编辑文章' : '添加文章'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="请输入文章标题"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">封面图片</label>
                <div className="flex items-center space-x-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={formData.cover_url}
                      onChange={(e) => setFormData({ ...formData, cover_url: e.target.value })}
                      placeholder="图片链接或从图片库选择"
                      className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all"
                    />
                    {formData.cover_url && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, cover_url: '' })}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowImagePicker(true)}
                    className="flex items-center space-x-1 px-3 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors shrink-0"
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span className="text-sm">图片库</span>
                  </button>
                </div>
                {formData.cover_url && (
                  <div className="mt-2 relative inline-block">
                    <img
                      src={formData.cover_url}
                      alt="封面预览"
                      className="h-24 w-40 object-cover rounded-lg border border-gray-200"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">内容</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="请输入文章内容"
                  rows={10}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all resize-none"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>保存</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Image Picker Modal */}
      {showImagePicker && (
        <ImagePicker
          value={formData.cover_url}
          onChange={(url) => {
            setFormData({ ...formData, cover_url: url });
            setShowImagePicker(false);
          }}
          onClose={() => setShowImagePicker(false)}
        />
      )}
    </AdminLayout>
  );
}
