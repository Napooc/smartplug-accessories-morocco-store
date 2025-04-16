
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useScrollToTop } from '@/hooks/useScrollToTop';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  // This hook will scroll to top on route changes
  useScrollToTop();
  
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Navbar />
      <main className="flex-grow w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
