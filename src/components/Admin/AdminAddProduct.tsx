
import { useState, useRef } from 'react';
import { useStore } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Upload, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { categories } from '@/lib/data';
import { toast } from 'sonner';

interface AdminAddProductProps {
  onProductAdded: () => void;
}

const AdminAddProduct = ({ onProductAdded }: AdminAddProductProps) => {
  const { addProduct } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: 0,
    oldPrice: 0,
    category: '',
    featured: false,
    onSale: false,
    stock: 0,
    images: [] as string[],
    rating: 0,
    sku: ''
  });
  
  const [errors, setErrors] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    images: ''
  });
  
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'oldPrice' || name === 'stock' 
        ? parseFloat(value) || 0 
        : value
    }));
    
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setProduct(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const handleCategoryChange = (value: string) => {
    setProduct(prev => ({
      ...prev,
      category: value
    }));
    
    if (errors.category) {
      setErrors(prev => ({
        ...prev,
        category: ''
      }));
    }
  };
  
  const addImage = () => {
    if (!imageUrl.trim()) return;
    
    setProduct(prev => ({
      ...prev,
      images: [...prev.images, imageUrl]
    }));
    
    setImageUrl('');
    
    if (errors.images) {
      setErrors(prev => ({
        ...prev,
        images: ''
      }));
    }
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          setProduct(prev => ({
            ...prev,
            images: [...prev.images, event.target!.result as string]
          }));
          
          if (errors.images) {
            setErrors(prev => ({
              ...prev,
              images: ''
            }));
          }
        }
        setIsUploading(false);
      };
      
      reader.onerror = () => {
        toast.error("Échec de lecture du fichier image");
        setIsUploading(false);
      };
      
      reader.readAsDataURL(file);
    });
    
    // Clear the file input for future uploads
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const removeImage = (index: number) => {
    setProduct(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };
  
  const validateForm = () => {
    const newErrors = {
      name: product.name ? '' : 'Le nom est requis',
      description: product.description ? '' : 'La description est requise',
      price: product.price > 0 ? '' : 'Le prix doit être supérieur à 0',
      category: product.category ? '' : 'La catégorie est requise',
      images: product.images.length > 0 ? '' : 'Le produit doit avoir au moins une image'
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Veuillez corriger les erreurs avant de soumettre");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      await addProduct(product);
      
      // Reset form
      setProduct({
        name: '',
        description: '',
        price: 0,
        oldPrice: 0,
        category: '',
        featured: false,
        onSale: false,
        stock: 0,
        images: [],
        rating: 0,
        sku: ''
      });
      
      toast.success("Produit ajouté avec succès");
      onProductAdded(); // Call the callback function after successfully adding a product
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error("Erreur lors de l'ajout du produit");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du Produit</Label>
            <Input
              id="name"
              name="name"
              value={product.name}
              onChange={handleChange}
              placeholder="Entrer le nom du produit"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Catégorie</Label>
            <Select value={product.category} onValueChange={handleCategoryChange}>
              <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={product.description}
            onChange={handleChange}
            placeholder="Entrer la description du produit"
            rows={4}
            className={errors.description ? 'border-red-500' : ''}
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="price">Prix (DH)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={product.price || ''}
              onChange={handleChange}
              placeholder="0.00"
              className={errors.price ? 'border-red-500' : ''}
            />
            {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="oldPrice">Ancien Prix (DH)</Label>
            <Input
              id="oldPrice"
              name="oldPrice"
              type="number"
              min="0"
              step="0.01"
              value={product.oldPrice || ''}
              onChange={handleChange}
              placeholder="0.00"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="stock">Quantité en Stock</Label>
            <Input
              id="stock"
              name="stock"
              type="number"
              min="0"
              value={product.stock || ''}
              onChange={handleChange}
              placeholder="0"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sku">SKU</Label>
            <Input
              id="sku"
              name="sku"
              value={product.sku}
              onChange={handleChange}
              placeholder="Entrer SKU (ou laisser vide pour générer)"
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={product.featured}
              onCheckedChange={(checked) => handleCheckboxChange('featured', checked as boolean)}
            />
            <Label htmlFor="featured">Produit Mis en Avant</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="onSale"
              checked={product.onSale}
              onCheckedChange={(checked) => handleCheckboxChange('onSale', checked as boolean)}
            />
            <Label htmlFor="onSale">En Solde</Label>
          </div>
        </div>
        
        <div className="space-y-4">
          <Label>Images du Produit</Label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex">
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Entrer l'URL de l'image"
                className="rounded-r-none"
              />
              <Button 
                type="button" 
                onClick={addImage}
                className="rounded-l-none"
              >
                Ajouter
              </Button>
            </div>
            
            <div className="flex">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileUpload}
              />
              <Button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="w-full flex items-center justify-center"
                disabled={isUploading}
              >
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? "Téléchargement..." : "Télécharger depuis l'appareil"}
              </Button>
            </div>
          </div>
          
          {errors.images && <p className="text-red-500 text-sm">{errors.images}</p>}
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {product.images.map((image, index) => (
              <div key={index} className="relative group">
                <img 
                  src={image} 
                  alt={`Produit ${index+1}`} 
                  className="w-full h-32 object-cover rounded-md border"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            
            {product.images.length === 0 && (
              <div className="border border-dashed rounded-md flex items-center justify-center h-32 bg-gray-50">
                <div className="text-center text-gray-500">
                  <Plus size={24} className="mx-auto mb-1" />
                  <p className="text-xs">Pas encore d'images</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="bg-smartplug-blue hover:bg-smartplug-lightblue"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Ajout en cours..." : "Ajouter Produit"}
        </Button>
      </form>
    </div>
  );
};

export default AdminAddProduct;
