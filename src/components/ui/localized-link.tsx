
import React from 'react';
import { Link as RouterLink, LinkProps, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/lib/languageContext';

type LocalizedLinkProps = LinkProps & {
  children: React.ReactNode;
};

export const LocalizedLink: React.FC<LocalizedLinkProps> = ({ to, children, ...props }) => {
  const { language } = useLanguage();
  
  // Convert 'to' to string if it's an object
  const toStr = typeof to === 'string' ? to : to.pathname || '/';
  
  // Handle admin routes differently - don't add language parameter
  if (toStr.startsWith('/admin')) {
    return <RouterLink to={to} {...props}>{children}</RouterLink>;
  }
  
  // For non-admin routes, add language parameter
  // Create a safe copy of the URL for manipulation without actually setting window.location
  let pathname = toStr;
  let search = '';
  let hash = '';
  
  // Handle hash and search parts if present
  if (toStr.includes('#')) {
    [pathname, hash] = toStr.split('#');
    hash = `#${hash}`;
  }
  
  if (pathname.includes('?')) {
    [pathname, search] = pathname.split('?');
    search = `?${search}`;
  }
  
  // Create new URLSearchParams without using window.location
  const searchParams = new URLSearchParams(search);
  searchParams.set('lang', language);
  
  const finalTo = {
    pathname,
    search: searchParams.toString() ? `?${searchParams.toString()}` : '',
    hash
  };
  
  return (
    <RouterLink to={finalTo} {...props}>
      {children}
    </RouterLink>
  );
};
