import { create } from 'zustand';
import api from '../lib/api';

interface User {
  id: string;
  username: string;
  display_name: string;
  email: string;
  bio: string;
  avatar: string;
  banner: string;
  location: string;
  website: string;
  is_writer: number;
  followers_count: number;
  following_count: number;
  stories_count: number;
  posts_count: number;
  created_at: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (login: string, password: string) => Promise<void>;
  register: (data: { username: string; display_name: string; email: string; password: string; is_writer: boolean }) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
}

const stored = localStorage.getItem('user');

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: stored ? JSON.parse(stored) : null,
  token: localStorage.getItem('token'),
  loading: false,

  login: async (login, password) => {
    const { data } = await api.post('/auth/login', { login, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    set({ user: data.user, token: data.token });
  },

  register: async (formData) => {
    const { data } = await api.post('/auth/register', formData);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    set({ user: data.user, token: data.token });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  },

  fetchMe: async () => {
    try {
      const { data } = await api.get('/auth/me');
      localStorage.setItem('user', JSON.stringify(data));
      set({ user: data });
    } catch {
      get().logout();
    }
  },

  updateUser: (data) => {
    const updated = { ...get().user!, ...data };
    localStorage.setItem('user', JSON.stringify(updated));
    set({ user: updated });
  }
}));
