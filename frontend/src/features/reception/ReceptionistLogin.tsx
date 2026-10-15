import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Hotel, User, Lock, ArrowRight, ShieldCheck, 
  Eye, EyeOff, AlertCircle, Loader2
} from 'lucide-react';
import { API_BASE_URL } from '../../lib/api';
import logoImg from '../../assets/logo.png';

interface ReceptionistLoginProps {
  onLogin?: (user: any) => void;
  portalType?: 'reception' | 'admin';
  initialRole?: 'reception' | 'admin';
}

export const ReceptionistLogin = ({ 
  onLogin, 
  portalType,
  initialRole = 'reception' 
}: ReceptionistLoginProps) => {
  const navigate = useNavigate();
  // If portalType is specified, lock role to that portalType; otherwise allow switching
  const effectiveRole = portalType || initialRole;
  const [role, setRole] = useState<'reception' | 'admin'>(effectiveRole);
  
  // No hardcoded default credentials - start empty
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isAdmin = (portalType ? portalType === 'admin' : role === 'admin');

  const handleRoleChange = (newRole: 'reception' | 'admin') => {
    setRole(newRole);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('Please enter both your username and password.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const activeRole = portalType || role;
      const endpoint = activeRole === 'admin' ? 'auth/admin' : 'auth/receptionist';
      const resp = await fetch(`${API_BASE_URL}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password })
      });
      
      const data = await resp.json();
      if (resp.ok && data.status === 'success') {
        if (activeRole === 'admin') {
          localStorage.setItem('admin_user', JSON.stringify(data.user));
          if (onLogin) {
            onLogin(data.user);
          } else {
            navigate('/admin');
          }
        } else {
          localStorage.setItem('reception_user', JSON.stringify(data.user));
          if (onLogin) {
            onLogin(data.user);
          } else {
            navigate('/reception');
          }
        }
      } else {
        setError(data.message || 'Authentication failed. Please verify credentials.');
      }
    } catch (err: any) {
      setError('Connection error reaching authentication server. Please check internet.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center p-4 antialiased text-gray-800 relative selection:bg-blue-100 selection:text-blue-900">
      {/* Background subtle luxury ambiance */}
      <div className="fixed inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_50%_15%,#e0e7ff_0%,transparent_60%)]" />

      {/* Main Login Card */}
      <div className="w-full max-w-md rounded-2xl bg-white border border-gray-200/90 shadow-xl overflow-hidden relative z-10 transition-all">
        
        {/* Brand Header */}
        <div className="pt-8 pb-6 px-8 text-center border-b border-gray-100 bg-white">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-xs">
              S
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              HMS<span className="text-blue-600">.</span>
            </span>
          </div>

          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gray-50 p-2 shadow-xs border border-gray-200 flex items-center justify-center">
            <img src={logoImg} alt="Subra Residency" className="w-full h-full object-contain" />
          </div>

          <h1 className="text-base font-bold text-gray-900 tracking-tight">
            {isAdmin ? 'Administrator Portal' : 'Front Desk Reception'}
          </h1>
          <p className="text-[11px] font-medium text-gray-500 uppercase tracking-widest mt-0.5">
            {isAdmin ? 'Executive Management System' : 'Front Desk Operations Terminal'}
          </p>
        </div>

        {/* Role Selector Tabs (Only shown if portalType is not locked) */}
        {!portalType && (
          <div className="p-6 pb-2">
            <div className="p-1 bg-gray-100 rounded-xl border border-gray-200 flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleRoleChange('reception')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  role === 'reception'
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <Hotel size={15} className={role === 'reception' ? 'text-blue-600' : 'text-gray-400'} />
                <span>Front Desk</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('admin')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  role === 'admin'
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <ShieldCheck size={15} className={role === 'admin' ? 'text-blue-600' : 'text-gray-400'} />
                <span>Administrator</span>
              </button>
            </div>
          </div>
        )}

        <div className="p-6 pt-4 space-y-4">
          
          {/* Subtitle / Role Badge */}
          <div className="flex items-center justify-between text-xs pb-1">
            <span className="text-gray-500 font-medium">
              {isAdmin ? 'Staff Credentials Required' : 'Front Desk Credentials Required'}
            </span>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200 font-semibold uppercase">
              {isAdmin ? 'ROLE: ADMIN' : 'ROLE: FRONT_DESK'}
            </span>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2 animate-in fade-in">
              <AlertCircle size={15} className="text-rose-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-semibold">Access Denied: </span>
                <span>{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username Input */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-semibold text-gray-700 block">
                {isAdmin ? 'Administrator Username' : 'Receptionist Username'}
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                <input 
                  type="text" 
                  required
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl py-2.5 pl-10 pr-3 text-xs font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all shadow-2xs"
                  placeholder={isAdmin ? 'Enter admin username' : 'Enter receptionist username'}
                />
              </div>
            </div>

            {/* Password Input with Eye Icon */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-semibold text-gray-700 block">
                Security Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl py-2.5 pl-10 pr-10 text-xs font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all shadow-2xs"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1 cursor-pointer transition-colors"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full font-semibold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>
                    {isAdmin ? 'Sign In as Administrator' : 'Sign In to Front Desk'}
                  </span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Security Footer Info */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
            <span className="flex items-center gap-1 font-mono">
              <ShieldCheck size={12} className="text-emerald-600" />
              <span>TLS 256-bit Encrypted</span>
            </span>
            <span>Subra Residency HMS v2.4</span>
          </div>

        </div>
      </div>
    </div>
  );
};
