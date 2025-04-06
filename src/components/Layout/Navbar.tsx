
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, User, LogOut } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useIsMobile } from '@/hooks/use-mobile';
import { Product } from '@/lib/types';
import LanguageSelector from './LanguageSelector';
import { useLanguage } from '@/lib/languageContext';

export default function Navbar() {
  const { cart, isAdmin, logout, searchProducts } = useStore();
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  
  // Handle search query changes
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const results = searchProducts(searchQuery);
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [searchQuery, searchProducts]);
  
  // Handle clicks outside of search results
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle search selection
  const handleSearchSelect = (productId: string) => {
    setSearchQuery('');
    setShowSearchResults(false);
    navigate(`/product/${productId}`);
  };
  
  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchResults(false);
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-smartplug-blue">
            SmartPlug
          </Link>
          
          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="flex space-x-6">
              <Link to="/" className="text-gray-700 hover:text-smartplug-blue">
                {t('home')}
              </Link>
              <Link to="/shop" className="text-gray-700 hover:text-smartplug-blue">
                {t('shop')}
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-smartplug-blue">
                {t('about')}
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-smartplug-blue">
                {t('contact')}
              </Link>
              {isAdmin && (
                <Link to="/admin" className="text-gray-700 hover:text-smartplug-blue">
                  {t('admin')}
                </Link>
              )}
            </nav>
          )}
          
          {/* Search, Language and Cart */}
          <div className="flex items-center space-x-4" ref={searchRef}>
            {/* Search */}
            <div className="relative">
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <input
                  type="text"
                  placeholder={t('search')}
                  className="bg-gray-100 px-3 py-2 rounded-md w-40 md:w-60 focus:outline-none focus:ring-2 focus:ring-smartplug-blue"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button 
                  type="submit"
                  className="ml-2 text-gray-600 hover:text-smartplug-blue"
                >
                  <Search size={20} />
                </button>
              </form>
              
              {/* Search Results Dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
                  {searchResults.map((product) => (
                    <div 
                      key={product.id}
                      className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                      onClick={() => handleSearchSelect(product.id)}
                    >
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded mr-2"
                      />
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-600">{product.price} DH</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {showSearchResults && searchQuery.trim() && searchResults.length === 0 && (
                <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50 p-3">
                  <p className="text-gray-600">No products found</p>
                </div>
              )}
            </div>
            
            {/* Language Selector */}
            <LanguageSelector />
            
            {/* Admin or Cart */}
            {isAdmin ? (
              <button 
                onClick={logout}
                className="text-gray-700 hover:text-red-500 flex items-center"
              >
                <LogOut size={20} />
                <span className="ml-1 hidden md:inline">{t('logout')}</span>
              </button>
            ) : (
              <Link to="/cart" className="text-gray-700 hover:text-smartplug-blue relative">
                <ShoppingCart size={24} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-smartplug-blue text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            )}
            
            {/* Mobile Menu Toggle */}
            {isMobile && (
              <button 
                className="text-gray-700"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            )}
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobile && mobileMenuOpen && (
          <nav className="py-4 border-t">
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/" 
                  className="block py-2 text-gray-700 hover:text-smartplug-blue"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/shop" 
                  className="block py-2 text-gray-700 hover:text-smartplug-blue"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('shop')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="block py-2 text-gray-700 hover:text-smartplug-blue"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('about')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="block py-2 text-gray-700 hover:text-smartplug-blue"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('contact')}
                </Link>
              </li>
              {isAdmin && (
                <li>
                  <Link 
                    to="/admin" 
                    className="block py-2 text-gray-700 hover:text-smartplug-blue"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('admin')}
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
