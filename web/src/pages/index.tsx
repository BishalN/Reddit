import React, { useState } from 'react';
import {
  PostsQuery,
  useDeletePostMutation,
  useMeQuery,
  usePostsQuery,
} from '../generated/graphql';
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
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { withApollo } from '../utils/withApollo';

const Index = () => {
  const { data: dataMe } = useMeQuery();

  const { data, loading, fetchMore, variables } = usePostsQuery({
    variables: {
      limit: 20,
      cursor: null,
    },
    notifyOnNetworkStatusChange: true,
  });
  const [deletePost] = useDeletePostMutation();

  if (!loading && !data) {
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
      {!data && loading ? (
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
                {dataMe?.me?.id !== p.creator.id ? null : (
                  <Box ml='auto'>
                    <NextLink
                      href='/posts/edit/[id]'
                      as={`/posts/edit/${p.id}`}
                    >
                      <IconButton
                        aria-label='edit post'
                        mr={4}
                        icon={<EditIcon />}
                      />
                    </NextLink>

                    <IconButton
                      aria-label='delete post'
                      icon={<DeleteIcon />}
                      onClick={() => {
                        deletePost({
                          variables: { id: p.id },
                          update: (cache) => {
                            cache.evict({ id: 'Post:' + p.id });
                          },
                        });
                      }}
                    />
                  </Box>
                )}
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
            isLoading={loading}
            onClick={() => {
              fetchMore({
                variables: {
                  limit: variables?.limit,
                  cursor:
                    data.posts.posts[data.posts.posts.length - 1].createdAt,
                },
                updateQuery: (
                  previousResult,
                  { fetchMoreResult }
                ): PostsQuery => {
                  if (!fetchMoreResult) {
                    return previousResult as PostsQuery;
                  }
                  return {
                    __typename: 'Query',
                    posts: {
                      __typename: 'PaginatedPosts',
                      hasMore: fetchMoreResult.posts.hasMore,
                      posts: [
                        ...previousResult.posts.posts,
                        ...fetchMoreResult.posts.posts,
                      ],
                    },
                  };
                },
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

export default withApollo({ ssr: true })(Index);
