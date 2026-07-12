export const ROLE_CONFIG = {
  ADMIN: {
    label: 'Fleet Manager',
    dashboard: '/admin/dashboard',
    sidebar: [
      { label: 'Dashboard', path: '/admin/dashboard', icon: 'LayoutDashboard' },
      { label: 'Vehicles', path: '/admin/vehicles', icon: 'Truck' },
      { label: 'Drivers', path: '/admin/drivers', icon: 'Users' },
      { label: 'Trips', path: '/admin/trips', icon: 'Route' },
      { label: 'Maintenance', path: '/admin/maintenance', icon: 'Wrench' },
      { label: 'Reports', path: '/admin/reports', icon: 'BarChart3' },
      { label: 'Settings', path: '/admin/settings', icon: 'Settings' },
    ],
  },
  DRIVER: {
    label: 'Driver',
    dashboard: '/driver/dashboard',
    sidebar: [
      { label: 'Dashboard', path: '/driver/dashboard', icon: 'LayoutDashboard' },
      { label: 'My Trips', path: '/driver/trips', icon: 'Route' },
    ],
  },
  SAFETY_OFFICER: {
    label: 'Safety Officer',
    dashboard: '/safety/dashboard',
    sidebar: [
      { label: 'Dashboard', path: '/safety/dashboard', icon: 'LayoutDashboard' },
      { label: 'Driver Safety', path: '/safety/drivers', icon: 'ShieldCheck' },
    ],
  },
  FINANCIAL_ANALYST: {
    label: 'Financial Analyst',
    dashboard: '/finance/dashboard',
    sidebar: [
      { label: 'Dashboard', path: '/finance/dashboard', icon: 'LayoutDashboard' },
      { label: 'Reports', path: '/finance/reports', icon: 'BarChart3' },
    ],
  },
};
