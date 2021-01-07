import { Box, Button, Heading } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import { Layout } from '../../components/Layout';
import { useMeQuery, usePostQuery } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import NextLink from 'next/link';

const Post: React.FC<{}> = ({}) => {
  const router = useRouter();
  const intId =
    typeof router.query.id === 'string' ? parseInt(router.query.id) : -1;

  const [{ data: dataMe }] = useMeQuery();

  const [{ data, fetching, error }] = usePostQuery({
    pause: intId === -1,
    variables: { id: intId },
  });

  if (fetching) {
    return (
      <Layout varaint='regular'>
        <div>Loading...</div>
      </Layout>
    );
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  if (!data?.post) {
    return (
      <Layout varaint='regular'>
        <Box>Could not find the post</Box>
      </Layout>
    );
  }

  return (
    <Layout varaint='regular'>
      <Heading mb={4}>{data.post.title}</Heading>
      {data.post?.text}
      {dataMe?.me?.id !== data.post.creator.id ? null : (
        <NextLink href='/posts/edit/[id]' as={`/posts/edit/${data.post.id}`}>
          <Button ml={4}>edit post</Button>
        </NextLink>
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
