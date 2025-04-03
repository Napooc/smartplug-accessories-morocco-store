
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { categories } from '@/lib/data';

const AdminAddProduct = () => {
  const { addProduct } = useStore();
  
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: 0,
    oldPrice: 0,
    category: '',
    featured: false,
    onSale: false,
    stock: 0,
    images: ['https://via.placeholder.com/300']
  });
  
  const [errors, setErrors] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    images: ''
  });
  
  const [imageUrl, setImageUrl] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'oldPrice' || name === 'stock' ? parseFloat(value) : value
    }));
    
    // Clear error
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
    
    // Clear error
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
  };
  
  const removeImage = (index: number) => {
    if (product.images.length <= 1) {
      setErrors(prev => ({
        ...prev,
        images: 'Product must have at least one image'
      }));
      return;
    }
    
    setProduct(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {
      name: product.name ? '' : 'Name is required',
      description: product.description ? '' : 'Description is required',
      price: product.price > 0 ? '' : 'Price must be greater than 0',
      category: product.category ? '' : 'Category is required',
      images: product.images.length > 0 ? '' : 'Product must have at least one image'
    };
    
    setErrors(newErrors);
    
    // If there are errors, don't submit
    if (Object.values(newErrors).some(error => error)) {
      return;
    }
    
    // Add the product
    addProduct(product);
    
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
      images: ['https://via.placeholder.com/300']
    });
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-bold mb-6">Add New Product</h2>
      
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
              checked={product.onSale}
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
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="bg-smartplug-blue hover:bg-smartplug-lightblue"
        >
          Add Product
        </Button>
      </form>
    </div>
  );
};

export default AdminAddProduct;
