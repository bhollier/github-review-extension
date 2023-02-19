import React from 'react';
import { Center, Flex, FlexProps, Spinner, Text } from '@chakra-ui/react';

import PRCard from './PRCard';

import { PullRequest } from '../../common/types';

interface PRListProps extends FlexProps {
  isLoading: boolean;
  prs: PullRequest[];
}

const PRList = ({ isLoading, prs, ...props }: PRListProps) => (
  <Flex p={5} gap={4} direction="column" {...props}>
    {/* eslint-disable-next-line no-nested-ternary */}
    {isLoading ? (
      <Center>
        <Spinner />
      </Center>
    ) : prs.length === 0 ? (
      <Center>
        <Text fontSize={16}>Nothing left to review 🎉</Text>
      </Center>
    ) : (
      prs
        .sort((a, b) => a.created_at.localeCompare(b.created_at))
        .map(pr => <PRCard pr={pr} />)
    )}
  </Flex>
);

export default PRList;
