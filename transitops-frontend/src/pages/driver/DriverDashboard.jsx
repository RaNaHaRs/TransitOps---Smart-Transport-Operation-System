import { useEffect, useState } from 'react';
import { Truck, Route, Clock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getTrips } from '@/services/tripService';
import { getVehicles } from '@/services/vehicleService';
import StatusBadge from '@/components/common/StatusBadge';
import Loading from '@/components/common/Loading';
import { formatDate } from '@/utils/helpers';

export default function DriverDashboard() {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.driverId) { setLoading(false); return; }
    Promise.all([
      getTrips({ driverId: user.driverId }),
      getVehicles(),
    ]).then(([tripsData, vehiclesData]) => {
      setTrips(tripsData);
      setVehicles(vehiclesData);
      setLoading(false);
    });
  }, [user]);

  if (loading) return <Loading />;

  // Active trips = Draft or Dispatched (not completed/cancelled)
  const activeTrips = trips.filter((t) => t.status === 'Draft' || t.status === 'Dispatched');
  // First pending trip (Draft first, then Dispatched) to show assigned vehicle
  const firstPendingTrip = trips.find((t) => t.status === 'Draft') || trips.find((t) => t.status === 'Dispatched');
  const assignedVehicle = firstPendingTrip
    ? vehicles.find((v) => Number(v.id) === Number(firstPendingTrip.vehicleId) || v.id === firstPendingTrip.vehicleId)
    : null;
  // Current trip for status: prefer Dispatched, else Draft
  const currentTrip = trips.find((t) => t.status === 'Dispatched') || trips.find((t) => t.status === 'Draft');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">Good day, {user?.name?.split(' ')[0]}!</h1>
        <p className="text-sm text-neutral-500">Your current assignment and trip status.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center"><Truck className="w-4 h-4 text-blue-600" /></div>
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Assigned Vehicle</p>
          </div>
          {assignedVehicle ? (
            <>
              <p className="font-bold text-neutral-900">{assignedVehicle.vehicleName}</p>
              <p className="text-xs font-mono text-neutral-400 mt-0.5">{assignedVehicle.registrationNumber}</p>
            </>
          ) : <p className="text-sm text-neutral-400">None assigned</p>}
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center"><Route className="w-4 h-4 text-green-600" /></div>
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Active Trips</p>
          </div>
          <p className="font-bold text-2xl text-neutral-900">{activeTrips.length}</p>
          <p className="text-xs text-neutral-400 mt-0.5">
            {activeTrips.length === 0
              ? 'No active trips'
              : `${activeTrips.filter((t) => t.status === 'Dispatched').length} dispatched, ${activeTrips.filter((t) => t.status === 'Draft').length} pending`}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center"><Clock className="w-4 h-4 text-amber-600" /></div>
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Trip Status</p>
          </div>
          {currentTrip
            ? <StatusBadge status={currentTrip.status} />
            : <StatusBadge status="Arrived" />}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm">
        <div className="px-5 py-4 border-b border-neutral-100">
          <h2 className="text-sm font-semibold text-neutral-700">Recent Trips</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                {['Route', 'Date', 'Status', 'Cargo'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {trips.slice(0, 5).map((t) => (
                <tr key={t.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3 font-medium text-neutral-800">{t.source} → {t.destination}</td>
                  <td className="px-4 py-3 text-neutral-500">{formatDate(t.createdAt)}</td>
                  <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                  <td className="px-4 py-3 text-neutral-500">{t.cargoWeight} kg</td>
                </tr>
              ))}
              {trips.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-sm text-neutral-400">No trips assigned yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
