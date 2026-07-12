const today = new Date();
const daysAgo = (n) => {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
};

export const mockFuelLogs = [
  { id: 'f1', vehicleId: 'v1', liters: 40, costPerLiter: 96.5, totalCost: 3860, date: daysAgo(2), odometer: 48290, tripId: null },
  { id: 'f2', vehicleId: 'v2', liters: 55, costPerLiter: 95.8, totalCost: 5269, date: daysAgo(5), odometer: 72480, tripId: 't1' },
  { id: 'f3', vehicleId: 'v5', liters: 70, costPerLiter: 96.2, totalCost: 6734, date: daysAgo(8), odometer: 98200, tripId: 't5' },
  { id: 'f4', vehicleId: 'v6', liters: 38, costPerLiter: 95.5, totalCost: 3629, date: daysAgo(10), odometer: 55560, tripId: 't2' },
  { id: 'f5', vehicleId: 'v7', liters: 42, costPerLiter: 96.8, totalCost: 4066, date: daysAgo(14), odometer: 41100, tripId: 't7' },
  { id: 'f6', vehicleId: 'v8', liters: 25, costPerLiter: 96.0, totalCost: 2400, date: daysAgo(15), odometer: 63750, tripId: 't8' },
  { id: 'f7', vehicleId: 'v12', liters: 90, costPerLiter: 95.5, totalCost: 8595, date: daysAgo(20), odometer: 77800, tripId: 't14' },
  { id: 'f8', vehicleId: 'v14', liters: 65, costPerLiter: 96.3, totalCost: 6260, date: daysAgo(25), odometer: 93500, tripId: 't3' },
  { id: 'f9', vehicleId: 'v15', liters: 30, costPerLiter: 95.9, totalCost: 2877, date: daysAgo(28), odometer: 38490, tripId: 't10' },
  { id: 'f10', vehicleId: 'v3', liters: 34, costPerLiter: 96.1, totalCost: 3267, date: daysAgo(32), odometer: 31600, tripId: 't11' },
  { id: 'f11', vehicleId: 'v13', liters: 18, costPerLiter: 95.7, totalCost: 1723, date: daysAgo(40), odometer: 19310, tripId: 't13' },
  { id: 'f12', vehicleId: 'v1', liters: 45, costPerLiter: 94.8, totalCost: 4266, date: daysAgo(45), odometer: 48110, tripId: null },
  { id: 'f13', vehicleId: 'v5', liters: 68, costPerLiter: 94.5, totalCost: 6426, date: daysAgo(50), odometer: 97900, tripId: null },
  { id: 'f14', vehicleId: 'v10', liters: 32, costPerLiter: 96.4, totalCost: 3085, date: daysAgo(55), odometer: 28820, tripId: null },
];

export const mockExpenses = [
  { id: 'e1', vehicleId: 'v2', type: 'Toll', description: 'Mumbai–Pune expressway toll', amount: 380, date: daysAgo(5), tripId: 't1' },
  { id: 'e2', vehicleId: 'v12', type: 'Toll', description: 'Hyderabad–Bangalore NH-44 tolls', amount: 1240, date: daysAgo(20), tripId: 't14' },
  { id: 'e3', vehicleId: 'v14', type: 'Driver Allowance', description: 'Long-haul allowance — 2 days', amount: 1600, date: daysAgo(25), tripId: 't3' },
  { id: 'e4', vehicleId: 'v5', type: 'Toll', description: 'Ahmedabad–Surat NH-48 tolls', amount: 520, date: daysAgo(8), tripId: 't5' },
  { id: 'e5', vehicleId: 'v7', type: 'Driver Allowance', description: 'Overnight trip allowance', amount: 900, date: daysAgo(14), tripId: 't7' },
  { id: 'e6', vehicleId: 'v4', type: 'Parts', description: 'Brake pads + hardware — Bosch', amount: 6200, date: daysAgo(8), tripId: null },
  { id: 'e7', vehicleId: 'v9', type: 'Parts', description: 'Air filter + oil filter set', amount: 2800, date: daysAgo(5), tripId: null },
  { id: 'e8', vehicleId: 'v8', type: 'Toll', description: 'Lucknow–Kanpur expressway', amount: 120, date: daysAgo(10), tripId: 't8' },
  { id: 'e9', vehicleId: 'v15', type: 'Driver Allowance', description: 'Day trip allowance', amount: 500, date: daysAgo(28), tripId: 't10' },
  { id: 'e10', vehicleId: 'v13', type: 'Toll', description: 'Ludhiana–Amritsar bypass toll', amount: 90, date: daysAgo(40), tripId: 't13' },
];
