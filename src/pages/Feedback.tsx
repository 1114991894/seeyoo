import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send, CheckCircle } from 'lucide-react';

export default function Feedback() {
  const [feedbackType, setFeedbackType] = useState('suggestion');
  const [content, setContent] = useState('');
  const [contact, setContact] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const feedbackTypes = [
    { id: 'suggestion', label: '功能建议' },
    { id: 'bug', label: '问题反馈' },
    { id: 'content', label: '内容举报' },
    { id: 'other', label: '其他' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      alert('请输入反馈内容');
      return;
    }

    setIsSubmitting(true);
    
    // 模拟提交
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 保存到localStorage
    const feedbacks = JSON.parse(localStorage.getItem('shenxiaoyou_feedbacks') || '[]');
    feedbacks.push({
      id: 'feedback_' + Date.now(),
      type: feedbackType,
      content,
      contact,
      created_at: new Date().toISOString()
    });
    localStorage.setItem('shenxiaoyou_feedbacks', JSON.stringify(feedbacks));
    
    setIsSubmitting(false);
    setShowSuccess(true);
    
    // 3秒后自动返回
    setTimeout(() => {
      setShowSuccess(false);
      setContent('');
      setContact('');
    }, 3000);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-sm w-full">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">提交成功</h2>
          <p className="text-gray-500">感谢您的反馈，我们会尽快处理</p>
        </div>
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
          <h1 className="font-semibold text-gray-800">建议与反馈</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
          {/* Feedback Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">反馈类型</label>
            <div className="flex flex-wrap gap-2">
              {feedbackTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setFeedbackType(type.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    feedbackType === type.id
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">反馈内容</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="请详细描述您的建议或遇到的问题..."
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none resize-none"
            />
          </div>

          {/* Contact */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">联系方式（选填）</label>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="手机号或邮箱，方便我们回复您"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? '提交中...' : '提交反馈'}</span>
          </button>
        </form>

        {/* Tips */}
        <div className="mt-6 p-4 bg-emerald-50 rounded-xl">
          <h4 className="font-medium text-emerald-800 mb-2">反馈小贴士</h4>
          <ul className="text-sm text-emerald-700 space-y-1">
            <li>• 请尽量详细描述您的问题或建议</li>
            <li>• 如遇问题，请说明具体操作步骤</li>
            <li>• 留下联系方式，方便我们及时回复</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
