
import Layout from "@/components/Layout/Layout";
import Hero from "@/components/Home/Hero";
import CategoryGrid from "@/components/Home/CategoryGrid";
import ProductGrid from "@/components/Products/ProductGrid";
import FeaturedSection from "@/components/Home/FeaturedSection";
import { useStore } from "@/lib/store";

const Index = () => {
  const { featuredProducts, saleProducts } = useStore();
  
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
            imageUrl="/public/lovable-uploads/630c44e5-1c0c-4664-8ac2-18390ad254fb.png"
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
            imageUrl="/public/lovable-uploads/563a1834-b7fa-40eb-8a01-96162ae40d11.png"
            link="/categories/chargers"
          />
        </div>
        
        <ProductGrid products={saleProducts} title="On Sale" />
      </div>
    </Layout>
  );
};

export default Index;
