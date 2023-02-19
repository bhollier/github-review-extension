export interface Auth {
  apiToken: string;
  valid: boolean;
}

export interface FilterOptions {
  includeAssigned: boolean;
  includeAssignedToMe: boolean;
  includeBots: boolean;
  includeDrafts: boolean;
}

export interface PullRequest {
  id: number;
  url: string;
  html_url: string;
  number: number;
  title: string;
  body: string;
  user: User;
  created_at: string;
  assignee?: User;
  assignees: User[];
  requested_reviewers: User[];
  draft: boolean;
}

export interface Repository {
  id: number;
  owner: string;
  name: string;
}

export interface User {
  id: number;
  login: string;
  type: string;
  avatar_url: string;
}
