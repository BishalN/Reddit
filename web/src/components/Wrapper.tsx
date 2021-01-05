import React from 'react';
import { Box } from '@chakra-ui/react';

interface WrapperProps {
  varaint?: 'small' | 'regular';
}

export const Wrapper: React.FC<WrapperProps> = ({
  children,
  varaint = 'regular',
}) => {
  return (
    <Box
      maxW={varaint === 'regular' ? '800px' : '400px'}
      mx='auto'
      mt={8}
      w='100%'
    >
      {children}
    </Box>
  );
};
