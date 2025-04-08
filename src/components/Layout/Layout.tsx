
import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useLanguage } from '@/lib/languageContext';
import { AlertTriangle } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Promotional Message Banner */}
      <div className="bg-smartplug-blue text-white py-3 px-4 text-center">
        <div className="container mx-auto flex items-center justify-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          <p className="text-sm md:text-base font-medium">
            {t('promotionalMessage')}
          </p>
        </div>
      </div>
      
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
