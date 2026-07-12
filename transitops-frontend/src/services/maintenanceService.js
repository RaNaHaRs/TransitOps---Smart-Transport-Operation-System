import { USE_MOCK_DATA } from '@/utils/config';
import { simulateDelay } from '@/utils/delay';
import { mockMaintenance } from '@/mocks/maintenance';
import { updateVehicleStatus } from './vehicleService';
import api from './api';

let records = [...mockMaintenance];

export async function getMaintenance(filters = {}) {
  if (USE_MOCK_DATA) {
    await simulateDelay();
    let list = [...records];
    if (filters.status) list = list.filter((r) => r.status === filters.status);
    if (filters.vehicleId) list = list.filter((r) => r.vehicleId === filters.vehicleId);
    return list.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
  }
  const { data } = await api.get('/maintenance', { params: filters });
  return data;
}

export async function createMaintenance(data) {
  if (USE_MOCK_DATA) {
    await simulateDelay(500);
    const newRecord = { ...data, id: `m${Date.now()}`, status: 'Open', closedDate: null };
    records = [newRecord, ...records];
    await updateVehicleStatus(data.vehicleId, 'In Shop');
    return newRecord;
  }
  const { data: res } = await api.post('/maintenance', data);
  return res;
}

export async function closeMaintenance(id) {
  if (USE_MOCK_DATA) {
    await simulateDelay(500);
    const record = records.find((r) => r.id === id);
    if (!record) throw new Error('Maintenance record not found');
    records = records.map((r) =>
      r.id === id ? { ...r, status: 'Closed', closedDate: new Date().toISOString().split('T')[0] } : r
    );
    await updateVehicleStatus(record.vehicleId, 'Available');
    return records.find((r) => r.id === id);
  }
  const { data } = await api.put(`/maintenance/${id}/close`);
  return data;
}
