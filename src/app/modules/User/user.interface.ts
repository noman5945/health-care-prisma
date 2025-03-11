export type IUserFilter = {
  id?: string;
  email?: string;
  role?: string;
  status?: string;
  searchTerm?: string;
};

export type ICurrentUserInfo = {
  email: string;
  role: string;
  iat: number;
  exp: number;
};
