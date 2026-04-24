import { defineStore } from 'pinia';
import { loginApi, meApi } from '@/api/auth';

interface UserInfo {
  userId?: number;
  username?: string;
  nickname?: string;
  role?: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('admin_token') || '',
    user: {} as UserInfo,
  }),
  getters: {
    isLoggedIn: (state) => Boolean(state.token),
  },
  actions: {
    async login(username: string, password: string) {
      const res = await loginApi(username, password);
      this.token = res.accessToken;
      this.user = {
        userId: res.user.id,
        username: res.user.username,
        nickname: res.user.nickname,
        role: res.user.role,
      };
      localStorage.setItem('admin_token', res.accessToken);
    },
    async fetchMe() {
      if (!this.token) return;
      this.user = await meApi();
    },
    logout() {
      this.token = '';
      this.user = {};
      localStorage.removeItem('admin_token');
    },
  },
});
