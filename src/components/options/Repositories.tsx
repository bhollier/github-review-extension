import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  BoxProps,
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Input,
  Spinner,
  Table,
  TableContainer,
  TableContainerProps,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react';

import InvalidToken from '../InvalidToken';

import * as api from '../../api/api';

import { Repository } from '../../common/types';
import { getAuth } from '../../api/auth';

interface RepoTableProps extends TableContainerProps {
  repos: Repository[];
  selected: boolean;
  handleToggleSelect: (repoId: number) => void;
}

const RepoTable = ({
  repos,
  selected,
  handleToggleSelect,
  ...props
}: RepoTableProps) => (
  <TableContainer {...props}>
    <Table variant="unstyled" size="sm">
      <Thead>
        <Tr>
          <Th width="48px" />
        </Tr>
      </Thead>
      <Tbody>
        {repos.map(repo => (
          <FormControl>
            <Tr>
              <Td>
                <Checkbox
                  isChecked={selected}
                  onChange={() => handleToggleSelect(repo.id)}
                />
              </Td>
              <Td>
                <FormLabel>{`${repo.owner}/${repo.name}`}</FormLabel>
              </Td>
            </Tr>
          </FormControl>
        ))}
      </Tbody>
    </Table>
  </TableContainer>
);

const isSelected = (selectedRepos: number[], repoId: number) =>
  selectedRepos.filter(selectedId => selectedId === repoId).length > 0;

const saveSelectedRepos = async (
  repos: Repository[],
  selectedRepos: number[]
) => {
  await chrome.storage.sync.set({
    repos: repos.filter(repo => isSelected(selectedRepos, repo.id)),
  });
};

interface RepositoriesProps extends BoxProps {}

const Repositories = ({ ...props }: RepositoriesProps) => {
  const toast = useToast();

  const [repos, setRepos] = useState([] as Repository[]);
  const [selectedRepos, setSelectedRepos] = useState([] as number[]);
  const [addRepoText, setAddRepoText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [noToken, setNoToken] = useState<boolean>();

  const getRepos = useCallback(async () => {
    setIsLoading(true);

    const auth = await getAuth();
    if (!auth || !auth.valid) {
      setIsLoading(false);
      setNoToken(true);
      return;
    }
    setNoToken(false);

    try {
      const userRepos = await api.getUserRepos({ apiToken: auth.apiToken });
      setRepos(userRepos);
    } catch (error) {
      console.log(error);
      toast({ title: 'Error retrieving repositories', status: 'error' });
      setIsLoading(false);
    }
    const selected = (
      await chrome.storage.sync.get({
        repos: [],
      })
    ).repos as Repository[];
    setSelectedRepos(selected.map(selectedRepo => selectedRepo.id));
    setIsLoading(false);
  }, [toast]);

  useEffect(() => {
    getRepos();
  }, [getRepos]);

  // Update repos when the user's auth settings have changed
  chrome.storage.onChanged.addListener(changes => {
    if (changes.auth) {
      getRepos();
    }
  });

  const handleCheck = (repoId: number) => {
    const newSelectedRepos = [
      ...selectedRepos.filter(selectedId => selectedId !== repoId),
      repoId,
    ];
    setSelectedRepos(newSelectedRepos);
    saveSelectedRepos(repos, newSelectedRepos);
  };

  const handleUncheck = (repoId: number) => {
    const newSelectedRepos = selectedRepos.filter(
      selectedId => selectedId !== repoId
    );
    setSelectedRepos(newSelectedRepos);
    saveSelectedRepos(repos, newSelectedRepos);
  };

  const handleAdd = async (
    e: React.FormEvent<HTMLFormElement> | React.FormEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    const [owner, name] = addRepoText.split('/');
    if (!owner || !name) {
      toast({ title: 'Invalid repo name', status: 'error' });
      return;
    }

    // Make sure it exists
    let repo: Repository;
    try {
      repo = await api.getRepo({ owner, name });
    } catch (error) {
      toast({ title: "Couldn't find repo", status: 'error' });
      return;
    }

    // Add the repo
    const newRepos = [
      ...repos.filter(otherRepo => otherRepo.id !== repo.id),
      repo,
    ];
    const newSelectedRepos = [
      ...selectedRepos.filter(repoId => repoId !== repo.id),
      repo.id,
    ];
    setRepos(newRepos);
    setSelectedRepos(newSelectedRepos);
    saveSelectedRepos(newRepos, newSelectedRepos);
    setAddRepoText('');
  };

  return (
    <Box {...props}>
      <Heading size="md" mb={3}>
        Repositories
      </Heading>
      {/* eslint-disable-next-line no-nested-ternary */}
      {noToken ? (
        <InvalidToken fontSize={16} alreadyOnOptionsPage />
      ) : isLoading ? (
        <Box py={4} px={8}>
          <Spinner />
        </Box>
      ) : (
        <>
          <Heading size="sm" mb={1}>
            Subscribed
          </Heading>
          <RepoTable
            mb={2}
            repos={repos.filter(repo => isSelected(selectedRepos, repo.id))}
            selected={true}
            handleToggleSelect={handleUncheck}
          />
          <Heading size="sm" mb={1}>
            Available
          </Heading>
          <Box overflowY="auto" maxHeight={400} mb={2}>
            <RepoTable
              repos={repos.filter(repo => !isSelected(selectedRepos, repo.id))}
              selected={false}
              handleToggleSelect={handleCheck}
            />
          </Box>
          <form onSubmit={handleAdd}>
            <FormControl>
              <HStack>
                <Input
                  type="text"
                  maxWidth={400}
                  isDisabled={isLoading}
                  value={addRepoText}
                  onChange={e => setAddRepoText(e.target.value)}
                />
                <Button onClick={handleAdd}>Add</Button>
              </HStack>
              <FormHelperText>
                In the format <code>{'{owner}/{repo}'}</code>
              </FormHelperText>
            </FormControl>
          </form>
        </>
      )}
    </Box>
  );
};

export default Repositories;
