import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Hotel, Calendar, Settings, 
  LayoutDashboard, LogOut, Menu, CreditCard,
  Layout, Search, Bell, Mail, PlusCircle, Globe, Clock,
  CheckCircle2, LayoutGrid, Briefcase, Monitor, ChevronDown, ChevronRight, User,
  Check, X, Shield, Key, Loader2, Sparkles, ReceiptIndianRupee, Landmark, FileText
} from 'lucide-react';
import { CategoryManagement } from './components/CategoryManagement';
import { BookingManagement } from './components/BookingManagement';
import { RoomCalendar } from './components/RoomCalendar';
import { AdminRoomDetailView } from './components/AdminRoomDetailView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { AdminSettingsView } from './components/AdminSettingsView';
import { AdminAccountsView } from './components/AdminAccountsView';
import { ReportsView } from '../reports/ReportsView';
import { CreateRoom } from '../../pages/admin/room/CreateRoom';
import { ReceptionistLogin } from '../reception/ReceptionistLogin';
import { API_BASE_URL } from '../../lib/api';

interface NavItem {
  id: string;
  icon: any;
  label: string;
  badge?: string;
  hasSub?: boolean;
}

export const AdminPortal = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'calendar';
  const dashboardView = searchParams.get('view') || 'overview';

  const setActiveTab = (tab: string) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (tab === 'calendar') {
        next.delete('tab');
      } else {
        next.set('tab', tab);
      }
      if (tab !== 'dashboard') {
        next.delete('view');
      }
      next.delete('room_id');
      next.delete('action');
      return next;
    });
  };

  const setDashboardView = (view: string) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (view === 'overview') {
        next.delete('view');
      } else {
        next.set('view', view);
      }
      return next;
    });
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [previewRoom, setPreviewRoom] = useState<any>(null);

  // Admin User Authentication State
  const [adminUser, setAdminUser] = useState<any>(() => {
    const saved = localStorage.getItem('admin_user');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const handleLogout = () => {
    localStorage.removeItem('admin_user');
    setAdminUser(null);
  };

  // Notifications State
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [showNotifs, setShowNotifs] = useState<boolean>(false);
  const [isMarkingRead, setIsMarkingRead] = useState<boolean>(false);

  // Profile & Quick Password Modal State
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [adminUsername, setAdminUsername] = useState('admin');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch Notifications
  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/receptionist/notifications`);
      if (!res.ok) return;
      const text = await res.text();
      if (!text || text.trim() === '') return;
      const data = JSON.parse(text);
      if (data && data.status === 'success') {
        const notifs = (data.notifications || []).filter((n: any) => Number(n.is_read) === 0);
        setNotifications(notifs);
        setUnreadCount(notifs.length);
      }
    } catch (e) {
      // Ignore background notification polling connection issues
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (id?: number) => {
    setIsMarkingRead(true);
    // Optimistically remove from view so read notifications don't linger
    if (id) {
      setNotifications(prev => prev.filter((n: any) => n.id !== id));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
    try {
      await fetch(`${API_BASE_URL}/admin/markRead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(id ? { notification_id: id } : {})
      });
      await fetchNotifications();
    } catch (e) {
      console.error('Error marking notifications as read', e);
    } finally {
      setIsMarkingRead(false);
    }
  };

  const handleUpdateAdminPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminUsername.trim()) {
      setPasswordMsg({ type: 'error', text: 'Username cannot be empty.' });
      return;
    }
    if (newPassword && newPassword.length < 4) {
      setPasswordMsg({ type: 'error', text: 'Password must be at least 4 characters.' });
      return;
    }
    if (newPassword && newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    setPasswordSaving(true);
    setPasswordMsg(null);
    try {
      // Find admin user or update default admin ID 1
      const payload: any = {
        id: 1,
        role: 'admin',
        username: adminUsername.trim()
      };
      if (newPassword) {
        payload.password = newPassword;
      }

      const res = await fetch(`${API_BASE_URL}/users/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setPasswordMsg({ type: 'success', text: 'Admin credentials updated successfully!' });
        setTimeout(() => {
          setShowPasswordModal(false);
          setNewPassword('');
          setConfirmPassword('');
          setPasswordMsg(null);
        }, 1200);
      } else {
        setPasswordMsg({ type: 'error', text: data.message || 'Failed to update credentials.' });
      }
    } catch (err: any) {
      setPasswordMsg({ type: 'error', text: 'Connection error updating credentials.' });
    } finally {
      setPasswordSaving(false);
    }
  };

  const handlePreviewRoom = (room: any) => {
    setPreviewRoom(room);
    setActiveTab('rooms');
  };

  const handleAddRoom = () => {
    setPreviewRoom(null);
    setShowCreateRoom(true);
    setActiveTab('rooms');
  };

  // If not authenticated as admin, render modern login portal
  if (!adminUser) {
    return (
      <ReceptionistLogin 
        portalType="admin" 
        onLogin={(user) => {
          setAdminUser(user);
        }} 
      />
    );
  }

  const navItems: { group: string; items: NavItem[] }[] = [
    {
      group: 'Core',
      items: [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'calendar', icon: Calendar, label: 'Room Calendar' },
        { id: 'bookings', icon: CreditCard, label: 'Bookings' },
      ]
    },
    {
      group: 'Financial Management',
      items: [
        { id: 'accounts', icon: ReceiptIndianRupee, label: 'Accounts & Expenses' },
        { id: 'reports', icon: FileText, label: 'Reports & Audits' },
      ]
    },
    {
      group: 'Inventory',
      items: [
        { id: 'rooms', icon: Hotel, label: 'Rooms & Suites', hasSub: true },
      ]
    },
    {
      group: 'Settings & System',
      items: [
        { id: 'website', icon: Settings, label: 'Website Settings' },
        { id: 'settings', icon: Layout, label: 'System Config' },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans admin-portal-theme antialiased text-gray-800">
      {/* Top Navbar - SaaS CRM Style */}
      <header className="h-16 bg-white border-b border-gray-200 px-4 md:px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          {/* Brand Icon & Name */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
              S
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-900">
              HMS<span className="text-blue-600">.</span>
            </span>
          </div>

          <div className="w-px h-6 bg-gray-200 mx-2 hidden sm:block" />

          {/* Icon Shortcuts */}
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
              title="Toggle Sidebar"
            >
              <Menu size={18} />
            </button>
            <button 
              onClick={() => setActiveTab('bookings')}
              className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors hidden md:block" 
              title="Tasks / Bookings"
            >
              <CheckCircle2 size={18} />
            </button>
            <button 
              onClick={() => setActiveTab('dashboard')}
              className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors hidden md:block" 
              title="Dashboard"
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setActiveTab('rooms')}
              className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors hidden lg:block" 
              title="Room Operations"
            >
              <Briefcase size={18} />
            </button>
            <button 
              onClick={() => window.open('/reception', '_blank')}
              className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors hidden lg:block" 
              title="Reception Terminal"
            >
              <Monitor size={18} />
            </button>
          </div>
        </div>

        {/* Right Nav Elements */}
        <div className="flex items-center gap-3">
          {/* Status Badge */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 bg-gray-100 text-gray-600 rounded border border-gray-200">
              subra
            </span>
            <div className="bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              Live System
            </div>
          </div>

          <div className="flex items-center gap-1 text-gray-500 relative">
            <button 
              onClick={() => setActiveTab('bookings')}
              className="p-2 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
              title="Search"
            >
              <Search size={17} />
            </button>
            <button 
              onClick={handleAddRoom}
              className="p-2 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
              title="Add Room"
            >
              <PlusCircle size={17} />
            </button>
            <button 
              onClick={() => window.open('/', '_blank')}
              className="p-2 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors hidden sm:block"
              title="Website"
            >
              <Globe size={17} />
            </button>

            {/* Notification Bell with Unread Badge & Dropdown */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowNotifs(!showNotifs);
                  setShowProfileMenu(false);
                }}
                className="p-2 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors relative"
                title="Notifications"
              >
                <Bell size={17} />
                {unreadCount > 0 ? (
                  <span className="absolute top-1 right-1 px-1.5 py-0.2 bg-emerald-600 text-white text-[9px] font-bold rounded-full min-w-[16px] text-center shadow-xs">
                    {unreadCount}
                  </span>
                ) : (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gray-300 rounded-full" />
                )}
              </button>

              {/* Notifications Popover */}
              {showNotifs && (
                <div className="absolute right-0 mt-2 w-88 bg-white border border-gray-200 rounded-lg shadow-xl py-3 px-4 z-50">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">Occupancy & Alerts</span>
                      {unreadCount > 0 && (
                        <span className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => handleMarkAsRead()}
                        disabled={isMarkingRead}
                        className="text-[11px] text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors"
                      >
                        {isMarkingRead ? 'Marking...' : 'Mark all read'}
                      </button>
                    )}
                  </div>

                  <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto mt-2">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-gray-400">
                        <CheckCircle2 size={24} className="mx-auto mb-2 text-gray-300" />
                        <p className="text-xs font-medium">All caught up! No new notifications.</p>
                      </div>
                    ) : (
                      notifications.map((n) => {
                        const isUnread = Number(n.is_read) === 0;
                        return (
                          <div 
                            key={n.id}
                            onClick={() => {
                              if (isUnread) handleMarkAsRead(n.id);
                              if (n.message && n.message.includes('HBK')) {
                                setActiveTab('bookings');
                                setShowNotifs(false);
                              }
                            }}
                            className={`py-3 px-2 flex items-start gap-3 rounded-md transition-colors cursor-pointer ${
                              isUnread ? 'bg-emerald-50/40 hover:bg-emerald-50/70' : 'hover:bg-gray-50'
                            }`}
                          >
                            <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${isUnread ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`} />
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs ${isUnread ? 'font-semibold text-gray-900' : 'font-medium text-gray-600'} leading-snug`}>
                                {n.message}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] text-gray-400">
                                  {n.created_at ? new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                                </span>
                                {isUnread && (
                                  <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-semibold">
                                    Occupied
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  <div className="pt-2 border-t border-gray-100 mt-2 text-center">
                    <button
                      onClick={() => {
                        setShowNotifs(false);
                        setActiveTab('bookings');
                      }}
                      className="text-xs text-gray-500 hover:text-gray-900 font-medium"
                    >
                      View All Reservations
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="w-px h-6 bg-gray-200 mx-1 hidden sm:block" />

          {/* User Profile with Interactive Dropdown */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifs(false);
              }}
              className="flex items-center gap-2.5 pl-1 py-1 pr-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer text-left"
            >
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs border border-slate-700">
                {adminUser?.username ? adminUser.username.slice(0, 2).toUpperCase() : 'AD'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold text-gray-800 leading-tight">
                  {adminUser?.full_name || 'Subra Admin'}
                </p>
                <p className="text-[10px] text-gray-400 leading-tight">Administrator</p>
              </div>
              <ChevronDown size={14} className="text-gray-400 hidden sm:block" />
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-xs font-bold text-gray-900">{adminUser?.full_name || 'Subra Admin'}</p>
                  <p className="text-[11px] text-gray-500 font-mono">@{adminUser?.username || 'admin'}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-semibold rounded border border-emerald-200">
                    Primary Executive Admin
                  </span>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setShowPasswordModal(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 hover:text-blue-600 font-medium transition-colors"
                  >
                    <Key size={14} />
                    <span>Change My Password</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setActiveTab('settings');
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 hover:text-blue-600 font-medium transition-colors"
                  >
                    <User size={14} />
                    <span>Manage Reception Staff</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      handleAddRoom();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 hover:text-blue-600 font-medium transition-colors"
                  >
                    <PlusCircle size={14} />
                    <span>New Room Configuration</span>
                  </button>

                  <button
                    onClick={() => window.open('/reception', '_blank')}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 hover:text-blue-600 font-medium transition-colors"
                  >
                    <Monitor size={14} />
                    <span>Launch Reception Terminal</span>
                  </button>
                </div>

                <div className="pt-1 border-t border-gray-100">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-medium transition-colors cursor-pointer"
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Change Admin Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-lg shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
                  <Key size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Change Admin Password</h3>
                  <p className="text-[11px] text-gray-500">Update system administrator credentials</p>
                </div>
              </div>
              <button 
                onClick={() => setShowPasswordModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X size={16} />
              </button>
            </div>

            {passwordMsg && (
              <div className={`mt-4 p-3 rounded-md text-xs font-medium flex items-center gap-2 ${
                passwordMsg.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}>
                {passwordMsg.type === 'success' ? <Check size={14} /> : <X size={14} />}
                <span>{passwordMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleUpdateAdminPassword} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Admin Username
                </label>
                <input 
                  type="text"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-medium text-gray-800"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  New Password <span className="text-[10px] text-gray-400 font-normal">(Leave blank to keep current)</span>
                </label>
                <input 
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Confirm Password
                </label>
                <input 
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password to confirm"
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={passwordSaving}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                >
                  {passwordSaving && <Loader2 size={13} className="animate-spin" />}
                  <span>{passwordSaving ? 'Updating...' : 'Update Password'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Layout (Sidebar + Content) */}
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <aside 
          className={`bg-white border-r border-gray-200 flex flex-col shrink-0 transition-all duration-200 sticky top-16 h-[calc(100vh-64px)] z-40 ${
            isSidebarOpen ? 'w-60' : 'w-16'
          }`}
        >
          <div className="flex-1 py-4 overflow-y-auto space-y-6">
            {navItems.map((section, idx) => (
              <div key={idx} className="space-y-1">
                {isSidebarOpen && (
                  <p className="px-5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    {section.group}
                  </p>
                )}
                {section.items.map((item) => {
                  const isActive = activeTab === item.id;
                  const Icon = item.icon;
                  return (
                    <div key={item.id} className="px-3">
                      <button
                        onClick={() => {
                          setActiveTab(item.id);
                          setShowCreateRoom(false);
                          setPreviewRoom(null);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-all ${
                          isActive
                            ? 'bg-[#f0fdf4] text-[#059669] border border-[#a7f3d0] font-medium shadow-xs'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-normal'
                        }`}
                        title={!isSidebarOpen ? item.label : undefined}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Icon 
                            size={18} 
                            className={`shrink-0 ${isActive ? 'text-[#059669]' : 'text-gray-500'}`} 
                          />
                          {isSidebarOpen && (
                            <span className="truncate">{item.label}</span>
                          )}
                        </div>
                        {isSidebarOpen && item.hasSub && (
                          <ChevronDown size={14} className="text-gray-400 shrink-0" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Sidebar Footer */}
          <div className="p-3 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-normal cursor-pointer"
              title="Sign Out"
            >
              <LogOut size={16} className="shrink-0" />
              {isSidebarOpen && <span>Sign Out</span>}
            </button>
          </div>
        </aside>

        {/* Content View */}
        <main className="flex-1 min-w-0 p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {activeTab === 'dashboard' && (
              <AdminDashboardView activeSubTab={dashboardView} onNavigate={setActiveTab} />
            )}
            
            {activeTab === 'bookings' && <BookingManagement />}
            {activeTab === 'accounts' && <AdminAccountsView />}
            {activeTab === 'reports' && <ReportsView userRole="admin" />}
            {activeTab === 'website' && <AdminSettingsView />}

            {activeTab === 'rooms' && (
              showCreateRoom ? (
                <CreateRoom 
                  onCancel={() => { setShowCreateRoom(false); }}
                  onSuccess={() => { setShowCreateRoom(false); }}
                />
              ) : previewRoom ? (
                <AdminRoomDetailView 
                  room={previewRoom}
                  onBack={() => setPreviewRoom(null)}
                  onRefresh={() => {
                    setPreviewRoom(null);
                  }}
                />
              ) : (
                <CategoryManagement 
                  onAddRoom={handleAddRoom} 
                  onEditRoom={(room) => handlePreviewRoom(room)} 
                />
              )
            )}

            {activeTab === 'calendar' && <RoomCalendar />}
            {activeTab === 'settings' && <AdminSettingsView />}
          </div>
        </main>
      </div>
    </div>
  );
};
