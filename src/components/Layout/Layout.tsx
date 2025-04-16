
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';
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
      {/* WhatsApp Button - business phone number from the footer */}
      <WhatsAppButton 
        phoneNumber="+212691772215" 
        message="Hello, I'm interested in your products!"
      />
    </div>
  );
};

export default Layout;
