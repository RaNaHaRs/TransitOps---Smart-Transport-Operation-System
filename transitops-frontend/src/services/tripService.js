import { USE_MOCK_DATA } from '@/utils/config';
import { simulateDelay } from '@/utils/delay';
import { mockTrips } from '@/mocks/trips';
import { updateVehicleStatus } from './vehicleService';
import { updateDriverStatus } from './driverService';
import api from './api';

let trips = [...mockTrips];

function applyFilters(list, { status, search, driverId } = {}) {
  return list.filter((t) => {
    if (status && t.status !== status) return false;
    if (driverId && Number(t.driverId) !== Number(driverId) && t.driverId !== driverId) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!t.source.toLowerCase().includes(q) && !t.destination.toLowerCase().includes(q)) return false;
    }
    return true;
  });
}

export async function getTrips(filters = {}) {
  let list = [];
  if (USE_MOCK_DATA) {
    await simulateDelay();
    list = [...trips];
  } else {
    const { data } = await api.get('/trips');
    list = data;
  }
  const sorted = list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return applyFilters(sorted, filters);
}

export async function getTripById(id) {
  if (USE_MOCK_DATA) {
    await simulateDelay(200);
    return trips.find((t) => t.id === id) || null;
  }
  const { data } = await api.get(`/trips/${id}`);
  return data;
}

export async function createTrip(tripData) {
  if (USE_MOCK_DATA) {
    await simulateDelay(500);
    const newTrip = {
      ...tripData,
      id: `t${Date.now()}`,
      status: 'Draft',
      createdAt: new Date().toISOString().split('T')[0],
      dispatchedAt: null,
      completedAt: null,
      actualDistance: null,
      endOdometer: null,
      fuelConsumed: null,
    };
    trips = [newTrip, ...trips];
    return newTrip;
  }
  const payload = {
    ...tripData,
    vehicleId: Number(tripData.vehicleId),
    driverId: Number(tripData.driverId),
    plannedDistance: Number(tripData.plannedDistance) || 0,
    cargoWeight: Number(tripData.cargoWeight) || 0,
  };
  const { data } = await api.post('/trips', payload);
  return data;
}

export async function dispatchTrip(id) {
  if (USE_MOCK_DATA) {
    await simulateDelay(500);
    const trip = trips.find((t) => t.id === id);
    if (!trip) throw new Error('Trip not found');
    trips = trips.map((t) =>
      t.id === id ? { ...t, status: 'Dispatched', dispatchedAt: new Date().toISOString().split('T')[0] } : t
    );
    await updateVehicleStatus(trip.vehicleId, 'On Trip');
    await updateDriverStatus(trip.driverId, 'On Trip');
    return trips.find((t) => t.id === id);
  }
  const { data } = await api.put(`/trips/${id}/dispatch`);
  return data;
}

export async function completeTrip(id, { endOdometer, fuelConsumed }) {
  if (USE_MOCK_DATA) {
    await simulateDelay(600);
    const trip = trips.find((t) => t.id === id);
    if (!trip) throw new Error('Trip not found');
    const actualDistance = endOdometer - trip.startOdometer;
    trips = trips.map((t) =>
      t.id === id
        ? { ...t, status: 'Completed', endOdometer, fuelConsumed, actualDistance, completedAt: new Date().toISOString().split('T')[0] }
        : t
    );
    await updateVehicleStatus(trip.vehicleId, 'Available');
    await updateDriverStatus(trip.driverId, 'Available');
    return trips.find((t) => t.id === id);
  }
  const payload = {
    endOdometer: Number(endOdometer),
    fuelConsumed: Number(fuelConsumed),
  };
  const { data } = await api.put(`/trips/${id}/complete`, payload);
  return data;
}

export async function cancelTrip(id) {
  if (USE_MOCK_DATA) {
    await simulateDelay(400);
    const trip = trips.find((t) => t.id === id);
    if (!trip) throw new Error('Trip not found');
    trips = trips.map((t) =>
      t.id === id ? { ...t, status: 'Cancelled' } : t
    );
    if (trip.status === 'Dispatched') {
      await updateVehicleStatus(trip.vehicleId, 'Available');
      await updateDriverStatus(trip.driverId, 'Available');
    }
    return trips.find((t) => t.id === id);
  }
  const { data } = await api.put(`/trips/${id}/cancel`);
  return data;
}

export function getTripsSync() {
  return trips;
}
