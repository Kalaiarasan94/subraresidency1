import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { API_BASE_URL } from '../../../lib/api';
import { 
  Users, UserPlus, Shield, Key, Mail, Edit, Trash2, 
  X, CheckCircle, AlertCircle, Loader2, ArrowLeft 
} from 'lucide-react';

interface User {
  id: number;
  username: string;
  full_name: string;
  email: string;
  role: 'admin' | 'receptionist';
  created_at: string;
}

interface AdminUsersViewProps {
  onBack: () => void;
}

export const AdminUsersView: React.FC<AdminUsersViewProps> = ({ onBack }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'receptionist'>('receptionist');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users/list`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setErrorMsg('Failed to load system users.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingUser(null);
    setFullName('');
    setUsername('');
    setEmail('');
    setPassword('');
    setRole('receptionist');
    setErrorMsg(null);
    setSuccessMsg(null);
    setShowModal(true);
  };

  const handleOpenEditModal = (user: User) => {
    setEditingUser(user);
    setFullName(user.full_name);
    setUsername(user.username);
    setEmail(user.email);
    setPassword('');
    setRole(user.role);
    setErrorMsg(null);
    setSuccessMsg(null);
    setShowModal(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const isEdit = !!editingUser;
    const url = isEdit ? `${API_BASE_URL}/users/update` : `${API_BASE_URL}/users/create`;
    
    const payload: any = {
      fullName,
      username,
      email,
      role
    };

    if (isEdit) {
      payload.id = editingUser.id;
      if (password) {
        payload.password = password;
      }
    } else {
      payload.password = password;
      if (!password) {
        setErrorMsg('Password is required for new users.');
        setSaving(false);
        return;
      }
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const resData = await response.json();
      
      if (!response.ok) {
        throw new Error(resData.message || 'Operation failed');
      }

      setSuccessMsg(isEdit ? 'Credentials updated successfully!' : 'New user created successfully!');
      fetchUsers();
      
      // Auto close modal slightly after success
      setTimeout(() => {
        setShowModal(false);
      }, 1000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to save user details.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (!window.confirm(`Are you sure you want to delete ${user.full_name || user.username}?`)) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, role: user.role })
      });
      
      const resData = await response.json();
      
      if (!response.ok) {
        throw new Error(resData.message || 'Deletion failed');
      }

      setSuccessMsg('User deleted successfully.');
      fetchUsers();
      
      setTimeout(() => {
        setSuccessMsg(null);
      }, 3000);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to delete user.');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onBack}
            className="border-slate-200 hover:bg-slate-50 rounded-full w-10 h-10 p-0"
          >
            <ArrowLeft size={16} />
          </Button>
          <div>
            <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">User Management</h1>
            <p className="text-sm text-slate-500 font-medium font-sans">Create and modify system logins for admins and receptionist staff.</p>
          </div>
        </div>
        <Button 
          onClick={handleOpenCreateModal}
          className="bg-[#0b3a24] hover:bg-black text-white text-xs font-black uppercase tracking-widest px-6 h-12 shadow-xl shadow-emerald-900/10"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Notices */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl flex items-center gap-3 font-semibold text-xs tracking-wide">
          <CheckCircle size={16} />
          {successMsg}
        </div>
      )}

      {/* Users table/card list */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 space-y-4">
          <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
          <p className="text-emerald-950 font-black uppercase tracking-widest text-[10px]">Loading Accounts...</p>
        </div>
      ) : (
        <Card className="border-none shadow-xl shadow-slate-200/50 overflow-hidden bg-white">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-500 tracking-widest border-b border-slate-100">
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Username</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Created At</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map(user => (
                    <tr key={`${user.role}-${user.id}`} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-5 text-sm font-bold text-slate-800">{user.full_name || 'N/A'}</td>
                      <td className="px-6 py-5 text-sm font-semibold text-slate-600">{user.username}</td>
                      <td className="px-6 py-5 text-sm text-slate-500 font-sans">{user.email || 'N/A'}</td>
                      <td className="px-6 py-5">
                        <Badge className={`rounded-full px-3 py-1 font-bold text-[9px] uppercase tracking-wider ${
                          user.role === 'admin' 
                            ? 'bg-amber-50 text-amber-700 border border-amber-100' 
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        }`}>
                          <Shield size={10} className="mr-1 inline-block" />
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-5 text-xs text-slate-400 font-sans">
                        {new Date(user.created_at).toLocaleDateString(undefined, { 
                          year: 'numeric', month: 'short', day: 'numeric' 
                        })}
                      </td>
                      <td className="px-6 py-5 text-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleOpenEditModal(user)} 
                          className="h-8 w-8 text-slate-450 hover:text-emerald-700 hover:bg-emerald-50 rounded-full"
                        >
                          <Edit size={14} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteUser(user)}
                          className="h-8 w-8 text-slate-450 hover:text-rose-600 hover:bg-rose-50 rounded-full"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-sm font-bold text-slate-450">
                        No system users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal Dialog */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <Card className="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-md border-none overflow-hidden max-h-[90vh] flex flex-col">
            <CardHeader className="bg-[#0b3a24] text-white p-6 flex flex-row items-center justify-between border-none">
              <div>
                <CardTitle className="text-base font-black uppercase tracking-wider flex items-center gap-2">
                  <Shield size={18} />
                  {editingUser ? 'Update Credentials' : 'New User Setup'}
                </CardTitle>
                <CardDescription className="text-white/60 text-xs mt-1 font-sans">
                  {editingUser ? `Editing ${editingUser.username}` : 'Enter new login parameters.'}
                </CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowModal(false)}
                className="text-white/80 hover:text-white hover:bg-white/10 rounded-full h-8 w-8"
              >
                <X size={18} />
              </Button>
            </CardHeader>

            <form onSubmit={handleSaveUser} className="flex-1 overflow-y-auto p-6 space-y-6">
              {errorMsg && (
                <div className="p-4 bg-rose-50 border border-rose-100 text-rose-800 rounded-xl flex items-center gap-3 font-semibold text-xs tracking-wide">
                  <AlertCircle size={16} />
                  {errorMsg}
                </div>
              )}

              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Full Name</label>
                <Input 
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="bg-slate-50 border-none h-12 font-bold focus-visible:ring-emerald-700/20"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <Input 
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="john@subraresidency.com"
                    className="bg-slate-50 border-none h-12 pl-12 font-bold focus-visible:ring-emerald-700/20"
                    required
                  />
                </div>
              </div>

              {/* Username */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Username</label>
                <Input 
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="e.g. johndoe"
                  className="bg-slate-50 border-none h-12 font-bold focus-visible:ring-emerald-700/20"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Password</label>
                  {editingUser && <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-widest select-none">(Optional - Fill to Change)</span>}
                </div>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <Input 
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder={editingUser ? "••••••••" : "Password password"}
                    className="bg-slate-50 border-none h-12 pl-12 font-bold focus-visible:ring-emerald-700/20"
                    required={!editingUser}
                  />
                </div>
              </div>

              {/* Role */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">System Role</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setRole('receptionist')}
                    className={`h-14 font-black uppercase tracking-wider text-xs border rounded-xl flex items-center justify-center gap-2 transition-all ${
                      role === 'receptionist'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20'
                        : 'border-slate-100 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Users size={16} />
                    Receptionist
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`h-14 font-black uppercase tracking-wider text-xs border rounded-xl flex items-center justify-center gap-2 transition-all ${
                      role === 'admin'
                        ? 'border-amber-600 bg-amber-50 text-amber-800 ring-2 ring-amber-500/20'
                        : 'border-slate-100 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Shield size={16} />
                    Admin
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowModal(false)}
                  className="border-slate-200 text-slate-500 uppercase text-xs font-black tracking-widest h-12 px-6"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={saving}
                  className="bg-[#0b3a24] hover:bg-black text-white text-xs font-black uppercase tracking-widest px-8 h-12 flex items-center justify-center"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Parameters'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};
