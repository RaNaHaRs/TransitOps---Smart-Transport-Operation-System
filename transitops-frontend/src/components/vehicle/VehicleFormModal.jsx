import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import { createVehicle, updateVehicle } from '@/services/vehicleService';

const TYPES = ['Van', 'Truck', 'Mini-Truck'];
const REGIONS = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Ahmedabad', 'Jaipur', 'Chennai', 'Lucknow', 'Gurgaon', 'Thane', 'Kolkata', 'Hyderabad', 'Ludhiana', 'Kochi'];

export default function VehicleFormModal({ isOpen, vehicle, onClose, onSaved }) {
  const isEditing = !!vehicle;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    vehicleName: '',
    registrationNumber: '',
    type: 'Van',
    maximumLoadCapacity: '',
    currentOdometer: '',
    acquisitionCost: '',
    region: 'Mumbai',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setForm({
        vehicleName: vehicle?.vehicleName || '',
        registrationNumber: vehicle?.registrationNumber || '',
        type: vehicle?.type || 'Van',
        maximumLoadCapacity: vehicle?.maximumLoadCapacity || '',
        currentOdometer: vehicle?.currentOdometer || '',
        acquisitionCost: vehicle?.acquisitionCost || '',
        region: vehicle?.region || 'Mumbai',
      });
      setErrors({});
    }
  }, [isOpen, vehicle]);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: '' }));
  }

  function validate() {
    const errs = {};
    if (!form.vehicleName.trim()) errs.vehicleName = 'Vehicle name is required';
    if (!form.registrationNumber.trim()) errs.registrationNumber = 'Registration number is required';
    if (!form.maximumLoadCapacity || Number(form.maximumLoadCapacity) <= 0) errs.maximumLoadCapacity = 'Enter a valid capacity';
    if (!form.acquisitionCost || Number(form.acquisitionCost) <= 0) errs.acquisitionCost = 'Enter a valid cost';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const payload = {
        ...form,
        maximumLoadCapacity: Number(form.maximumLoadCapacity),
        currentOdometer: Number(form.currentOdometer) || 0,
        acquisitionCost: Number(form.acquisitionCost),
        status: vehicle?.status || 'Available',
      };
      if (isEditing) {
        await updateVehicle(vehicle.id, payload);
        toast.success(`${form.vehicleName} updated successfully`);
      } else {
        await createVehicle(payload);
        toast.success(`${form.vehicleName} added to fleet`);
      }
      onSaved();
    } catch {
      toast.error('Failed to save vehicle');
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <h2 className="text-base font-semibold text-neutral-900">{isEditing ? 'Edit Vehicle' : 'Add New Vehicle'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Vehicle Name *</label>
              <input value={form.vehicleName} onChange={(e) => set('vehicleName', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g. Tata Ace Gold" />
              {errors.vehicleName && <p className="text-xs text-red-500 mt-1">{errors.vehicleName}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Registration No. *</label>
              <input value={form.registrationNumber} onChange={(e) => set('registrationNumber', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="MH-12-AB-4521" />
              {errors.registrationNumber && <p className="text-xs text-red-500 mt-1">{errors.registrationNumber}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Type</label>
              <select value={form.type} onChange={(e) => set('type', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white">
                {TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Region</label>
              <select value={form.region} onChange={(e) => set('region', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white">
                {REGIONS.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Max Capacity (kg) *</label>
              <input type="number" value={form.maximumLoadCapacity} onChange={(e) => set('maximumLoadCapacity', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="900" min="1" />
              {errors.maximumLoadCapacity && <p className="text-xs text-red-500 mt-1">{errors.maximumLoadCapacity}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Odometer (km)</label>
              <input type="number" value={form.currentOdometer} onChange={(e) => set('currentOdometer', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="0" min="0" />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Acquisition Cost (₹) *</label>
              <input type="number" value={form.acquisitionCost} onChange={(e) => set('acquisitionCost', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="750000" min="1" />
              {errors.acquisitionCost && <p className="text-xs text-red-500 mt-1">{errors.acquisitionCost}</p>}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors disabled:opacity-60">
              {loading ? 'Saving…' : isEditing ? 'Save Changes' : 'Add Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
