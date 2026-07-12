import { USE_MOCK_DATA } from '@/utils/config';
import { simulateDelay } from '@/utils/delay';
import { mockUsers } from '@/mocks/users';
import api from './api';

export async function login(email, password) {
  if (USE_MOCK_DATA) {
    await simulateDelay(600);
    const user = mockUsers.find(
      (u) => u.email === email && u.password === password
    );
    if (!user) throw new Error('Invalid email or password');
    const token = `mock_token_${user.id}_${Date.now()}`;
    return { user: { id: user.id, name: user.name, email: user.email, role: user.role, driverId: user.driverId || null }, token };
  }
  const { data } = await api.post('/auth/login', { email, password });
  return data;
}

export async function getMe() {
  if (USE_MOCK_DATA) {
    await simulateDelay(200);
    const raw = localStorage.getItem('transit_user');
    return raw ? JSON.parse(raw) : null;
  }
  const { data } = await api.get('/auth/me');
  return data;
}
