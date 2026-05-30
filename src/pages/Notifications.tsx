import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Heart, MessageCircle, UserPlus, Bell, Check } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';
import { formatDistanceToNow } from '../utils/format';

export default function Notifications() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

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
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center space-x-1 text-sm text-emerald-600 hover:text-emerald-700"
            >
              <Check className="w-4 h-4" />
              <span>全部已读</span>
            </button>
          )}
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
          <div className="space-y-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={`bg-white rounded-xl p-4 cursor-pointer hover:shadow-md transition-shadow ${
                  !notification.is_read ? 'border-l-4 border-emerald-500' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getBgColor(notification.type)}`}>
                    {getIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        {notification.sender_name && (
                          <span className="font-medium text-gray-800">{notification.sender_name}</span>
                        )}
                        <span className="text-gray-600">{notification.content}</span>
                        {notification.post_title && (
                          <Link 
                            to={`/post/${notification.post_id}`}
                            className="block mt-1 text-sm text-emerald-600 hover:underline"
                          >
                            《{notification.post_title}》
                          </Link>
                        )}
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                        {formatDistanceToNow(notification.created_at)}
                      </span>
                    </div>
                  </div>

                  {/* Unread Dot */}
                  {!notification.is_read && (
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
