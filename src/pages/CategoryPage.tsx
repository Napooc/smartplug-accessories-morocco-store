
import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import ProductGrid from '@/components/Products/ProductGrid';
import { useStore } from '@/lib/store';
import { categories } from '@/lib/data';

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { getProductsByCategory } = useStore();
  
  const category = categories.find((c) => c.id === categoryId);
  const products = getProductsByCategory(categoryId || '');
  
  return (
    <Layout>
      <div className="bg-gray-100 py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold capitalize">{category?.name || 'Category'}</h1>
          <div className="flex items-center text-sm mt-2">
            <a href="/" className="text-gray-500 hover:text-smartplug-blue">Home</a>
            <span className="mx-2">/</span>
            <a href="/shop" className="text-gray-500 hover:text-smartplug-blue">Shop</a>
            <span className="mx-2">/</span>
            <span className="font-medium capitalize">{category?.name || categoryId}</span>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">No products found</h2>
            <p className="text-gray-600">
              There are no products in this category at the moment.
            </p>
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </Layout>
  );
};

export default CategoryPage;
