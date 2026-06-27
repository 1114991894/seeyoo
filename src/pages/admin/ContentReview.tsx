import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, MessageSquare, Flag, ChevronDown, ChevronRight } from 'lucide-react';
import AdminLayout from './AdminLayout';

interface ReviewItem {
  id: string;
  type: 'post' | 'comment' | 'report';
  content: string;
  author: string;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export default function ContentReview() {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>([
    {
      id: 'review_1',
      type: 'post',
      content: '分享一个偏方，据说对肾病很有效果...',
      author: '用户A',
      reason: '可能涉及医疗广告',
      status: 'pending',
      created_at: '2024-06-01T10:00:00Z'
    },
    {
      id: 'review_2',
      type: 'report',
      content: '该用户发布不当言论',
      author: '用户B',
      reason: '被举报内容违规',
      status: 'pending',
      created_at: '2024-06-01T09:30:00Z'
    },
    {
      id: 'review_3',
      type: 'comment',
      content: '加油！一定会好起来的！',
      author: '用户C',
      status: 'approved',
      created_at: '2024-06-01T08:00:00Z'
    },
  ]);

  const filteredItems = reviewItems.filter(item => item.status === activeTab);

  // 按日期分组
  const groupItemsByDate = (items: ReviewItem[]) => {
    const groups: { [key: string]: ReviewItem[] } = {};
    items.forEach(item => {
      const date = new Date(item.created_at).toLocaleDateString('zh-CN');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(item);
    });
    return groups;
  };

  const groupedItems = groupItemsByDate(filteredItems);
  const sortedDates = Object.keys(groupedItems).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  const toggleDate = (date: string) => {
    const newExpanded = new Set(expandedDates);
    if (newExpanded.has(date)) {
      newExpanded.delete(date);
    } else {
      newExpanded.add(date);
    }
    setExpandedDates(newExpanded);
  };

  const handleApprove = (id: string) => {
    setReviewItems(prev => prev.map(item => 
      item.id === id ? { ...item, status: 'approved' } : item
    ));
  };

  const handleReject = (id: string) => {
    setReviewItems(prev => prev.map(item => 
      item.id === id ? { ...item, status: 'rejected' } : item
    ));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'post':
        return <MessageSquare className="w-5 h-5 text-blue-500" />;
      case 'comment':
        return <MessageSquare className="w-5 h-5 text-emerald-500" />;
      case 'report':
        return <Flag className="w-5 h-5 text-red-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'post':
        return '帖子';
      case 'comment':
        return '评论';
      case 'report':
        return '举报';
      default:
        return '其他';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">内容审核</h1>
          <p className="text-gray-500 mt-1">审核用户发布的内容和举报信息</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">待审核</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">
                  {reviewItems.filter(i => i.status === 'pending').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">已通过</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">
                  {reviewItems.filter(i => i.status === 'approved').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">已拒绝</p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {reviewItems.filter(i => i.status === 'rejected').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="border-b border-gray-200">
            <div className="flex space-x-6 px-6">
              {[
                { id: 'pending', label: '待审核' },
                { id: 'approved', label: '已通过' },
                { id: 'rejected', label: '已拒绝' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 text-sm font-medium border-b-2 transition-colors ${
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

          {/* Review List */}
          <div className="divide-y divide-gray-200">
            {filteredItems.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                暂无{activeTab === 'pending' ? '待审核' : activeTab === 'approved' ? '已通过' : '已拒绝'}的内容
              </div>
            ) : (
              sortedDates.map(date => (
                <div key={date}>
                  <div
                    className="bg-gray-50 px-6 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => toggleDate(date)}
                  >
                    <div className="flex items-center space-x-2">
                      {expandedDates.has(date) ? (
                        <ChevronDown className="w-4 h-4 text-gray-600" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-600" />
                      )}
                      <span className="text-sm font-medium text-gray-800">{date}</span>
                    </div>
                    <span className="text-sm text-gray-500">{groupedItems[date].length} 条</span>
                  </div>
                  {expandedDates.has(date) && (
                  <div className="divide-y divide-gray-200">
                    {groupedItems[date].map((item) => (
                      <div key={item.id} className="p-6 hover:bg-gray-50">
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            {getTypeIcon(item.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-sm font-medium text-gray-800">
                                {getTypeLabel(item.type)}
                              </span>
                              <span className="text-sm text-gray-500">by {item.author}</span>
                              <span className="text-xs text-gray-400">
                                {new Date(item.created_at).toLocaleString('zh-CN')}
                              </span>
                            </div>
                            <p className="text-gray-700 mb-2 line-clamp-2" title={item.content}>{item.content}</p>
                            {item.reason && (
                              <p className="text-sm text-red-600 bg-red-50 px-3 py-1 rounded-lg inline-block">
                                原因：{item.reason}
                              </p>
                            )}
                          </div>
                          {activeTab === 'pending' && (
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleApprove(item.id)}
                                className="flex items-center space-x-1 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                              >
                                <CheckCircle className="w-4 h-4" />
                                <span>通过</span>
                              </button>
                              <button
                                onClick={() => handleReject(item.id)}
                                className="flex items-center space-x-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                              >
                                <XCircle className="w-4 h-4" />
                                <span>拒绝</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
