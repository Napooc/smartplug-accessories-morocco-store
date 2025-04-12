
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/Admin/AdminLayout';
import AdminAddProduct from '@/components/Admin/AdminAddProduct';
import AdminEditProduct from '@/components/Admin/AdminEditProduct';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, X, Edit, Trash2, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
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
import { toast } from 'sonner';

const AdminProducts = () => {
  const { products, deleteProduct, fetchProducts } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
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
      toast.success("Produits rafraîchis avec succès");
    } catch (error) {
      console.error("Error refreshing products:", error);
      toast.error("Échec du rafraîchissement des produits");
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
      await deleteProduct(productId);
      refreshProducts(); // Refresh products list after deleting
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };
  
  return (
    <AdminLayout title="Produits">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Rechercher produits..."
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
            <RefreshCw className={`mr-1 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Rafraîchir
          </Button>
          
          <Button
            onClick={() => setShowAddProduct(true)}
            className="bg-smartplug-blue hover:bg-smartplug-lightblue flex items-center"
          >
            <Plus size={18} className="mr-1" />
            Ajouter Produit
          </Button>
        </div>
      </div>
      
      {showAddProduct && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Ajouter Nouveau Produit</h2>
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
                    Nom du Produit
                    {getSortIcon('name')}
                  </div>
                </th>
                <th className="px-6 py-3 cursor-pointer" onClick={() => toggleSort('category')}>
                  <div className="flex items-center">
                    Catégorie
                    {getSortIcon('category')}
                  </div>
                </th>
                <th className="px-6 py-3 cursor-pointer" onClick={() => toggleSort('price')}>
                  <div className="flex items-center">
                    Prix
                    {getSortIcon('price')}
                  </div>
                </th>
                <th className="px-6 py-3">Stock</th>
                <th className="px-6 py-3">Statut</th>
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
                            Mis en avant
                          </span>
                        )}
                        {product.onSale && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                            En solde
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <Sheet>
                          <SheetContent side="right" className="w-[400px] sm:w-[600px] overflow-y-auto">
                            <SheetHeader>
                              <SheetTitle>Modifier Produit</SheetTitle>
                              <SheetDescription>
                                Modifier les détails du produit ici.
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
                          
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleEditProduct(product)}
                          >
                            <Edit size={16} />
                          </Button>
                        </Sheet>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Supprimer Produit</AlertDialogTitle>
                              <AlertDialogDescription>
                                Êtes-vous sûr de vouloir supprimer ce produit? Cette action ne peut pas être annulée.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-500 hover:bg-red-600"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                Supprimer
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
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    Aucun produit trouvé
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
