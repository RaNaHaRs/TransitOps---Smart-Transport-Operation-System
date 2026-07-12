import { useEffect, useState, useCallback } from 'react';
import { Route, Eye } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getTrips } from '@/services/tripService';
import StatusBadge from '@/components/common/StatusBadge';
import Loading, { TableSkeleton } from '@/components/common/Loading';
import EmptyState from '@/components/common/EmptyState';
import CompleteTripModal from '@/components/trip/CompleteTripModal';
import { formatDate, formatNumber } from '@/utils/helpers';
import { toast } from 'react-toastify';

export default function DriverTripsPage() {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailModal, setDetailModal] = useState({ open: false, trip: null });
  const [completeModal, setCompleteModal] = useState({ open: false, trip: null });

  const load = useCallback(async () => {
    if (!user?.driverId) { setLoading(false); return; }
    setLoading(true);
    try {
      const data = await getTrips({ driverId: user.driverId });
      setTrips(data);
    } catch { toast.error('Failed to load trips'); }
    finally { setLoading(false); }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">My Trips</h1>
        <p className="text-sm text-neutral-500">All trips assigned to you.</p>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        {loading ? <TableSkeleton rows={5} cols={5} /> : trips.length === 0 ? (
          <EmptyState icon={Route} title="No trips assigned" description="Your fleet manager hasn't assigned any trips yet." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  {['Route', 'Date', 'Cargo', 'Distance', 'Status', ''].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {trips.map((t) => (
                  <tr key={t.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3 font-medium text-neutral-800">{t.source} → {t.destination}</td>
                    <td className="px-4 py-3 text-neutral-500">{formatDate(t.createdAt)}</td>
                    <td className="px-4 py-3 text-neutral-500">{formatNumber(t.cargoWeight)} kg</td>
                    <td className="px-4 py-3 text-neutral-500">{t.plannedDistance ? `${formatNumber(t.plannedDistance)} km` : '—'}</td>
                    <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setDetailModal({ open: true, trip: t })}
                          className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-500 transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                        {t.status === 'Dispatched' && (
                          <button onClick={() => setCompleteModal({ open: true, trip: t })}
                            className="px-2 py-1 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-medium rounded-md transition-colors">
                            Complete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {detailModal.open && detailModal.trip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDetailModal({ open: false, trip: null })} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-base font-semibold text-neutral-900 mb-4">Trip Details</h2>
            <div className="space-y-3">
              {[
                ['Route', `${detailModal.trip.source} → ${detailModal.trip.destination}`],
                ['Status', detailModal.trip.status],
                ['Cargo Weight', `${formatNumber(detailModal.trip.cargoWeight)} kg`],
                ['Planned Distance', `${formatNumber(detailModal.trip.plannedDistance)} km`],
                ['Actual Distance', detailModal.trip.actualDistance ? `${formatNumber(detailModal.trip.actualDistance)} km` : 'Not yet'],
                ['Fuel Consumed', detailModal.trip.fuelConsumed ? `${detailModal.trip.fuelConsumed} L` : '—'],
                ['Created', formatDate(detailModal.trip.createdAt)],
                ['Dispatched', formatDate(detailModal.trip.dispatchedAt)],
                ['Completed', formatDate(detailModal.trip.completedAt)],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm">
                  <span className="text-neutral-500">{k}</span>
                  <span className="font-medium text-neutral-800">{v || '—'}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setDetailModal({ open: false, trip: null })}
              className="mt-5 w-full py-2 text-sm font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors">
              Close
            </button>
          </div>
        </div>
      )}

      <CompleteTripModal isOpen={completeModal.open} trip={completeModal.trip}
        onClose={() => setCompleteModal({ open: false, trip: null })}
        onCompleted={() => { setCompleteModal({ open: false, trip: null }); load(); }} />
    </div>
  );
}
