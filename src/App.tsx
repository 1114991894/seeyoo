import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import PostDetail from './pages/PostDetail';
import PostNew from './pages/PostNew';
import Policy from './pages/Policy';
import Health from './pages/Health';
import Community from './pages/Community';
import Search from './pages/Search';
import Notifications from './pages/Notifications';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Feedback from './pages/Feedback';
import MyPosts from './pages/MyPosts';
import MyFavorites from './pages/MyFavorites';
import ArticleDetail from './pages/ArticleDetail';
import Diagnose from './pages/Diagnose';
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import PostManagement from './pages/admin/PostManagement';
import ContentReview from './pages/admin/ContentReview';
import Statistics from './pages/admin/Statistics';
import MediaLibrary from './pages/admin/MediaLibrary';
import PolicyManagement from './pages/admin/PolicyManagement';
import HealthManagement from './pages/admin/HealthManagement';
import SubAdminManagement from './pages/admin/SubAdminManagement';
import AdminRouteGuard from './components/AdminRouteGuard';

function AuthErrorHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('error=')) {
      const params = new URLSearchParams(hash.split('?')[1] || hash.replace('#', ''));
      const errorCode = params.get('error');
      if (errorCode) {
        navigate(`/login?error=${errorCode}&error_description=${params.get('error_description') || ''}&error_code=${params.get('error_code') || ''}`, { replace: true });
      }
    }
  }, [navigate]);

  return null;
}

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <HashRouter>
          <AuthErrorHandler />
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="profile" element={<Profile />} />
              <Route path="post/:id" element={<PostDetail />} />
              <Route path="post/new" element={<PostNew />} />
              <Route path="policy" element={<Policy />} />
              <Route path="health" element={<Health />} />
              <Route path="community" element={<Community />} />
              <Route path="search" element={<Search />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="terms" element={<Terms />} />
              <Route path="privacy" element={<Privacy />} />
              <Route path="diagnose" element={<Diagnose />} />
              <Route path="feedback" element={<Feedback />} />
              <Route path="my-posts" element={<MyPosts />} />
              <Route path="my-favorites" element={<MyFavorites />} />
              <Route path="article/:id" element={<ArticleDetail />} />
            </Route>
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={
              <AdminRouteGuard requiredPerm="dashboard">
                <Dashboard />
              </AdminRouteGuard>
            } />
            <Route path="/admin/users" element={
              <AdminRouteGuard requiredPerm="users">
                <UserManagement />
              </AdminRouteGuard>
            } />
            <Route path="/admin/posts" element={
              <AdminRouteGuard requiredPerm="posts">
                <PostManagement />
              </AdminRouteGuard>
            } />
            <Route path="/admin/review" element={
              <AdminRouteGuard requiredPerm="review">
                <ContentReview />
              </AdminRouteGuard>
            } />
            <Route path="/admin/stats" element={
              <AdminRouteGuard requiredPerm="stats">
                <Statistics />
              </AdminRouteGuard>
            } />
            <Route path="/admin/media" element={
              <AdminRouteGuard requiredPerm="media">
                <MediaLibrary />
              </AdminRouteGuard>
            } />
            <Route path="/admin/policy" element={
              <AdminRouteGuard requiredPerm="policy">
                <PolicyManagement />
              </AdminRouteGuard>
            } />
            <Route path="/admin/health" element={
              <AdminRouteGuard requiredPerm="health">
                <HealthManagement />
              </AdminRouteGuard>
            } />
            <Route path="/admin/sub-admins" element={
              <AdminRouteGuard requiredPerm="sub-admins">
                <SubAdminManagement />
              </AdminRouteGuard>
            } />
          </Routes>
        </HashRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;