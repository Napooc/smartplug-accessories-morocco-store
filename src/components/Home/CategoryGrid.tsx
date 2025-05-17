import { Link } from 'react-router-dom';
import { 
  Home, 
  Headphones,
  Wrench, 
  Droplet,
  Flower,
  PaintBucket,
  Bath,
  Thermometer,
  Tag
} from 'lucide-react';
import { categories } from '@/lib/data';
import { useLanguage } from '@/lib/languageContext';

const categoryIcons: Record<string, JSX.Element> = {
  'home-kitchen': <Home className="h-6 w-6 text-smartplug-blue" />,
  'electronics': <Headphones className="h-6 w-6 text-smartplug-blue" />,
  'tools-lighting': <Wrench className="h-6 w-6 text-smartplug-blue" />,
  'plumbing': <Droplet className="h-6 w-6 text-smartplug-blue" />,
  'garden-terrace': <Flower className="h-6 w-6 text-smartplug-blue" />,
  'paint-hardware': <PaintBucket className="h-6 w-6 text-smartplug-blue" />,
  'bathroom-toilet': <Bath className="h-6 w-6 text-smartplug-blue" />,
  'heating-ac': <Thermometer className="h-6 w-6 text-smartplug-blue" />,
  'discounts-deals': <Tag className="h-6 w-6 text-red-500" />
};

const categoryBackgrounds: Record<string, string> = {
  'home-kitchen': 'url("https://plus.unsplash.com/premium_photo-1680382578857-c331ead9ed51?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8a2l0Y2hlbnxlbnwwfHwwfHx8MA%3D%3D")',
  'electronics': 'url("https://t4.ftcdn.net/jpg/03/64/41/07/360_F_364410756_Ev3WoDfNyxO9c9n4tYIsU5YBQWAP3UF8.jpg")',
  'tools-lighting': 'url("https://plus.unsplash.com/premium_photo-1667925014057-49c73ab2b181?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
  'plumbing': 'url("https://plus.unsplash.com/premium_photo-1683141410787-c4dbd2220487?q=80&w=2671&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
  'garden-terrace': 'url("https://5.imimg.com/data5/SELLER/Default/2024/3/405401849/FO/VF/UZ/52179850/residential-terrace-garden-designing-500x500.jpg")',
  'paint-hardware': 'url("https://paintshardware.co.ke/wp-content/uploads/2020/09/Paints-_-hardware-supermarket-75-1024x683.jpg")',
  'bathroom-toilet': 'url("https://www.kinedo.com/media/img/1cgqgxwjnt9s1805zdh46sbc2h/toilettes-dans-la-salle-de-bain--512x384c.jpg")',
  'heating-ac': 'url("https://logicoolair.com.au/wp-content/uploads/2021/04/Air-Conditioning-Heating-Everything-You-Need-To-Know.png")',
  'discounts-deals': 'url("https://static.vecteezy.com/system/resources/previews/015/452/522/non_2x/discount-icon-in-trendy-flat-style-isolated-on-background-discount-icon-page-symbol-for-your-web-site-design-discount-icon-logo-app-ui-discount-icon-eps-vector.jpg")'
};

export default function CategoryGrid() {https://static.vecteezy.com/system/resources/previews/015/452/522/non_2x/discount-icon-in-trendy-flat-style-isolated-on-background-discount-icon-page-symbol-for-your-web-site-design-discount-icon-logo-app-ui-discount-icon-eps-vector.jpg
  const { t, direction } = useLanguage();
  
  const categoryTranslationKeys: Record<string, string> = {
    'home-kitchen': 'homeKitchen',
    'electronics': 'electronics',
    'tools-lighting': 'toolsLighting',
    'plumbing': 'plumbing',
    'garden-terrace': 'gardenTerrace',
    'paint-hardware': 'paintHardware',
    'bathroom-toilet': 'bathroomToilet',
    'heating-ac': 'heatingAc',
    'discounts-deals': 'discountsDeals'
  };

  const allCategories = [...categories, 
    {id: 'discounts-deals', name: 'Discounts & Deals'}
  ].filter((cat, index, self) => 
    index === self.findIndex((c) => c.id === cat.id)
  );
  
  return (
    <section className="py-12 bg-gray-50" dir={direction}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{t('shopByCategory')}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{t('shopByCategoryDesc')}</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {allCategories.map((category) => (
            <Link 
              key={category.id}
              to={`/categories/${category.id}`}
              className="group relative overflow-hidden rounded-lg"
            >
              <div 
                className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300"
                style={{
                  backgroundImage: categoryBackgrounds[category.id],
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <div className="relative z-10 flex flex-col items-center p-6 h-full">
                <div className={`mb-4 p-3 rounded-full bg-white/90 backdrop-blur-sm transition-transform group-hover:scale-110 ${category.id === 'discounts-deals' ? 'bg-red-50' : ''}`}>
                  {categoryIcons[category.id]}
                </div>
                <h3 className={`text-center font-medium text-white text-shadow-sm ${category.id === 'discounts-deals' ? 'text-red-100' : ''}`}>
                  {t(categoryTranslationKeys[category.id] || category.id, { default: category.name })}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
