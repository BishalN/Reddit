import { Box, Button, Flex, Heading, Link } from '@chakra-ui/react';
import React from 'react';

import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';
import NextLink from 'next/link';

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  });
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();

  let body = null;

  //loading data
  if (fetching) {
    //not logged in
  } else if (!data?.me) {
    body = (
      <>
        <Heading>LiReddit</Heading>
        <NextLink href='/login'>
          <Link mr={2}>Login</Link>
        </NextLink>
        <NextLink href='/register'>
          <Link>Register</Link>
        </NextLink>
      </>
    );
    //logged in
  } else {
    body = (
      <Flex>
        <Box mr={2}>{data.me.username}</Box>
        <Button
          variant='link'
          isLoading={logoutFetching}
          onClick={() => logout()}
        >
          logout
        </Button>
      </Flex>
    );
  }
  return (
    <Flex zIndex={1} bg='tan' p={4} position='sticky' top={0}>
      <Flex direction='row' justifyContent='space-around'>
        <NextLink href='/'>
          <Link>
            <Heading mr={8}>Lireddit</Heading>
          </Link>
        </NextLink>
        <Box mr='auto'>{body}</Box>
      </Flex>
    </Flex>
  );
};
