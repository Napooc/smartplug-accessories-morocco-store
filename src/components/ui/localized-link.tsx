
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
  
  // Handle admin routes differently - don't add language parameter
  if (toStr.startsWith('/admin')) {
    return <RouterLink to={to} {...props}>{children}</RouterLink>;
  }
  
  // For non-admin routes, add language parameter
  const url = new URL(toStr, window.location.origin);
  url.searchParams.set('lang', language);
  
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
