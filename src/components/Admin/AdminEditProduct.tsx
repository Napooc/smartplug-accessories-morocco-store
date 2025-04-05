
import { useState, useRef, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Upload, X } from 'lucide-react';
import { SheetClose } from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { categories } from '@/lib/data';
import { toast } from 'sonner';
import { Product } from '@/lib/types';

interface AdminEditProductProps {
  product: Product;
  onClose: () => void;
}

const AdminEditProduct = ({ product, onClose }: AdminEditProductProps) => {
  const { updateProduct } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [productData, setProductData] = useState<Product>({ ...product });
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  const [errors, setErrors] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    images: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'oldPrice' || name === 'stock' ? parseFloat(value) : value
    }));
    
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setProductData(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const handleCategoryChange = (value: string) => {
    setProductData(prev => ({
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
    
    setProductData(prev => ({
      ...prev,
      images: [...prev.images, imageUrl]
    }));
    
    setImageUrl('');
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    
    // In a real app, you would upload the file to a server here
    // For now we'll just use FileReader to get a data URL
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          setProductData(prev => ({
            ...prev,
            images: [...prev.images, event.target!.result as string]
          }));
        }
        setIsUploading(false);
      };
      
      reader.onerror = () => {
        toast.error("Failed to read the image file");
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
    if (productData.images.length <= 1 && index === 0) {
      setErrors(prev => ({
        ...prev,
        images: 'Product must have at least one image'
      }));
      return;
    }
    
    setProductData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors = {
      name: productData.name ? '' : 'Name is required',
      description: productData.description ? '' : 'Description is required',
      price: productData.price > 0 ? '' : 'Price must be greater than 0',
      category: productData.category ? '' : 'Category is required',
      images: productData.images.length > 0 ? '' : 'Product must have at least one image'
    };
    
    setErrors(newErrors);
    
    if (Object.values(newErrors).some(error => error)) {
      return;
    }
    
    updateProduct(product.id, productData);
    onClose();
    toast.success("Product updated successfully");
  };
  
  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              name="name"
              value={productData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={productData.category} onValueChange={handleCategoryChange}>
              <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select category" />
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
            value={productData.description}
            onChange={handleChange}
            placeholder="Enter product description"
            rows={4}
            className={errors.description ? 'border-red-500' : ''}
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="price">Price (DH)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={productData.price || ''}
              onChange={handleChange}
              placeholder="0.00"
              className={errors.price ? 'border-red-500' : ''}
            />
            {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="oldPrice">Old Price (DH)</Label>
            <Input
              id="oldPrice"
              name="oldPrice"
              type="number"
              min="0"
              step="0.01"
              value={productData.oldPrice || ''}
              onChange={handleChange}
              placeholder="0.00"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="stock">Stock Quantity</Label>
            <Input
              id="stock"
              name="stock"
              type="number"
              min="0"
              value={productData.stock || ''}
              onChange={handleChange}
              placeholder="0"
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={productData.featured || false}
              onCheckedChange={(checked) => handleCheckboxChange('featured', checked as boolean)}
            />
            <Label htmlFor="featured">Featured Product</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="onSale"
              checked={productData.onSale || false}
              onCheckedChange={(checked) => handleCheckboxChange('onSale', checked as boolean)}
            />
            <Label htmlFor="onSale">On Sale</Label>
          </div>
        </div>
        
        <div className="space-y-4">
          <Label>Product Images</Label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex">
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Enter image URL"
                className="rounded-r-none"
              />
              <Button 
                type="button" 
                onClick={addImage}
                className="rounded-l-none"
              >
                Add
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
                {isUploading ? "Uploading..." : "Upload from device"}
              </Button>
            </div>
          </div>
          
          {errors.images && <p className="text-red-500 text-sm">{errors.images}</p>}
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {productData.images.map((image, index) => (
              <div key={index} className="relative group">
                <img 
                  src={image} 
                  alt={`Product ${index+1}`} 
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
            
            {productData.images.length === 0 && (
              <div className="border border-dashed rounded-md flex items-center justify-center h-32 bg-gray-50">
                <div className="text-center text-gray-500">
                  <Plus size={24} className="mx-auto mb-1" />
                  <p className="text-xs">No images yet</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex space-x-3 justify-end pt-4">
          <SheetClose asChild>
            <Button type="button" variant="outline">Cancel</Button>
          </SheetClose>
          <Button 
            type="submit" 
            className="bg-smartplug-blue hover:bg-smartplug-lightblue"
          >
            Update Product
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminEditProduct;
