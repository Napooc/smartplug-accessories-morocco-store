
import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage, Language } from '@/lib/languageContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  
  const languages = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
    { code: 'ar', label: 'العربية' }
  ];
  
  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    
    // Update URL with language parameter without full page reload
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('lang', lang);
    navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
  };
  
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
            onClick={() => handleLanguageChange(lang.code as Language)}
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
