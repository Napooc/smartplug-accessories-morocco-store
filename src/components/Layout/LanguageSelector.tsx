
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
import { Button } from '@/components/ui/button';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  
  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'ar', label: 'العربية', flag: '🇲🇦' }
  ];
  
  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    
    // Update URL with language parameter without full page reload
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('lang', lang);
    navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
  };
  
  const currentLanguage = languages.find(lang => lang.code === language);
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-100"
        >
          <Globe size={18} className="mr-1" />
          <span className="hidden md:inline">{currentLanguage?.flag} {currentLanguage?.label}</span>
          <span className="md:hidden">{currentLanguage?.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[150px]">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code as Language)}
            className={`cursor-pointer flex items-center gap-2 ${language === lang.code ? 'bg-muted font-medium' : ''}`}
          >
            <span>{lang.flag}</span> {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
