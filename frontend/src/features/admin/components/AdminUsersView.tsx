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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-4">
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={onBack}
            className="border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg w-8 h-8 flex items-center justify-center transition-colors shadow-xs"
          >
            <ArrowLeft size={14} />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900 tracking-tight">User Management</h1>
            <p className="text-xs text-gray-500 mt-0.5">Create and manage logins, passwords, and permissions for Admin and Reception staff.</p>
          </div>
        </div>
        <button 
          type="button"
          onClick={handleOpenCreateModal}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium px-3.5 py-2 rounded-lg shadow-xs transition-colors self-start sm:self-auto flex items-center gap-1.5"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Add User Account</span>
        </button>
      </div>

      {/* Notices */}
      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center gap-2 text-xs font-medium">
          <CheckCircle size={15} />
          {successMsg}
        </div>
      )}

      {/* Users table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-16 space-y-3">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          <p className="text-gray-500 text-xs font-medium">Loading user accounts...</p>
        </div>
      ) : (
        <div className="crm-card bg-white border border-gray-200 rounded-lg shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/75 text-[11px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  <th className="px-4 py-3">Staff Name</th>
                  <th className="px-4 py-3">Username</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {users.map(user => (
                  <tr key={`${user.role}-${user.id}`} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-4 py-3 font-semibold text-gray-900">{user.full_name || '—'}</td>
                    <td className="px-4 py-3 font-mono text-gray-700">{user.username}</td>
                    <td className="px-4 py-3 text-gray-500">{user.email || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${
                        user.role === 'admin' 
                          ? 'bg-blue-50 text-blue-700 border-blue-200' 
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        <Shield size={10} className="mr-1" />
                        {user.role === 'admin' ? 'Administrator' : 'Receptionist'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 tabular-nums">
                      {new Date(user.created_at).toLocaleDateString(undefined, { 
                        year: 'numeric', month: 'short', day: 'numeric' 
                      })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button 
                          onClick={() => handleOpenEditModal(user)} 
                          title="Change Password / Edit"
                          className="px-2.5 py-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded text-xs font-medium transition-colors"
                        >
                          Change Password
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user)}
                          title="Delete user"
                          className="p-1 text-gray-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-gray-400 font-medium">
                      No system users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Dialog */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md border border-gray-200 overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                  <Shield size={16} className="text-emerald-600" />
                  {editingUser ? 'Update User & Password' : 'Create New User Account'}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {editingUser ? `Updating credentials for ${editingUser.username}` : 'Create login credentials for receptionist or admin staff.'}
                </p>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="p-5 space-y-4">
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-md text-xs font-medium flex items-center gap-2">
                  <AlertCircle size={14} />
                  {errorMsg}
                </div>
              )}

              {/* System Role */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Account Role</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('receptionist')}
                    className={`py-2 px-3 text-xs font-medium border rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                      role === 'receptionist'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Users size={14} />
                    Receptionist
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`py-2 px-3 text-xs font-medium border rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                      role === 'admin'
                        ? 'border-blue-500 bg-blue-50 text-blue-800'
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Shield size={14} />
                    Administrator
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Staff Full Name</label>
                <input 
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 shadow-xs"
                  required
                />
              </div>

              {/* Username */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Login Username</label>
                <input 
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="e.g. reception_desk1"
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 shadow-xs"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Email Address</label>
                <input 
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="staff@subraresidency.com"
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 shadow-xs"
                />
              </div>

              {/* Password */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-gray-700">
                    {editingUser ? 'New Password' : 'Password'}
                  </label>
                  {editingUser && (
                    <span className="text-[11px] text-gray-400 font-normal">
                      Leave blank to keep current
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input 
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder={editingUser ? "Enter new password to change" : "Enter password for account"}
                    className="w-full bg-white border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 shadow-xs"
                    required={!editingUser}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-3.5 py-1.5 border border-gray-300 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-50 shadow-xs"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={saving}
                  className="px-4 py-1.5 bg-gray-900 hover:bg-black text-white text-xs font-medium rounded-lg flex items-center justify-center shadow-xs"
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : null}
                  {editingUser ? 'Save Password & User' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
