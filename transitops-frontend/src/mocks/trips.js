// Trips over the last ~60 days, linking to vehicles and drivers from mock data
const today = new Date();
const daysAgo = (n) => {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
};

export const mockTrips = [
  { id: 't1', source: 'Mumbai', destination: 'Pune', vehicleId: 'v2', driverId: 'd3', cargoWeight: 720, plannedDistance: 148, actualDistance: 152, startOdometer: 72000, endOdometer: 72152, fuelConsumed: 22.4, status: 'Completed', createdAt: daysAgo(55), dispatchedAt: daysAgo(55), completedAt: daysAgo(54) },
  { id: 't2', source: 'Delhi', destination: 'Agra', vehicleId: 'v6', driverId: 'd6', cargoWeight: 480, plannedDistance: 206, actualDistance: null, startOdometer: 55200, endOdometer: null, fuelConsumed: null, status: 'Dispatched', createdAt: daysAgo(3), dispatchedAt: daysAgo(2), completedAt: null },
  { id: 't3', source: 'Bangalore', destination: 'Chennai', vehicleId: 'v14', driverId: 'd12', cargoWeight: 1100, plannedDistance: 345, actualDistance: 352, startOdometer: 93300, endOdometer: 93652, fuelConsumed: 58.1, status: 'Completed', createdAt: daysAgo(40), dispatchedAt: daysAgo(40), completedAt: daysAgo(39) },
  { id: 't4', source: 'Hyderabad', destination: 'Vizag', vehicleId: 'v12', driverId: 'd4', cargoWeight: 1600, plannedDistance: 618, actualDistance: null, startOdometer: 78100, endOdometer: null, fuelConsumed: null, status: 'Draft', createdAt: daysAgo(1), dispatchedAt: null, completedAt: null },
  { id: 't5', source: 'Ahmedabad', destination: 'Surat', vehicleId: 'v5', driverId: 'd1', cargoWeight: 1750, plannedDistance: 264, actualDistance: 270, startOdometer: 98100, endOdometer: 98370, fuelConsumed: 45.2, status: 'Completed', createdAt: daysAgo(28), dispatchedAt: daysAgo(28), completedAt: daysAgo(27) },
  { id: 't6', source: 'Jaipur', destination: 'Jodhpur', vehicleId: 'v6', driverId: 'd6', cargoWeight: 390, plannedDistance: 332, actualDistance: null, startOdometer: 55400, endOdometer: null, fuelConsumed: null, status: 'Cancelled', createdAt: daysAgo(15), dispatchedAt: null, completedAt: null },
  { id: 't7', source: 'Chennai', destination: 'Madurai', vehicleId: 'v7', driverId: 'd7', cargoWeight: 260, plannedDistance: 460, actualDistance: 468, startOdometer: 40900, endOdometer: 41368, fuelConsumed: 39.8, status: 'Completed', createdAt: daysAgo(22), dispatchedAt: daysAgo(22), completedAt: daysAgo(21) },
  { id: 't8', source: 'Lucknow', destination: 'Kanpur', vehicleId: 'v8', driverId: 'd9', cargoWeight: 650, plannedDistance: 82, actualDistance: 85, startOdometer: 63600, endOdometer: 63685, fuelConsumed: 10.3, status: 'Completed', createdAt: daysAgo(10), dispatchedAt: daysAgo(10), completedAt: daysAgo(10) },
  { id: 't9', source: 'Mumbai', destination: 'Nashik', vehicleId: 'v1', driverId: 'd1', cargoWeight: 840, plannedDistance: 165, actualDistance: null, startOdometer: 48200, endOdometer: null, fuelConsumed: null, status: 'Draft', createdAt: daysAgo(0), dispatchedAt: null, completedAt: null },
  { id: 't10', source: 'Kochi', destination: 'Trivandrum', vehicleId: 'v15', driverId: 'd10', cargoWeight: 580, plannedDistance: 205, actualDistance: 211, startOdometer: 38400, endOdometer: 38611, fuelConsumed: 26.7, status: 'Completed', createdAt: daysAgo(35), dispatchedAt: daysAgo(35), completedAt: daysAgo(34) },
  { id: 't11', source: 'Pune', destination: 'Kolhapur', vehicleId: 'v3', driverId: 'd4', cargoWeight: 520, plannedDistance: 228, actualDistance: 234, startOdometer: 31500, endOdometer: 31734, fuelConsumed: 28.1, status: 'Completed', createdAt: daysAgo(18), dispatchedAt: daysAgo(18), completedAt: daysAgo(17) },
  { id: 't12', source: 'Delhi', destination: 'Chandigarh', vehicleId: 'v8', driverId: 'd14', cargoWeight: 700, plannedDistance: 248, actualDistance: null, startOdometer: 63800, endOdometer: null, fuelConsumed: null, status: 'Dispatched', createdAt: daysAgo(2), dispatchedAt: daysAgo(1), completedAt: null },
  { id: 't13', source: 'Ludhiana', destination: 'Amritsar', vehicleId: 'v13', driverId: 'd9', cargoWeight: 280, plannedDistance: 75, actualDistance: 78, startOdometer: 19300, endOdometer: 19378, fuelConsumed: 7.2, status: 'Completed', createdAt: daysAgo(48), dispatchedAt: daysAgo(48), completedAt: daysAgo(48) },
  { id: 't14', source: 'Hyderabad', destination: 'Bangalore', vehicleId: 'v12', driverId: 'd1', cargoWeight: 1500, plannedDistance: 570, actualDistance: 582, startOdometer: 77700, endOdometer: 78282, fuelConsumed: 82.4, status: 'Completed', createdAt: daysAgo(60), dispatchedAt: daysAgo(60), completedAt: daysAgo(58) },
  { id: 't15', source: 'Gurgaon', destination: 'Jaipur', vehicleId: 'v10', driverId: 'd14', cargoWeight: 350, plannedDistance: 265, actualDistance: null, startOdometer: 28800, endOdometer: null, fuelConsumed: null, status: 'Draft', createdAt: daysAgo(0), dispatchedAt: null, completedAt: null },
];
