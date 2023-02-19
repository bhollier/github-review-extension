import {
  Box,
  BoxProps,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Input,
  Link,
  useToast,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

import { getAuth, validateToken } from '../../api/auth';

interface AuthorisationProps extends BoxProps {}

const Authorisation = ({ ...props }: AuthorisationProps) => {
  const toast = useToast();

  const [apiToken, setAPIToken] = useState('');
  const [apiTokenValid, setAPITokenValid] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const retrieveAPIToken = async () => {
      setIsLoading(true);
      const auth = await getAuth();
      setAPIToken(auth?.apiToken ?? '');
      setAPITokenValid(auth?.valid ?? false);
      setIsLoading(false);
    };
    retrieveAPIToken();
  }, []);

  const handleChangeAPIToken = (event: React.FormEvent<HTMLInputElement>) => {
    setAPIToken(event.currentTarget.value);
  };

  const handleSaveAPIToken = async () => {
    // First, make sure the token is valid
    const tokenValid = await validateToken(apiToken);
    if (!tokenValid) {
      setAPITokenValid(false);
      toast({ title: 'Invalid token', status: 'error' });
      return;
    }
    // If it's valid, save it
    await chrome.storage.local.set({ auth: { apiToken, valid: true } });
    setAPITokenValid(true);
    toast({ title: 'Saved', status: 'success' });
  };

  const handleClearAPIToken = async () => {
    await chrome.storage.local.set({ auth: null });
    setAPIToken('');
    toast({ title: 'Saved', status: 'success' });
  };

  return (
    <Box {...props}>
      <Heading size="md" mb={3}>
        Authorisation
      </Heading>
      <FormControl>
        <FormLabel>Github API Token</FormLabel>
        <HStack>
          <Input
            type="text"
            maxWidth={450}
            value={apiToken}
            isDisabled={isLoading}
            isInvalid={!apiTokenValid}
            onChange={handleChangeAPIToken}
          />
          <Button onClick={handleSaveAPIToken}>Save</Button>
          <Button onClick={handleClearAPIToken}>Clear</Button>
        </HStack>
        <FormHelperText>
          Your Github personal access token, see{' '}
          <Link
            href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token"
            isExternal
          >
            the Github docs
          </Link>{' '}
          on how to generate one
        </FormHelperText>
      </FormControl>
    </Box>
  );
};

export default Authorisation;
