import { Octokit } from 'octokit';
import { RequestError } from '@octokit/types';

import { Auth } from '../common/types';

const getAuth = async (apiToken?: string) => {
  if (!apiToken) {
    return (
      await chrome.storage.local.get({
        auth: null,
      })
    ).auth as Auth | null;
  }

  return {
    apiToken,
    valid: true,
  } as Auth;
};

const authorisedRequestWrapper = async <T>(
  request: (auth: string) => Promise<T>,
  apiToken?: string
) => {
  const auth = await getAuth(apiToken);
  if (!auth || !auth.valid) {
    throw new Error('No credentials');
  }

  try {
    return await request(auth.apiToken);
  } catch (error) {
    // If it is an auth error
    if ((error as RequestError)?.status === 401) {
      auth.valid = false;
      await chrome.storage.local.set({
        auth,
      });
    } else {
      console.log(error);
    }
    throw error;
  }
};

const validateToken = async (apiToken: string) => {
  try {
    await new Octokit({ auth: apiToken }).request('GET /user');
    return true;
  } catch (error) {
    if ((error as RequestError).status === 401) {
      return false;
    }
    console.log(error);
    throw error;
  }
};

export { getAuth, authorisedRequestWrapper, validateToken };
