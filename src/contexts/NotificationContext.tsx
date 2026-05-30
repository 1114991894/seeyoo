import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface Notification {
  id: string;
  user_id: string;
  sender_id?: string;
  sender_name?: string;
  sender_avatar?: string;
  type: 'like' | 'comment' | 'follow' | 'system';
  content: string;
  post_id?: string;
  post_title?: string;
  is_read: boolean;
  created_at: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'created_at' | 'is_read'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // 从localStorage加载通知
      const savedNotifications = localStorage.getItem(`shenxiaoyou_notifications_${user.id}`);
      if (savedNotifications) {
        setNotifications(JSON.parse(savedNotifications));
      } else {
        // 初始化一些示例通知
        const initialNotifications: Notification[] = [
          {
            id: 'notif_1',
            user_id: user.id,
            sender_id: 'user_2',
            sender_name: '阳光肾友',
            sender_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sunshine',
            type: 'like',
            content: '赞了你的帖子',
            post_id: 'post_1',
            post_title: '我的透析日常分享',
            is_read: false,
            created_at: new Date(Date.now() - 3600000).toISOString()
          },
          {
            id: 'notif_2',
            user_id: user.id,
            sender_id: 'user_3',
            sender_name: '坚强的小李',
            sender_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=strong',
            type: 'comment',
            content: '评论了你的帖子：加油！我们一起努力！',
            post_id: 'post_1',
            post_title: '我的透析日常分享',
            is_read: false,
            created_at: new Date(Date.now() - 7200000).toISOString()
          },
          {
            id: 'notif_3',
            user_id: user.id,
            type: 'system',
            content: '欢迎来到肾小友社区！这里是你温暖的互助家园。',
            is_read: true,
            created_at: new Date(Date.now() - 86400000).toISOString()
          }
        ];
        setNotifications(initialNotifications);
        localStorage.setItem(`shenxiaoyou_notifications_${user.id}`, JSON.stringify(initialNotifications));
      }
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`shenxiaoyou_notifications_${user.id}`, JSON.stringify(notifications));
    }
  }, [notifications, user]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, is_read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, is_read: true }))
    );
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'created_at' | 'is_read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: 'notif_' + Date.now(),
      is_read: false,
      created_at: new Date().toISOString()
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      unreadCount, 
      markAsRead, 
      markAllAsRead,
      addNotification 
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
