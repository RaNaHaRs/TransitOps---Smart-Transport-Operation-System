const today = new Date();
const daysAgo = (n) => {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
};

export const mockMaintenance = [
  { id: 'm1', vehicleId: 'v4', type: 'Brake Service', description: 'Front and rear brake pads replaced', cost: 12500, startDate: daysAgo(8), closedDate: null, status: 'Open' },
  { id: 'm2', vehicleId: 'v9', type: 'General Inspection', description: 'Full 30,000 km service — oil, filters, belts', cost: 18200, startDate: daysAgo(5), closedDate: null, status: 'Open' },
  { id: 'm3', vehicleId: 'v11', type: 'Engine Overhaul', description: 'Major engine rebuild before retirement decision', cost: 85000, startDate: daysAgo(45), closedDate: daysAgo(30), status: 'Closed' },
  { id: 'm4', vehicleId: 'v2', type: 'Oil Change', description: 'Synthetic 15W-40 oil change + filter', cost: 3800, startDate: daysAgo(20), closedDate: daysAgo(18), status: 'Closed' },
  { id: 'm5', vehicleId: 'v5', type: 'Tire Replacement', description: 'All 6 tires replaced — MRF ZVTS set', cost: 42000, startDate: daysAgo(12), closedDate: daysAgo(9), status: 'Closed' },
  { id: 'm6', vehicleId: 'v1', type: 'AC Repair', description: 'Compressor seal replaced, refrigerant recharged', cost: 7600, startDate: daysAgo(3), closedDate: null, status: 'Closed' },
  { id: 'm7', vehicleId: 'v14', type: 'Electrical', description: 'Alternator and battery replacement', cost: 9400, startDate: daysAgo(35), closedDate: daysAgo(33), status: 'Closed' },
  { id: 'm8', vehicleId: 'v7', type: 'Oil Change', description: 'Routine oil change + cabin filter', cost: 2400, startDate: daysAgo(50), closedDate: daysAgo(49), status: 'Closed' },
];
