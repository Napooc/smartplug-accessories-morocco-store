
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/Admin/AdminLayout';
import AdminAddProduct from '@/components/Admin/AdminAddProduct';
import AdminEditProduct from '@/components/Admin/AdminEditProduct';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Plus, 
  X, 
  Edit, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  RefreshCw,
  Loader2
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Product } from '@/lib/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useScrollToTop } from '@/hooks/useScrollToTop';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from 'sonner';

const AdminProducts = () => {
  const { products, deleteProduct, fetchProducts } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [selectedProductsForDeletion, setSelectedProductsForDeletion] = useState<string[]>([]);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [showAddImage, setShowAddImage] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  
  // Use scroll to top hook
  useScrollToTop();
  
  // Fetch products on component mount
  useEffect(() => {
    refreshProducts();
  }, []);
  
  const refreshProducts = async () => {
    setIsRefreshing(true);
    try {
      await fetchProducts();
      toast.success("Products refreshed successfully");
    } catch (error) {
      console.error("Error refreshing products:", error);
      toast.error("Failed to refresh products");
    } finally {
      setIsRefreshing(false);
    }
  };
  
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
  
  const handleEditProduct = (product: Product) => {
    console.log("Editing product:", product);
    setSelectedProduct(product);
  };
  
  const handleCloseEditSheet = () => {
    setSelectedProduct(null);
    refreshProducts(); // Refresh products list after editing
  };
  
  const handleDeleteProduct = async (productId: string) => {
    try {
      setIsDeleting(productId);
      console.log("Deleting product:", productId);
      await deleteProduct(productId);
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    } finally {
      setIsDeleting(null);
    }
  };
  
  const handleProductAdded = () => {
    setShowAddProduct(false);
    refreshProducts();
  };
  
  const toggleProductSelection = (productId: string) => {
    setSelectedProductsForDeletion(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };
  
  const handleSelectAll = () => {
    if (selectedProductsForDeletion.length === filteredProducts.length) {
      // If all are selected, unselect all
      setSelectedProductsForDeletion([]);
    } else {
      // Otherwise, select all
      setSelectedProductsForDeletion(filteredProducts.map(p => p.id));
    }
  };
  
  const handleBulkDelete = async () => {
    if (selectedProductsForDeletion.length === 0) return;
    
    setIsBulkDeleting(true);
    try {
      // Delete multiple products in sequence
      for (const productId of selectedProductsForDeletion) {
        await deleteProduct(productId);
      }
      
      toast.success(`${selectedProductsForDeletion.length} products deleted successfully`);
      setSelectedProductsForDeletion([]);
      setShowBulkDeleteConfirm(false);
    } catch (error) {
      console.error("Error bulk deleting products:", error);
      toast.error("Error during bulk delete");
    } finally {
      setIsBulkDeleting(false);
    }
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
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={refreshProducts}
            disabled={isRefreshing}
            className="flex items-center"
          >
            {isRefreshing ? (
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-1 h-4 w-4" />
            )}
            Refresh
          </Button>
          
          <Button
            onClick={() => setShowAddProduct(true)}
            className="bg-smartplug-blue hover:bg-smartplug-lightblue flex items-center"
          >
            <Plus size={18} className="mr-1" />
            Add Product
          </Button>
        </div>
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
          <AdminAddProduct onProductAdded={handleProductAdded} />
        </div>
      )}
      
      {selectedProductsForDeletion.length > 0 && (
        <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg mb-4">
          <div className="font-medium text-blue-800">
            {selectedProductsForDeletion.length} products selected
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setSelectedProductsForDeletion([])}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowBulkDeleteConfirm(true)}
            >
              Delete Selected
            </Button>
          </div>
        </div>
      )}
      
      {/* Dialog for bulk delete confirmation */}
      <Dialog open={showBulkDeleteConfirm} onOpenChange={setShowBulkDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Products</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedProductsForDeletion.length} products? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowBulkDeleteConfirm(false)}
              disabled={isBulkDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
              disabled={isBulkDeleting}
            >
              {isBulkDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Confirm Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      checked={
                        filteredProducts.length > 0 &&
                        selectedProductsForDeletion.length === filteredProducts.length
                      }
                      onChange={handleSelectAll}
                    />
                  </div>
                </th>
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
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        checked={selectedProductsForDeletion.includes(product.id)}
                        onChange={() => toggleProductSelection(product.id)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-12 w-12 object-cover rounded"
                        />
                      ) : (
                        <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center">
                          <X size={16} className="text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{product.name}</div>
                    </td>
                    <td className="px-6 py-4 capitalize">
                      {product.category}
                    </td>
                    <td className="px-6 py-4">
                      {product.price} DH
                      {product.oldPrice && product.oldPrice > 0 && (
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
                            On Sale
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
                              onClick={() => handleEditProduct(product)}
                            >
                              <Edit size={16} />
                            </Button>
                          </SheetTrigger>
                          <SheetContent side="right" className="w-[400px] sm:w-[600px] overflow-y-auto">
                            <SheetHeader>
                              <SheetTitle>Edit Product</SheetTitle>
                              <SheetDescription>
                                Make changes to the product details here.
                              </SheetDescription>
                            </SheetHeader>
                            <div className="py-4">
                              {selectedProduct && selectedProduct.id === product.id && (
                                <AdminEditProduct 
                                  product={selectedProduct} 
                                  onClose={handleCloseEditSheet} 
                                />
                              )}
                            </div>
                          </SheetContent>
                        </Sheet>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                              disabled={isDeleting === product.id}
                            >
                              {isDeleting === product.id ? (
                                <Loader2 size={16} className="animate-spin" />
                              ) : (
                                <Trash2 size={16} />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Product</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this product? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-500 hover:bg-red-600"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                {isDeleting === product.id ? 'Deleting...' : 'Delete'}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    {searchTerm ? 'No products found matching your search criteria' : 'No products found'}
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
