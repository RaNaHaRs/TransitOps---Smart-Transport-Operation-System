import { useEffect, useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { createTrip } from '@/services/tripService';
import { getVehicles } from '@/services/vehicleService';
import { getDrivers } from '@/services/driverService';
import { licenseStatus, formatNumber } from '@/utils/helpers';

export default function CreateTripModal({ isOpen, onClose, onCreated }) {
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ source: '', destination: '', vehicleId: '', driverId: '', cargoWeight: '', plannedDistance: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) return;
    Promise.all([
      getVehicles({ status: 'Available' }),
      getDrivers({ status: 'Available', validLicenseOnly: true }),
    ]).then(([v, d]) => {
      setVehicles(v);
      setDrivers(d.filter((dr) => licenseStatus(dr.licenseExpiry) !== 'expired'));
    });
    setForm({ source: '', destination: '', vehicleId: '', driverId: '', cargoWeight: '', plannedDistance: '' });
    setErrors({});
  }, [isOpen]);

  const selectedVehicle = vehicles.find((v) => v.id === form.vehicleId);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: '' }));
  }

  function validate() {
    const errs = {};
    if (!form.source.trim()) errs.source = 'Source required';
    if (!form.destination.trim()) errs.destination = 'Destination required';
    if (!form.vehicleId) errs.vehicleId = 'Select a vehicle';
    if (!form.driverId) errs.driverId = 'Select a driver';
    if (!form.cargoWeight || Number(form.cargoWeight) <= 0) errs.cargoWeight = 'Enter cargo weight';
    if (selectedVehicle && Number(form.cargoWeight) > selectedVehicle.maximumLoadCapacity) {
      errs.cargoWeight = `Exceeds vehicle max capacity (${formatNumber(selectedVehicle.maximumLoadCapacity)} kg)`;
    }
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await createTrip({
        source: form.source,
        destination: form.destination,
        vehicleId: form.vehicleId,
        driverId: form.driverId,
        cargoWeight: Number(form.cargoWeight),
        plannedDistance: Number(form.plannedDistance) || 0,
        startOdometer: selectedVehicle?.currentOdometer || 0,
      });
      toast.success('Trip created — dispatch when ready');
      onCreated();
    } catch { toast.error('Failed to create trip'); }
    finally { setLoading(false); }
  }

  if (!isOpen) return null;

  const cargoOverLimit = selectedVehicle && Number(form.cargoWeight) > selectedVehicle.maximumLoadCapacity;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <h2 className="text-base font-semibold text-neutral-900">Create Trip</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Source *</label>
              <input value={form.source} onChange={(e) => set('source', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Mumbai" />
              {errors.source && <p className="text-xs text-red-500 mt-1">{errors.source}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Destination *</label>
              <input value={form.destination} onChange={(e) => set('destination', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Pune" />
              {errors.destination && <p className="text-xs text-red-500 mt-1">{errors.destination}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Vehicle (Available only) *</label>
            <select value={form.vehicleId} onChange={(e) => set('vehicleId', e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white">
              <option value="">Select vehicle…</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>{v.vehicleName} — {v.registrationNumber} (max {formatNumber(v.maximumLoadCapacity)} kg)</option>
              ))}
            </select>
            {errors.vehicleId && <p className="text-xs text-red-500 mt-1">{errors.vehicleId}</p>}
            {vehicles.length === 0 && <p className="text-xs text-amber-600 mt-1">No available vehicles — all are on trip or in maintenance.</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Driver (Available, valid license) *</label>
            <select value={form.driverId} onChange={(e) => set('driverId', e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white">
              <option value="">Select driver…</option>
              {drivers.map((d) => <option key={d.id} value={d.id}>{d.name} (Score: {d.safetyScore})</option>)}
            </select>
            {errors.driverId && <p className="text-xs text-red-500 mt-1">{errors.driverId}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Cargo Weight (kg) *</label>
              <input type="number" value={form.cargoWeight} onChange={(e) => set('cargoWeight', e.target.value)} min="1"
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="500" />
              {selectedVehicle && (
                <p className={`text-xs mt-1 ${cargoOverLimit ? 'text-red-500 font-medium' : 'text-neutral-400'}`}>
                  {cargoOverLimit && <AlertCircle className="w-3 h-3 inline mr-1" />}
                  Vehicle max: {formatNumber(selectedVehicle.maximumLoadCapacity)} kg
                </p>
              )}
              {errors.cargoWeight && <p className="text-xs text-red-500 mt-1">{errors.cargoWeight}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Planned Distance (km)</label>
              <input type="number" value={form.plannedDistance} onChange={(e) => set('plannedDistance', e.target.value)} min="1"
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="150" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors">Cancel</button>
            <button type="submit" disabled={loading || cargoOverLimit}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors disabled:opacity-60">
              {loading ? 'Creating…' : 'Create Trip'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
