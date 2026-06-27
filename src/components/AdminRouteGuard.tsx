import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface AdminRouteGuardProps {
  children: React.ReactNode;
  requiredPerm: string;
}

export default function AdminRouteGuard({ children, requiredPerm }: AdminRouteGuardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const adminData = localStorage.getItem('shenxiaoyou_admin');
    if (!adminData) {
      navigate('/admin/login');
      return;
    }

    try {
      const admin = JSON.parse(adminData);
      // 总管理员拥有所有权限
      if (admin.role === 'admin') {
        setIsAuthorized(true);
        setIsChecking(false);
        return;
      }

      // 分管理员检查权限
      if (admin.permissions && admin.permissions.includes(requiredPerm)) {
        setIsAuthorized(true);
      } else {
        // 无权限，重定向到数据概览
        navigate('/admin/dashboard');
      }
      setIsChecking(false);
    } catch (e) {
      navigate('/admin/login');
    }
  }, [navigate, requiredPerm]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <div className="text-gray-500">验证权限中...</div>
        </div>
      </div>
    );
  }

  return isAuthorized ? <>{children}</> : null;
}