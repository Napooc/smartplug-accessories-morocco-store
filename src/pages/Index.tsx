
import Layout from "@/components/Layout/Layout";
import Hero from "@/components/Home/Hero";
import CategoryGrid from "@/components/Home/CategoryGrid";
import ProductGrid from "@/components/Products/ProductGrid";
import TopSellingProducts from "@/components/Home/TopSellingProducts";
import InnovationShowcase from "@/components/Home/InnovationShowcase";
import CustomerBenefits from "@/components/Home/CustomerBenefits";
import { useStore } from "@/lib/store";
import { useEffect } from "react";
import { useLanguage } from "@/lib/languageContext";

const Index = () => {
  const { featuredProducts, fetchOrders, saleProducts } = useStore();
  const { t, direction } = useLanguage();
  
  // Fetch orders when the component mounts
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);
  
  return (
    <Layout>
      <Hero />
      
      <div className="container mx-auto px-4 py-8" dir={direction}>
        <CategoryGrid />
        
        <div className="my-12">
          <TopSellingProducts />
        </div>
        
        <div className="my-12">
          <ProductGrid products={featuredProducts} title={t('featured', { default: 'Featured Products' })} />
        </div>
        
        {saleProducts.length > 0 && (
          <div className="my-12">
            <ProductGrid 
              products={saleProducts} 
              title={t('discountsDeals', { default: 'Discounts & Deals' })} 
              highlight={true}
            />
          </div>
        )}
        
        <div className="my-12">
          <InnovationShowcase />
        </div>
        
        <div className="my-12">
          <CustomerBenefits />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
