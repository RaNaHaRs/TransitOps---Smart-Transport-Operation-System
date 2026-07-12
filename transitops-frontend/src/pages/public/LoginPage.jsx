import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Truck, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ROLE_CONFIG } from '@/utils/roleConfig';
import { USE_MOCK_DATA } from '@/utils/config';
import { mockUsers } from '@/mocks/users';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recentUsers, setRecentUsers] = useState([]);
  const passwordInputRef = useRef(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('transit_recent_users');
      if (stored) {
        setRecentUsers(JSON.parse(stored));
      }
    } catch (e) {}
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter your email and password');
      return;
    }
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(ROLE_CONFIG[user.role]?.dashboard || '/');
    } catch (err) {
      toast.error(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  }

  async function handleRecentClick(recentUser) {
    // Check if the quick login shortcut has expired (1 week)
    if (recentUser.expiry && Date.now() > recentUser.expiry) {
      setEmail(recentUser.email);
      setPassword('');
      toast.warning('Your quick login shortcut has expired, you need to login again.');
      if (passwordInputRef.current) {
        passwordInputRef.current.focus();
      }
      return;
    }

    if (USE_MOCK_DATA) {
      // Find the mock user to get their password for instant quick login
      const mUser = mockUsers.find(u => u.email === recentUser.email);
      if (mUser) {
        setLoading(true);
        try {
          const user = await login(mUser.email, mUser.password);
          toast.success(`Welcome back, ${user.name}!`);
          navigate(ROLE_CONFIG[user.role]?.dashboard || '/');
        } catch {
          toast.error('Quick login failed');
        } finally {
          setLoading(false);
        }
        return;
      }
    }
    
    // Fallback if not mock data or user not found
    setEmail(recentUser.email);
    setPassword('');
    toast.info(`Please enter your password for ${recentUser.name}`);
    if (passwordInputRef.current) {
      passwordInputRef.current.focus();
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-primary-950 to-neutral-950 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 justify-center mb-8">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-neutral-900 tracking-tight">TransitOps</span>
          </Link>

          <h1 className="text-xl font-bold text-neutral-900 text-center mb-1">Sign in to your account</h1>
          <p className="text-sm text-neutral-500 text-center mb-7">Fleet operations, simplified.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
                  placeholder="you@transitops.in"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  ref={passwordInputRef}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed text-sm mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign in'}
            </button>
          </form>

          {/* Recent Logins */}
          {recentUsers.length > 0 && (
            <div className="mt-6 pt-5 border-t border-neutral-200">
              <p className="text-xs text-neutral-400 text-center mb-3 font-medium uppercase tracking-wider">Recent Logins</p>
              <div className="grid grid-cols-2 gap-2">
                {recentUsers.map((u) => (
                  <button
                    key={u.email}
                    onClick={() => handleRecentClick(u)}
                    disabled={loading}
                    className="text-left px-3 py-2 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <p className="text-xs font-semibold text-neutral-700">{u.name}</p>
                    <p className="text-[11px] text-neutral-400 truncate">{u.email}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-neutral-500 text-xs mt-4">
          Internal use only — TransitOps Fleet Management
        </p>
      </div>
    </div>
  );
}
