
import React, { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useScrollToTop } from '@/hooks/useScrollToTop';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  // This hook will scroll to top on route changes
  useScrollToTop();
  
  // Apply security measures on component mount
  useEffect(() => {
    try {
      // Set security meta tags (would be better implemented server-side)
      const metaTags = [
        { name: 'Content-Security-Policy', content: "default-src 'self'; img-src 'self' https://images.unsplash.com data:; style-src 'self' 'unsafe-inline'; script-src 'self'" },
        { name: 'X-Frame-Options', content: 'DENY' },
        { name: 'X-Content-Type-Options', content: 'nosniff' },
        { name: 'Referrer-Policy', content: 'strict-origin-when-cross-origin' },
        { name: 'Permissions-Policy', content: 'geolocation=(), camera=(), microphone=()' }
      ];
      
      // Remove any existing security meta tags
      document.querySelectorAll('meta[name^="Content-Security-Policy"], meta[name^="X-Frame-Options"], meta[name^="X-Content-Type-Options"], meta[name^="Referrer-Policy"], meta[name^="Permissions-Policy"]')
        .forEach(tag => tag.remove());
      
      // Add new security meta tags
      metaTags.forEach(tagInfo => {
        const tag = document.createElement('meta');
        tag.name = tagInfo.name;
        tag.content = tagInfo.content;
        document.head.appendChild(tag);
      });
      
      // Removed clickjacking prevention code that was causing security issues
    } catch (error) {
      console.error("Error setting security headers:", error);
    }
  }, []);
  
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
