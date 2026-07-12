import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, Users, Search, ShieldAlert } from 'lucide-react';
import { toast } from 'react-toastify';
import StatusBadge from '@/components/common/StatusBadge';
import Loading, { TableSkeleton } from '@/components/common/Loading';
import EmptyState from '@/components/common/EmptyState';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import DriverFormModal from '@/components/driver/DriverFormModal';
import { getDrivers, deleteDriver } from '@/services/driverService';
import { formatDate, licenseStatus, daysUntilExpiry, cn } from '@/utils/helpers';
import { useDebounce } from '@/hooks/useDebounce';

function LicenseExpiry({ date }) {
  const status = licenseStatus(date);
  const days = daysUntilExpiry(date);
  const labels = { expired: 'text-red-600 font-semibold', 'expiring-soon': 'text-amber-600 font-medium', valid: 'text-neutral-600', unknown: 'text-neutral-400' };
  const hint = days === null ? '—' : days < 0 ? `${Math.abs(days)}d ago` : days === 0 ? 'Today' : `${days}d left`;

  return (
    <div>
      <p className={cn('text-xs', labels[status])}>{formatDate(date)}</p>
      <p className={cn('text-[11px]', labels[status])}>{hint}</p>
    </div>
  );
}

export default function DriversPage() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [formModal, setFormModal] = useState({ open: false, driver: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, driver: null, loading: false });

  const debouncedSearch = useDebounce(search, 300);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getDrivers({ status: statusFilter, search: debouncedSearch });
      setDrivers(data);
    } catch { toast.error('Failed to load drivers'); }
    finally { setLoading(false); }
  }, [statusFilter, debouncedSearch]);

  useEffect(() => { load(); }, [load]);

  async function handleDelete() {
    setDeleteDialog((d) => ({ ...d, loading: true }));
    try {
      await deleteDriver(deleteDialog.driver.id);
      toast.success(`${deleteDialog.driver.name} removed`);
      setDeleteDialog({ open: false, driver: null, loading: false });
      load();
    } catch {
      toast.error('Failed to remove driver');
      setDeleteDialog((d) => ({ ...d, loading: false }));
    }
  }

  const expiredCount = drivers.filter((d) => licenseStatus(d.licenseExpiry) === 'expired').length;
  const expiringCount = drivers.filter((d) => licenseStatus(d.licenseExpiry) === 'expiring-soon').length;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Drivers</h1>
          <p className="text-sm text-neutral-500">Manage driver profiles and compliance status.</p>
        </div>
        <button
          onClick={() => setFormModal({ open: true, driver: null })}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />Add Driver
        </button>
      </div>

      {/* Alert banners */}
      {(expiredCount > 0 || expiringCount > 0) && (
        <div className="flex flex-col sm:flex-row gap-3">
          {expiredCount > 0 && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 text-sm text-red-700">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span><strong>{expiredCount}</strong> driver{expiredCount > 1 ? 's' : ''} with expired license — cannot be assigned to trips</span>
            </div>
          )}
          {expiringCount > 0 && (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 text-sm text-amber-700">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span><strong>{expiringCount}</strong> driver{expiringCount > 1 ? 's' : ''} expiring within 30 days</span>
            </div>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or license…"
            className="w-full pl-9 pr-4 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white">
          <option value="">All Statuses</option>
          {['Available', 'On Trip', 'Off Duty', 'Suspended'].map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        {loading ? <TableSkeleton rows={6} cols={7} /> : drivers.length === 0 ? (
          <EmptyState icon={Users} title="No drivers found" description={search || statusFilter ? 'Try adjusting filters.' : 'Register your first driver.'} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  {['Name', 'License Number', 'Category', 'License Expiry', 'Safety Score', 'Status', ''].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {drivers.map((d) => (
                  <tr key={d.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-neutral-800">{d.name}</p>
                      <p className="text-xs text-neutral-400">{d.region}</p>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-neutral-600">{d.licenseNumber}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded text-xs font-medium">{d.licenseCategory}</span>
                    </td>
                    <td className="px-4 py-3"><LicenseExpiry date={d.licenseExpiry} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-green-500" style={{ width: `${d.safetyScore}%` }} />
                        </div>
                        <span className="text-xs font-medium text-neutral-700">{d.safetyScore}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setFormModal({ open: true, driver: d })}
                          className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-500 hover:text-primary-600 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setDeleteDialog({ open: true, driver: d, loading: false })}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-neutral-500 hover:text-red-600 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <DriverFormModal isOpen={formModal.open} driver={formModal.driver}
        onClose={() => setFormModal({ open: false, driver: null })}
        onSaved={() => { setFormModal({ open: false, driver: null }); load(); }} />
      <ConfirmDialog isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, driver: null, loading: false })}
        onConfirm={handleDelete} loading={deleteDialog.loading}
        title="Remove driver?" message={`Remove ${deleteDialog.driver?.name} from the roster?`} confirmLabel="Remove" />
    </div>
  );
}
