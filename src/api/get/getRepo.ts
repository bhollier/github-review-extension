import { Octokit } from 'octokit';

import { authorisedRequestWrapper } from '../auth';
import { Repository } from '../../common/types';

interface getRepoProps {
  apiToken?: string;
  owner: string;
  name: string;
}

const getRepo = async ({ apiToken, owner, name }: getRepoProps) => {
  const response = await authorisedRequestWrapper(
    async auth =>
      new Octokit({ auth }).request('GET /repos/{owner}/{repo}', {
        owner,
        repo: name,
      }),
    apiToken
  );

  return {
    id: response.data.id,
    owner: response.data.owner.login,
    name: response.data.name,
  } as Repository;
};

export default getRepo;
