import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, ChevronDown, Menu, Search } from 'lucide-react';
import { useStore } from '@/lib/store';
import AnimatedLogo from './AnimatedLogo';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const { cart } = useStore();
  const isMobile = useIsMobile();
  const categories = ['Smart Home', 'Electronics', 'Appliances', 'Gadgets'];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Free shipping notification bar */}
      <div className="bg-smartplug-blue text-white py-2 text-center animate-pulse">
        <p className="text-sm font-medium">Free shipping on all orders! 🚚</p>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <AnimatedLogo size="medium" withText={true} />
          </div>

          {/* Navigation for desktop */}
          {!isMobile && (
            <nav className="hidden md:flex items-center space-x-8">
              {/* Categories dropdown */}
              <div className="relative group">
                <button className="flex items-center space-x-1 hover:text-smartplug-blue transition-colors">
                  <span>Categories</span>
                  <ChevronDown size={16} />
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 z-50">
                  <div className="py-1">
                    {categories.map((category) => (
                      <Link
                        key={category}
                        to={`/category/${category.toLowerCase()}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-smartplug-blue capitalize"
                      >
                        {category}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              
              <Link to="/" className="hover:text-smartplug-blue transition-colors">
                Home
              </Link>
              <Link to="/products" className="hover:text-smartplug-blue transition-colors">
                Products
              </Link>
              <Link to="/about" className="hover:text-smartplug-blue transition-colors">
                About
              </Link>
              <Link to="/contact" className="hover:text-smartplug-blue transition-colors">
                Contact
              </Link>
            </nav>
          )}

          {/* Search bar, cart, and mobile menu */}
          <div className="flex items-center space-x-4">
            {/* Search bar (always visible) */}
            <div className="relative">
              <input
                type="search"
                placeholder="Search..."
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-smartplug-blue"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>
            
            {/* Cart */}
            <Link to="/cart" className="relative hover:text-smartplug-blue transition-colors">
              <ShoppingCart size={24} />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                  {cart.length}
                </span>
              )}
            </Link>
            
            {/* Mobile menu */}
            {isMobile && (
              <Link to="/mobile-menu" className="hover:text-smartplug-blue transition-colors">
                <Menu size={24} />
              </Link>
            )}
            
            {/* User icon */}
            <Link to="/profile" className="hover:text-smartplug-blue transition-colors">
              <User size={24} />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
