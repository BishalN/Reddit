import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Flex, IconButton, Box } from '@chakra-ui/react';
import React, { useState } from 'react';
import { PostSnippetFragment, useVoteMutation } from '../generated/graphql';

interface UpdootSectionProps {
  post: PostSnippetFragment;
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<
    'updoot-loading' | 'downdoot-loading' | 'not-loading'
  >('not-loading');
  const [vote] = useVoteMutation();
  return (
    <Flex direction='column' justifyContent='center' alignItems='center' mr={4}>
      <IconButton
        aria-label='up doot'
        icon={<ChevronUpIcon />}
        colorScheme={post.voteStatus === 1 ? 'green' : undefined}
        isLoading={loadingState === 'updoot-loading'}
        onClick={async () => {
          setLoadingState('updoot-loading');
          await vote({ variables: { postId: post.id, value: 1 } });
          setLoadingState('not-loading');
        }}
      />
      <Box>{post.points}</Box>
      <IconButton
        aria-label='down doot'
        isLoading={loadingState === 'downdoot-loading'}
        colorScheme={post.voteStatus === -1 ? 'red' : undefined}
        icon={<ChevronDownIcon />}
        onClick={async () => {
          setLoadingState('downdoot-loading');
          await vote({ variables: { postId: post.id, value: -1 } });
          setLoadingState('not-loading');
        }}
      />
    </Flex>
  );
};
