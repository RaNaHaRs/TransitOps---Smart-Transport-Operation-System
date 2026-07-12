import { useEffect, useState } from 'react';
import { getFuelLogs, getExpenses } from '@/services/expenseService';
import { getMaintenance } from '@/services/maintenanceService';
import { getVehiclesSync } from '@/services/vehicleService';
import { formatDate, formatCurrency, formatNumber } from '@/utils/helpers';
import Loading, { TableSkeleton } from '@/components/common/Loading';
import EmptyState from '@/components/common/EmptyState';
import { BarChart3 } from 'lucide-react';

const TABS = ['Fuel', 'Expenses', 'Maintenance'];

export default function FinanceReportsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [fuel, setFuel] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const vehicles = getVehiclesSync();
      const [f, e, m] = await Promise.all([getFuelLogs(), getExpenses(), getMaintenance()]);
      setFuel(f.map((x) => ({ ...x, vehicle: vehicles.find((v) => v.id === x.vehicleId) })));
      setExpenses(e.map((x) => ({ ...x, vehicle: vehicles.find((v) => v.id === x.vehicleId) })));
      setMaintenance(m.map((x) => ({ ...x, vehicle: vehicles.find((v) => v.id === x.vehicleId) })));
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">Financial Reports</h1>
        <p className="text-sm text-neutral-500">Detailed expense and cost records.</p>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-neutral-200 p-4 text-center shadow-sm">
          <p className="text-xs text-neutral-500 mb-1">Total Fuel</p>
          <p className="text-xl font-bold text-neutral-900">{formatCurrency(fuel.reduce((s, f) => s + f.totalCost, 0))}</p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-4 text-center shadow-sm">
          <p className="text-xs text-neutral-500 mb-1">Other Expenses</p>
          <p className="text-xl font-bold text-neutral-900">{formatCurrency(expenses.reduce((s, e) => s + e.amount, 0))}</p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-4 text-center shadow-sm">
          <p className="text-xs text-neutral-500 mb-1">Maintenance</p>
          <p className="text-xl font-bold text-neutral-900">{formatCurrency(maintenance.reduce((s, m) => s + m.cost, 0))}</p>
        </div>
      </div>

      <div className="flex border-b border-neutral-200 gap-1">
        {TABS.map((tab, i) => (
          <button key={tab} onClick={() => setActiveTab(i)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${i === activeTab ? 'border-primary-500 text-primary-600' : 'border-transparent text-neutral-500 hover:text-neutral-700'}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        {activeTab === 0 && (
          fuel.length === 0 ? <EmptyState icon={BarChart3} title="No fuel records" /> :
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 border-b border-neutral-200"><tr>
                {['Date', 'Vehicle', 'Liters', 'Cost/L', 'Total'].map((h) => <th key={h} className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">{h}</th>)}
              </tr></thead>
              <tbody className="divide-y divide-neutral-100">
                {fuel.map((f) => (
                  <tr key={f.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3 text-neutral-500">{formatDate(f.date)}</td>
                    <td className="px-4 py-3 font-medium text-neutral-800">{f.vehicle?.vehicleName || f.vehicleId}</td>
                    <td className="px-4 py-3 text-neutral-600">{f.liters} L</td>
                    <td className="px-4 py-3 text-neutral-600">₹{f.costPerLiter}</td>
                    <td className="px-4 py-3 font-semibold text-neutral-700">{formatCurrency(f.totalCost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {activeTab === 1 && (
          expenses.length === 0 ? <EmptyState icon={BarChart3} title="No expenses" /> :
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 border-b border-neutral-200"><tr>
                {['Date', 'Vehicle', 'Type', 'Description', 'Amount'].map((h) => <th key={h} className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">{h}</th>)}
              </tr></thead>
              <tbody className="divide-y divide-neutral-100">
                {expenses.map((e) => (
                  <tr key={e.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3 text-neutral-500">{formatDate(e.date)}</td>
                    <td className="px-4 py-3 font-medium text-neutral-800">{e.vehicle?.vehicleName || e.vehicleId}</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded text-xs">{e.type}</span></td>
                    <td className="px-4 py-3 text-neutral-500 max-w-xs truncate">{e.description}</td>
                    <td className="px-4 py-3 font-semibold text-neutral-700">{formatCurrency(e.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {activeTab === 2 && (
          maintenance.length === 0 ? <EmptyState icon={BarChart3} title="No maintenance costs" /> :
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 border-b border-neutral-200"><tr>
                {['Date', 'Vehicle', 'Type', 'Description', 'Cost'].map((h) => <th key={h} className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">{h}</th>)}
              </tr></thead>
              <tbody className="divide-y divide-neutral-100">
                {maintenance.map((m) => (
                  <tr key={m.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3 text-neutral-500">{formatDate(m.startDate)}</td>
                    <td className="px-4 py-3 font-medium text-neutral-800">{m.vehicle?.vehicleName || m.vehicleId}</td>
                    <td className="px-4 py-3 text-neutral-600">{m.type}</td>
                    <td className="px-4 py-3 text-neutral-500 max-w-xs truncate">{m.description}</td>
                    <td className="px-4 py-3 font-semibold text-neutral-700">{formatCurrency(m.cost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
