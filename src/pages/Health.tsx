import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ChevronRight, Eye } from 'lucide-react';
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

export default function Health() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    // 初始化保健知识
    const initialArticles: Article[] = [
      {
        id: 'health_1',
        title: '透析患者的饮食控制指南',
        content: '透析患者的饮食管理至关重要。本文详细介绍如何控制钾、磷、钠的摄入，以及每日饮水量的控制方法...',
        category: '饮食管理',
        cover_image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400',
        views_count: 4521,
        created_at: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 'health_2',
        title: '适合肾病患者的运动推荐',
        content: '适当的运动有助于改善肾病患者的身体状况。本文推荐几种适合不同阶段肾病患者的运动方式...',
        category: '运动康复',
        cover_image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
        views_count: 3245,
        created_at: new Date(Date.now() - 172800000).toISOString()
      },
      {
        id: 'health_3',
        title: '肾病患者的心理调节方法',
        content: '长期患病容易产生焦虑、抑郁等负面情绪。本文分享一些有效的心理调节方法，帮助患者保持积极心态...',
        category: '心理健康',
        cover_image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
        views_count: 2891,
        created_at: new Date(Date.now() - 259200000).toISOString()
      },
      {
        id: 'health_4',
        title: '透析期间的并发症预防',
        content: '透析过程中可能出现低血压、肌肉痉挛等并发症。本文介绍如何预防和处理这些常见问题...',
        category: '并发症预防',
        cover_image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400',
        views_count: 4123,
        created_at: new Date(Date.now() - 345600000).toISOString()
      },
      {
        id: 'health_5',
        title: '肾移植后的日常护理要点',
        content: '肾移植成功后，日常护理同样重要。本文详细介绍术后用药、饮食、运动等方面的注意事项...',
        category: '术后护理',
        cover_image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400',
        views_count: 3567,
        created_at: new Date(Date.now() - 432000000).toISOString()
      },
      {
        id: 'health_6',
        title: '慢性肾病的早期症状识别',
        content: '早期发现肾病可以延缓病情进展。本文介绍慢性肾病的早期症状，帮助大家及时发现问题...',
        category: '疾病认知',
        cover_image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400',
        views_count: 5234,
        created_at: new Date(Date.now() - 518400000).toISOString()
      }
    ];
    setArticles(initialArticles);
  }, []);

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
      </div>
    </div>
  );
}
