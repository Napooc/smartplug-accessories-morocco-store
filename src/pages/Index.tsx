
import Layout from "@/components/Layout/Layout";
import Hero from "@/components/Home/Hero";
import CategoryGrid from "@/components/Home/CategoryGrid";
import ProductGrid from "@/components/Products/ProductGrid";
import TopSellingProducts from "@/components/Home/TopSellingProducts";
import InnovationShowcase from "@/components/Home/InnovationShowcase";
import { useStore } from "@/lib/store";
import { useEffect } from "react";

const Index = () => {
  const { featuredProducts, fetchOrders } = useStore();
  
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
          <TopSellingProducts />
        </div>
        
        <ProductGrid products={featuredProducts} title="Featured Products" />
        
        <div className="my-12">
          <InnovationShowcase />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
