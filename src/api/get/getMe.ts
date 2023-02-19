import { Octokit } from 'octokit';

import { authorisedRequestWrapper } from '../auth';
import { User } from '../../common/types';

interface getMeProps {
  apiToken?: string;
}

const getMe = async ({ apiToken }: getMeProps) => {
  const response = await authorisedRequestWrapper(
    async auth => new Octokit({ auth }).request('GET /user'),
    apiToken
  );
  return response.data as User;
};

export default getMe;
