import http from './http';

export interface LoginResponse {
  accessToken: string;
  user: {
    id: number;
    username: string;
    nickname?: string;
    role: string;
  };
}

export interface UserItem {
  id: number;
  username: string;
  nickname?: string;
  role: 'ADMIN' | 'OPERATOR' | 'AUDITOR';
  createdAt?: string;
}

export interface UserListResponse {
  list: UserItem[];
  total: number;
  page: number;
  pageSize: number;
}

export async function loginApi(username: string, password: string) {
  const { data } = await http.post<LoginResponse>('/auth/login', { username, password });
  return data;
}

export async function meApi() {
  const { data } = await http.get('/users/me');
  return data;
}

export async function usersApi(params?: { page?: number; pageSize?: number; keyword?: string }) {
  const { data } = await http.get<UserListResponse>('/users', {
    params,
  });
  return data;
}

export async function createUserApi(payload: {
  username: string;
  password: string;
  nickname?: string;
  role: 'ADMIN' | 'OPERATOR' | 'AUDITOR';
}) {
  const { data } = await http.post<UserItem>('/users', payload);
  return data;
}

export async function updateUserApi(
  id: number,
  payload: {
    username?: string;
    password?: string;
    nickname?: string;
    role?: 'ADMIN' | 'OPERATOR' | 'AUDITOR';
  },
) {
  const { data } = await http.patch<UserItem>(`/users/${id}`, payload);
  return data;
}

export async function deleteUserApi(id: number) {
  const { data } = await http.delete<{ success: boolean }>(`/users/${id}`);
  return data;
}
