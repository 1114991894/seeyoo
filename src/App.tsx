import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
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
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import PostManagement from './pages/admin/PostManagement';
import ContentReview from './pages/admin/ContentReview';
import Statistics from './pages/admin/Statistics';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <HashRouter>
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
              <Route path="feedback" element={<Feedback />} />
              <Route path="my-posts" element={<MyPosts />} />
              <Route path="my-favorites" element={<MyFavorites />} />
            </Route>
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/posts" element={<PostManagement />} />
            <Route path="/admin/review" element={<ContentReview />} />
            <Route path="/admin/stats" element={<Statistics />} />
          </Routes>
        </HashRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
