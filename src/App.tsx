import React, { useEffect, lazy, Suspense } from "react";
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
import { useStore } from "@/lib/store";
import { toast } from "sonner";

// Create a new QueryClient instance with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Don't refetch on window focus
      staleTime: 5 * 60 * 1000, // Data fresh for 5 minutes
      retry: 1, // Minimize retries for faster loading
    },
  },
});

// Load core pages eagerly to remove initial loading screen
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import AdminLogin from "./pages/AdminLogin";
import Layout from "./components/Layout/Layout";

// Optimized lazy loading for other pages
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminOrders = lazy(() => import("./pages/AdminOrders"));
const AdminProducts = lazy(() => import("./pages/AdminProducts"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Route Change Handler Component
const RouteChangeHandler = () => {
  const { language } = useLanguage();
  const location = useLocation();
  
  React.useEffect(() => {
    // When route changes, ensure all links have language params
    // Skip for admin routes
    if (!location.pathname.startsWith('/admin')) {
      updatePageLinks(language);
    }
  }, [location, language]);
  
  return null;
};

// Minimal loading component (no spinners or loading text)
const MinimalFallback = () => <div className="min-h-screen"></div>;

// Admin Route Guard Component with enhanced security
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin } = useStore();
  const location = useLocation();
  
  // Check for admin session timeout
  useEffect(() => {
    const checkAdminSession = () => {
      const lastActivity = localStorage.getItem('adminLastActivity');
      if (lastActivity) {
        const inactiveTime = Date.now() - parseInt(lastActivity, 10);
        // Auto logout after 30 minutes of inactivity
        if (inactiveTime > 30 * 60 * 1000) {
          localStorage.removeItem('adminLastActivity');
          localStorage.removeItem('smartplug-admin');
          window.location.href = '/admin/login';
          toast.warning("Session expired due to inactivity");
        }
      }
    };
    
    // Run check on mount
    checkAdminSession();
  }, []);
  
  // Update last activity timestamp
  useEffect(() => {
    if (isAdmin) {
      const updateActivity = () => {
        localStorage.setItem('adminLastActivity', Date.now().toString());
      };
      
      // Update on initial render
      updateActivity();
      
      // Set up event listeners for user activity
      const events = ['mousedown', 'keypress', 'scroll', 'touchstart'];
      events.forEach(event => {
        window.addEventListener(event, updateActivity);
      });
      
      return () => {
        events.forEach(event => {
          window.removeEventListener(event, updateActivity);
        });
      };
    }
  }, [isAdmin]);
  
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
          {/* Customer Routes - No loading indicators */}
          <Route path="/" element={<Index />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={
            <Suspense fallback={<MinimalFallback />}>
              <ProductDetail />
            </Suspense>
          } />
          <Route path="/categories/:categoryId" element={
            <Suspense fallback={<MinimalFallback />}>
              <CategoryPage />
            </Suspense>
          } />
          <Route path="/cart" element={
            <Suspense fallback={<MinimalFallback />}>
              <Cart />
            </Suspense>
          } />
          <Route path="/checkout" element={
            <Suspense fallback={<MinimalFallback />}>
              <Checkout />
            </Suspense>
          } />
          <Route path="/confirmation" element={
            <Suspense fallback={<MinimalFallback />}>
              <OrderConfirmation />
            </Suspense>
          } />
          <Route path="/about" element={
            <Suspense fallback={<MinimalFallback />}>
              <About />
            </Suspense>
          } />
          <Route path="/contact" element={
            <Suspense fallback={<MinimalFallback />}>
              <Contact />
            </Suspense>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <AdminRoute>
              <Suspense fallback={<MinimalFallback />}>
                <AdminDashboard />
              </Suspense>
            </AdminRoute>
          } />
          <Route path="/admin/orders" element={
            <AdminRoute>
              <Suspense fallback={<MinimalFallback />}>
                <AdminOrders />
              </Suspense>
            </AdminRoute>
          } />
          <Route path="/admin/products" element={
            <AdminRoute>
              <Suspense fallback={<MinimalFallback />}>
                <AdminProducts />
              </Suspense>
            </AdminRoute>
          } />
          
          {/* Catch-all Route */}
          <Route path="*" element={
            <Suspense fallback={<MinimalFallback />}>
              <NotFound />
            </Suspense>
          } />
        </Routes>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
