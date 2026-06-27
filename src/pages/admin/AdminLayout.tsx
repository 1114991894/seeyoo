import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  ShieldCheck, 
  BarChart3, 
  LogOut,
  Menu,
  X,
  Image,
  Heart,
  FileText as PolicyIcon,
  UserCog
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('shenxiaoyou_admin_sidebar');
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('shenxiaoyou_admin_sidebar', JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);
  const [admin, setAdmin] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const adminData = localStorage.getItem('shenxiaoyou_admin');
    if (!adminData) {
      setIsChecking(false);
      navigate('/admin/login');
      return;
    }
    try {
      const parsed = JSON.parse(adminData);
      setAdmin(parsed);
      setIsChecking(false);
    } catch (e) {
      console.error('[AdminLayout] 解析管理员数据失败:', e);
      localStorage.removeItem('shenxiaoyou_admin');
      setIsChecking(false);
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('shenxiaoyou_admin');
    navigate('/admin/login');
  };

  const menuItems = [
    { path: '/admin/dashboard', label: '数据概览', icon: LayoutDashboard, perm: 'dashboard' },
    { path: '/admin/users', label: '用户管理', icon: Users, perm: 'users' },
    { path: '/admin/posts', label: '帖子管理', icon: FileText, perm: 'posts' },
    { path: '/admin/review', label: '内容审核', icon: ShieldCheck, perm: 'review' },
    { path: '/admin/stats', label: '数据统计', icon: BarChart3, perm: 'stats' },
    { path: '/admin/media', label: '图片库', icon: Image, perm: 'media' },
    { path: '/admin/policy', label: '政策管理', icon: PolicyIcon, perm: 'policy' },
    { path: '/admin/health', label: '保健管理', icon: Heart, perm: 'health' },
    { path: '/admin/sub-admins', label: '分管理员', icon: UserCog, perm: 'sub-admins' },
    { type: 'logout', label: '退出登录', icon: LogOut },
  ];

  // 检查是否有权限访问某个菜单项
  const hasPermission = (perm: string) => {
    if (!admin) return false;
    // 总管理员拥有所有权限
    if (admin.role === 'admin') return true;
    // 分管理员根据权限列表判断
    return admin.permissions && admin.permissions.includes(perm);
  };

  // 检查中或正在跳转
  if (isChecking || !admin) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <div className="text-gray-500">验证中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside 
        className={`bg-slate-800 text-white transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-slate-700">
          {isSidebarOpen ? (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">肾</span>
              </div>
              <span className="font-bold">肾小友—管理员后台</span>
            </div>
          ) : (
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">肾</span>
            </div>
          )}
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            if (item.type === 'logout') {
              return (
                <button
                  key="logout"
                  onClick={handleLogout}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-slate-300 hover:bg-slate-700 hover:text-white w-full"
                >
                  <LogOut className="w-5 h-5" />
                  {isSidebarOpen && <span>{item.label}</span>}
                </button>
              );
            }
            const path = item.path;
            if (!path) return null;
            // 检查权限
            if (item.perm && !hasPermission(item.perm)) return null;
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-emerald-500 text-white' 
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {isSidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">管理员：{admin?.username}</span>
            <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">管</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}