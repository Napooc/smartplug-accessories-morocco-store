
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
    isLoading,
    bestSellingProducts,
    dealsProducts,
    featuredProducts,
    fetchOrders 
  } = useStore();
  
  const { t, direction } = useLanguage();
  
  return (
    <Layout>
      <Hero />
      
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8" dir={direction}>
        <CategoryGrid />
        
        <div className="my-8 md:my-12">
          {bestSellingProducts.length > 0 ? (
            <ProductGrid 
              products={bestSellingProducts} 
              title={t('bestSellingItems', { default: 'Best Selling Items' })}
              emptyMessage={t('noBestSellingItems', { default: 'No best selling items yet' })}
              isLoading={isLoading}
            />
          ) : (
            <TopSellingProducts />
          )}
        </div>
        
        <div className="my-8 md:my-12">
          {dealsProducts.length > 0 && (
            <ProductGrid 
              products={dealsProducts} 
              title={t('discountDeals', { default: 'Discounts & Deals' })}
              emptyMessage={t('noDeals', { default: 'No deals available yet' })}
              isLoading={isLoading}
            />
          )}
        </div>
        
        <div className="my-8 md:my-12">
          <ProductGrid 
            products={featuredProducts} 
            title={t('featured', { default: 'Featured Products' })}
            emptyMessage={t('noFeaturedProducts', { default: 'No featured products yet' })}
            isLoading={isLoading}
          />
        </div>
        
        <div className="my-8 md:my-12">
          <InnovationShowcase />
        </div>
        
        <div className="my-8 md:my-12">
          <CustomerBenefits />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
