import React, { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';

import Header from '../../components/popup/Header';
import PRList from '../../components/popup/PRList';
import InvalidToken from '../../components/InvalidToken';

import { getAuth } from '../../api/auth';
import { getPRs } from '../../common/prs';
import { PullRequest } from '../../common/types';

const App = () => {
  const [prs, setPRs] = useState<PullRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [noToken, setNoToken] = useState<boolean>();

  const retrievePRs = async () => {
    setIsLoading(true);

    const auth = await getAuth();
    if (!auth || !auth.valid) {
      setIsLoading(false);
      setNoToken(true);
      return;
    }

    const retrievedPRs = await getPRs();
    setIsLoading(false);
    if (retrievedPRs === null) {
      // todo error handling
    } else {
      setPRs(retrievedPRs);
    }
  };

  useEffect(() => {
    retrievePRs();
  }, []);

  const handleRefresh = () => {
    retrievePRs();
  };

  return (
    <Box w="md">
      <Header h={12} handleRefresh={handleRefresh} />
      {noToken ? (
        <InvalidToken mt={12} p={5} fontSize={16} />
      ) : (
        <PRList mt={12} prs={prs} isLoading={isLoading} />
      )}
    </Box>
  );
};

export default App;
