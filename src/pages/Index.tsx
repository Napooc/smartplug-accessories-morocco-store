
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
  const { 
    products,
    bestSellingProducts,
    dealsProducts,
    featuredProducts,
    fetchOrders 
  } = useStore();
  
  const { t, direction } = useLanguage();
  
  // Fetch orders when the component mounts
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);
  
  // Log for debugging
  console.log("Best Selling Products:", bestSellingProducts.length, bestSellingProducts.map(p => p.name));
  console.log("Deals Products:", dealsProducts.length, dealsProducts.map(p => p.name));
  console.log("Featured Products:", featuredProducts.length, featuredProducts.map(p => p.name));
  
  return (
    <Layout>
      <Hero />
      
      <div className="container mx-auto px-4 py-8" dir={direction}>
        <CategoryGrid />
        
        <div className="my-12">
          {bestSellingProducts.length > 0 ? (
            <ProductGrid 
              products={bestSellingProducts} 
              title={t('bestSellingItems', { default: 'Best Selling Items' })}
              emptyMessage={t('noBestSellingItems', { default: 'No best selling items yet' })}
            />
          ) : (
            <TopSellingProducts />
          )}
        </div>
        
        <div className="my-12">
          {dealsProducts.length > 0 && (
            <ProductGrid 
              products={dealsProducts} 
              title={t('discountDeals', { default: 'Discounts & Deals' })}
              emptyMessage={t('noDeals', { default: 'No deals available yet' })}
            />
          )}
        </div>
        
        <div className="my-12">
          <ProductGrid 
            products={featuredProducts} 
            title={t('featured', { default: 'Featured Products' })}
            emptyMessage={t('noFeaturedProducts', { default: 'No featured products yet' })}
          />
        </div>
        
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
