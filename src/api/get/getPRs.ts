import { Octokit } from 'octokit';

import { authorisedRequestWrapper } from '../auth';
import { PullRequest, Repository } from '../../common/types';

interface getPRsProps {
  apiToken?: string;
  repo: Repository;
}

const getPRs = async ({ apiToken, repo }: getPRsProps) => {
  const response = await authorisedRequestWrapper(
    async auth =>
      new Octokit({ auth }).paginate('GET /repos/{owner}/{repo}/pulls', {
        owner: repo.owner,
        repo: repo.name,
      }),
    apiToken
  );
  return response as PullRequest[];
};

export default getPRs;
