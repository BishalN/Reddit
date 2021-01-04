import { Box } from '@chakra-ui/react';
import React from 'react';

interface WrapperProps {
  varaint?: 'small' | 'regular';
}

export const Wrapper: React.FC<WrapperProps> = ({
  children,
  varaint = 'regular',
}) => {
  return (
    <Box mt={8} maxW={varaint === 'regular' ? '800px' : '400px'} w='100%'>
      {children}
    </Box>
  );
};
