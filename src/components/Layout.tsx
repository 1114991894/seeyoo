import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import BottomNav from './BottomNav';

export default function Layout() {
  const location = useLocation();
  const hideBottomNav = ['/login', '/post/new'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pb-20 md:pb-0">
        <Outlet />
      </main>
      {!hideBottomNav && <BottomNav />}
    </div>
  );
}
