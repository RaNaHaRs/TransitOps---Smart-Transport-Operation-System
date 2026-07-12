import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, Truck, Search } from 'lucide-react';
import { toast } from 'react-toastify';
import StatusBadge from '@/components/common/StatusBadge';
import Loading, { TableSkeleton } from '@/components/common/Loading';
import EmptyState from '@/components/common/EmptyState';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import VehicleFormModal from '@/components/vehicle/VehicleFormModal';
import { getVehicles, deleteVehicle } from '@/services/vehicleService';
import { formatNumber, formatCurrency } from '@/utils/helpers';
import { useDebounce } from '@/hooks/useDebounce';

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [formModal, setFormModal] = useState({ open: false, vehicle: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, vehicle: null, loading: false });

  const debouncedSearch = useDebounce(search, 300);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getVehicles({ status: statusFilter, type: typeFilter, search: debouncedSearch });
      setVehicles(data);
    } catch {
      toast.error('Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, typeFilter, debouncedSearch]);

  useEffect(() => { load(); }, [load]);

  async function handleDelete() {
    setDeleteDialog((d) => ({ ...d, loading: true }));
    try {
      await deleteVehicle(deleteDialog.vehicle.id);
      toast.success(`${deleteDialog.vehicle.vehicleName} removed from fleet`);
      setDeleteDialog({ open: false, vehicle: null, loading: false });
      load();
    } catch {
      toast.error('Failed to delete vehicle');
      setDeleteDialog((d) => ({ ...d, loading: false }));
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Vehicles</h1>
          <p className="text-sm text-neutral-500">Manage your entire fleet in one place.</p>
        </div>
        <button
          onClick={() => setFormModal({ open: true, vehicle: null })}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Vehicle
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or reg. number…"
            className="w-full pl-9 pr-4 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
        >
          <option value="">All Statuses</option>
          {['Available', 'On Trip', 'In Shop', 'Retired'].map((s) => <option key={s}>{s}</option>)}
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
        >
          <option value="">All Types</option>
          {['Van', 'Truck', 'Mini-Truck'].map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        {loading ? (
          <TableSkeleton rows={6} cols={7} />
        ) : vehicles.length === 0 ? (
          <EmptyState
            icon={Truck}
            title="No vehicles found"
            description={search || statusFilter || typeFilter ? 'Try adjusting your filters.' : 'Add your first vehicle to get started.'}
            action={
              <button
                onClick={() => setFormModal({ open: true, vehicle: null })}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Add vehicle →
              </button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  {['Registration', 'Vehicle', 'Type', 'Capacity', 'Odometer', 'Acq. Cost', 'Status', ''].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {vehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs font-medium text-neutral-700">{v.registrationNumber}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-neutral-800">{v.vehicleName}</p>
                      <p className="text-xs text-neutral-400">{v.region}</p>
                    </td>
                    <td className="px-4 py-3 text-neutral-600">{v.type}</td>
                    <td className="px-4 py-3 text-neutral-600">{formatNumber(v.maximumLoadCapacity)} kg</td>
                    <td className="px-4 py-3 text-neutral-600">{formatNumber(v.currentOdometer)} km</td>
                    <td className="px-4 py-3 text-neutral-600">{formatCurrency(v.acquisitionCost)}</td>
                    <td className="px-4 py-3"><StatusBadge status={v.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setFormModal({ open: true, vehicle: v })}
                          className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-500 hover:text-primary-600 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteDialog({ open: true, vehicle: v, loading: false })}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-neutral-500 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <VehicleFormModal
        isOpen={formModal.open}
        vehicle={formModal.vehicle}
        onClose={() => setFormModal({ open: false, vehicle: null })}
        onSaved={() => { setFormModal({ open: false, vehicle: null }); load(); }}
      />

      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, vehicle: null, loading: false })}
        onConfirm={handleDelete}
        loading={deleteDialog.loading}
        title="Remove vehicle from fleet?"
        message={`This will permanently delete ${deleteDialog.vehicle?.vehicleName} (${deleteDialog.vehicle?.registrationNumber}). This action can't be undone.`}
        confirmLabel="Remove"
      />
    </div>
  );
}
