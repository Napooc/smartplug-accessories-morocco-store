
import React, { useState } from 'react';
import { useLanguage } from '@/lib/languageContext';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Maximize, X } from "lucide-react";

type GalleryImage = {
  src: string;
  alt: string;
  description: string;
};

const StoreGallery: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("storefront");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const storeImages: Record<string, GalleryImage[]> = {
    storefront: [
      {
        src: "/lovable-uploads/bab8df4b-bc99-4788-b6d6-9d1fc02f7989.png",
        alt: t('gallery.storefront'),
        description: t('gallery.storefrontDesc')
      }
    ],
    bathroom: [
      {
        src: "/lovable-uploads/e93b813d-dd74-40cc-a282-dc0a2ee841e8.png",
        alt: t('gallery.bathroom'),
        description: t('gallery.bathroomDesc')
      },
      {
        src: "/lovable-uploads/cef5ff18-965d-4340-b406-174f5540da6e.png",
        alt: t('gallery.bathroomDisplay'),
        description: t('gallery.bathroomDisplayDesc')
      }
    ],
    warehouse: [
      {
        src: "/lovable-uploads/6bfd59e2-26e4-406d-9e31-d41eb1f05a9e.png",
        alt: t('gallery.warehouse'),
        description: t('gallery.warehouseDesc')
      }
    ]
  };

  const allImages = [
    ...storeImages.storefront,
    ...storeImages.bathroom,
    ...storeImages.warehouse
  ];

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setActiveIndex(0);
  };

  const handleThumbnailClick = (index: number) => {
    const categoryImages = storeImages[activeTab];
    // Find the global index of the clicked image
    let globalIndex = 0;
    if (activeTab === 'bathroom') {
      globalIndex = storeImages.storefront.length + index;
    } else if (activeTab === 'warehouse') {
      globalIndex = storeImages.storefront.length + storeImages.bathroom.length + index;
    } else {
      globalIndex = index;
    }
    setActiveIndex(globalIndex);
  };

  return (
    <div className="space-y-6 mb-10">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Main image display */}
        <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
          <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 bg-black">
            <div className="relative h-full">
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2 z-50 bg-black/50 text-white hover:bg-black/70"
                onClick={() => setIsFullscreen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
              <div className="p-6 h-full flex flex-col items-center justify-center">
                <img 
                  src={allImages[activeIndex].src} 
                  alt={allImages[activeIndex].alt} 
                  className="max-h-[80vh] max-w-full object-contain"
                />
                <p className="text-white text-center mt-4">{allImages[activeIndex].description}</p>
              </div>
            </div>
          </DialogContent>
          
          <div className="relative">
            <img 
              src={allImages[activeIndex].src} 
              alt={allImages[activeIndex].alt} 
              className="w-full h-96 object-cover cursor-pointer hover:opacity-95 transition-opacity"
            />
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                className="absolute bottom-4 right-4 bg-white/80 hover:bg-white"
              >
                <Maximize className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <p className="text-white font-medium">{allImages[activeIndex].description}</p>
            </div>
          </div>
        </Dialog>
        
        {/* Category tabs and thumbnails */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="p-4">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="storefront">{t('gallery.storefrontTab')}</TabsTrigger>
            <TabsTrigger value="bathroom">{t('gallery.bathroomTab')}</TabsTrigger>
            <TabsTrigger value="warehouse">{t('gallery.warehouseTab')}</TabsTrigger>
          </TabsList>
          
          {Object.entries(storeImages).map(([category, images]) => (
            <TabsContent key={category} value={category} className="mt-4">
              <div className="grid grid-cols-3 gap-2">
                {images.map((image, idx) => (
                  <img
                    key={idx}
                    src={image.src}
                    alt={image.alt}
                    className={`w-full h-24 object-cover cursor-pointer rounded-md transition-all 
                      ${
                        (category === 'storefront' && activeIndex === idx) ||
                        (category === 'bathroom' && activeIndex === storeImages.storefront.length + idx) ||
                        (category === 'warehouse' && activeIndex === storeImages.storefront.length + storeImages.bathroom.length + idx)
                          ? 'ring-2 ring-blue-500 opacity-100 scale-105'
                          : 'opacity-80 hover:opacity-100'
                      }`}
                    onClick={() => handleThumbnailClick(idx)}
                  />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
      
      {/* Image carousel for mobile */}
      <div className="lg:hidden mt-6">
        <Carousel className="w-full">
          <CarouselContent>
            {allImages.map((image, index) => (
              <CarouselItem key={index}>
                <Card>
                  <CardContent className="p-1">
                    <img 
                      src={image.src} 
                      alt={image.alt} 
                      className="w-full h-48 object-cover rounded-md"
                    />
                    <p className="text-sm mt-2 text-center">{image.description}</p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-1" />
          <CarouselNext className="right-1" />
        </Carousel>
      </div>
    </div>
  );
};

export default StoreGallery;
