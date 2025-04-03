
import { Link } from "react-router-dom";
import { 
  ShoppingCart, 
  Search, 
  Menu, 
  User,
  Headphones
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

export default function Navbar() {
  const { cart, isAdmin } = useStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log("Searching for:", searchQuery);
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
            <form onSubmit={handleSearch} className="w-full flex">
              <Input
                type="text"
                placeholder="What are you looking for?"
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
                    <Link to="/categories" className="block px-2 py-1 text-lg">Categories</Link>
                    <Link to="/cart" className="block px-2 py-1 text-lg">Cart</Link>
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
            <div className="flex items-center space-x-1">
              <Menu size={18} className="text-gray-600" />
              <span className="font-medium">CATEGORIES</span>
            </div>
            
            <div className="flex space-x-8">
              <Link to="/" className="hover:text-smartplug-blue">Home</Link>
              <Link to="/shop" className="hover:text-smartplug-blue">Shop</Link>
              <Link to="/about" className="hover:text-smartplug-blue">About Us</Link>
              <Link to="/contact" className="hover:text-smartplug-blue">Contact</Link>
            </div>
            
            <div className="flex items-center">
              <Link to="/sale" className="flex items-center">
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
