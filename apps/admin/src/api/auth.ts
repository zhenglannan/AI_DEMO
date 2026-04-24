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

export async function loginApi(username: string, password: string) {
  const { data } = await http.post<LoginResponse>('/auth/login', { username, password });
  return data;
}

export async function meApi() {
  const { data } = await http.get('/users/me');
  return data;
}

export async function usersApi() {
  const { data } = await http.get('/users');
  return data;
}
