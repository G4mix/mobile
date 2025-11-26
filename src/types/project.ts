export type ProjectDto = {
  id: string;
  title: string;
  description: string;
  icon: string | null;
  backgroundImage: string | null;
  ownerId: string;
  createdAt: string;
  followersCount: number;
  ideasCount: number;
  topFollowers: Array<{ name: string; icon: string | null }>;
  isFollowing: boolean;
  isOwner: boolean;
  isMember: boolean;
  owner?: {
    id: string;
    displayName: string;
    autobiography: string | null;
    icon: string | null;
    backgroundImage: string | null;
    links: string[];
    isFollowing: boolean;
    followers: number;
    following: number;
    user: {
      id: string;
      username: string;
      email: string;
      verified: boolean;
    };
  };
  members: Array<{
    id: string;
    displayName: string;
    autobiography: string | null;
    icon: string | null;
    backgroundImage: string | null;
    links: string[];
    isFollowing: boolean;
    followers: number;
    following: number;
    user: {
      id: string;
      username: string;
      email: string;
      verified: boolean;
    };
  }> | null;
};

export type ProjectPageable = {
  page: number;
  nextPage: number | null;
  pages: number;
  total: number;
  data: ProjectDto[];
};
