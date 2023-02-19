import React from 'react';
import {
  Avatar,
  Card,
  CardFooter,
  CardHeader,
  Flex,
  LinkBox,
  LinkOverlay,
  Text,
  VStack,
} from '@chakra-ui/react';

import { formatDistance } from 'date-fns';

import { commaSeparatedList } from '../../common/string';
import { PullRequest } from '../../common/types';

interface PRCardProps {
  pr: PullRequest;
}

const PRCard = ({ pr }: PRCardProps) => (
  <LinkBox>
    <Card>
      <Flex px={4} alignItems="center">
        <Avatar name={pr.user.login} size="sm" src={pr.user.avatar_url} />
        <LinkOverlay href={pr.html_url} isExternal>
          <CardHeader fontWeight="bold">{pr.title}</CardHeader>
        </LinkOverlay>
      </Flex>
      <CardFooter pt={1} pb={4}>
        <VStack alignItems="start">
          <Text>
            #{pr.number} opened{' '}
            {formatDistance(new Date(pr.created_at), new Date(), {
              addSuffix: true,
            })}{' '}
            by {pr.user.login}
          </Text>
          {pr.assignees && pr.assignees.length > 0 && (
            <Text>
              Assigned to{' '}
              {commaSeparatedList(pr.assignees.map(assignee => assignee.login))}
            </Text>
          )}
        </VStack>
      </CardFooter>
    </Card>
  </LinkBox>
);

export default PRCard;
