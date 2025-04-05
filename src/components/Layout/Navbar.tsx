
import { Link, useNavigate } from "react-router-dom";
import { 
  ShoppingCart, 
  Search, 
  Menu, 
  User,
  Headphones,
  X
} from "lucide-react";
import { useState } from "react";
import { useStore } from "@/lib/store";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function Navbar() {
  const navigate = useNavigate();
  const { cart, isAdmin, searchProducts } = useStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Array<any>>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setSearchResults([]);
    }
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim().length >= 2) {
      const results = searchProducts(value);
      setSearchResults(results.slice(0, 5));
      setIsSearching(true);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  };
  
  const handleSearchResultClick = (productId: string) => {
    navigate(`/product/${productId}`);
    setSearchQuery("");
    setSearchResults([]);
    setIsSearching(false);
  };
  
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      {/* Sale announcement banner */}
      <div className="bg-smartplug-blue text-white py-2 overflow-hidden whitespace-nowrap relative">
        <div className="flex w-full">
          <div className="animate-marquee inline-block">
            Flat 30% Sale Going On Selected Products. VIEW PRODUCTS.
          </div>
          <div className="animate-marquee2 inline-block absolute">
            Flat 30% Sale Going On Selected Products. VIEW PRODUCTS.
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Headphones className="h-8 w-8 text-smartplug-blue" />
            <span className="text-2xl font-bold text-gray-900">SmartPlug</span>
          </Link>
          
          {/* Search bar - visible on desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <Popover open={isSearching && searchResults.length > 0} onOpenChange={setIsSearching}>
              <div className="w-full flex relative">
                <PopoverTrigger asChild>
                  <form onSubmit={handleSearch} className="w-full flex">
                    <Input
                      type="text"
                      placeholder="What are you looking for?"
                      className="rounded-l-md border-r-0"
                      value={searchQuery}
                      onChange={handleSearchChange}
                    />
                    <Button 
                      type="submit" 
                      className="rounded-l-none bg-smartplug-blue hover:bg-smartplug-lightblue"
                    >
                      <Search size={18} />
                    </Button>
                  </form>
                </PopoverTrigger>
                
                <PopoverContent className="w-[400px] p-0" align="start">
                  {searchResults.length > 0 ? (
                    <div className="py-2">
                      {searchResults.map((product) => (
                        <div 
                          key={product.id}
                          className="flex items-center p-2 cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSearchResultClick(product.id)}
                        >
                          <img 
                            src={product.images[0]} 
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                          <div className="ml-3">
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.price} DH</div>
                          </div>
                        </div>
                      ))}
                      <div className="border-t pt-2 px-2 mt-1">
                        <Button 
                          variant="ghost" 
                          className="w-full justify-center text-smartplug-blue"
                          onClick={() => {
                            navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
                            setSearchQuery("");
                            setSearchResults([]);
                            setIsSearching(false);
                          }}
                        >
                          View all results
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">No results found</div>
                  )}
                </PopoverContent>
              </div>
            </Popover>
          </div>
          
          {/* Nav links */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center">
              <div className="text-right">
                <p className="text-sm font-medium">NEED HELP?</p>
                <p className="text-sm">+212-555-1234</p>
              </div>
            </div>
            
            {isAdmin ? (
              <Link to="/admin" className="text-gray-600 hover:text-smartplug-blue">
                <div className="flex items-center space-x-1">
                  <User size={20} />
                  <span>Admin</span>
                </div>
              </Link>
            ) : (
              <Link to="/login" className="text-gray-600 hover:text-smartplug-blue">
                <div className="flex items-center space-x-1">
                  <User size={20} />
                  <span>Login</span>
                </div>
              </Link>
            )}
            
            <Link to="/cart" className="text-gray-600 hover:text-smartplug-blue">
              <div className="relative">
                <ShoppingCart size={22} />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-smartplug-red text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </div>
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center space-x-4 md:hidden">
            <Link to="/cart" className="text-gray-600">
              <div className="relative">
                <ShoppingCart size={22} />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-smartplug-red text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </div>
            </Link>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu size={22} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="py-4 space-y-4">
                  <form onSubmit={handleSearch} className="flex">
                    <Input
                      type="text"
                      placeholder="Search products..."
                      className="rounded-l-md border-r-0"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button 
                      type="submit" 
                      className="rounded-l-none bg-smartplug-blue hover:bg-smartplug-lightblue"
                    >
                      <Search size={18} />
                    </Button>
                  </form>
                  
                  <nav className="space-y-4 mt-8">
                    <Link to="/" className="block px-2 py-1 text-lg">Home</Link>
                    <Link to="/shop" className="block px-2 py-1 text-lg">Shop</Link>
                    <Link to="/categories/earbuds" className="block px-2 py-1 text-lg">Categories</Link>
                    <Link to="/cart" className="block px-2 py-1 text-lg">Cart</Link>
                    <Link to="/about" className="block px-2 py-1 text-lg">About Us</Link>
                    <Link to="/contact" className="block px-2 py-1 text-lg">Contact</Link>
                    {isAdmin ? (
                      <Link to="/admin" className="block px-2 py-1 text-lg">Admin Dashboard</Link>
                    ) : (
                      <Link to="/login" className="block px-2 py-1 text-lg">Login</Link>
                    )}
                  </nav>
                  
                  <div className="pt-4 border-t mt-6">
                    <p className="text-sm font-medium">NEED HELP?</p>
                    <p className="text-sm">+212-555-1234</p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      
      {/* Secondary navigation */}
      <div className="bg-gray-100 py-2 hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="relative group">
              <div className="flex items-center space-x-1 cursor-pointer">
                <Menu size={18} className="text-gray-600" />
                <span className="font-medium">CATEGORIES</span>
              </div>
              
              <div className="absolute left-0 top-full mt-2 w-60 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="py-2">
                  <Link to="/categories/earbuds" className="block px-4 py-2 hover:bg-gray-100">Earbuds</Link>
                  <Link to="/categories/cases" className="block px-4 py-2 hover:bg-gray-100">Phone Cases</Link>
                  <Link to="/categories/chargers" className="block px-4 py-2 hover:bg-gray-100">Chargers</Link>
                  <Link to="/categories/cables" className="block px-4 py-2 hover:bg-gray-100">Cables</Link>
                  <Link to="/categories/speakers" className="block px-4 py-2 hover:bg-gray-100">Speakers</Link>
                  <Link to="/categories/accessories" className="block px-4 py-2 hover:bg-gray-100">Accessories</Link>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-8">
              <Link to="/" className="hover:text-smartplug-blue">Home</Link>
              <Link to="/shop" className="hover:text-smartplug-blue">Shop</Link>
              <Link to="/about" className="hover:text-smartplug-blue">About Us</Link>
              <Link to="/contact" className="hover:text-smartplug-blue">Contact</Link>
            </div>
            
            <div className="flex items-center">
              <Link to="/shop" className="flex items-center">
                <span className="font-medium mr-2">Ongoing Offers</span>
                <span className="sale-badge">Sale</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
