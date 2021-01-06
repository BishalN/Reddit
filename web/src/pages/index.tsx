import { withUrqlClient } from 'next-urql';
import React from 'react';
import { createUrqlClient } from '../utils/createUrqlClient';
import { usePostsQuery } from '../generated/graphql';
import { Layout } from '../components/Layout';
import { Button, Link } from '@chakra-ui/react';
import NextLink from 'next/link';

const Index = () => {
  const [{ data }] = usePostsQuery();

  return (
    <Layout varaint='regular'>
      <NextLink href='/create-post'>
        <Button>create post</Button>
      </NextLink>

      <br />
      {!data ? (
        <div>loading...</div>
      ) : (
        data.posts.map((post) => <div>{post.title}</div>)
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
