import { useEffect, useState, useCallback } from 'react';
import { ShieldCheck, UserX, UserCheck } from 'lucide-react';
import { toast } from 'react-toastify';
import { getDrivers, updateDriverStatus } from '@/services/driverService';
import { formatDate, licenseStatus, daysUntilExpiry, cn } from '@/utils/helpers';
import StatusBadge from '@/components/common/StatusBadge';
import Loading, { TableSkeleton } from '@/components/common/Loading';
import EmptyState from '@/components/common/EmptyState';
import ConfirmDialog from '@/components/common/ConfirmDialog';

function LicenseBadge({ date }) {
  const status = licenseStatus(date);
  const days = daysUntilExpiry(date);
  const styles = {
    expired: 'bg-red-100 text-red-700 border-red-200',
    'expiring-soon': 'bg-amber-100 text-amber-700 border-amber-200',
    valid: 'bg-green-100 text-green-700 border-green-200',
  };
  return (
    <div>
      <p className="text-xs text-neutral-600">{formatDate(date)}</p>
      <span className={cn('inline-flex text-[11px] font-medium px-2 py-0.5 rounded-full border mt-0.5', styles[status] || 'bg-neutral-100 text-neutral-500 border-neutral-200')}>
        {status === 'expired' ? `Expired ${Math.abs(days)}d ago` : status === 'expiring-soon' ? `${days}d left` : 'Valid'}
      </span>
    </div>
  );
}

export default function SafetyDriversPage() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({ open: false, driver: null, action: null, loading: false });

  const load = useCallback(async () => {
    setLoading(true);
    try { const data = await getDrivers({ status: statusFilter }); setDrivers(data); }
    catch { toast.error('Failed to load drivers'); }
    finally { setLoading(false); }
  }, [statusFilter]);

  useEffect(() => { load(); }, [load]);

  async function executeAction() {
    const { driver, action } = confirmDialog;
    setConfirmDialog((d) => ({ ...d, loading: true }));
    try {
      const newStatus = action === 'suspend' ? 'Suspended' : 'Available';
      await updateDriverStatus(driver.id, newStatus);
      toast.success(`${driver.name} ${action === 'suspend' ? 'suspended' : 'reactivated'}`);
      setConfirmDialog({ open: false, driver: null, action: null, loading: false });
      load();
    } catch {
      toast.error('Action failed');
      setConfirmDialog((d) => ({ ...d, loading: false }));
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">Driver Safety</h1>
        <p className="text-sm text-neutral-500">Review license compliance and manage driver status.</p>
      </div>

      <div className="flex gap-3">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white">
          <option value="">All Statuses</option>
          {['Available', 'On Trip', 'Off Duty', 'Suspended'].map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        {loading ? <TableSkeleton rows={6} cols={5} /> : drivers.length === 0 ? (
          <EmptyState icon={ShieldCheck} title="No drivers found" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  {['Driver', 'License Expiry', 'Safety Score', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {drivers.map((d) => (
                  <tr key={d.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-neutral-800">{d.name}</p>
                      <p className="text-xs text-neutral-400">{d.licenseCategory} · {d.region}</p>
                    </td>
                    <td className="px-4 py-3"><LicenseBadge date={d.licenseExpiry} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: `${d.safetyScore}%` }} />
                        </div>
                        <span className="text-xs font-medium text-neutral-700">{d.safetyScore}/100</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {d.status !== 'Suspended' ? (
                          <button onClick={() => setConfirmDialog({ open: true, driver: d, action: 'suspend', loading: false })}
                            className="flex items-center gap-1 px-2 py-1 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-medium rounded-md transition-colors">
                            <UserX className="w-3 h-3" />Suspend
                          </button>
                        ) : (
                          <button onClick={() => setConfirmDialog({ open: true, driver: d, action: 'activate', loading: false })}
                            className="flex items-center gap-1 px-2 py-1 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-medium rounded-md transition-colors">
                            <UserCheck className="w-3 h-3" />Activate
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

      <ConfirmDialog
        isOpen={confirmDialog.open}
        danger={confirmDialog.action === 'suspend'}
        onClose={() => setConfirmDialog({ open: false, driver: null, action: null, loading: false })}
        onConfirm={executeAction}
        loading={confirmDialog.loading}
        title={confirmDialog.action === 'suspend' ? 'Suspend driver?' : 'Reactivate driver?'}
        message={confirmDialog.action === 'suspend'
          ? `${confirmDialog.driver?.name} will be suspended and cannot be assigned to trips.`
          : `${confirmDialog.driver?.name} will be reactivated and available for trips.`}
        confirmLabel={confirmDialog.action === 'suspend' ? 'Suspend' : 'Activate'}
      />
    </div>
  );
}
