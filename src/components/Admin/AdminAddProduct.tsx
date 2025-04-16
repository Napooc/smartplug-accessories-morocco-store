import { useState, useRef } from 'react';
import { useStore } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Upload, X, Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { categories } from '@/lib/data';
import { toast } from 'sonner';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ColorVariant } from '@/lib/types';
import ColorVariantManager from './ColorVariantManager';

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
    sku: '',
    placement: 'regular' as 'best_selling' | 'deals' | 'regular',
    colorVariants: [] as ColorVariant[]
  });
  
  const [errors, setErrors] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    images: ''
  });
  
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

  const handlePlacementChange = (value: 'best_selling' | 'deals' | 'regular') => {
    console.log("Setting placement to:", value);
    setProduct(prev => ({
      ...prev,
      placement: value,
      onSale: value === 'deals' ? true : prev.onSale
    }));
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    processFiles(files);
  };

  const handleColorVariantImageUpload = (files: FileList, variantId: string) => {
    processFiles(files, variantId);
  };
  
  const processFiles = (files: FileList, variantId?: string) => {
    setIsUploading(true);
    
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          const base64Image = event.target.result as string;
          
          if (variantId) {
            setProduct(prev => ({
              ...prev,
              colorVariants: prev.colorVariants.map(variant => 
                variant.id === variantId 
                  ? { ...variant, images: [...variant.images, base64Image] } 
                  : variant
              )
            }));
          } else {
            setProduct(prev => ({
              ...prev,
              images: [...prev.images, base64Image]
            }));
            
            if (errors.images) {
              setErrors(prev => ({
                ...prev,
                images: ''
              }));
            }
          }
        }
        setIsUploading(false);
      };
      
      reader.onerror = () => {
        toast.error("Failed to read image file");
        setIsUploading(false);
      };
      
      reader.readAsDataURL(file);
    });
    
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
  
  const handleColorVariantsChange = (colorVariants: ColorVariant[]) => {
    setProduct(prev => ({
      ...prev,
      colorVariants
    }));
  };
  
  const validateForm = () => {
    const newErrors = {
      name: product.name ? '' : 'Name is required',
      description: product.description ? '' : 'Description is required',
      price: product.price > 0 ? '' : 'Price must be greater than 0',
      category: product.category ? '' : 'Category is required',
      images: product.images.length > 0 ? '' : 'Product must have at least one image'
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please correct the errors before submitting");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      console.log("Adding product with placement:", product.placement);
      
      const productToAdd = {
        ...product,
        onSale: product.placement === 'deals' ? true : product.onSale
      };
      
      await addProduct(productToAdd);
      
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
        sku: '',
        placement: 'regular',
        colorVariants: []
      });
      
      toast.success("Product added successfully");
      
      setTimeout(() => {
        onProductAdded();
      }, 300);
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error("Error adding product");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              name="name"
              value={product.name}
              onChange={handleChange}
              placeholder="Enter product name"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={product.category} onValueChange={handleCategoryChange}>
              <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select a category" />
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
              value={product.price || ''}
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
              value={product.oldPrice || ''}
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
              placeholder="Enter SKU (or leave empty to generate)"
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
            <Label htmlFor="featured">Featured Product</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="onSale"
              checked={product.onSale || product.placement === 'deals'}
              onCheckedChange={(checked) => handleCheckboxChange('onSale', checked as boolean)}
              disabled={product.placement === 'deals'}
            />
            <Label htmlFor="onSale">
              On Sale
              {product.placement === 'deals' && (
                <span className="text-xs text-gray-500 ml-1">(Auto-enabled for Discount items)</span>
              )}
            </Label>
          </div>
        </div>

        <div className="space-y-2 border-t pt-4">
          <Label>Product Placement</Label>
          <RadioGroup 
            value={product.placement} 
            onValueChange={(value) => handlePlacementChange(value as 'best_selling' | 'deals' | 'regular')}
            className="flex flex-col space-y-2 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="regular" id="placement-regular" />
              <Label htmlFor="placement-regular">Regular Product</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="best_selling" id="placement-best-selling" />
              <Label htmlFor="placement-best-selling">Add to "Best Selling Items" section</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="deals" id="placement-deals" />
              <Label htmlFor="placement-deals">Add to "Discounts & Deals" section {product.placement === 'deals' && "(Auto-enables 'On Sale')"}</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-4 border-t pt-4">
          <Label>Default Product Images</Label>
          <p className="text-sm text-gray-500">These images will be shown when no color variant is selected.</p>
          
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
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload from device
                </>
              )}
            </Button>
          </div>
          
          {errors.images && <p className="text-red-500 text-sm">{errors.images}</p>}
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {product.images.map((image, index) => (
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
            
            {product.images.length === 0 && (
              <div className="border border-dashed rounded-md flex items-center justify-center h-32 bg-gray-50">
                <div className="text-center text-gray-500">
                  <Plus size={24} className="mx-auto mb-1" />
                  <p className="text-xs">No images yet</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="border-t pt-4">
          <ColorVariantManager
            variants={product.colorVariants}
            onChange={handleColorVariantsChange}
            onImageUpload={handleColorVariantImageUpload}
            isUploading={isUploading}
          />
        </div>
        
        <Button 
          type="submit" 
          className="bg-smartplug-blue hover:bg-smartplug-lightblue"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Adding...
            </>
          ) : (
            "Add Product"
          )}
        </Button>
      </form>
    </div>
  );
};

export default AdminAddProduct;
