import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from '@/context/AuthContext';
import PrivateRoute from '@/components/common/PrivateRoute';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

// Public
import LandingPage from '@/pages/public/LandingPage';
import LoginPage from '@/pages/public/LoginPage';

// Admin / Fleet Manager
import AdminDashboard from '@/pages/admin/AdminDashboard';
import VehiclesPage from '@/pages/admin/VehiclesPage';
import DriversPage from '@/pages/admin/DriversPage';
import TripsPage from '@/pages/admin/TripsPage';
import MaintenancePage from '@/pages/admin/MaintenancePage';
import ReportsPage from '@/pages/admin/ReportsPage';
import SettingsPage from '@/pages/admin/SettingsPage';

// Driver
import DriverDashboard from '@/pages/driver/DriverDashboard';
import DriverTripsPage from '@/pages/driver/DriverTripsPage';

// Safety Officer
import SafetyDashboard from '@/pages/safety/SafetyDashboard';
import SafetyDriversPage from '@/pages/safety/SafetyDriversPage';

// Financial Analyst
import FinanceDashboard from '@/pages/finance/FinanceDashboard';
import FinanceReportsPage from '@/pages/finance/FinanceReportsPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Fleet Manager routes */}
          <Route
            element={
              <PrivateRoute allowedRoles={['ADMIN']}>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/vehicles" element={<VehiclesPage />} />
            <Route path="/admin/drivers" element={<DriversPage />} />
            <Route path="/admin/trips" element={<TripsPage />} />
            <Route path="/admin/maintenance" element={<MaintenancePage />} />
            <Route path="/admin/reports" element={<ReportsPage />} />
            <Route path="/admin/settings" element={<SettingsPage />} />
          </Route>

          {/* Driver routes */}
          <Route
            element={
              <PrivateRoute allowedRoles={['DRIVER']}>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route path="/driver/dashboard" element={<DriverDashboard />} />
            <Route path="/driver/trips" element={<DriverTripsPage />} />
          </Route>

          {/* Safety Officer routes */}
          <Route
            element={
              <PrivateRoute allowedRoles={['SAFETY_OFFICER']}>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route path="/safety/dashboard" element={<SafetyDashboard />} />
            <Route path="/safety/drivers" element={<SafetyDriversPage />} />
          </Route>

          {/* Financial Analyst routes */}
          <Route
            element={
              <PrivateRoute allowedRoles={['FINANCIAL_ANALYST']}>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route path="/finance/dashboard" element={<FinanceDashboard />} />
            <Route path="/finance/reports" element={<FinanceReportsPage />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastClassName="text-sm"
        />
      </BrowserRouter>
    </AuthProvider>
  );
}
