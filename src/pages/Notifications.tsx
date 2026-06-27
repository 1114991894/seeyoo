import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Heart, MessageCircle, UserPlus, Bell, Check, ChevronDown, ChevronRight } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';
import { formatDistanceToNow } from '../utils/format';

export default function Notifications() {
  const { notifications, markAsRead, markDateAsRead } = useNotifications();
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());

  // 按日期分组通知
  const groupedNotifications = notifications.reduce<Record<string, typeof notifications>>((groups, notification) => {
    const date = new Date(notification.created_at);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateKey = `${year}-${month}-${day}`;
    const displayDate = `${year}年${month}月${day}日`;
    
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(notification);
    return groups;
  }, {});

  // 按日期降序排列
  const sortedDateKeys = Object.keys(groupedNotifications).sort((a, b) => b.localeCompare(a));

  const toggleExpand = (dateKey: string) => {
    setExpandedDates(prev => {
      const newSet = new Set(prev);
      if (newSet.has(dateKey)) {
        newSet.delete(dateKey);
      } else {
        newSet.add(dateKey);
      }
      return newSet;
    });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-5 h-5 text-red-500" />;
      case 'comment':
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'follow':
        return <UserPlus className="w-5 h-5 text-emerald-500" />;
      case 'system':
        return <Bell className="w-5 h-5 text-orange-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'like':
        return 'bg-red-50';
      case 'comment':
        return 'bg-blue-50';
      case 'follow':
        return 'bg-emerald-50';
      case 'system':
        return 'bg-orange-50';
      default:
        return 'bg-gray-50';
    }
  };

  const formatDateKey = (dateKey: string) => {
    const [year, month, day] = dateKey.split('-');
    return `${year}年${month}月${day}日`;
  };

  const getUnreadCount = (dateKey: string) => {
    return groupedNotifications[dateKey].filter(n => !n.is_read).length;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-14 md:top-16 z-40 bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to="/" className="text-gray-600 hover:text-gray-800">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-semibold text-gray-800">消息通知</h1>
          </div>
        </div>
      </div>

      {/* Notification List */}
      <div className="max-w-3xl mx-auto px-4 py-4">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">暂无消息</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedDateKeys.map((dateKey) => {
              const unreadCount = getUnreadCount(dateKey);
              const isExpanded = expandedDates.has(dateKey);
              const displayDate = formatDateKey(dateKey);

              return (
                <div key={dateKey} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  {/* Date Header */}
                  <div
                    onClick={() => toggleExpand(dateKey)}
                    className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">{displayDate}</span>
                      {unreadCount > 0 && (
                        <span className="flex items-center space-x-1 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                          <span className="w-1.5 h-1.5 bg-white rounded-full" />
                          <span>{unreadCount}</span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {unreadCount > 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markDateAsRead(dateKey);
                          }}
                          className="flex items-center space-x-1 text-xs text-emerald-600 hover:text-emerald-700 px-2 py-1 hover:bg-emerald-50 rounded transition-colors"
                        >
                          <Check className="w-3 h-3" />
                          <span>全部已读</span>
                        </button>
                      )}
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Notifications for this date */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 divide-y divide-gray-50">
                      {groupedNotifications[dateKey].map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => markAsRead(notification.id)}
                          className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                            !notification.is_read ? 'bg-emerald-50/50' : ''
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            {/* Avatar or Icon */}
                            {notification.sender_avatar && notification.type !== 'system' ? (
                              <img
                                src={notification.sender_avatar}
                                alt={notification.sender_name || ''}
                                className="w-10 h-10 rounded-full"
                              />
                            ) : (
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getBgColor(notification.type)}`}>
                                {getIcon(notification.type)}
                              </div>
                            )}

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  {notification.sender_name && (
                                    <span className="font-medium text-gray-800">{notification.sender_name}</span>
                                  )}
                                  <span className="text-gray-600 ml-1">{notification.content}</span>
                                  {notification.post_title && (
                                    <Link
                                      to={`/post/${notification.post_id}`}
                                      className="block mt-1 text-sm text-emerald-600 hover:underline truncate"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      《{notification.post_title}》
                                    </Link>
                                  )}
                                </div>
                                <div className="flex items-center space-x-2 ml-2 shrink-0">
                                  <span className="text-xs text-gray-400 whitespace-nowrap">
                                    {new Date(notification.created_at).toLocaleTimeString('zh-CN', {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                  {!notification.is_read && (
                                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}