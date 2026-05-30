import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search as SearchIcon, X, Clock, TrendingUp } from 'lucide-react';

export default function Search() {
  const [query, setQuery] = useState('');
  const [searchHistory] = useState(['透析经验', '饮食控制', '医保报销']);
  const [hotSearches] = useState(['肾移植', '腹透', '血透', '并发症', '心理调节', '运动康复']);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      alert(`搜索: ${query}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="sticky top-14 md:top-16 z-40 bg-white border-b border-gray-200 p-4">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSearch} className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索帖子、用户、话题..."
                className="w-full pl-10 pr-10 py-3 bg-gray-100 rounded-full outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-emerald-500 text-white rounded-full font-medium hover:bg-emerald-600 transition-colors"
            >
              搜索
            </button>
          </form>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Search History */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>搜索历史</span>
            </h3>
            <button className="text-sm text-gray-500 hover:text-gray-700">清空</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {searchHistory.map((item, index) => (
              <button
                key={index}
                onClick={() => setQuery(item)}
                className="px-4 py-2 bg-white rounded-full text-sm text-gray-600 hover:bg-gray-100 transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Hot Searches */}
        <div className="mb-8">
          <h3 className="font-semibold text-gray-800 flex items-center space-x-2 mb-4">
            <TrendingUp className="w-4 h-4" />
            <span>热门搜索</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {hotSearches.map((item, index) => (
              <button
                key={index}
                onClick={() => setQuery(item)}
                className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-sm hover:bg-emerald-100 transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-4">分类浏览</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: '透析交流', count: 1234, color: 'bg-blue-50 text-blue-600' },
              { name: '移植等待', count: 567, color: 'bg-emerald-50 text-emerald-600' },
              { name: '饮食管理', count: 890, color: 'bg-orange-50 text-orange-600' },
              { name: '运动康复', count: 456, color: 'bg-purple-50 text-purple-600' },
              { name: '心理支持', count: 345, color: 'bg-pink-50 text-pink-600' },
              { name: '政策咨询', count: 234, color: 'bg-teal-50 text-teal-600' },
            ].map((category) => (
              <Link
                key={category.name}
                to="/"
                className="bg-white rounded-xl p-4 hover:shadow-md transition-shadow"
              >
                <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 ${category.color}`}>
                  {category.name}
                </div>
                <div className="text-gray-400 text-sm">{category.count} 个帖子</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
