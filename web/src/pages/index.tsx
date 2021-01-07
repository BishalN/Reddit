import React, { useState } from 'react';
import { useDeletePostMutation, usePostsQuery } from '../generated/graphql';
import { Layout } from '../components/Layout';
import {
  Button,
  Stack,
  Text,
  Box,
  Heading,
  Flex,
  Link,
  IconButton,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { UpdootSection } from '../components/UpdootSection';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { DeleteIcon } from '@chakra-ui/icons';

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 20,
    cursor: null as null | string,
  });

  const [{ data, fetching }] = usePostsQuery({ variables });
  const [, deletePost] = useDeletePostMutation();

  if (!fetching && !data) {
    return <div>you got no data</div>;
  }

  return (
    <Layout varaint='regular'>
      <Flex alignItems='center'>
        <Heading>LiReddit</Heading>
        <NextLink href='/create-post'>
          <Link ml='auto'>create post</Link>
        </NextLink>
      </Flex>

      <br />
      {!data && fetching ? (
        <div>loading...</div>
      ) : (
        <Stack spacing={8}>
          {data?.posts.posts.map((p) =>
            !p ? null : (
              <Flex
                key={p.id}
                p={5}
                shadow='md'
                borderWidth='1px'
                alignItems='center'
              >
                <UpdootSection post={p} />
                <Box flex={1}>
                  <NextLink href='/posts/[id]' as={`/posts/${p.id}`}>
                    <Link>
                      <Heading fontSize='xl'>{p.title}</Heading>
                    </Link>
                  </NextLink>

                  <Text> posted by {p.creator.username}</Text>
                  <Text mt={4}>{p.textSnippet}</Text>
                </Box>
                <IconButton
                  aria-label='Search database'
                  icon={<DeleteIcon />}
                  colorScheme='red'
                  onClick={() => {
                    deletePost({ id: p.id });
                  }}
                />
              </Flex>
            )
          )}
        </Stack>
      )}

      {data && data?.posts.hasMore ? (
        <Flex>
          <Button
            m='auto'
            my={8}
            isLoading={fetching}
            onClick={() => {
              setVariables({
                limit: variables.limit,
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
              });
            }}
          >
            Load more
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
