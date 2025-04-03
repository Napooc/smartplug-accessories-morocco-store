
import { Link } from 'react-router-dom';
import { 
  Headphones, 
  Smartphone, 
  Battery,
  Cable, 
  Speaker, 
  Plug
} from 'lucide-react';

const categories = [
  { 
    name: 'Earbuds', 
    icon: <Headphones className="h-8 w-8 text-gray-700" />,
    link: '/categories/earbuds'
  },
  { 
    name: 'Phone Cases', 
    icon: <Smartphone className="h-8 w-8 text-gray-700" />,
    link: '/categories/cases'
  },
  { 
    name: 'Chargers', 
    icon: <Battery className="h-8 w-8 text-gray-700" />,
    link: '/categories/chargers'
  },
  { 
    name: 'Cables', 
    icon: <Cable className="h-8 w-8 text-gray-700" />,
    link: '/categories/cables'
  },
  { 
    name: 'Speakers', 
    icon: <Speaker className="h-8 w-8 text-gray-700" />,
    link: '/categories/speakers'
  },
  { 
    name: 'Accessories', 
    icon: <Plug className="h-8 w-8 text-gray-700" />,
    link: '/categories/accessories'
  }
];

export default function CategoryGrid() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <Link 
              key={category.name}
              to={category.link}
              className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100"
            >
              <div className="mb-3">
                {category.icon}
              </div>
              <h3 className="text-center font-medium">{category.name}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
