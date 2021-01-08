import { Box, Button, Flex, Heading, Link } from '@chakra-ui/react';
import React from 'react';

import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useApolloClient } from '@apollo/client';
import { withApollo } from '../utils/withApollo';

interface NavBarProps {}

const NavBar: React.FC<NavBarProps> = ({}) => {
  const apolloClient = useApolloClient();
  const { data, loading } = useMeQuery({
    skip: isServer(),
  });
  const [logout, { loading: logoutFetching }] = useLogoutMutation();

  let body = null;

  //loading data
  if (loading) {
    //not logged in
  } else if (!data?.me) {
    body = (
      <>
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
          onClick={async () => {
            await logout();
            apolloClient.resetStore();
          }}
        >
          logout
        </Button>
      </Flex>
    );
  }
  return (
    <Flex zIndex={1} bg='tan' p={4} position='sticky' top={0}>
      <Flex direction='row' justifyContent='space-around'>
        <Box mr='auto'>{body}</Box>
      </Flex>
    </Flex>
  );
};

export default NavBar;
