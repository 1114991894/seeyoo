import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, ChevronRight, Eye } from 'lucide-react';
import { formatDistanceToNow } from '../utils/format';

interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  cover_image: string;
  views_count: number;
  created_at: string;
}

export default function Policy() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    // 初始化政策资讯
    const initialArticles: Article[] = [
      {
        id: 'article_1',
        title: '2024年肾病患者医保报销新政策解读',
        content: '根据国家医保局最新发布的政策，肾病患者在透析治疗、肾移植手术等方面的报销比例将进一步提高。本文详细解读新政策的变化和申请流程...',
        category: '医保政策',
        cover_image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400',
        views_count: 2345,
        created_at: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 'article_2',
        title: '肾移植等待名单申请指南',
        content: '想要申请肾移植等待名单？本文详细介绍申请条件、所需材料、申请流程以及等待期间的注意事项...',
        category: '移植政策',
        cover_image: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=400',
        views_count: 1892,
        created_at: new Date(Date.now() - 172800000).toISOString()
      },
      {
        id: 'article_3',
        title: '残疾人证办理对肾病患者的优惠政策',
        content: '肾病患者可以申请办理残疾人证，享受多项优惠政策。本文详细介绍办理条件、流程和可享受的福利...',
        category: '福利政策',
        cover_image: 'https://images.unsplash.com/photo-1584515933487-779824d4e3b7?w=400',
        views_count: 1567,
        created_at: new Date(Date.now() - 259200000).toISOString()
      },
      {
        id: 'article_4',
        title: '大病医保申请条件和流程详解',
        content: '大病医保可以为肾病患者减轻沉重的医疗负担。本文详细介绍大病医保的申请条件、报销范围和办理流程...',
        category: '医保政策',
        cover_image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400',
        views_count: 3241,
        created_at: new Date(Date.now() - 345600000).toISOString()
      }
    ];
    setArticles(initialArticles);
  }, []);

  const tabs = [
    { id: 'all', label: '全部' },
    { id: '医保政策', label: '医保' },
    { id: '移植政策', label: '移植' },
    { id: '福利政策', label: '福利' },
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
            <FileText className="w-8 h-8 text-gray-800" />
            <h1 className="text-2xl font-bold text-gray-800">政策资讯</h1>
          </div>
          <p className="text-gray-600">了解最新医保、福利政策，维护自身权益</p>
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
                    ? 'border-blue-500 text-blue-600' 
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
                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full mb-2">
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
      </div>
    </div>
  );
}
