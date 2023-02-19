import { Octokit } from 'octokit';

import { authorisedRequestWrapper } from '../auth';
import { Repository } from '../../common/types';

interface getUserReposProps {
  apiToken?: string;
}

const getUserRepos = async ({ apiToken }: getUserReposProps) => {
  const response = await authorisedRequestWrapper(
    async auth => new Octokit({ auth }).paginate('GET /user/repos'),
    apiToken
  );
  return response.map(
    (repo): Repository => ({
      id: repo.id,
      owner: repo.owner.login,
      name: repo.name,
    })
  );
};

export default getUserRepos;
