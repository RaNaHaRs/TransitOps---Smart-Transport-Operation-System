import { useEffect, useState } from 'react';
import { Truck, Users, Route, Wrench, DollarSign, CheckCircle, Clock } from 'lucide-react';
import KPICard from '@/components/dashboard/KPICard';
import StatusBadge from '@/components/common/StatusBadge';
import Loading from '@/components/common/Loading';
import { getVehicles } from '@/services/vehicleService';
import { getDrivers } from '@/services/driverService';
import { getTrips } from '@/services/tripService';
import { getMaintenance } from '@/services/maintenanceService';
import { getFuelLogs } from '@/services/expenseService';
import { formatDate, formatCurrency } from '@/utils/helpers';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [vehicles, drivers, trips, maintenance, fuel] = await Promise.all([
        getVehicles(),
        getDrivers(),
        getTrips(),
        getMaintenance(),
        getFuelLogs(),
      ]);

      const thisMonth = new Date().getMonth();
      const thisYear = new Date().getFullYear();
      const monthFuel = fuel
        .filter((f) => {
          const d = new Date(f.date);
          return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
        })
        .reduce((sum, f) => sum + f.totalCost, 0);

      // Calculate revenue from completed trips: cargoWeight * actualDistance * 0.15 (Rs. 0.15 / kg / km)
      const completedTrips = trips.filter((t) => t.status === 'Completed');
      const totalRevenue = completedTrips.reduce((sum, t) => {
        const dist = t.actualDistance || t.plannedDistance || 0;
        const cargo = t.cargoWeight || 0;
        return sum + (dist * cargo * 0.15);
      }, 0);

      setData({
        totalVehicles: vehicles.length,
        availableVehicles: vehicles.filter((v) => v.status === 'Available').length,
        activeTrips: trips.filter((t) => t.status === 'Dispatched').length,
        inMaintenance: vehicles.filter((v) => v.status === 'In Shop').length,
        totalDrivers: drivers.length,
        monthFuelCost: monthFuel,
        totalRevenue,
        recentTrips: trips.slice(0, 7),
        vehicles,
      });
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">Fleet Dashboard</h1>
        <p className="text-sm text-neutral-500 mt-0.5">Live overview of your entire fleet operation.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
        <KPICard title="Total Vehicles" value={data.totalVehicles} icon={Truck} color="blue" />
        <KPICard title="Available" value={data.availableVehicles} icon={CheckCircle} color="green" />
        <KPICard title="Active Trips" value={data.activeTrips} icon={Route} color="blue" />
        <KPICard title="In Maintenance" value={data.inMaintenance} icon={Wrench} color="amber" />
        <KPICard title="Total Drivers" value={data.totalDrivers} icon={Users} color="purple" />
        <KPICard title="Fuel This Month" value={formatCurrency(data.monthFuelCost)} icon={DollarSign} color="slate" />
        <KPICard title="Total Revenue" value={formatCurrency(data.totalRevenue)} icon={DollarSign} color="green" />
      </div>

      {/* Vehicle Status Bar */}
      <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-neutral-700 mb-4">Fleet Status Breakdown</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {['Available', 'On Trip', 'In Shop', 'Retired'].map((status) => {
            const count = data.vehicles.filter((v) => v.status === status).length;
            const pct = data.totalVehicles > 0 ? Math.round((count / data.totalVehicles) * 100) : 0;
            return (
              <div key={status} className="text-center">
                <StatusBadge status={status} className="mb-2" />
                <p className="text-2xl font-bold text-neutral-900">{count}</p>
                <p className="text-xs text-neutral-400">{pct}% of fleet</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Trips */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm">
        <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-700">Recent Trips</h2>
          <a href="/admin/trips" className="text-xs text-primary-600 hover:text-primary-700 font-medium">View all</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-50 text-left">
                <th className="px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Route</th>
                <th className="px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Cargo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {data.recentTrips.map((trip) => (
                <tr key={trip.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-neutral-800">
                    {trip.source} → {trip.destination}
                  </td>
                  <td className="px-4 py-3 text-neutral-500">{formatDate(trip.createdAt)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={trip.status} />
                  </td>
                  <td className="px-4 py-3 text-neutral-500">{trip.cargoWeight} kg</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
