
import { ReactNode, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Home,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Logo from '@/components/Layout/Logo';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const navigate = useNavigate();
  const { logout, isAdmin } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // If not admin, redirect to login
  if (!isAdmin) {
    navigate('/login');
    return null;
  }
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const menuItems = [
    {
      title: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
      link: '/admin',
    },
    {
      title: 'Orders',
      icon: <ShoppingCart size={20} />,
      link: '/admin/orders',
    },
    {
      title: 'Products',
      icon: <Package size={20} />,
      link: '/admin/products',
    },
  ];
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between p-4 bg-white border-b">
          <Link to="/admin" className="flex items-center">
            <Logo size="small" withText={false} />
            <span className="font-bold text-xl ml-2">Ma7alkom Admin</span>
          </Link>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <div className="flex flex-col h-full">
                <div className="p-4 border-b">
                  <Link to="/admin" className="flex items-center">
                    <Logo size="small" withText={false} />
                    <span className="font-bold text-lg ml-2">Ma7alkom Admin</span>
                  </Link>
                </div>
                
                <nav className="flex-1 p-4">
                  <ul className="space-y-2">
                    {menuItems.map((item) => (
                      <li key={item.title}>
                        <Link
                          to={item.link}
                          className="flex items-center p-2 rounded-md hover:bg-gray-100"
                        >
                          <div className="mr-3 text-gray-600">{item.icon}</div>
                          <span>{item.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
                
                <div className="p-4 border-t">
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center"
                    onClick={handleLogout}
                  >
                    <LogOut size={18} className="mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 bg-white border-r h-screen overflow-y-auto fixed">
          <div className="p-6">
            <Link to="/admin" className="flex items-center">
              <Logo size="small" withText={false} />
              <span className="font-bold text-xl ml-2">Ma7alkom Admin</span>
            </Link>
          </div>
          
          <nav className="mt-6">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.title}>
                  <Link
                    to={item.link}
                    className="flex items-center px-6 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="mr-3 text-gray-600">{item.icon}</div>
                    <span>{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="absolute bottom-0 left-0 right-0 p-6 border-t">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center"
              onClick={handleLogout}
            >
              <LogOut size={18} className="mr-2" />
              Logout
            </Button>
          </div>
        </aside>
        
        {/* Main Content */}
        <div className="flex-1 lg:ml-64">
          <header className="bg-white shadow-sm border-b p-4 hidden lg:block">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">{title}</h1>
              
              <div className="flex items-center space-x-4">
                <Link to="/" className="text-gray-600 hover:text-smartplug-blue">
                  View Store
                </Link>
              </div>
            </div>
          </header>
          
          <main className="p-6">
            <div className="mb-6 flex items-center text-sm text-gray-500">
              <Link to="/admin" className="hover:text-smartplug-blue">
                Dashboard
              </Link>
              <ChevronRight size={16} className="mx-1" />
              <span className="font-medium text-gray-800">{title}</span>
            </div>
            
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
