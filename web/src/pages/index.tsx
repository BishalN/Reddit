import { withUrqlClient } from 'next-urql';
import React, { useState } from 'react';
import { createUrqlClient } from '../utils/createUrqlClient';
import { usePostsQuery } from '../generated/graphql';
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
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { UpdootSection } from '../components/UpdootSection';

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 20,
    cursor: null as null | string,
  });

  const [{ data, fetching }] = usePostsQuery({ variables });

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
          {data?.posts.posts.map((p) => (
            <Flex key={p.id} p={5} shadow='md' borderWidth='1px'>
              <UpdootSection post={p} />
              <Box>
                <Heading fontSize='xl'>{p.title}</Heading>
                <Text> posted by {p.creator.username}</Text>
                <Text mt={4}>{p.textSnippet}</Text>
              </Box>
            </Flex>
          ))}
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
