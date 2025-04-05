
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { SheetClose } from '@/components/ui/sheet';
import { toast } from 'sonner';

interface AdminEditProductProps {
  product: Product;
  onClose: () => void;
}

const AdminEditProduct = ({ product, onClose }: AdminEditProductProps) => {
  const { updateProduct } = useStore();
  
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description,
    price: product.price,
    oldPrice: product.oldPrice || 0,
    category: product.category,
    sku: product.sku,
    stock: product.stock,
    featured: product.featured || false,
    onSale: product.onSale || false,
    rating: product.rating,
    imageUrl: product.images.length > 0 ? product.images[0] : '',
    additionalImages: product.images.slice(1).join(', ')
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value === '' ? 0 : Number(value);
    
    setFormData(prev => ({
      ...prev,
      [name]: numValue
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.category) {
      toast.error('Please fill out all required fields');
      return;
    }
    
    // Gather all images
    const images = [formData.imageUrl];
    
    if (formData.additionalImages) {
      const additionalImagesArray = formData.additionalImages
        .split(',')
        .map(url => url.trim())
        .filter(url => url);
      
      images.push(...additionalImagesArray);
    }
    
    setIsSubmitting(true);
    
    try {
      await updateProduct(product.id, {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        oldPrice: formData.onSale ? formData.oldPrice : undefined,
        category: formData.category,
        sku: formData.sku,
        stock: formData.stock,
        featured: formData.featured,
        onSale: formData.onSale,
        images,
        rating: formData.rating
      });
      
      toast.success(`${formData.name} updated successfully`);
      onClose();
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Product Name *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="category">Category *</Label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          >
            <option value="">Select Category</option>
            <option value="headphones">Headphones</option>
            <option value="chargers">Chargers</option>
            <option value="cables">Cables</option>
            <option value="accessories">Accessories</option>
          </select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="price">Price (DH) *</Label>
          <Input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handleNumberChange}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="oldPrice">Old Price (DH)</Label>
          <Input
            id="oldPrice"
            name="oldPrice"
            type="number"
            min="0"
            step="0.01"
            value={formData.oldPrice}
            onChange={handleNumberChange}
            disabled={!formData.onSale}
          />
        </div>
        
        <div>
          <Label htmlFor="stock">Stock *</Label>
          <Input
            id="stock"
            name="stock"
            type="number"
            min="0"
            value={formData.stock}
            onChange={handleNumberChange}
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="sku">SKU *</Label>
          <Input
            id="sku"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="rating">Rating (1-5)</Label>
          <Input
            id="rating"
            name="rating"
            type="number"
            min="1"
            max="5"
            step="0.1"
            value={formData.rating}
            onChange={handleNumberChange}
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="imageUrl">Main Image URL *</Label>
        <Input
          id="imageUrl"
          name="imageUrl"
          placeholder="https://example.com/image.jpg"
          value={formData.imageUrl}
          onChange={handleChange}
          required
        />
        {formData.imageUrl && (
          <img
            src={formData.imageUrl}
            alt="Product preview"
            className="mt-2 h-24 object-contain rounded border p-1"
          />
        )}
      </div>
      
      <div>
        <Label htmlFor="additionalImages">Additional Images (comma separated URLs)</Label>
        <Input
          id="additionalImages"
          name="additionalImages"
          placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
          value={formData.additionalImages}
          onChange={handleChange}
        />
      </div>
      
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <Switch
            id="featured"
            checked={formData.featured}
            onCheckedChange={(checked) => handleSwitchChange('featured', checked)}
          />
          <Label htmlFor="featured">Featured Product</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="onSale"
            checked={formData.onSale}
            onCheckedChange={(checked) => handleSwitchChange('onSale', checked)}
          />
          <Label htmlFor="onSale">On Sale</Label>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <SheetClose asChild>
          <Button variant="outline" type="button">Cancel</Button>
        </SheetClose>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Updating...' : 'Update Product'}
        </Button>
      </div>
    </form>
  );
};

export default AdminEditProduct;
