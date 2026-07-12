import { USE_MOCK_DATA } from '@/utils/config';
import { simulateDelay } from '@/utils/delay';
import { mockDrivers } from '@/mocks/drivers';
import { licenseStatus } from '@/utils/helpers';
import api from './api';

let drivers = [...mockDrivers];

function applyFilters(list, { status, search, validLicenseOnly } = {}) {
  return list.filter((d) => {
    if (status && d.status !== status) return false;
    if (validLicenseOnly && licenseStatus(d.licenseExpiry) === 'expired') return false;
    if (search) {
      const q = search.toLowerCase();
      if (!d.name.toLowerCase().includes(q) && !d.licenseNumber.toLowerCase().includes(q)) return false;
    }
    return true;
  });
}

export async function getDrivers(filters = {}) {
  if (USE_MOCK_DATA) {
    await simulateDelay();
    return applyFilters(drivers, filters);
  }
  const { data } = await api.get('/drivers');
  return applyFilters(data, filters);
}

export async function getDriverById(id) {
  if (USE_MOCK_DATA) {
    await simulateDelay(200);
    return drivers.find((d) => d.id === id) || null;
  }
  const { data } = await api.get(`/drivers/${id}`);
  return data;
}

export async function createDriver(driverData) {
  if (USE_MOCK_DATA) {
    await simulateDelay(500);
    const newDriver = { ...driverData, id: `d${Date.now()}`, status: 'Available' };
    drivers = [newDriver, ...drivers];
    return newDriver;
  }
  const payload = {
    ...driverData,
    password: driverData.password || 'Driver@123',
  };
  const { data } = await api.post('/drivers', payload);
  return data;
}

export async function updateDriver(id, driverData) {
  if (USE_MOCK_DATA) {
    await simulateDelay(400);
    drivers = drivers.map((d) => (d.id === id ? { ...d, ...driverData } : d));
    return drivers.find((d) => d.id === id);
  }
  const { data } = await api.put(`/drivers/${id}`, driverData);
  return data;
}

export async function deleteDriver(id) {
  if (USE_MOCK_DATA) {
    await simulateDelay(300);
    drivers = drivers.filter((d) => d.id !== id);
    return { success: true };
  }
  const { data } = await api.delete(`/drivers/${id}`);
  return data;
}

export async function updateDriverStatus(id, status) {
  return updateDriver(id, { status });
}

export function getDriversSync() {
  return drivers;
}
