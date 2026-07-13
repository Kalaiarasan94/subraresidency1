import { useState } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Hotel, User, Lock, ArrowRight, Shield } from 'lucide-react';
import { API_BASE_URL } from '../../lib/api';

export const ReceptionistLogin = ({ onLogin }: any) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const resp = await fetch(`${API_BASE_URL}/auth/receptionist/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await resp.json();
      if (data.status === 'success') {
        onLogin(data.user);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#061c12] flex items-center justify-center p-6 relative overflow-hidden reception-portal-theme">
      {/* Abstract Background Decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -ml-64 -mb-64" />

      <Card className="w-full max-w-md border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white/95 backdrop-blur-xl animate-in zoom-in-95 duration-700">
        <div className="bg-emerald-950 p-10 text-center relative">
          <div className="w-20 h-20 bg-white/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 backdrop-blur-md border border-white/10">
            <Hotel size={40} className="text-emerald-400" />
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Reception Desk</h2>
          <p className="text-emerald-400/60 font-bold text-[10px] uppercase tracking-[0.3em] mt-2">Staff Portal Access</p>
        </div>

        <CardContent className="p-10 space-y-8">
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-[10px] font-black uppercase text-center tracking-widest">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Authorized Username</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-600 transition-colors" size={18} />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-4 pl-12 pr-6 text-sm font-black text-slate-800 focus:outline-none focus:border-emerald-500 transition-all shadow-inner"
                  placeholder="e.g. receptionist_01"
                />
              </div>
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Secure Password</label>
               <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-600 transition-colors" size={18} />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-4 pl-12 pr-6 text-sm font-black text-slate-800 focus:outline-none focus:border-emerald-500 transition-all shadow-inner"
                    placeholder="••••••••"
                  />
               </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-7 rounded-2xl text-lg uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              {loading ? 'Authenticating...' : (
                <>
                  Access Terminal <ArrowRight size={20} />
                </>
              )}
            </Button>
          </form>

          <div className="flex flex-col items-center gap-4 pt-4">
             <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <Shield size={12} className="text-emerald-500" /> AES-256 Encrypted Session
             </div>
             <p className="text-[9px] text-slate-400 font-bold text-center">Unauthorized access attempt is logged with IP address and system thumbprint.</p>
          </div>
        </CardContent>
      </Card>
      
      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/20 text-[10px] font-black uppercase tracking-[0.5em]">Subra Residency Management System v2.0</p>
    </div>
  );
};
