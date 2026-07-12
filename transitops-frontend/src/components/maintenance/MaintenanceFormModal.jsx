import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import { createMaintenance } from '@/services/maintenanceService';
import { getVehicles } from '@/services/vehicleService';
import { formatNumber } from '@/utils/helpers';

const TYPES = ['Oil Change', 'Tire Replacement', 'Brake Service', 'General Inspection', 'Electrical', 'AC Repair', 'Engine Overhaul'];

export default function MaintenanceFormModal({ isOpen, onClose, onSaved }) {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ vehicleId: '', type: 'Oil Change', description: '', cost: '', startDate: new Date().toISOString().split('T')[0] });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) return;
    getVehicles().then(setVehicles);
    setForm({ vehicleId: '', type: 'Oil Change', description: '', cost: '', startDate: new Date().toISOString().split('T')[0] });
    setErrors({});
  }, [isOpen]);

  function set(f, v) { setForm((x) => ({ ...x, [f]: v })); setErrors((e) => ({ ...e, [f]: '' })); }

  function validate() {
    const errs = {};
    if (!form.vehicleId) errs.vehicleId = 'Select a vehicle';
    if (!form.cost || Number(form.cost) <= 0) errs.cost = 'Enter a valid cost';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await createMaintenance({ ...form, cost: Number(form.cost) });
      toast.success('Maintenance record created — vehicle marked In Shop');
      onSaved();
    } catch { toast.error('Failed to create maintenance record'); }
    finally { setLoading(false); }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <h2 className="text-base font-semibold text-neutral-900">Log Maintenance</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Vehicle *</label>
            <select value={form.vehicleId} onChange={(e) => set('vehicleId', e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white">
              <option value="">Select vehicle…</option>
              {vehicles.map((v) => <option key={v.id} value={v.id}>{v.vehicleName} — {v.registrationNumber} [{v.status}]</option>)}
            </select>
            {errors.vehicleId && <p className="text-xs text-red-500 mt-1">{errors.vehicleId}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Maintenance Type</label>
              <select value={form.type} onChange={(e) => set('type', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white">
                {TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Cost (₹) *</label>
              <input type="number" value={form.cost} onChange={(e) => set('cost', e.target.value)} min="1"
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="12500" />
              {errors.cost && <p className="text-xs text-red-500 mt-1">{errors.cost}</p>}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={2}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              placeholder="Details about the service work…" />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Start Date</label>
            <input type="date" value={form.startDate} onChange={(e) => set('startDate', e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors disabled:opacity-60">
              {loading ? 'Saving…' : 'Log Maintenance'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
