import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Heart, FileText, Bookmark, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import PostCard from '../components/PostCard';
import ShareModal from '../components/ShareModal';

interface Post {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar: string;
  title: string;
  content: string;
  category: string;
  images: string[];
  likes_count: number;
  comments_count: number;
  created_at: string;
}

interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  cover_image: string;
  created_at: string;
}

export default function MyFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Post[]>([]);
  const [articleFavorites, setArticleFavorites] = useState<Article[]>([]);
  const [sharePost, setSharePost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'posts' | 'articles'>('posts');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);

    // 加载收藏的帖子
    const savedFavoriteIds = localStorage.getItem(`shenxiaoyou_user_favorites_${user!.id}`);
    if (savedFavoriteIds) {
      const favoriteIds = JSON.parse(savedFavoriteIds);
      const savedPosts = localStorage.getItem('shenxiaoyou_posts');
      if (savedPosts) {
        const allPosts = JSON.parse(savedPosts);
        const favoritePosts = allPosts.filter((p: Post) => favoriteIds.includes(p.id));
        setFavorites(favoritePosts);
      }
    }

    // 加载收藏的文章（从 Supabase）
    await loadArticleFavorites();

    // 加载用户点赞记录
    const savedLikes = localStorage.getItem(`shenxiaoyou_user_likes_${user!.id}`);
    if (savedLikes) {
      setLikedPosts(new Set(JSON.parse(savedLikes)));
    }

    setLoading(false);
  };

  const loadArticleFavorites = async () => {
    const savedArticleFavorites = localStorage.getItem(`shenxiaoyou_article_favorites_${user!.id}`);
    if (!savedArticleFavorites) return;

    const articleIds = JSON.parse(savedArticleFavorites);
    if (articleIds.length === 0) return;

    const allArticles: Article[] = [];

    if (supabase) {
      try {
        // 从 Supabase 加载政策文章
        const { data: policyData } = await supabase
          .from('policy_articles')
          .select('*')
          .in('id', articleIds);

        if (policyData) {
          allArticles.push(...policyData.map((a: any) => ({
            id: a.id,
            title: a.title,
            content: a.content,
            category: a.category === 'insurance' ? '医保政策' :
                      a.category === 'transplant' ? '移植政策' :
                      a.category === 'welfare' ? '福利政策' : a.category,
            cover_image: a.cover_url,
            created_at: a.created_at
          })));
        }

        // 从 Supabase 加载保健文章
        const { data: healthData } = await supabase
          .from('health_articles')
          .select('*')
          .in('id', articleIds);

        if (healthData) {
          allArticles.push(...healthData.map((a: any) => ({
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
            created_at: a.created_at
          })));
        }
      } catch (error) {
        console.error('Error loading articles from Supabase:', error);
      }
    }

    // Fallback to localStorage if Supabase failed or not configured
    if (allArticles.length === 0) {
      // 从政策文章中查找
      const savedPolicy = localStorage.getItem('shenxiaoyou_policy_articles');
      if (savedPolicy) {
        const parsed = JSON.parse(savedPolicy);
        const mapped = parsed.map((a: any) => ({
          id: a.id,
          title: a.title,
          content: a.content,
          category: a.category === 'insurance' ? '医保政策' :
                    a.category === 'transplant' ? '移植政策' :
                    a.category === 'welfare' ? '福利政策' : a.category,
          cover_image: a.cover_url,
          created_at: a.created_at
        }));
        allArticles.push(...mapped);
      }

      // 从保健文章中查找
      const savedHealth = localStorage.getItem('shenxiaoyou_health_articles');
      if (savedHealth) {
        const parsed = JSON.parse(savedHealth);
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
          created_at: a.created_at
        }));
        allArticles.push(...mapped);
      }
    }

    const favoriteArticles = allArticles.filter((a: Article) => articleIds.includes(a.id));
    setArticleFavorites(favoriteArticles);
  };

  const handleLike = (postId: string) => {
    if (!user) return;

    // 检查用户是否已经点过赞
    const savedLikes = localStorage.getItem(`shenxiaoyou_user_likes_${user.id}`);
    const likedPostsList = savedLikes ? JSON.parse(savedLikes) : [];

    if (likedPostsList.includes(postId)) {
      // 已经点过赞了，不执行任何操作
      return;
    }

    // 执行点赞
    const newLikedPosts = [...likedPostsList, postId];
    localStorage.setItem(`shenxiaoyou_user_likes_${user.id}`, JSON.stringify(newLikedPosts));
    setLikedPosts(new Set(newLikedPosts));

    // 更新收藏列表中的点赞数
    setFavorites(prev => {
      const updated = prev.map(post => {
        if (post.id === postId) {
          return { ...post, likes_count: post.likes_count + 1 };
        }
        return post;
      });

      // 同步更新所有帖子存储
      const savedPosts = localStorage.getItem('shenxiaoyou_posts');
      if (savedPosts) {
        const posts = JSON.parse(savedPosts);
        const updatedPosts = posts.map((p: Post) =>
          p.id === postId ? { ...p, likes_count: p.likes_count + 1 } : p
        );
        localStorage.setItem('shenxiaoyou_posts', JSON.stringify(updatedPosts));
      }

      return updated;
    });
  };

  const handleRemovePostFavorite = (postId: string) => {
    if (!user) return;

    // 从收藏列表中移除
    const savedFavorites = localStorage.getItem(`shenxiaoyou_user_favorites_${user.id}`);
    if (savedFavorites) {
      const favorites = JSON.parse(savedFavorites);
      const updated = favorites.filter((id: string) => id !== postId);
      localStorage.setItem(`shenxiaoyou_user_favorites_${user.id}`, JSON.stringify(updated));
    }

    // 更新显示
    setFavorites(prev => prev.filter(post => post.id !== postId));
  };

  const handleRemoveArticleFavorite = (articleId: string) => {
    if (!user) return;

    // 从文章收藏列表中移除
    const savedFavorites = localStorage.getItem(`shenxiaoyou_article_favorites_${user.id}`);
    if (savedFavorites) {
      const favorites = JSON.parse(savedFavorites);
      const updated = favorites.filter((id: string) => id !== articleId);
      localStorage.setItem(`shenxiaoyou_article_favorites_${user.id}`, JSON.stringify(updated));
    }

    // 更新显示
    setArticleFavorites(prev => prev.filter(article => article.id !== articleId));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-14 md:top-16 z-40 bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center space-x-3">
          <Link to="/profile" className="text-gray-600 hover:text-gray-800">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-semibold text-gray-800">我的收藏</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-3xl mx-auto px-4 pt-4">
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex items-center space-x-1 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'posts'
                ? 'bg-emerald-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>帖子 ({favorites.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('articles')}
            className={`flex items-center space-x-1 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'articles'
                ? 'bg-emerald-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>文章 ({articleFavorites.length})</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 pb-4">
        {activeTab === 'posts' ? (
          favorites.length === 0 ? (
            <div className="min-h-[50vh] flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Heart className="w-10 h-10 text-gray-300" />
              </div>
              <p className="text-gray-400 text-lg mb-1">空空如也</p>
              <p className="text-gray-400">还没有收藏帖子</p>
              <Link
                to="/"
                className="mt-6 px-6 py-2 bg-emerald-500 text-white rounded-full text-sm hover:bg-emerald-600 transition-colors"
              >
                去发现
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {favorites.map(post => (
                <div key={post.id} className="relative group">
                  <PostCard
                    post={post}
                    onLike={() => handleLike(post.id)}
                    onShare={() => setSharePost(post)}
                  />
                  <button
                    onClick={() => handleRemovePostFavorite(post.id)}
                    className="absolute top-2 right-2 p-1.5 bg-red-50 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100"
                    title="取消收藏"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )
        ) : (
          articleFavorites.length === 0 ? (
            <div className="min-h-[50vh] flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Bookmark className="w-10 h-10 text-gray-300" />
              </div>
              <p className="text-gray-400 text-lg mb-1">空空如也</p>
              <p className="text-gray-400">还没有收藏文章</p>
              <div className="flex space-x-3 mt-6">
                <Link
                  to="/policy"
                  className="px-6 py-2 bg-emerald-500 text-white rounded-full text-sm hover:bg-emerald-600 transition-colors"
                >
                  政策资讯
                </Link>
                <Link
                  to="/health"
                  className="px-6 py-2 bg-emerald-500 text-white rounded-full text-sm hover:bg-emerald-600 transition-colors"
                >
                  保健知识
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {articleFavorites.map(article => (
                <div key={article.id} className="relative group">
                  <Link
                    to={`/article/${article.id}`}
                    className="block bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="flex">
                      <img
                        src={article.cover_image}
                        alt={article.title}
                        className="w-32 h-24 object-cover flex-shrink-0"
                      />
                      <div className="p-4 flex-1 min-w-0">
                        <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-600 text-xs rounded-full mb-2">
                          {article.category}
                        </span>
                        <h3 className="font-medium text-gray-800 text-sm line-clamp-2">
                          {article.title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemoveArticleFavorite(article.id);
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-red-50 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100"
                    title="取消收藏"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {/* Share Modal */}
      {sharePost && (
        <ShareModal post={sharePost} onClose={() => setSharePost(null)} />
      )}
    </div>
  );
}