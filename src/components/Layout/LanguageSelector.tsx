
import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage, Language } from '@/lib/languageContext';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  
  const languages = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
    { code: 'ar', label: 'العربية' }
  ];
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1 text-gray-700 hover:text-smartplug-blue">
        <Globe size={20} />
        <span className="ml-1 hidden md:inline uppercase">{language}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code as Language)}
            className={`cursor-pointer ${language === lang.code ? 'bg-muted' : ''}`}
          >
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
