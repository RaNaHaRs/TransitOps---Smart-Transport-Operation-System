import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import { createDriver, updateDriver } from '@/services/driverService';

const CATEGORIES = ['LMV', 'HMV', 'LMV+HMV'];
const REGIONS = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Ahmedabad', 'Jaipur', 'Chennai', 'Lucknow', 'Gurgaon', 'Thane', 'Kolkata', 'Hyderabad', 'Ludhiana', 'Kochi'];

export default function DriverFormModal({ isOpen, driver, onClose, onSaved }) {
  const isEditing = !!driver;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    licenseNumber: '',
    licenseCategory: 'HMV',
    licenseExpiry: '',
    safetyScore: 85,
    region: 'Mumbai',
    password: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setForm({
        name: driver?.name || '',
        email: driver?.email || '',
        phone: driver?.phone || '',
        licenseNumber: driver?.licenseNumber || '',
        licenseCategory: driver?.licenseCategory || 'HMV',
        licenseExpiry: driver?.licenseExpiry || '',
        safetyScore: driver?.safetyScore || 85,
        region: driver?.region || 'Mumbai',
        password: '',
      });
      setErrors({});
    }
  }, [isOpen, driver]);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: '' }));
  }

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.licenseNumber.trim()) errs.licenseNumber = 'License number is required';
    if (!form.licenseExpiry) errs.licenseExpiry = 'Expiry date is required';
    if (!form.email.trim() || !form.email.includes('@')) errs.email = 'Valid email required';
    if (!isEditing && (!form.password || form.password.length < 6)) {
      errs.password = 'Password must be at least 6 characters';
    }
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
        safetyScore: Number(form.safetyScore),
        status: driver?.status || 'Available',
      };
      if (isEditing) {
        delete payload.password; // Do not send password on update
      }
      if (isEditing) {
        await updateDriver(driver.id, payload);
        toast.success(`${form.name} updated`);
      } else {
        await createDriver(payload);
        toast.success(`${form.name} added to roster`);
      }
      onSaved();
    } catch { toast.error('Failed to save driver'); }
    finally { setLoading(false); }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <h2 className="text-base font-semibold text-neutral-900">{isEditing ? 'Edit Driver' : 'Register Driver'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Full Name *</label>
              <input value={form.name} onChange={(e) => set('name', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Rajesh Kumar Sharma" />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Email *</label>
              <input value={form.email} onChange={(e) => set('email', e.target.value)} type="email"
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="name@transitops.in" />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Phone</label>
              <input value={form.phone} onChange={(e) => set('phone', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="9XXXXXXXXX" />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Region</label>
              <select value={form.region} onChange={(e) => set('region', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white">
                {REGIONS.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
          </div>
          {!isEditing && (
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Password *</label>
              <input value={form.password} onChange={(e) => set('password', e.target.value)} type="password"
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Password (min 6 chars)" />
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>
          )}
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">License Number *</label>
            <input value={form.licenseNumber} onChange={(e) => set('licenseNumber', e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="MH-12-20200045231" />
            {errors.licenseNumber && <p className="text-xs text-red-500 mt-1">{errors.licenseNumber}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">License Category</label>
              <select value={form.licenseCategory} onChange={(e) => set('licenseCategory', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white">
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">License Expiry *</label>
              <input type="date" value={form.licenseExpiry} onChange={(e) => set('licenseExpiry', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              {errors.licenseExpiry && <p className="text-xs text-red-500 mt-1">{errors.licenseExpiry}</p>}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors disabled:opacity-60">
              {loading ? 'Saving…' : isEditing ? 'Save Changes' : 'Register Driver'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
