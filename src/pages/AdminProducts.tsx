
import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import AdminLayout from '@/components/Admin/AdminLayout';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { categories } from '@/lib/data';

const AdminProducts = () => {
  const { products } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // Filter products
  const filteredProducts = products.filter((product) => {
    // Filter by category
    if (categoryFilter !== 'all' && product.category !== categoryFilter) {
      return false;
    }
    
    // Filter by search query (name or description)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
  
  return (
    <AdminLayout title="Products">
      <div className="bg-white rounded-lg shadow-sm border">
        {/* Filter and search */}
        <div className="p-6 border-b">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search products..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="w-full sm:w-48">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Products table */}
        <div className="overflow-x-auto">
          {filteredProducts.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              No products found
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 text-left text-gray-600 text-sm">
                <tr>
                  <th className="p-4">Image</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">SKU</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <img 
                        src={product.images[0]} 
                        alt={product.name} 
                        className="w-12 h-12 object-cover rounded border"
                      />
                    </td>
                    <td className="p-4 font-medium">{product.name}</td>
                    <td className="p-4 text-gray-600">{product.sku}</td>
                    <td className="p-4 capitalize">{product.category}</td>
                    <td className="p-4 font-medium">
                      {product.price} DH
                      {product.oldPrice && (
                        <span className="line-through text-gray-500 ml-2 text-sm">
                          {product.oldPrice} DH
                        </span>
                      )}
                    </td>
                    <td className="p-4">{product.stock}</td>
                    <td className="p-4">
                      {product.stock > 0 ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          In Stock
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                          Out of Stock
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
