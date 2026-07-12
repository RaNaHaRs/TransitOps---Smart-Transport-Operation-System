import { useEffect, useState, useCallback } from 'react';
import { Plus, Route, Search, ChevronRight, CheckCircle, XCircle, Send } from 'lucide-react';
import { toast } from 'react-toastify';
import StatusBadge from '@/components/common/StatusBadge';
import Loading, { TableSkeleton } from '@/components/common/Loading';
import EmptyState from '@/components/common/EmptyState';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import CreateTripModal from '@/components/trip/CreateTripModal';
import CompleteTripModal from '@/components/trip/CompleteTripModal';
import { getTrips, dispatchTrip, cancelTrip } from '@/services/tripService';
import { formatDate, formatNumber } from '@/utils/helpers';
import { useDebounce } from '@/hooks/useDebounce';
import { getVehiclesSync } from '@/services/vehicleService';
import { getDriversSync } from '@/services/driverService';

export default function TripsPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [createModal, setCreateModal] = useState(false);
  const [completeModal, setCompleteModal] = useState({ open: false, trip: null });
  const [cancelDialog, setCancelDialog] = useState({ open: false, trip: null, loading: false });
  const [dispatchDialog, setDispatchDialog] = useState({ open: false, trip: null, loading: false });

  const debouncedSearch = useDebounce(search, 300);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTrips({ status: statusFilter, search: debouncedSearch });
      const vehicles = getVehiclesSync();
      const drivers = getDriversSync();
      const enriched = data.map((t) => ({
        ...t,
        vehicle: vehicles.find((v) => v.id === t.vehicleId),
        driver: drivers.find((d) => d.id === t.driverId),
      }));
      setTrips(enriched);
    } catch { toast.error('Failed to load trips'); }
    finally { setLoading(false); }
  }, [statusFilter, debouncedSearch]);

  useEffect(() => { load(); }, [load]);

  async function handleDispatch() {
    setDispatchDialog((d) => ({ ...d, loading: true }));
    try {
      await dispatchTrip(dispatchDialog.trip.id);
      toast.success('Trip dispatched successfully');
      setDispatchDialog({ open: false, trip: null, loading: false });
      load();
    } catch { toast.error('Failed to dispatch'); setDispatchDialog((d) => ({ ...d, loading: false })); }
  }

  async function handleCancel() {
    setCancelDialog((d) => ({ ...d, loading: true }));
    try {
      await cancelTrip(cancelDialog.trip.id);
      toast.success('Trip cancelled');
      setCancelDialog({ open: false, trip: null, loading: false });
      load();
    } catch { toast.error('Failed to cancel'); setCancelDialog((d) => ({ ...d, loading: false })); }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Trips</h1>
          <p className="text-sm text-neutral-500">Create, dispatch, and complete trips.</p>
        </div>
        <button onClick={() => setCreateModal(true)}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          <Plus className="w-4 h-4" />Create Trip
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by city…"
            className="w-full pl-9 pr-4 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white">
          <option value="">All Statuses</option>
          {['Draft', 'Dispatched', 'Completed', 'Cancelled'].map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        {loading ? <TableSkeleton rows={6} cols={7} /> : trips.length === 0 ? (
          <EmptyState icon={Route} title="No trips found"
            description={search || statusFilter ? 'Try adjusting filters.' : 'Create your first trip to get started.'} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  {['Route', 'Vehicle', 'Driver', 'Cargo', 'Date', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {trips.map((t) => (
                  <tr key={t.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 font-medium text-neutral-800">
                        {t.source}
                        <ChevronRight className="w-3 h-3 text-neutral-400" />
                        {t.destination}
                      </div>
                      {t.plannedDistance && <p className="text-xs text-neutral-400">{t.plannedDistance} km planned</p>}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">{t.vehicle?.vehicleName || '—'}</td>
                    <td className="px-4 py-3 text-neutral-600">{t.driver?.name?.split(' ')[0] || '—'}</td>
                    <td className="px-4 py-3 text-neutral-600">{formatNumber(t.cargoWeight)} kg</td>
                    <td className="px-4 py-3 text-neutral-500">{formatDate(t.createdAt)}</td>
                    <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 flex-wrap">
                        {t.status === 'Draft' && (
                          <button onClick={() => setDispatchDialog({ open: true, trip: t, loading: false })}
                            className="flex items-center gap-1 px-2 py-1 bg-primary-50 hover:bg-primary-100 text-primary-700 text-xs font-medium rounded-md transition-colors">
                            <Send className="w-3 h-3" />Dispatch
                          </button>
                        )}
                        {t.status === 'Dispatched' && (
                          <button onClick={() => setCompleteModal({ open: true, trip: t })}
                            className="flex items-center gap-1 px-2 py-1 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-medium rounded-md transition-colors">
                            <CheckCircle className="w-3 h-3" />Complete
                          </button>
                        )}
                        {(t.status === 'Draft' || t.status === 'Dispatched') && (
                          <button onClick={() => setCancelDialog({ open: true, trip: t, loading: false })}
                            className="flex items-center gap-1 px-2 py-1 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-medium rounded-md transition-colors">
                            <XCircle className="w-3 h-3" />Cancel
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

      <CreateTripModal isOpen={createModal} onClose={() => setCreateModal(false)} onCreated={() => { setCreateModal(false); load(); }} />
      <CompleteTripModal isOpen={completeModal.open} trip={completeModal.trip}
        onClose={() => setCompleteModal({ open: false, trip: null })}
        onCompleted={() => { setCompleteModal({ open: false, trip: null }); load(); }} />
      <ConfirmDialog isOpen={dispatchDialog.open} danger={false}
        onClose={() => setDispatchDialog({ open: false, trip: null, loading: false })}
        onConfirm={handleDispatch} loading={dispatchDialog.loading}
        title="Dispatch this trip?"
        message={`Vehicle and driver will be marked On Trip. You'll need to complete or cancel the trip to release them.`}
        confirmLabel="Dispatch" />
      <ConfirmDialog isOpen={cancelDialog.open}
        onClose={() => setCancelDialog({ open: false, trip: null, loading: false })}
        onConfirm={handleCancel} loading={cancelDialog.loading}
        title="Cancel trip?" message="This will cancel the trip and restore vehicle and driver availability."
        confirmLabel="Cancel Trip" />
    </div>
  );
}
