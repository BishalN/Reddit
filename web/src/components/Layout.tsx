import React from 'react';
import { NavBar } from './NavBar';
import { Wrapper } from './Wrapper';

interface LayoutProps {
  varaint: 'small' | 'regular';
}

export const Layout: React.FC<LayoutProps> = ({ children, varaint }) => {
  return (
    <>
      <NavBar />

      <Wrapper varaint={varaint}>{children}</Wrapper>
    </>
  );
};
