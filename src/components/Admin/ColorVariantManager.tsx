
import { useState } from 'react';
import { Plus, X, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ColorVariant } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

interface ColorVariantManagerProps {
  variants: ColorVariant[];
  onChange: (variants: ColorVariant[]) => void;
  onImageUpload: (files: FileList, variantId: string) => void;
  isUploading: boolean;
}

const ColorVariantManager = ({
  variants,
  onChange,
  onImageUpload,
  isUploading
}: ColorVariantManagerProps) => {
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null);

  const addNewVariant = () => {
    const newVariant: ColorVariant = {
      id: uuidv4(),
      name: '',
      hexValue: '#000000',
      images: [],
      priceAdjustment: 0,
      stock: 10
    };
    
    onChange([...variants, newVariant]);
  };

  const removeVariant = (id: string) => {
    onChange(variants.filter(v => v.id !== id));
  };

  const updateVariant = (id: string, field: keyof ColorVariant, value: any) => {
    onChange(
      variants.map(v => 
        v.id === id ? { ...v, [field]: value } : v
      )
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, variantId: string) => {
    if (e.target.files && e.target.files.length > 0) {
      onImageUpload(e.target.files, variantId);
    }
  };

  const removeImage = (variantId: string, imageIndex: number) => {
    onChange(
      variants.map(v => 
        v.id === variantId 
          ? { ...v, images: v.images.filter((_, i) => i !== imageIndex) } 
          : v
      )
    );
  };

  const moveVariant = (fromIndex: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && fromIndex === 0) || 
      (direction === 'down' && fromIndex === variants.length - 1)
    ) {
      return;
    }

    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    const newVariants = [...variants];
    const [movedItem] = newVariants.splice(fromIndex, 1);
    newVariants.splice(toIndex, 0, movedItem);
    
    onChange(newVariants);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Color Variants</h3>
        <Button 
          type="button" 
          onClick={addNewVariant} 
          variant="outline" 
          size="sm"
          className="flex items-center"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Color
        </Button>
      </div>

      {variants.length === 0 && (
        <div className="text-center p-6 border border-dashed rounded-md">
          <p className="text-gray-500">No color variants added yet. Add a color variant to give customers more options.</p>
        </div>
      )}

      {variants.map((variant, index) => (
        <div key={variant.id} className="border rounded-md p-4 relative">
          <div className="absolute right-4 top-4 flex space-x-2">
            <button 
              type="button" 
              onClick={() => removeVariant(variant.id)}
              className="text-red-500 hover:text-red-700"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex flex-wrap md:flex-nowrap gap-4 mb-4">
            <div className="w-full md:w-1/3">
              <Label htmlFor={`color-name-${variant.id}`}>Color Name</Label>
              <Input
                id={`color-name-${variant.id}`}
                value={variant.name}
                onChange={e => updateVariant(variant.id, 'name', e.target.value)}
                placeholder="e.g. Royal Blue"
              />
            </div>

            <div className="w-full md:w-1/3">
              <Label htmlFor={`color-hex-${variant.id}`}>Color Value</Label>
              <div className="flex">
                <Input
                  id={`color-hex-${variant.id}`}
                  value={variant.hexValue}
                  onChange={e => updateVariant(variant.id, 'hexValue', e.target.value)}
                  placeholder="#000000"
                />
                <div className="relative ml-2">
                  <button
                    type="button"
                    onClick={() => setShowColorPicker(showColorPicker === variant.id ? null : variant.id)}
                    className="w-10 h-10 rounded border"
                    style={{ backgroundColor: variant.hexValue }}
                  ></button>
                  {showColorPicker === variant.id && (
                    <div className="absolute right-0 z-10 mt-1 p-2 bg-white rounded-md shadow-lg">
                      <input
                        type="color"
                        value={variant.hexValue}
                        onChange={e => updateVariant(variant.id, 'hexValue', e.target.value)}
                        className="w-32 h-32"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full md:w-1/3">
              <div>
                <Label htmlFor={`price-adj-${variant.id}`}>Price Adjustment</Label>
                <Input
                  id={`price-adj-${variant.id}`}
                  type="number"
                  value={variant.priceAdjustment}
                  onChange={e => updateVariant(variant.id, 'priceAdjustment', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor={`stock-${variant.id}`}>Stock</Label>
                <Input
                  id={`stock-${variant.id}`}
                  type="number"
                  value={variant.stock}
                  onChange={e => updateVariant(variant.id, 'stock', parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Images for this color</Label>
              <input
                type="file"
                id={`variant-images-${variant.id}`}
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(e, variant.id)}
              />
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => document.getElementById(`variant-images-${variant.id}`)?.click()}
                disabled={isUploading}
              >
                Upload Images
              </Button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {variant.images.map((image, imageIndex) => (
                <div key={imageIndex} className="relative group border rounded-md">
                  <img
                    src={image}
                    alt={`${variant.name} color variant`}
                    className="h-20 w-full object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(variant.id, imageIndex)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}

              {variant.images.length === 0 && (
                <div className="border border-dashed rounded-md flex items-center justify-center h-20 bg-gray-50 text-gray-400 text-xs">
                  No images
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between mt-4">
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => moveVariant(index, 'up')}
                disabled={index === 0}
                className="h-8"
              >
                <span className="sr-only">Move Up</span>
                ↑
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => moveVariant(index, 'down')}
                disabled={index === variants.length - 1}
                className="h-8"
              >
                <span className="sr-only">Move Down</span>
                ↓
              </Button>
            </div>
            <div className="text-sm text-gray-500">
              Variant #{index + 1}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ColorVariantManager;
