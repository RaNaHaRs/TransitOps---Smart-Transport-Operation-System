import { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import { completeTrip } from '@/services/tripService';
import { formatNumber } from '@/utils/helpers';

export default function CompleteTripModal({ isOpen, trip, onClose, onCompleted }) {
  const [endOdometer, setEndOdometer] = useState('');
  const [fuelConsumed, setFuelConsumed] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  function validate() {
    const errs = {};
    if (!endOdometer || Number(endOdometer) <= (trip?.startOdometer || 0)) {
      errs.endOdometer = `Must be greater than starting odometer (${formatNumber(trip?.startOdometer)} km)`;
    }
    if (!fuelConsumed || Number(fuelConsumed) <= 0) errs.fuelConsumed = 'Enter fuel consumed';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await completeTrip(trip.id, { endOdometer: Number(endOdometer), fuelConsumed: Number(fuelConsumed) });
      toast.success('Trip marked as completed');
      setEndOdometer('');
      setFuelConsumed('');
      onCompleted();
    } catch { toast.error('Failed to complete trip'); }
    finally { setLoading(false); }
  }

  if (!isOpen || !trip) return null;

  const distance = endOdometer && trip.startOdometer ? Number(endOdometer) - trip.startOdometer : null;
  const efficiency = distance && fuelConsumed ? (distance / Number(fuelConsumed)).toFixed(2) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <div>
            <h2 className="text-base font-semibold text-neutral-900">Complete Trip</h2>
            <p className="text-xs text-neutral-500">{trip.source} → {trip.destination}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Ending Odometer (km) <span className="text-neutral-400 font-normal">— Start: {formatNumber(trip.startOdometer)} km</span>
            </label>
            <input type="number" value={endOdometer} onChange={(e) => { setEndOdometer(e.target.value); setErrors((er) => ({ ...er, endOdometer: '' })); }}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder={String((trip.startOdometer || 0) + 150)} min={(trip.startOdometer || 0) + 1} />
            {errors.endOdometer && <p className="text-xs text-red-500 mt-1">{errors.endOdometer}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Fuel Consumed (liters)</label>
            <input type="number" value={fuelConsumed} onChange={(e) => { setFuelConsumed(e.target.value); setErrors((er) => ({ ...er, fuelConsumed: '' })); }}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="35" min="0.1" step="0.1" />
            {errors.fuelConsumed && <p className="text-xs text-red-500 mt-1">{errors.fuelConsumed}</p>}
          </div>

          {(distance !== null || efficiency !== null) && (
            <div className="bg-neutral-50 rounded-lg px-4 py-3 grid grid-cols-2 gap-4">
              {distance !== null && <div><p className="text-xs text-neutral-400">Distance</p><p className="font-semibold text-neutral-800">{formatNumber(distance)} km</p></div>}
              {efficiency !== null && <div><p className="text-xs text-neutral-400">Fuel Efficiency</p><p className="font-semibold text-neutral-800">{efficiency} km/L</p></div>}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-60">
              {loading ? 'Completing…' : 'Mark Completed'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
