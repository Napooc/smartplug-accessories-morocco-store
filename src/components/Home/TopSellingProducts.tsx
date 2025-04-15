
import { useStore } from "@/lib/store";
import { Link } from "react-router-dom";
import ProductCard from "../Products/ProductCard";
import { useLanguage } from "@/lib/languageContext";

export default function TopSellingProducts() {
  const { products } = useStore();
  const { t, direction } = useLanguage();
  
  // Get the top 4 highest-rated products
  const topSellingProducts = [...products]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);
  
  return (
    <section className="py-10 bg-gray-50 rounded-lg overflow-hidden">
      <div className="container mx-auto" dir={direction}>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{t('bestSellingProducts')}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('discoverBestProducts')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
          {topSellingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
