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
  markDateAsRead: (dateKey: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'created_at' | 'is_read'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const NOTIFICATIONS_KEY = 'shenxiaoyou_notifications_all';

function getAllNotifications(): Notification[] {
  try {
    return JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveAllNotifications(all: Notification[]) {
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(all));
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();

  // 从共享存储加载当前用户的通知
  useEffect(() => {
    if (user) {
      const all = getAllNotifications();
      setNotifications(all.filter(n => n.user_id === user.id));
    } else {
      setNotifications([]);
    }
  }, [user]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const markAsRead = (id: string) => {
    // 更新共享存储
    const all = getAllNotifications();
    const updated = all.map(n => n.id === id ? { ...n, is_read: true } : n);
    saveAllNotifications(updated);
    // 更新当前用户状态
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const markAllAsRead = () => {
    const all = getAllNotifications();
    const updated = all.map(n => 
      n.user_id === user?.id ? { ...n, is_read: true } : n
    );
    saveAllNotifications(updated);
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const markDateAsRead = (dateKey: string) => {
    const all = getAllNotifications();
    const updated = all.map(n => {
      const nDateKey = new Date(n.created_at).toLocaleDateString('zh-CN', {
        year: 'numeric', month: '2-digit', day: '2-digit'
      }).replace(/\//g, '-');
      if (n.user_id === user?.id && nDateKey === dateKey) {
        return { ...n, is_read: true };
      }
      return n;
    });
    saveAllNotifications(updated);
    setNotifications(prev => prev.map(n => {
      const nDateKey = new Date(n.created_at).toLocaleDateString('zh-CN', {
        year: 'numeric', month: '2-digit', day: '2-digit'
      }).replace(/\//g, '-');
      if (nDateKey === dateKey) {
        return { ...n, is_read: true };
      }
      return n;
    }));
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'created_at' | 'is_read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: 'notif_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      is_read: false,
      created_at: new Date().toISOString()
    };

    // 写入共享存储（所有用户共享）
    const all = getAllNotifications();
    all.unshift(newNotification);
    saveAllNotifications(all);

    // 如果通知属于当前用户，也更新当前状态
    if (user && newNotification.user_id === user.id) {
      setNotifications(prev => [newNotification, ...prev]);
    }
  };

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      unreadCount, 
      markAsRead, 
      markAllAsRead,
      markDateAsRead,
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