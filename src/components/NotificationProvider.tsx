import React, { createContext, useContext, useState, useEffect } from 'react';
import { Notification } from '../types';
import { toast } from 'sonner';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const addNotification = (n: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotification: Notification = {
      ...n,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      isRead: false
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Also show toast
    switch (n.type) {
      case 'success': toast.success(n.title, { description: n.message }); break;
      case 'error': toast.error(n.title, { description: n.message }); break;
      case 'warning': toast.warning(n.title, { description: n.message }); break;
      default: toast.info(n.title, { description: n.message }); break;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  // Initial welcome notification
  useEffect(() => {
    if (notifications.length === 0) {
      addNotification({
        type: 'info',
        title: 'Registry Connection Established',
        message: 'Your treasury is now synchronized with the Base Mainnet registry.'
      });
    }
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAsRead, markAllAsRead, clearAll }}>
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
