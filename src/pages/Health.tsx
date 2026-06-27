import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ChevronRight, Eye } from 'lucide-react';
import { formatDistanceToNow } from '../utils/format';
import { supabase } from '../lib/supabaseClient';

interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  cover_image: string;
  views_count: number;
  created_at: string;
}

export default function Health() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    loadArticles();
  }, []);

  const mapArticle = (article: any): Article => ({
    id: article.id,
    title: article.title,
    content: article.content,
    category: article.category === 'diet' ? '饮食管理' :
              article.category === 'exercise' ? '运动康复' :
              article.category === 'mental' ? '心理健康' :
              article.category === 'prevention' ? '并发症预防' :
              article.category === 'postop' ? '术后护理' :
              article.category === 'knowledge' ? '疾病认知' : article.category,
    cover_image: article.cover_url,
    views_count: 0,
    created_at: article.created_at
  });

  const loadArticles = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      if (!supabase) {
        // Fallback to localStorage
        const savedArticles = localStorage.getItem('shenxiaoyou_health_articles');
        if (savedArticles) {
          const parsed = JSON.parse(savedArticles);
          setArticles(parsed.map(mapArticle));
        }
        return;
      }

      const { data, error } = await supabase
        .from('health_articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setArticles((data || []).map(mapArticle));
    } catch (error: any) {
      console.error('保健文章加载失败:', error);
      // 显示 Supabase 错误信息（常见原因：RLS 行级安全策略阻止读取）
      if (error?.code === 'PGRST301' || error?.message?.includes('permission denied') || error?.message?.includes('permission')) {
        setLoadError('数据库权限不足（RLS），请在 Supabase SQL Editor 中执行 supabase/disable_rls.sql 脚本');
      } else {
        setLoadError(`数据加载失败: ${error?.message || '未知错误'}`);
      }
      // Fallback to localStorage
      const savedArticles = localStorage.getItem('shenxiaoyou_health_articles');
      if (savedArticles) {
        const parsed = JSON.parse(savedArticles);
        setArticles(parsed.map(mapArticle));
        setLoadError(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'all', label: '全部' },
    { id: '饮食管理', label: '饮食' },
    { id: '运动康复', label: '运动' },
    { id: '心理健康', label: '心理' },
  ];

  const filteredArticles = activeTab === 'all'
    ? articles
    : articles.filter(a => a.category === activeTab);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-3 mb-2">
            <Heart className="w-8 h-8 text-gray-800" />
            <h1 className="text-2xl font-bold text-gray-800">保健知识</h1>
          </div>
          <p className="text-gray-600">科学保健，健康生活，与肾病和谐共处</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-14 md:top-16 z-40 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
            <p className="text-gray-500">加载中...</p>
          </div>
        ) : loadError ? (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-lg mx-auto">
              <Heart className="w-12 h-12 mx-auto mb-4 text-red-400" />
              <p className="text-red-600 font-medium mb-2">数据加载失败</p>
              <p className="text-red-500 text-sm mb-4">{loadError}</p>
              <button
                onClick={loadArticles}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
              >
                重新加载
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <Link
                key={article.id}
                to={`/article/${article.id}`}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <img
                  src={article.cover_image}
                  alt={article.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <span className="inline-block px-2 py-1 bg-emerald-100 text-emerald-600 text-xs rounded-full mb-2">
                    {article.category}
                  </span>
                  <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{article.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-3">{article.content}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{article.views_count}</span>
                    </div>
                    <span>{formatDistanceToNow(article.created_at)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && !loadError && filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">暂无文章</p>
          </div>
        )}
      </div>
    </div>
  );
}