
import { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import LanguageSelector from '@/components/Layout/LanguageSelector';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  LogOut,
  ChevronRight
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AdminLayout = ({ children, title }: AdminLayoutProps) => {
  const { isAdmin, logout } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Use the hook for scrolling to top on navigation
  useScrollToTop();
  
  useEffect(() => {
    // Redirect to login if not admin
    if (!isAdmin) {
      navigate('/admin/login');
    }
  }, [isAdmin, navigate]);
  
  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };
  
  const navItems = [
    {
      title: 'Dashboard',
      path: '/admin',
      icon: <LayoutDashboard size={20} />
    },
    {
      title: 'Orders',
      path: '/admin/orders',
      icon: <ShoppingBag size={20} />
    },
    {
      title: 'Products',
      path: '/admin/products',
      icon: <Package size={20} />
    }
  ];
  
  if (!isAdmin) {
    return null;
  }
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white shadow-sm">
          <div className="px-4 pb-4 border-b">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold tracking-widest text-smartplug-blue">Ma7alkom</span>
              <span className="ml-2 text-sm text-gray-500">Admin</span>
            </Link>
          </div>
          
          <div className="flex flex-col flex-grow px-4 pt-5">
            <nav className="flex-1 space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-4 py-3 rounded-md group ${
                      isActive
                        ? 'bg-smartplug-blue bg-opacity-10 text-smartplug-blue'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="flex-shrink-0 mr-3">{item.icon}</span>
                    <span className="text-sm font-medium">{item.title}</span>
                    {isActive && <ChevronRight size={16} className="ml-auto" />}
                  </Link>
                );
              })}
            </nav>
          </div>
          
          <div className="flex-shrink-0 p-4 mt-auto border-t">
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="flex items-center justify-center w-full"
            >
              <LogOut size={16} className="mr-2" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-col flex-1">
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 bg-white shadow-sm md:px-6">
          <div className="md:hidden">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold tracking-widest text-smartplug-blue">Ma7alkom</span>
              <span className="ml-2 text-sm text-gray-500">Admin</span>
            </Link>
          </div>
          
          <div className="flex items-center ml-auto gap-2">
            <LanguageSelector />
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="flex items-center"
              size="sm"
            >
              <LogOut size={16} className="mr-2" />
              <span className="hidden md:inline">Logout</span>
            </Button>
          </div>
        </div>
        
        {/* Mobile navigation */}
        <div className="flex justify-between p-4 overflow-x-auto md:hidden bg-white border-b">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center px-3 py-2 ${
                  isActive ? 'text-smartplug-blue' : 'text-gray-600'
                }`}
              >
                {item.icon}
                <span className="mt-1 text-xs">{item.title}</span>
              </Link>
            );
          })}
        </div>
        
        {/* Page header */}
        <div className="px-4 py-6 md:px-6">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        </div>
        
        {/* Page content */}
        <div className="flex-grow px-4 pb-6 md:px-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
