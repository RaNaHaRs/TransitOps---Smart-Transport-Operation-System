import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Truck, LogOut, ChevronDown, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getInitials, cn } from '@/utils/helpers';

const roleColors = {
  FLEET_MANAGER: 'bg-primary-100 text-primary-700',
  DRIVER: 'bg-emerald-100 text-emerald-700',
  SAFETY_OFFICER: 'bg-amber-100 text-amber-700',
  FINANCIAL_ANALYST: 'bg-purple-100 text-purple-700',
};

const roleLabels = {
  FLEET_MANAGER: 'Fleet Manager',
  DRIVER: 'Driver',
  SAFETY_OFFICER: 'Safety Officer',
  FINANCIAL_ANALYST: 'Financial Analyst',
};

export default function Navbar({ onMenuToggle }) {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header className="h-14 bg-white border-b border-neutral-200 flex items-center justify-between px-4 lg:px-6 flex-shrink-0 z-30">
      {/* Left: hamburger + logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 text-neutral-500 transition-colors"
          aria-label="Toggle sidebar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <Truck className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-neutral-900 text-sm tracking-tight hidden sm:block">TransitOps</span>
        </Link>
      </div>

      {/* Right: user menu */}
      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg hover:bg-neutral-100 transition-colors"
        >
          <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
            {getInitials(user?.name || 'U')}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium text-neutral-800 leading-tight">{user?.name}</p>
            <span className={cn('text-[10px] font-medium px-1.5 py-0.5 rounded-full', roleColors[role] || 'bg-neutral-100 text-neutral-500')}>
              {roleLabels[role] || role}
            </span>
          </div>
          <ChevronDown className={cn('w-4 h-4 text-neutral-400 transition-transform', menuOpen && 'rotate-180')} />
        </button>

        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl border border-neutral-200 shadow-lg z-20 overflow-hidden">
              <div className="px-4 py-3 border-b border-neutral-100">
                <p className="text-sm font-semibold text-neutral-800">{user?.name}</p>
                <p className="text-xs text-neutral-400 truncate">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
