import { USE_MOCK_DATA } from '@/utils/config';
import { simulateDelay } from '@/utils/delay';
import { mockFuelLogs, mockExpenses } from '@/mocks/expenses';
import api from './api';

let fuelLogs = [...mockFuelLogs];
let expenses = [...mockExpenses];

export async function getFuelLogs(filters = {}) {
  if (USE_MOCK_DATA) {
    await simulateDelay();
    let list = [...fuelLogs];
    if (filters.vehicleId) list = list.filter((f) => f.vehicleId === filters.vehicleId);
    return list.sort((a, b) => new Date(b.date) - new Date(a.date));
  }
  const { data } = await api.get('/fuel-logs', { params: filters });
  return data;
}

export async function createFuelLog(data) {
  if (USE_MOCK_DATA) {
    await simulateDelay(400);
    const entry = { ...data, id: `f${Date.now()}` };
    fuelLogs = [entry, ...fuelLogs];
    return entry;
  }
  const { data: res } = await api.post('/fuel-logs', data);
  return res;
}

export async function getExpenses(filters = {}) {
  if (USE_MOCK_DATA) {
    await simulateDelay();
    let list = [...expenses];
    if (filters.vehicleId) list = list.filter((e) => e.vehicleId === filters.vehicleId);
    if (filters.type) list = list.filter((e) => e.type === filters.type);
    return list.sort((a, b) => new Date(b.date) - new Date(a.date));
  }
  const { data } = await api.get('/expenses', { params: filters });
  return data;
}

export async function createExpense(data) {
  if (USE_MOCK_DATA) {
    await simulateDelay(400);
    const entry = { ...data, id: `e${Date.now()}` };
    expenses = [entry, ...expenses];
    return entry;
  }
  const { data: res } = await api.post('/expenses', data);
  return res;
}
