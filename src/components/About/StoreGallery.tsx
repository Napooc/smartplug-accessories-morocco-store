
import React, { useState } from 'react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious 
} from "@/components/ui/carousel";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { 
  ImageIcon, 
  ZoomIn, 
  X, 
  Info 
} from 'lucide-react';
import { useLanguage } from '@/lib/languageContext';

interface StoreImage {
  id: number;
  src: string;
  alt: string;
  description: string;
}

const StoreGallery: React.FC = () => {
  const { t, direction } = useLanguage();
  const [expandedImage, setExpandedImage] = useState<StoreImage | null>(null);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  
  const storeImages: StoreImage[] = [
    {
      id: 1,
      src: '/lovable-uploads/e32db3eb-019d-4bd6-b496-6614048a4c45.png',
      alt: t('storeEntranceAlt'),
      description: t('storeEntranceDesc')
    },
    {
      id: 2,
      src: '/lovable-uploads/3ec05f99-6ac7-4813-bd8f-1c0a22525e3a.png',
      alt: t('storeBathroomAlt'),
      description: t('storeBathroomDesc')
    },
    {
      id: 3,
      src: '/lovable-uploads/beb080b5-8b30-45b5-9b0b-14c4226af0c4.png',
      alt: t('storeDisplayAlt'),
      description: t('storeDisplayDesc')
    },
    {
      id: 4,
      src: '/lovable-uploads/aec3b8f1-0379-4bfb-b18b-38fdaf63bfd4.png',
      alt: t('storeWarehouseAlt'),
      description: t('storeWarehouseDesc')
    }
  ];

  const handleExpandImage = (image: StoreImage) => {
    setExpandedImage(image);
    setShowInfo(false);
  };
  
  const handleCloseExpanded = () => {
    setExpandedImage(null);
    setShowInfo(false);
  };
  
  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };

  return (
    <div className="relative">
      {/* Main Carousel */}
      <div className="mb-8">
        <Carousel 
          className="w-full max-w-5xl mx-auto" 
          opts={{
            loop: true,
            align: "center",
          }}
        >
          <CarouselContent>
            {storeImages.map((image) => (
              <CarouselItem key={image.id} className="md:basis-1/2 lg:basis-1/3 h-64 sm:h-80 md:h-96">
                <div className="p-1 h-full">
                  <Card className="h-full overflow-hidden group border-2 border-transparent hover:border-smartplug-blue transition-all duration-300">
                    <CardContent className="relative h-full p-0">
                      <img 
                        src={image.src} 
                        alt={image.alt} 
                        className="object-cover w-full h-full transform transition-transform group-hover:scale-105 duration-700" 
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 flex items-center justify-center transition-all duration-300 group-hover:bg-opacity-50">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 hover:bg-white"
                          onClick={() => handleExpandImage(image)}
                        >
                          <ZoomIn className="h-5 w-5 text-smartplug-blue" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden sm:block">
            <CarouselPrevious className={`${direction === 'rtl' ? '-right-4' : '-left-4'} bg-white/90 hover:bg-white`} />
            <CarouselNext className={`${direction === 'rtl' ? '-left-4' : '-right-4'} bg-white/90 hover:bg-white`} />
          </div>
        </Carousel>
      </div>

      {/* Small Image Previews */}
      <div className="flex justify-center gap-2 mt-4 flex-wrap">
        {storeImages.map((image) => (
          <div 
            key={image.id}
            className={`w-20 h-20 rounded-md overflow-hidden cursor-pointer border-2 transition-all duration-300 ${
              expandedImage?.id === image.id ? 'border-smartplug-blue scale-110' : 'border-transparent hover:border-gray-300'
            }`}
            onClick={() => handleExpandImage(image)}
          >
            <img 
              src={image.src} 
              alt={image.alt} 
              className="w-full h-full object-cover" 
            />
          </div>
        ))}
      </div>

      {/* Full Screen View */}
      {expandedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4 md:p-8"
          onClick={handleCloseExpanded}
        >
          <div 
            className="relative max-w-6xl max-h-full rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={expandedImage.src} 
              alt={expandedImage.alt} 
              className="max-w-full max-h-[85vh] object-contain" 
            />
            
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                variant="outline"
                size="icon" 
                className="rounded-full bg-black/50 hover:bg-black/80 border-0"
                onClick={toggleInfo}
              >
                <Info className="h-5 w-5 text-white" />
              </Button>
              <Button
                variant="outline"
                size="icon" 
                className="rounded-full bg-black/50 hover:bg-black/80 border-0"
                onClick={handleCloseExpanded}
              >
                <X className="h-5 w-5 text-white" />
              </Button>
            </div>
            
            {showInfo && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4 transform transition-transform duration-300">
                <h3 className="text-lg font-bold">{expandedImage.alt}</h3>
                <p className="mt-1">{expandedImage.description}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreGallery;
