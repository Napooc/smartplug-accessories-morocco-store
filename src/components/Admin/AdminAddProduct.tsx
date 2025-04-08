import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useStore } from '@/lib/store';
import { categories } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const AdminAddProduct = () => {
  const { addProduct } = useStore();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [oldPrice, setOldPrice] = useState<number>(0);
  const [category, setCategory] = useState(categories[0].id);
  const [featured, setFeatured] = useState(false);
  const [onSale, setOnSale] = useState(false);
  const [stock, setStock] = useState<number>(0);
  const [sku, setSku] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsSubmitting(true);
    try {
      const imageUrls = await Promise.all(
        acceptedFiles.map(async (file) => {
          return await handleImageUpload(file);
        })
      );
      setImages(imageUrls);
      toast.success('Images uploaded successfully');
    } catch (error: any) {
      console.error('Error uploading images:', error);
      toast.error(error.message || 'Failed to upload images');
    } finally {
      setIsSubmitting(false);
    }
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
    multiple: true,
  });
  
  const handleImageUpload = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `products/${fileName}`;
    
    const { error } = await supabase.storage
      .from('images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('Error uploading image:', error);
      throw new Error(`Failed to upload image: ${error.message}`);
    }
    
    const { data } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (!name || !description || !price || !category || images.length === 0) {
        toast.error('Please fill in all required fields.');
        return;
      }
      
      const productData = {
        name,
        description,
        price: Number(price),
        oldPrice: Number(oldPrice),
        images,
        category,
        featured,
        onSale,
        stock: Number(stock),
        sku: sku || `SKU-${Date.now()}`
      };
      
      await addProduct(productData);
      
      setName('');
      setDescription('');
      setPrice(0);
      setOldPrice(0);
      setCategory(categories[0].id);
      setFeatured(false);
      setOnSale(false);
      setStock(0);
      setSku('');
      setImages([]);
      
      toast.success('Product added successfully!');
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Price</Label>
          <Input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="oldPrice">Old Price (optional)</Label>
          <Input
            type="number"
            id="oldPrice"
            value={oldPrice}
            onChange={(e) => setOldPrice(Number(e.target.value))}
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="stock">Stock</Label>
          <Input
            type="number"
            id="stock"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
          />
        </div>
        
        <div>
          <Label htmlFor="sku">SKU</Label>
          <Input
            type="text"
            id="sku"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="flex items-center">
          <Checkbox
            id="featured"
            checked={featured}
            onCheckedChange={(checked) => setFeatured(!!checked)}
          />
          <Label htmlFor="featured" className="ml-2">Featured</Label>
        </div>
        
        <div className="flex items-center">
          <Checkbox
            id="onSale"
            checked={onSale}
            onCheckedChange={(checked) => setOnSale(!!checked)}
          />
          <Label htmlFor="onSale" className="ml-2">On Sale</Label>
        </div>
      </div>
      
      <div>
        <Label>Images</Label>
        <div
          {...getRootProps()}
          className={`dropzone w-full p-4 border-2 border-dashed rounded-md cursor-pointer ${
            isDragActive ? 'border-smartplug-blue' : 'border-gray-300'
          }`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-smartplug-blue">Drop the images here ...</p>
          ) : (
            <p className="text-gray-500">
              Drag 'n' drop some images here, or click to select files
            </p>
          )}
        </div>
        
        {images.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <img src={image} alt={`Uploaded image ${index + 1}`} className="w-full rounded-md" />
                <button
                  type="button"
                  onClick={() => setImages(images.filter((_, i) => i !== index))}
                  className="absolute top-2 right-2 bg-gray-800 bg-opacity-60 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-opacity-80"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <Button type="submit" disabled={isSubmitting} className="bg-smartplug-blue hover:bg-smartplug-lightblue">
        {isSubmitting ? 'Adding...' : 'Add Product'}
      </Button>
    </form>
  );
};

export default AdminAddProduct;
