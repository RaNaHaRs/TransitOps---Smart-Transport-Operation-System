import { useEffect, useState, useCallback } from 'react';
import { Plus, Wrench, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import StatusBadge from '@/components/common/StatusBadge';
import Loading, { TableSkeleton } from '@/components/common/Loading';
import EmptyState from '@/components/common/EmptyState';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import MaintenanceFormModal from '@/components/maintenance/MaintenanceFormModal';
import { getMaintenance, closeMaintenance } from '@/services/maintenanceService';
import { getVehicles } from '@/services/vehicleService';
import { formatDate, formatCurrency } from '@/utils/helpers';

export default function MaintenancePage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [formModal, setFormModal] = useState(false);
  const [closeDialog, setCloseDialog] = useState({ open: false, record: null, loading: false });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [maintenanceData, vehiclesData] = await Promise.all([
        getMaintenance({ status: statusFilter }),
        getVehicles(),
      ]);
      setRecords(
        maintenanceData.map((r) => ({
          ...r,
          vehicle: vehiclesData.find((v) => Number(v.id) === Number(r.vehicleId) || v.id === r.vehicleId),
        }))
      );
    } catch { toast.error('Failed to load maintenance records'); }
    finally { setLoading(false); }
  }, [statusFilter]);

  useEffect(() => { load(); }, [load]);

  async function handleClose() {
    setCloseDialog((d) => ({ ...d, loading: true }));
    try {
      await closeMaintenance(closeDialog.record.id);
      toast.success('Maintenance closed — vehicle restored to Available');
      setCloseDialog({ open: false, record: null, loading: false });
      load();
    } catch { toast.error('Failed to close'); setCloseDialog((d) => ({ ...d, loading: false })); }
  }

  const totalOpenCost = records.filter((r) => r.status === 'Open').reduce((s, r) => s + r.cost, 0);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Maintenance</h1>
          <p className="text-sm text-neutral-500">Track service records and vehicle availability.</p>
        </div>
        <button onClick={() => setFormModal(true)}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          <Plus className="w-4 h-4" />Log Maintenance
        </button>
      </div>

      {records.filter((r) => r.status === 'Open').length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-700">
          <strong>{records.filter((r) => r.status === 'Open').length}</strong> open maintenance records — total cost: <strong>{formatCurrency(totalOpenCost)}</strong>
        </div>
      )}

      <div className="flex gap-3">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white">
          <option value="">All Records</option>
          <option>Open</option>
          <option>Closed</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        {loading ? <TableSkeleton rows={5} cols={6} /> : records.length === 0 ? (
          <EmptyState icon={Wrench} title="No maintenance records" description="Log your first maintenance record to track vehicle servicing." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  {['Vehicle', 'Type', 'Description', 'Start Date', 'Cost', 'Status', ''].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {records.map((r) => (
                  <tr key={r.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-neutral-800">{r.vehicle?.vehicleName || r.vehicleId}</p>
                      <p className="text-xs font-mono text-neutral-400">{r.vehicle?.registrationNumber}</p>
                    </td>
                    <td className="px-4 py-3 text-neutral-600">{r.type}</td>
                    <td className="px-4 py-3 text-neutral-500 max-w-xs truncate">{r.description}</td>
                    <td className="px-4 py-3 text-neutral-500">{formatDate(r.startDate)}</td>
                    <td className="px-4 py-3 font-medium text-neutral-700">{formatCurrency(r.cost)}</td>
                    <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                    <td className="px-4 py-3">
                      {r.status === 'Open' && (
                        <button onClick={() => setCloseDialog({ open: true, record: r, loading: false })}
                          className="flex items-center gap-1 px-2 py-1 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-medium rounded-md transition-colors">
                          <CheckCircle className="w-3 h-3" />Close
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <MaintenanceFormModal isOpen={formModal} onClose={() => setFormModal(false)} onSaved={() => { setFormModal(false); load(); }} />
      <ConfirmDialog isOpen={closeDialog.open} danger={false}
        onClose={() => setCloseDialog({ open: false, record: null, loading: false })}
        onConfirm={handleClose} loading={closeDialog.loading}
        title="Close maintenance record?"
        message={`This will mark the record as Closed and restore ${closeDialog.record?.vehicle?.vehicleName || 'the vehicle'} to Available status.`}
        confirmLabel="Close Record" />
    </div>
  );
}
