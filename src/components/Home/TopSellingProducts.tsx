
import { useStore } from "@/lib/store";
import { Link } from "react-router-dom";
import { Star, ArrowRight, Check } from "lucide-react";
import { useLanguage } from "@/lib/languageContext";

export default function TopSellingProducts() {
  const { products } = useStore();
  const { t } = useLanguage();
  
  // Get the top 4 highest-rated products
  const topSellingProducts = [...products]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);
  
  return (
    <section className="py-10 bg-gray-50 rounded-lg overflow-hidden">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{t('bestSellingProducts', { default: 'Best-Selling Products' })}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('discoverBestProducts', { default: 'Discover our most loved products with exceptional quality and customer satisfaction' })}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
          {topSellingProducts.map((product) => {
            // Translate product name and description
            const translatedName = t(`product_${product.id}_name`, { default: product.name });
            const translatedDescription = t(`product_${product.id}_description`, { default: product.description });
            
            return (
              <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-300 flex flex-col h-full">
                <div className="relative">
                  <Link to={`/product/${product.id}`} className="block">
                    <img 
                      src={product.images[0]} 
                      alt={translatedName}
                      className="w-full h-48 object-contain bg-white p-4"
                    />
                  </Link>
                  <div className="absolute top-2 right-2 bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded-sm flex items-center">
                    <Star className="w-3 h-3 mr-1 fill-white" />
                    {product.rating}
                  </div>
                </div>
                
                <div className="p-4 flex-grow flex flex-col">
                  <Link to={`/product/${product.id}`} className="block">
                    <h3 className="font-medium text-lg mb-2 hover:text-smartplug-blue transition-colors">
                      {translatedName}
                    </h3>
                  </Link>
                  
                  <div className="mb-3 flex-grow">
                    <ul className="space-y-1">
                      {translatedDescription.split('. ').slice(0, 2).map((feature, index) => (
                        <li key={index} className="flex items-start text-sm text-gray-600">
                          <Check className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-lg font-bold text-smartplug-blue">{product.price} DH</span>
                    <Link 
                      to={`/product/${product.id}`}
                      className="text-sm text-smartplug-blue hover:text-smartplug-lightblue flex items-center"
                    >
                      {t('viewDetails', { default: 'View Details' })}
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
