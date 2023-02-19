import * as api from '../api/api';

import { FILTER_OPTIONS_DEFAULT } from './constants';
import { Auth, FilterOptions, Repository, User } from './types';

const getPRs = async () => {
  const auth = (await chrome.storage.local.get({ auth: null }))
    .auth as Auth | null;
  const { repos, filters } = (await chrome.storage.sync.get({
    repos: [],
    filters: FILTER_OPTIONS_DEFAULT,
  })) as {
    repos: Repository[];
    filters: FilterOptions;
  };
  if (repos.length === 0) {
    return [];
  }

  if (!auth || !auth.valid) {
    return null;
  }

  let prs;
  try {
    const repoPRs = await Promise.all(
      repos.map(repo => api.getPRs({ apiToken: auth.apiToken, repo }))
    );
    prs = repoPRs.flatMap(pr => pr);
  } catch (error) {
    console.log(error);
    return null;
  }

  let user: User;
  if (filters.includeAssignedToMe && !filters.includeAssigned) {
    user = await api.getMe({ apiToken: auth.apiToken });
  }

  return prs
    .filter(
      pr =>
        filters.includeAssigned ||
        pr.assignees.length === 0 ||
        (filters.includeAssignedToMe &&
          pr.assignees.filter(assignee => assignee.login === user?.login)
            .length > 0)
    )
    .filter(pr => filters.includeBots || pr.user?.type !== 'Bot')
    .filter(pr => filters.includeDrafts || !pr.draft);
};

export { getPRs };
