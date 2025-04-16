
import { Link } from 'react-router-dom';
import { 
  Menu, 
  X, 
  ShoppingCart, 
  Search, 
  ChevronDown, 
  Home, 
  ShoppingBag, 
  Phone, 
  MessageCircle,
  Tag
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LanguageSelector from './LanguageSelector';
import { useLanguage } from '@/lib/languageContext';
import { useIsMobile } from '@/hooks/use-mobile';
import Logo from './Logo';

const Navbar = () => {
  const isMobile = useIsMobile();
  const { t, direction } = useLanguage();
  const { cart } = useStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      // Focus the search input when it opens
      setTimeout(() => {
        const searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.focus();
      }, 100);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      window.location.href = `/shop?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const navbarClass = isScrolled 
    ? 'bg-white shadow-md' 
    : 'bg-transparent';

  return (
    <>
      <nav 
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${navbarClass}`}
        dir={direction}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Logo size="medium" withText={true} />
            </div>

            {/* Navigation - Desktop */}
            <div className="hidden md:flex md:items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-smartplug-blue transition-colors">
                {t('home')}
              </Link>
              <div className="relative group">
                <button className="flex items-center text-gray-700 hover:text-smartplug-blue focus:outline-none transition-colors">
                  {t('categories')}
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden transform origin-top scale-0 group-hover:scale-100 transition-transform z-50">
                  <div className="py-2">
                    <Link to="/categories/home-kitchen" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      {t('homeKitchen')}
                    </Link>
                    <Link to="/categories/electronics" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      {t('electronics')}
                    </Link>
                    <Link to="/categories/tools-lighting" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      {t('toolsLighting')}
                    </Link>
                    <Link to="/categories/plumbing" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      {t('plumbing')}
                    </Link>
                    <Link to="/categories/garden-terrace" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      {t('gardenTerrace')}
                    </Link>
                    <Link to="/categories/discounts-deals" className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600">
                      <span className="flex items-center">
                        <Tag className="h-4 w-4 mr-1 text-red-500" />
                        {t('discountsDeals', { default: 'Discounts & Deals' })}
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
              <Link to="/shop" className="text-gray-700 hover:text-smartplug-blue transition-colors">
                {t('shop')}
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-smartplug-blue transition-colors">
                {t('about')}
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-smartplug-blue transition-colors">
                {t('contact')}
              </Link>
            </div>

            {/* Right Side - Actions */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={toggleSearch}
                className="text-gray-700 hover:text-smartplug-blue p-1 rounded-full focus:outline-none"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
              
              <Link 
                to="/cart" 
                className="text-gray-700 hover:text-smartplug-blue p-1 rounded-full focus:outline-none relative"
                aria-label="Cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-smartplug-blue text-white text-xs h-5 w-5 flex items-center justify-center rounded-full">
                    {cart.length}
                  </span>
                )}
              </Link>
              
              <LanguageSelector />
              
              {/* Mobile Menu Button */}
              <button
                onClick={toggleMenu}
                className="md:hidden p-1 rounded-md text-gray-700 hover:text-smartplug-blue focus:outline-none"
                aria-label="Menu"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Search Overlay */}
        {isSearchOpen && (
          <div className="absolute inset-0 w-full h-screen bg-white bg-opacity-95 z-40 flex items-start justify-center pt-20">
            <div className="container px-4 relative">
              <button 
                onClick={toggleSearch}
                className="absolute top-0 right-4 p-2 text-gray-600 hover:text-gray-900"
                aria-label="Close"
              >
                <X className="h-6 w-6" />
              </button>
              <form onSubmit={handleSearch} className="mx-auto max-w-2xl">
                <h2 className="text-2xl font-bold mb-4 text-center">{t('searchProducts')}</h2>
                <div className="flex">
                  <Input
                    id="search-input"
                    type="text"
                    placeholder={t('searchPlaceholder')}
                    className="flex-1"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button type="submit" className="ml-2 bg-smartplug-blue hover:bg-smartplug-lightblue">
                    <Search className="h-5 w-5" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t shadow-lg">
            <div className="container mx-auto px-4 py-3 space-y-3">
              <Link 
                to="/" 
                className="flex items-center py-2 px-3 rounded-md hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="h-5 w-5 mr-3 text-smartplug-blue" />
                {t('home')}
              </Link>
              <Link 
                to="/shop" 
                className="flex items-center py-2 px-3 rounded-md hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                <ShoppingBag className="h-5 w-5 mr-3 text-smartplug-blue" />
                {t('shop')}
              </Link>
              <details className="group">
                <summary className="flex items-center py-2 px-3 rounded-md hover:bg-gray-100 cursor-pointer list-none">
                  <ChevronDown className="h-5 w-5 mr-3 text-smartplug-blue transform group-open:rotate-180 transition-transform" />
                  {t('categories')}
                </summary>
                <div className="ml-8 mt-2 space-y-1">
                  <Link 
                    to="/categories/home-kitchen" 
                    className="block py-2 px-3 rounded-md hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('homeKitchen')}
                  </Link>
                  <Link 
                    to="/categories/electronics" 
                    className="block py-2 px-3 rounded-md hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('electronics')}
                  </Link>
                  <Link 
                    to="/categories/tools-lighting" 
                    className="block py-2 px-3 rounded-md hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('toolsLighting')}
                  </Link>
                  <Link 
                    to="/categories/plumbing" 
                    className="block py-2 px-3 rounded-md hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('plumbing')}
                  </Link>
                  <Link 
                    to="/categories/garden-terrace" 
                    className="block py-2 px-3 rounded-md hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('gardenTerrace')}
                  </Link>
                  <Link 
                    to="/categories/discounts-deals" 
                    className="block py-2 px-3 rounded-md hover:bg-gray-100 text-red-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="flex items-center">
                      <Tag className="h-4 w-4 mr-1" />
                      {t('discountsDeals', { default: 'Discounts & Deals' })}
                    </span>
                  </Link>
                </div>
              </details>
              <Link 
                to="/about" 
                className="flex items-center py-2 px-3 rounded-md hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                <MessageCircle className="h-5 w-5 mr-3 text-smartplug-blue" />
                {t('about')}
              </Link>
              <Link 
                to="/contact" 
                className="flex items-center py-2 px-3 rounded-md hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                <Phone className="h-5 w-5 mr-3 text-smartplug-blue" />
                {t('contact')}
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
