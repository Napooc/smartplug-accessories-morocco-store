
import { Link } from 'react-router-dom';
import { Zap, Check } from 'lucide-react';

export default function InnovationShowcase() {
  return (
    <section className="py-16 rounded-lg overflow-hidden bg-gradient-to-r from-smartplug-blue/90 to-smartplug-blue">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="lg:w-1/2 text-center lg:text-left">
            <div className="inline-flex items-center bg-white/20 text-white px-4 py-2 rounded-full mb-4">
              <Zap className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Innovation Hub</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Next-Gen Power Solutions</h2>
            
            <p className="text-white/90 text-lg mb-6 max-w-xl mx-auto lg:mx-0">
              Experience the future of charging with our innovative power solutions that charge your devices faster and smarter than ever before.
            </p>
            
            <ul className="space-y-3 mb-8 text-left max-w-md mx-auto lg:mx-0">
              {[
                'Ultra-fast GaN technology delivers 3x faster charging',
                'Smart power distribution for multiple devices',
                'Advanced safety features with temperature control',
                'Compact, travel-friendly designs'
              ].map((feature, index) => (
                <li key={index} className="flex items-start text-white/90">
                  <Check className="h-5 w-5 text-white mr-2 mt-0.5 bg-smartplug-lightblue/30 rounded-full p-1 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <Link 
              to="/categories/electronics"
              className="inline-block bg-white hover:bg-gray-100 text-smartplug-blue font-medium py-3 px-8 rounded-md transition-colors"
            >
              Explore Power Solutions
            </Link>
          </div>
          
          <div className="lg:w-1/2 flex justify-center">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1618842602192-2f9c0d57666f?w=500&auto=format&fit=crop&q=80"
                alt="Next-Gen Power Solutions" 
                className="max-w-full rounded-lg shadow-lg max-h-[400px] object-cover"
              />
              <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-lg shadow-lg">
                <p className="text-smartplug-blue font-bold text-lg">Up to 65W</p>
                <p className="text-gray-600 text-sm">Ultra-Fast Charging</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
