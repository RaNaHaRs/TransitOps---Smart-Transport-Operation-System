import { useEffect, useState } from 'react';
import { Download, BarChart3 } from 'lucide-react';
import { toast } from 'react-toastify';
import { getFuelLogs, getExpenses } from '@/services/expenseService';
import { getTrips } from '@/services/tripService';
import { getVehiclesSync } from '@/services/vehicleService';
import { formatDate, formatCurrency, formatNumber, exportToCSV } from '@/utils/helpers';
import Loading, { TableSkeleton } from '@/components/common/Loading';
import EmptyState from '@/components/common/EmptyState';

const TABS = ['Fuel Logs', 'Expenses', 'Completed Trips'];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [fuel, setFuel] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [completedTrips, setCompletedTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [f, e, t] = await Promise.all([getFuelLogs(), getExpenses(), getTrips({ status: 'Completed' })]);
      const vehicles = getVehiclesSync();
      setFuel(f.map((x) => ({ ...x, vehicle: vehicles.find((v) => v.id === x.vehicleId) })));
      setExpenses(e.map((x) => ({ ...x, vehicle: vehicles.find((v) => v.id === x.vehicleId) })));
      setCompletedTrips(t);
      setLoading(false);
    }
    load();
  }, []);

  function filterByDate(arr, dateField) {
    return arr.filter((r) => {
      const d = r[dateField];
      if (dateFrom && d < dateFrom) return false;
      if (dateTo && d > dateTo) return false;
      return true;
    });
  }

  const filteredFuel = filterByDate(fuel, 'date');
  const filteredExpenses = filterByDate(expenses, 'date');
  const filteredTrips = filterByDate(completedTrips, 'completedAt');

  const totalFuel = filteredFuel.reduce((s, f) => s + f.totalCost, 0);
  const totalExpenses = filteredExpenses.reduce((s, e) => s + e.amount, 0);
  const totalDist = filteredTrips.reduce((s, t) => s + (t.actualDistance || 0), 0);

  if (loading) return <Loading />;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Reports</h1>
          <p className="text-sm text-neutral-500">Operational data, expenses, and performance.</p>
        </div>
        <button
          onClick={() => {
            if (activeTab === 0) exportToCSV(filteredFuel.map((f) => ({ Date: f.date, Vehicle: f.vehicle?.vehicleName || f.vehicleId, 'Liters': f.liters, 'Total Cost': f.totalCost })), 'fuel-logs.csv');
            if (activeTab === 1) exportToCSV(filteredExpenses.map((e) => ({ Date: e.date, Vehicle: e.vehicle?.vehicleName || e.vehicleId, Type: e.type, Amount: e.amount })), 'expenses.csv');
            if (activeTab === 2) exportToCSV(filteredTrips.map((t) => ({ Route: `${t.source} → ${t.destination}`, Distance: t.actualDistance, Fuel: t.fuelConsumed, Completed: t.completedAt })), 'completed-trips.csv');
            toast.success('CSV exported');
          }}
          className="flex items-center gap-2 border border-neutral-300 hover:bg-neutral-50 text-neutral-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />Export CSV
        </button>
      </div>

      {/* Date filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <label className="text-xs font-medium text-neutral-500">From</label>
        <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
          className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
        <label className="text-xs font-medium text-neutral-500">To</label>
        <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
          className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
        {(dateFrom || dateTo) && <button onClick={() => { setDateFrom(''); setDateTo(''); }} className="text-xs text-neutral-400 hover:text-neutral-600">Clear</button>}
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-neutral-200 p-4 text-center shadow-sm">
          <p className="text-xs text-neutral-500 mb-1">Total Fuel Cost</p>
          <p className="text-xl font-bold text-neutral-900">{formatCurrency(totalFuel)}</p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-4 text-center shadow-sm">
          <p className="text-xs text-neutral-500 mb-1">Total Expenses</p>
          <p className="text-xl font-bold text-neutral-900">{formatCurrency(totalExpenses)}</p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-4 text-center shadow-sm">
          <p className="text-xs text-neutral-500 mb-1">Total Distance</p>
          <p className="text-xl font-bold text-neutral-900">{formatNumber(totalDist)} km</p>
        </div>
      </div>

      {/* Tabs */}
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
          filteredFuel.length === 0 ? <EmptyState icon={BarChart3} title="No fuel logs" description="No fuel records in this date range." /> :
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  {['Date', 'Vehicle', 'Liters', 'Per Liter', 'Total Cost', 'Odometer'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredFuel.map((f) => (
                  <tr key={f.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3 text-neutral-500">{formatDate(f.date)}</td>
                    <td className="px-4 py-3 font-medium text-neutral-800">{f.vehicle?.vehicleName || f.vehicleId}</td>
                    <td className="px-4 py-3 text-neutral-600">{f.liters} L</td>
                    <td className="px-4 py-3 text-neutral-600">₹{f.costPerLiter}</td>
                    <td className="px-4 py-3 font-medium text-neutral-700">{formatCurrency(f.totalCost)}</td>
                    <td className="px-4 py-3 text-neutral-500">{formatNumber(f.odometer)} km</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 1 && (
          filteredExpenses.length === 0 ? <EmptyState icon={BarChart3} title="No expenses" description="No expense records in this date range." /> :
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  {['Date', 'Vehicle', 'Type', 'Description', 'Amount'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredExpenses.map((e) => (
                  <tr key={e.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3 text-neutral-500">{formatDate(e.date)}</td>
                    <td className="px-4 py-3 font-medium text-neutral-800">{e.vehicle?.vehicleName || e.vehicleId}</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded text-xs">{e.type}</span></td>
                    <td className="px-4 py-3 text-neutral-500">{e.description}</td>
                    <td className="px-4 py-3 font-medium text-neutral-700">{formatCurrency(e.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 2 && (
          filteredTrips.length === 0 ? <EmptyState icon={BarChart3} title="No completed trips" description="No completed trips in this date range." /> :
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  {['Route', 'Completed', 'Distance', 'Fuel Used', 'Efficiency', 'Cargo'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredTrips.map((t) => (
                  <tr key={t.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3 font-medium text-neutral-800">{t.source} → {t.destination}</td>
                    <td className="px-4 py-3 text-neutral-500">{formatDate(t.completedAt)}</td>
                    <td className="px-4 py-3 text-neutral-600">{formatNumber(t.actualDistance)} km</td>
                    <td className="px-4 py-3 text-neutral-600">{t.fuelConsumed} L</td>
                    <td className="px-4 py-3 text-neutral-600">
                      {t.actualDistance && t.fuelConsumed ? `${(t.actualDistance / t.fuelConsumed).toFixed(2)} km/L` : '—'}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">{formatNumber(t.cargoWeight)} kg</td>
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
