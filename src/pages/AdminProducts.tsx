
import { useState } from 'react';
import AdminLayout from '@/components/Admin/AdminLayout';
import AdminAddProduct from '@/components/Admin/AdminAddProduct';
import AdminEditProduct from '@/components/Admin/AdminEditProduct';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, X, Edit, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { Product } from '@/lib/types';

const AdminProducts = () => {
  const { products, deleteProduct } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Filter and sort products
  const filteredProducts = products
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc' 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
      } else if (sortBy === 'price') {
        return sortOrder === 'asc' 
          ? a.price - b.price 
          : b.price - a.price;
      } else if (sortBy === 'category') {
        return sortOrder === 'asc' 
          ? a.category.localeCompare(b.category) 
          : b.category.localeCompare(a.category);
      }
      return 0;
    });
    
  const toggleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };
  
  const getSortIcon = (column: string) => {
    if (sortBy === column) {
      return sortOrder === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
    }
    return <ChevronDown size={16} className="text-gray-300" />;
  };
  
  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
  };
  
  const handleCloseEdit = () => {
    setEditingProduct(null);
  };
  
  return (
    <AdminLayout title="Products">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full sm:w-80"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>
        
        <Button
          onClick={() => setShowAddProduct(true)}
          className="bg-smartplug-blue hover:bg-smartplug-lightblue flex items-center"
        >
          <Plus size={18} className="mr-1" />
          Add Product
        </Button>
      </div>
      
      {showAddProduct && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Add New Product</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAddProduct(false)}
            >
              <X size={18} />
            </Button>
          </div>
          <AdminAddProduct />
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3">Image</th>
                <th className="px-6 py-3 cursor-pointer" onClick={() => toggleSort('name')}>
                  <div className="flex items-center">
                    Product Name
                    {getSortIcon('name')}
                  </div>
                </th>
                <th className="px-6 py-3 cursor-pointer" onClick={() => toggleSort('category')}>
                  <div className="flex items-center">
                    Category
                    {getSortIcon('category')}
                  </div>
                </th>
                <th className="px-6 py-3 cursor-pointer" onClick={() => toggleSort('price')}>
                  <div className="flex items-center">
                    Price
                    {getSortIcon('price')}
                  </div>
                </th>
                <th className="px-6 py-3">Stock</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-12 w-12 object-cover rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{product.name}</div>
                    </td>
                    <td className="px-6 py-4 capitalize">
                      {product.category}
                    </td>
                    <td className="px-6 py-4">
                      {product.price} DH
                      {product.oldPrice > 0 && (
                        <span className="text-gray-400 line-through ml-2">{product.oldPrice} DH</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {product.stock || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        {product.featured && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                            Featured
                          </span>
                        )}
                        {product.onSale && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                            Sale
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => handleEditClick(product)}
                            >
                              <Edit size={16} />
                            </Button>
                          </SheetTrigger>
                          <SheetContent side="right" className="w-[400px] sm:w-[540px]">
                            <SheetHeader>
                              <SheetTitle>Edit Product</SheetTitle>
                              <SheetDescription>
                                Make changes to the product here.
                              </SheetDescription>
                            </SheetHeader>
                            <div className="py-4">
                              {editingProduct && (
                                <AdminEditProduct 
                                  product={editingProduct} 
                                  onClose={handleCloseEdit} 
                                />
                              )}
                            </div>
                          </SheetContent>
                        </Sheet>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                          onClick={() => deleteProduct(product.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
