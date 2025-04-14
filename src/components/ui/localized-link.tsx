
import React from 'react';
import { Link as RouterLink, LinkProps } from 'react-router-dom';
import { useLanguage } from '@/lib/languageContext';

type LocalizedLinkProps = LinkProps & {
  children: React.ReactNode;
};

export const LocalizedLink: React.FC<LocalizedLinkProps> = ({ to, children, ...props }) => {
  const { language } = useLanguage();
  
  // Convert 'to' to string if it's an object
  const toStr = typeof to === 'string' ? to : to.pathname || '/';
  
  // Create URL object to manipulate the query params
  const url = new URL(toStr, window.location.origin);
  
  // Add language parameter
  url.searchParams.set('lang', language);
  
  // Create the final path for the Link
  const finalTo = {
    pathname: url.pathname,
    search: url.search,
    hash: url.hash
  };
  
  return (
    <RouterLink to={finalTo} {...props}>
      {children}
    </RouterLink>
  );
};
