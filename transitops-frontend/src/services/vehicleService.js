import { USE_MOCK_DATA } from '@/utils/config';
import { simulateDelay } from '@/utils/delay';
import { mockVehicles } from '@/mocks/vehicles';
import api from './api';

// In-memory store so mutations persist through the session
let vehicles = [...mockVehicles];

function mapVehicleFromBackend(v) {
  if (!v) return null;
  return {
    ...v,
    type: v.vehicleType, // Backend uses vehicleType, frontend uses type
  };
}

function mapVehicleToBackend(v) {
  if (!v) return null;
  const { type, ...rest } = v;
  return {
    ...rest,
    vehicleType: type,
  };
}

function applyFilters(list, { status, type, search } = {}) {
  return list.filter((v) => {
    if (status && v.status !== status) return false;
    if (type && v.type !== type) return false;
    if (search) {
      const q = search.toLowerCase();
      if (
        !v.registrationNumber.toLowerCase().includes(q) &&
        !v.vehicleName.toLowerCase().includes(q) &&
        !v.region.toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });
}

export async function getVehicles(filters = {}) {
  if (USE_MOCK_DATA) {
    await simulateDelay();
    return applyFilters(vehicles, filters);
  }
  const { data } = await api.get('/vehicles');
  const mapped = data.map(mapVehicleFromBackend);
  return applyFilters(mapped, filters);
}

export async function getVehicleById(id) {
  if (USE_MOCK_DATA) {
    await simulateDelay(200);
    return vehicles.find((v) => v.id === id) || null;
  }
  const { data } = await api.get(`/vehicles/${id}`);
  return mapVehicleFromBackend(data);
}

export async function createVehicle(vehicleData) {
  if (USE_MOCK_DATA) {
    await simulateDelay(500);
    const newVehicle = { ...vehicleData, id: `v${Date.now()}`, status: 'Available', currentOdometer: vehicleData.currentOdometer || 0 };
    vehicles = [newVehicle, ...vehicles];
    return newVehicle;
  }
  const backendPayload = mapVehicleToBackend(vehicleData);
  const { data } = await api.post('/vehicles', backendPayload);
  return mapVehicleFromBackend(data);
}

export async function updateVehicle(id, vehicleData) {
  if (USE_MOCK_DATA) {
    await simulateDelay(400);
    vehicles = vehicles.map((v) => (v.id === id ? { ...v, ...vehicleData } : v));
    return vehicles.find((v) => v.id === id);
  }
  const backendPayload = mapVehicleToBackend(vehicleData);
  const { data } = await api.put(`/vehicles/${id}`, backendPayload);
  return mapVehicleFromBackend(data);
}

export async function deleteVehicle(id) {
  if (USE_MOCK_DATA) {
    await simulateDelay(300);
    vehicles = vehicles.filter((v) => v.id !== id);
    return { success: true };
  }
  const { data } = await api.delete(`/vehicles/${id}`);
  return data;
}

export async function updateVehicleStatus(id, status) {
  return updateVehicle(id, { status });
}

export function getVehiclesSync() {
  return vehicles;
}

