import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, Calendar, Bookmark, Share2 } from 'lucide-react';
import { formatDistanceToNow } from '../utils/format';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import ShareModal from '../components/ShareModal';

interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  cover_image: string;
  views_count: number;
  created_at: string;
}

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [article, setArticle] = useState<Article | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadArticle();
  }, [id]);

  const loadArticle = async () => {
    if (!id) return;
    setLoading(true);

    try {
      if (!supabase) {
        // Fallback to localStorage
        loadFromLocalStorage();
        return;
      }

      // Try policy_articles first
      let { data, error } = await supabase
        .from('policy_articles')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        // Try health_articles
        const result = await supabase
          .from('health_articles')
          .select('*')
          .eq('id', id)
          .single();
        data = result.data;
        error = result.error;
      }

      if (data) {
        const isPolicy = data.category === 'insurance' || data.category === 'transplant' || data.category === 'welfare';
        const mapped: Article = {
          id: data.id,
          title: data.title,
          content: data.content,
          category: isPolicy ?
            (data.category === 'insurance' ? '医保政策' :
             data.category === 'transplant' ? '移植政策' :
             data.category === 'welfare' ? '福利政策' : data.category) :
            (data.category === 'diet' ? '饮食管理' :
             data.category === 'exercise' ? '运动康复' :
             data.category === 'mental' ? '心理健康' :
             data.category === 'prevention' ? '并发症预防' :
             data.category === 'postop' ? '术后护理' :
             data.category === 'knowledge' ? '疾病认知' : data.category),
          cover_image: data.cover_url,
          views_count: 0,
          created_at: data.created_at
        };
        setArticle(mapped);
      } else {
        // Fallback to localStorage if not found in Supabase
        loadFromLocalStorage();
      }
    } catch (error) {
      console.error('Error loading article:', error);
      loadFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  const loadFromLocalStorage = () => {
    if (!id) return;

    // 先从后台存储加载文章
    const savedPolicyArticles = localStorage.getItem('shenxiaoyou_policy_articles');
    const savedHealthArticles = localStorage.getItem('shenxiaoyou_health_articles');
    let found: Article | undefined;

    if (savedPolicyArticles) {
      const parsed = JSON.parse(savedPolicyArticles);
      const mapped = parsed.map((a: any) => ({
        id: a.id,
        title: a.title,
        content: a.content,
        category: a.category === 'insurance' ? '医保政策' :
                  a.category === 'transplant' ? '移植政策' :
                  a.category === 'welfare' ? '福利政策' : a.category,
        cover_image: a.cover_url,
        views_count: 0,
        created_at: a.created_at
      }));
      found = mapped.find((a: Article) => a.id === id);
    }

    if (!found && savedHealthArticles) {
      const parsed = JSON.parse(savedHealthArticles);
      const mapped = parsed.map((a: any) => ({
        id: a.id,
        title: a.title,
        content: a.content,
        category: a.category === 'diet' ? '饮食管理' :
                  a.category === 'exercise' ? '运动康复' :
                  a.category === 'mental' ? '心理健康' :
                  a.category === 'prevention' ? '并发症预防' :
                  a.category === 'postop' ? '术后护理' :
                  a.category === 'knowledge' ? '疾病认知' : a.category,
        cover_image: a.cover_url,
        views_count: 0,
        created_at: a.created_at
      }));
      found = mapped.find((a: Article) => a.id === id);
    }

    if (found) {
      setArticle(found);
    }
  };

  useEffect(() => {
    // 检查是否已收藏
    if (user && id) {
      const savedFavorites = localStorage.getItem(`shenxiaoyou_article_favorites_${user.id}`);
      if (savedFavorites) {
        const favorites = JSON.parse(savedFavorites);
        setIsFavorited(favorites.includes(id));
      }
    }
  }, [id, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-500">加载中...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">文章不存在或已被删除</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            返回
          </button>
        </div>
      </div>
    );
  }

  const handleFavorite = () => {
    if (!user) {
      if (confirm('请先登录')) {
        navigate('/login');
      }
      return;
    }
    if (!id) return;

    const savedFavorites = localStorage.getItem(`shenxiaoyou_article_favorites_${user.id}`);
    const favorites = savedFavorites ? JSON.parse(savedFavorites) : [];

    if (isFavorited) {
      const updated = favorites.filter((fid: string) => fid !== id);
      localStorage.setItem(`shenxiaoyou_article_favorites_${user.id}`, JSON.stringify(updated));
      setIsFavorited(false);
      alert('已取消收藏');
    } else {
      const updated = [...favorites, id];
      localStorage.setItem(`shenxiaoyou_article_favorites_${user.id}`, JSON.stringify(updated));
      setIsFavorited(true);
      alert('收藏成功');
    }
  };

  const handleShare = () => {
    setShowShare(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-14 md:top-16 z-40 bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-semibold text-gray-800 truncate">文章详情</h1>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleFavorite}
              className={`p-2 rounded-full transition-colors ${
                isFavorited
                  ? 'text-emerald-500 bg-emerald-50'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
              title={isFavorited ? '取消收藏' : '收藏'}
            >
              <Bookmark className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
              title="分享"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        <article className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Cover Image */}
          <img
            src={article.cover_image}
            alt={article.title}
            className="w-full h-48 md:h-64 object-cover"
          />

          <div className="p-6">
            {/* Category */}
            <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-600 text-sm rounded-full mb-4">
              {article.category}
            </span>

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-800 mb-4">{article.title}</h1>

            {/* Meta */}
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDistanceToNow(article.created_at)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{article.views_count} 阅读</span>
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-emerald max-w-none">
              {article.content.split('\n').map((paragraph, index) => {
                if (paragraph.startsWith('## ')) {
                  return (
                    <h2 key={index} className="text-xl font-bold text-gray-800 mt-6 mb-3">
                      {paragraph.replace('## ', '')}
                    </h2>
                  );
                }
                if (paragraph.startsWith('- ')) {
                  return (
                    <li key={index} className="text-gray-600 ml-4 mb-1">
                      {paragraph.replace('- ', '')}
                    </li>
                  );
                }
                if (paragraph.startsWith('1. ') || paragraph.startsWith('2. ') || paragraph.startsWith('3. ') || paragraph.startsWith('4. ') || paragraph.startsWith('5. ')) {
                  return (
                    <li key={index} className="text-gray-600 ml-4 mb-1">
                      {paragraph.replace(/^\d+\. /, '')}
                    </li>
                  );
                }
                if (paragraph.trim() === '') {
                  return <br key={index} />;
                }
                return (
                  <p key={index} className="text-gray-600 leading-relaxed mb-3">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </div>
        </article>
      </div>

      {/* Share Modal */}
      {showShare && article && (
        <ShareModal
          post={{
            id: article.id,
            title: article.title,
            content: article.content.substring(0, 100) + '...',
            user_name: '肾小友',
            user_avatar: '',
            images: [article.cover_image],
            created_at: article.created_at,
            likes_count: 0,
            comments_count: 0,
            category: article.category,
            user_id: ''
          }}
          onClose={() => setShowShare(false)}
        />
      )}
    </div>
  );
}