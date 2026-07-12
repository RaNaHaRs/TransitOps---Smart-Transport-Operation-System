import { useEffect, useState } from 'react';
import { Users, ShieldAlert, AlertCircle, XCircle } from 'lucide-react';
import { getDrivers } from '@/services/driverService';
import { licenseStatus, daysUntilExpiry } from '@/utils/helpers';
import KPICard from '@/components/dashboard/KPICard';
import Loading from '@/components/common/Loading';

export default function SafetyDashboard() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDrivers().then((d) => { setDrivers(d); setLoading(false); });
  }, []);

  if (loading) return <Loading />;

  const expired = drivers.filter((d) => licenseStatus(d.licenseExpiry) === 'expired').length;
  const expiringSoon = drivers.filter((d) => licenseStatus(d.licenseExpiry) === 'expiring-soon').length;
  const suspended = drivers.filter((d) => d.status === 'Suspended').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">Safety Dashboard</h1>
        <p className="text-sm text-neutral-500">Driver compliance and license monitoring.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Drivers" value={drivers.length} icon={Users} color="blue" />
        <KPICard title="Expired Licenses" value={expired} icon={XCircle} color="red" subtitle="Cannot be dispatched" />
        <KPICard title="Expiring ≤30 Days" value={expiringSoon} icon={AlertCircle} color="amber" subtitle="Renewal required soon" />
        <KPICard title="Suspended" value={suspended} icon={ShieldAlert} color="red" />
      </div>

      {/* Breakdown */}
      <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-neutral-700 mb-4">License Compliance Snapshot</h2>
        <div className="space-y-3">
          {[
            { label: 'Valid', count: drivers.filter((d) => licenseStatus(d.licenseExpiry) === 'valid').length, color: 'bg-green-500' },
            { label: 'Expiring Soon (≤30 days)', count: expiringSoon, color: 'bg-amber-500' },
            { label: 'Expired', count: expired, color: 'bg-red-500' },
          ].map((item) => {
            const pct = drivers.length ? Math.round((item.count / drivers.length) * 100) : 0;
            return (
              <div key={item.label} className="flex items-center gap-3">
                <span className="text-xs text-neutral-500 w-36 flex-shrink-0">{item.label}</span>
                <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs font-medium text-neutral-700 w-8 text-right">{item.count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
