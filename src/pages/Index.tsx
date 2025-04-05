
import Layout from "@/components/Layout/Layout";
import Hero from "@/components/Home/Hero";
import CategoryGrid from "@/components/Home/CategoryGrid";
import ProductGrid from "@/components/Products/ProductGrid";
import FeaturedSection from "@/components/Home/FeaturedSection";
import { useStore } from "@/lib/store";
import { useEffect } from "react";

const Index = () => {
  const { featuredProducts, saleProducts, fetchOrders } = useStore();
  
  // Fetch orders when the component mounts
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);
  
  return (
    <Layout>
      <Hero />
      
      <div className="container mx-auto px-4 py-8">
        <CategoryGrid />
        
        <div className="my-12">
          <FeaturedSection 
            title="Premium Headphones" 
            subtitle="Superior sound quality for music enthusiasts"
            categoryName="Audio"
            bgColor="bg-gray-100"
            textColor="text-gray-900"
            imageUrl="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80"
            link="/categories/headphones"
          />
        </div>
        
        <ProductGrid products={featuredProducts} title="Featured Products" />
        
        <div className="my-12">
          <FeaturedSection 
            title="Fast Charging Solutions" 
            subtitle="Power up your devices in minutes"
            categoryName="Chargers"
            bgColor="bg-smartplug-blue"
            textColor="text-white"
            imageUrl="https://images.unsplash.com/photo-1618842602192-2f9c0d57666f?w=500&auto=format&fit=crop&q=80"
            link="/categories/chargers"
          />
        </div>
        
        <ProductGrid products={saleProducts} title="On Sale" />
      </div>
    </Layout>
  );
};

export default Index;
