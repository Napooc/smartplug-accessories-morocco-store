
import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { 
  QueryClient, 
  QueryClientProvider 
} from "@tanstack/react-query";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { LanguageLinkInjector } from "@/components/ui/language-link-injector";
import { useLanguage } from "@/lib/languageContext";
import { updatePageLinks } from "@/lib/languageUtils";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import CategoryPage from "./pages/CategoryPage";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./pages/AdminOrders";
import AdminProducts from "./pages/AdminProducts";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import { useStore } from "@/lib/store";

// Create a new QueryClient instance
const queryClient = new QueryClient();

// Route Change Handler Component
const RouteChangeHandler = () => {
  const { language } = useLanguage();
  const location = useLocation();
  
  useEffect(() => {
    // When route changes, ensure all links have language params
    // Skip for admin routes
    if (!location.pathname.startsWith('/admin')) {
      updatePageLinks(language);
    }
  }, [location, language]);
  
  return null; // This component doesn't render anything
};

// Admin Route Guard Component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin } = useStore();
  const location = useLocation();
  
  if (!isAdmin) {
    // Redirect to admin login if not authenticated
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* Add LanguageLinkInjector to handle link updates */}
        <LanguageLinkInjector />
        
        {/* Add RouteChangeHandler to handle route changes */}
        <RouteChangeHandler />
        
        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/categories/:categoryId" element={<CategoryPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/confirmation" element={<OrderConfirmation />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          <Route path="/admin/orders" element={
            <AdminRoute>
              <AdminOrders />
            </AdminRoute>
          } />
          <Route path="/admin/products" element={
            <AdminRoute>
              <AdminProducts />
            </AdminRoute>
          } />
          
          {/* Catch-all Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
