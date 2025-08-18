
import { useState } from 'react';
import Layout from '@/components/Layout/Layout';
import ProductGrid from '@/components/Products/ProductGrid';
import { useStore } from '@/lib/store';
import { categories } from '@/lib/data';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/lib/languageContext';

const Shop = () => {
  const { products } = useStore();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState('default');
  const { t, direction } = useLanguage();
  
  // Map of category IDs to translation keys
  const categoryTranslationKeys: Record<string, string> = {
    'remises-offres': 'remisesOffres',
    'scotch': 'scotch',
    'droguerie': 'droguerie',
    'sanitaire': 'sanitaire',
    'automobile': 'automobile'
  };
  
  // Filter products
  const filteredProducts = products.filter((product) => {
    // Filter by category
    if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
      return false;
    }
    
    // Filter by price range
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }
    
    return true;
  });
  
  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });
  
  // Handle category toggle
  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };
  
  return (
    <Layout>
      <div className="bg-gray-100 py-6">
        <div className="container mx-auto px-4" dir={direction}>
          <h1 className="text-3xl font-bold">{t('shop')}</h1>
          <div className="flex items-center text-sm mt-2">
            <a href="/" className="text-gray-500 hover:text-smartplug-blue">{t('home')}</a>
            <span className="mx-2">/</span>
            <span className="font-medium">{t('shop')}</span>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8" dir={direction}>
        <div className="flex flex-col md:flex-row">
          {/* Sidebar filters */}
          <div className="md:w-1/4 pr-8">
            <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
              <h3 className="text-lg font-medium mb-4">{t('categories')}</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center">
                    <Checkbox
                      id={category.id}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={() => toggleCategory(category.id)}
                    />
                    <Label
                      htmlFor={category.id}
                      className="ml-2 capitalize cursor-pointer"
                    >
                      {t(categoryTranslationKeys[category.id] || category.id, { default: category.name })}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
              <h3 className="text-lg font-medium mb-4">{t('price', { default: 'Price Range' })}</h3>
              <div className="px-2">
                <Slider
                  defaultValue={priceRange}
                  min={0}
                  max={1000}
                  step={10}
                  onValueChange={setPriceRange}
                />
              </div>
              <div className="flex justify-between mt-4 text-sm">
                <span>{priceRange[0]} DH</span>
                <span>{priceRange[1]} DH</span>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium mb-4">{t('sale', { default: 'On Sale' })}</h3>
              <div className="flex items-center">
                <Checkbox id="on-sale" />
                <Label htmlFor="on-sale" className="ml-2 cursor-pointer">
                  {t('showOnlySaleItems', { default: 'Show only sale items' })}
                </Label>
              </div>
            </div>
          </div>
          
          {/* Products grid */}
          <div className="md:w-3/4 mt-8 md:mt-0">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                {t('showing', { default: 'Showing' })} <span className="font-medium">{sortedProducts.length}</span> {t('products', { default: 'products' })}
              </p>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t('sortBy', { default: 'Sort by' })} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">{t('default', { default: 'Default' })}</SelectItem>
                  <SelectItem value="price-asc">{t('priceLowToHigh', { default: 'Price: Low to High' })}</SelectItem>
                  <SelectItem value="price-desc">{t('priceHighToLow', { default: 'Price: High to Low' })}</SelectItem>
                  <SelectItem value="name-asc">{t('nameAtoZ', { default: 'Name: A to Z' })}</SelectItem>
                  <SelectItem value="name-desc">{t('nameZtoA', { default: 'Name: Z to A' })}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <ProductGrid products={sortedProducts} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Shop;
