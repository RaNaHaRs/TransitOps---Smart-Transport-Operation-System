import { useEffect, useState } from 'react';
import { DollarSign, Fuel, Wrench, Route } from 'lucide-react';
import { getFuelLogs, getExpenses } from '@/services/expenseService';
import { getMaintenance } from '@/services/maintenanceService';
import { getTrips } from '@/services/tripService';
import KPICard from '@/components/dashboard/KPICard';
import Loading from '@/components/common/Loading';
import { formatCurrency } from '@/utils/helpers';

export default function FinanceDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [fuel, expenses, maintenance, trips] = await Promise.all([
        getFuelLogs(), getExpenses(), getMaintenance(), getTrips({ status: 'Completed' })
      ]);
      const fuelTotal = fuel.reduce((s, f) => s + f.totalCost, 0);
      const expTotal = expenses.reduce((s, e) => s + e.amount, 0);
      const mTotal = maintenance.reduce((s, m) => s + m.cost, 0);
      setData({ fuelTotal, expTotal, mTotal, totalExpenses: fuelTotal + expTotal + mTotal, completedTrips: trips.length });
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">Finance Dashboard</h1>
        <p className="text-sm text-neutral-500">Cost overview and expense summary.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Expenses" value={formatCurrency(data.totalExpenses)} icon={DollarSign} color="blue" />
        <KPICard title="Fuel Cost" value={formatCurrency(data.fuelTotal)} icon={Fuel} color="amber" />
        <KPICard title="Maintenance Cost" value={formatCurrency(data.mTotal)} icon={Wrench} color="red" />
        <KPICard title="Completed Trips" value={data.completedTrips} icon={Route} color="green" />
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-neutral-700 mb-4">Cost Breakdown</h2>
        <div className="space-y-4">
          {[
            { label: 'Fuel', amount: data.fuelTotal, color: 'bg-amber-500' },
            { label: 'Other Expenses (Tolls, Allowances)', amount: data.expTotal, color: 'bg-blue-500' },
            { label: 'Maintenance', amount: data.mTotal, color: 'bg-red-500' },
          ].map((item) => {
            const pct = data.totalExpenses ? Math.round((item.amount / data.totalExpenses) * 100) : 0;
            return (
              <div key={item.label} className="flex items-center gap-3">
                <span className="text-xs text-neutral-500 w-52 flex-shrink-0">{item.label}</span>
                <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs font-semibold text-neutral-700 w-24 text-right">{formatCurrency(item.amount)}</span>
                <span className="text-xs text-neutral-400 w-8 text-right">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
