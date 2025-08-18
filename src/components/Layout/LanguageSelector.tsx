
import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage, Language } from '@/lib/languageContext';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { getLocalizedUrl } from '@/lib/languageUtils';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  
  const languages = [
    { code: 'ar', label: 'العربية', flag: '🇲🇦' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'en', label: 'English', flag: '🇬🇧' }
  ];
  
  const handleLanguageChange = (lang: Language) => {
    // This will update localStorage, URL params, and all links on the page
    setLanguage(lang);
    
    // If we're in a development environment, log the language change
    if (process.env.NODE_ENV === 'development') {
      console.log(`Language changed to: ${lang}`);
    }
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
