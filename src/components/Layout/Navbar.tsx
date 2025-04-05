import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, Search, User, ChevronDown } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Product } from '@/lib/types';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Navbar() {
  const { cart, isAdmin, logout, searchProducts } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };
  
  const toggleSearch = () => {
    setSearchOpen(prev => !prev);
    if (!searchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Live search - update results as user types
    if (value.trim()) {
      const results = searchProducts(value);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchOpen(false);
      setSearchTerm('');
      setSearchResults([]);
    }
  };
  
  const handleResultClick = (productId: string) => {
    navigate(`/product/${productId}`);
    setSearchOpen(false);
    setSearchTerm('');
    setSearchResults([]);
  };
  
  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setSearchResults([]);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-smartplug-blue">
            SmartPlug
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-smartplug-blue">Home</Link>
            <Link to="/shop" className="text-gray-700 hover:text-smartplug-blue">Shop</Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-gray-700 hover:text-smartplug-blue flex items-center">
                  Categories <ChevronDown className="ml-1" size={16} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link to="/categories/headphones" className="w-full">Headphones</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/categories/chargers" className="w-full">Chargers</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/categories/cables" className="w-full">Cables</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/categories/accessories" className="w-full">Accessories</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Link to="/about" className="text-gray-700 hover:text-smartplug-blue">About</Link>
            <Link to="/contact" className="text-gray-700 hover:text-smartplug-blue">Contact</Link>
          </nav>
          
          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <button
                onClick={toggleSearch}
                className="p-2 text-gray-700 hover:text-smartplug-blue"
              >
                <Search size={20} />
              </button>
              
              {searchOpen && (
                <div className="absolute right-0 top-10 w-72 md:w-96 bg-white shadow-lg rounded-md overflow-hidden z-20">
                  <form onSubmit={handleSearchSubmit} className="relative">
                    <Input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search products..."
                      className="w-full p-3 pr-12"
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                    <button 
                      type="submit" 
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                      <Search size={18} />
                    </button>
                  </form>
                  
                  {searchResults.length > 0 && (
                    <div className="max-h-80 overflow-y-auto divide-y">
                      {searchResults.map(product => (
                        <div 
                          key={product.id} 
                          className="p-3 hover:bg-gray-50 cursor-pointer flex items-center"
                          onClick={() => handleResultClick(product.id)}
                        >
                          <img 
                            src={product.images[0]} 
                            alt={product.name} 
                            className="w-12 h-12 object-cover rounded mr-3"
                          />
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.price} DH</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Admin Dashboard */}
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className="p-2 text-gray-700 hover:text-smartplug-blue"
              >
                <User size={20} />
              </Link>
            )}
            
            {/* Cart */}
            <Link to="/cart" className="p-2 text-gray-700 hover:text-smartplug-blue relative">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-smartplug-blue text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>
            
            {/* Mobile Menu Button */}
            <button
              className="p-2 text-gray-700 hover:text-smartplug-blue md:hidden"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <nav className="flex flex-col py-4 px-4 space-y-4">
            <Link
              to="/"
              className="text-gray-700 hover:text-smartplug-blue py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className="text-gray-700 hover:text-smartplug-blue py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              to="/categories/headphones"
              className="text-gray-700 hover:text-smartplug-blue py-2 pl-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              Headphones
            </Link>
            <Link
              to="/categories/chargers"
              className="text-gray-700 hover:text-smartplug-blue py-2 pl-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              Chargers
            </Link>
            <Link
              to="/categories/cables"
              className="text-gray-700 hover:text-smartplug-blue py-2 pl-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              Cables
            </Link>
            <Link
              to="/categories/accessories"
              className="text-gray-700 hover:text-smartplug-blue py-2 pl-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              Accessories
            </Link>
            <Link
              to="/about"
              className="text-gray-700 hover:text-smartplug-blue py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-smartplug-blue py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            {isAdmin && (
              <>
                <Link
                  to="/admin/dashboard"
                  className="text-gray-700 hover:text-smartplug-blue py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                >
                  Logout
                </Button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
