import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ReceptionistLogin } from './ReceptionistLogin';
import { 
  LayoutDashboard,
  Users, CreditCard, Bell, LogOut,
  Menu, Smartphone, PlusCircle,
  History, CheckCircle, Search, Globe, ChevronDown, User, X,
  Key, Check, Loader2, CheckCircle2, FileText, Phone, ShieldCheck, Clock, Sparkles
} from 'lucide-react';
import { ReceptionistDashboard } from './components/ReceptionistDashboard';
import { OnlineCheckInFlow } from './components/OnlineCheckInFlow';
import { OfflineBookingFlow } from './components/OfflineBookingFlow';
import { GuestDirectory } from './components/GuestDirectory';
import { Settlements } from './components/Settlements';
import { StayLogs } from './components/StayLogs';
import { ReportsView } from '../reports/ReportsView';
import { API_BASE_URL } from '../../lib/api';

export const ReceptionPortal = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'dashboard';

  const setActiveTab = (tab: string) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (tab === 'dashboard') {
        next.delete('tab');
      } else {
        next.set('tab', tab);
      }
      if (tab !== activeTab) {
        next.delete('step');
        next.delete('checkin_step');
      }
      return next;
    });
  };

  const [user, setUser] = useState<any>(() => {
    const saved = localStorage.getItem('reception_user');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Notification State
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [showNotifs, setShowNotifs] = useState<boolean>(false);
  const [isMarkingRead, setIsMarkingRead] = useState<boolean>(false);
  const [prefillBookingId, setPrefillBookingId] = useState<string | null>(null);
  const [activeToast, setActiveToast] = useState<any>(null);
  const [activeArrivalModal, setActiveArrivalModal] = useState<any>(null);
  const [seenNotifIds, setSeenNotifIds] = useState<Set<number>>(new Set());

  // Profile & Credentials Modal State
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState<boolean>(false);
  const [editUsername, setEditUsername] = useState<string>('');
  const [editFullName, setEditFullName] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [credentialSaving, setCredentialSaving] = useState<boolean>(false);
  const [credentialMsg, setCredentialMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (user) {
      setEditUsername(user.username || '');
      setEditFullName(user.full_name || '');
    }
  }, [user]);

  const playNotifChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      // Audio playback restriction fallback
    }
  };

  // Persistence
  useEffect(() => {
    if (user) {
      localStorage.setItem('reception_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('reception_user');
    }
  }, [user]);

  // Inactivity Logout (30 minutes)
  useEffect(() => {
    if (!user) return;

    let timeoutId: any;
    const INACTIVITY_LIMIT = 30 * 60 * 1000;

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setUser(null);
      }, INACTIVITY_LIMIT);
    };

    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    activityEvents.forEach(evt => document.addEventListener(evt, resetTimer));

    resetTimer();

    return () => {
      activityEvents.forEach(evt => document.removeEventListener(evt, resetTimer));
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [user]);

  // Polling for notifications (QR Scans, Check-ins, Occupied Rooms)
  const fetchNotifs = async () => {
    if (!user) return;
    try {
      const resp = await fetch(`${API_BASE_URL}/receptionist/notifications`);
      if (!resp.ok) return;
      const text = await resp.text();
      if (!text || text.trim() === '') return;
      const data = JSON.parse(text);
      if (data && data.status === 'success' && Array.isArray(data.notifications)) {
        // Only keep unread notifications (is_read == 0) so marked read notifications disappear
        const notifs = data.notifications.filter((n: any) => Number(n.is_read) === 0);
        setNotifications(notifs);
        setUnreadCount(notifs.length);

        const unreadQrs = notifs.filter((n: any) => !seenNotifIds.has(n.id) && n.type === 'QR_SCAN');
        if (unreadQrs.length > 0) {
          const newest = unreadQrs[0];
          setSeenNotifIds((prev) => {
            const next = new Set(prev);
            notifs.forEach((n: any) => next.add(n.id));
            return next;
          });
          playNotifChime();
          setActiveArrivalModal(newest);
          setActiveToast(newest);
        }
      }
    } catch (err) {
      console.error("Notif fetch error", err);
    }
  };

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 3000);
    return () => clearInterval(interval);
  }, [user, seenNotifIds]);

  const markRead = async (id?: number) => {
    setIsMarkingRead(true);
    // Optimistically update notifications list so marked as read notifications disappear immediately
    if (id) {
      setNotifications((prev) => prev.filter((n: any) => n.id !== id));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
    try {
      await fetch(`${API_BASE_URL}/receptionist/markRead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(id ? { notification_id: id } : {})
      });
      await fetchNotifs();
    } catch (err) {
      console.error("Error marking read", err);
    } finally {
      setIsMarkingRead(false);
    }
  };

  const openNotification = (n: any) => {
    if (n.id) {
      markRead(n.id);
    }
    if (n.type === 'QR_SCAN') {
      try {
        const parsed = typeof n.data === 'string' ? JSON.parse(n.data) : n.data;
        if (parsed?.booking_id) {
          setPrefillBookingId(parsed.booking_id);
          setActiveTab('online_checkin');
          setShowNotifs(false);
          return;
        }
      } catch (err) {
        console.error('Failed to parse notification data', err);
      }
    }
    // If room or booking related
    if (n.message && (n.message.includes('occupied') || n.message.includes('HBK') || n.message.includes('Guest'))) {
      setActiveTab('history');
      setShowNotifs(false);
    }
  };

  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUsername.trim()) {
      setCredentialMsg({ type: 'error', text: 'Username cannot be empty.' });
      return;
    }
    if (newPassword && newPassword.length < 4) {
      setCredentialMsg({ type: 'error', text: 'Password must be at least 4 characters.' });
      return;
    }
    if (newPassword && newPassword !== confirmPassword) {
      setCredentialMsg({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    setCredentialSaving(true);
    setCredentialMsg(null);
    try {
      const payload: any = {
        id: user.id || 1,
        role: 'receptionist',
        username: editUsername.trim(),
        fullName: editFullName.trim()
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
        const updatedUser = {
          ...user,
          username: editUsername.trim(),
          full_name: editFullName.trim()
        };
        setUser(updatedUser);
        localStorage.setItem('reception_user', JSON.stringify(updatedUser));
        setCredentialMsg({ type: 'success', text: 'Receptionist credentials updated successfully!' });
        setTimeout(() => {
          setShowCredentialsModal(false);
          setNewPassword('');
          setConfirmPassword('');
          setCredentialMsg(null);
        }, 1200);
      } else {
        setCredentialMsg({ type: 'error', text: data.message || 'Failed to update credentials.' });
      }
    } catch (err: any) {
      setCredentialMsg({ type: 'error', text: 'Connection error updating credentials.' });
    } finally {
      setCredentialSaving(false);
    }
  };

  if (!user) {
    return <ReceptionistLogin portalType="reception" onLogin={setUser} />;
  }

  const navSections = [
    {
      group: 'Front Desk',
      items: [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Front Desk Hub' },
        { id: 'online_checkin', icon: Smartphone, label: 'Online Check-in' },
        { id: 'offline_booking', icon: PlusCircle, label: 'New Registration' },
      ]
    },
    {
      group: 'Operations',
      items: [
        { id: 'guests', icon: Users, label: 'Guest Directory' },
        { id: 'transactions', icon: CreditCard, label: 'Settlements' },
        { id: 'history', icon: History, label: 'Stay Logs' },
        { id: 'reports', icon: FileText, label: 'Reports & Audits' },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans reception-portal-theme antialiased text-gray-800">
      {/* Top Navbar - SaaS CRM Style */}
      <header className="h-16 bg-white border-b border-gray-200 px-4 md:px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          {/* Brand Icon & Name */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
              R
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-900">
              FrontDesk<span className="text-emerald-600">.</span>
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
              onClick={() => setActiveTab('online_checkin')}
              className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors hidden md:block" 
              title="Fast Express Check-in"
            >
              <Smartphone size={18} />
            </button>
            <button 
              onClick={() => setActiveTab('offline_booking')}
              className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors hidden md:block" 
              title="Walk-in Registration"
            >
              <PlusCircle size={18} />
            </button>
          </div>
        </div>

        {/* Right Nav Elements */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Terminal 0.1 Online
            </div>
          </div>

          <div className="flex items-center gap-1 text-gray-500">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className="p-2 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
              title="Search Bookings"
            >
              <Search size={17} />
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
                      <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">Front Desk & Room Alerts</span>
                      {unreadCount > 0 && (
                        <span className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {notifications.length > 0 && (
                      <button
                        onClick={() => markRead()}
                        disabled={isMarkingRead}
                        className="text-[11px] text-emerald-600 hover:text-emerald-800 font-medium hover:underline transition-colors"
                      >
                        {isMarkingRead ? 'Marking...' : 'Mark all read'}
                      </button>
                    )}
                  </div>

                  <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto mt-2">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-gray-400">
                        <CheckCircle2 size={24} className="mx-auto mb-2 text-gray-300" />
                        <p className="text-xs font-medium">All caught up! No new reception alerts.</p>
                      </div>
                    ) : (
                      notifications.map((n) => {
                        const isUnread = Number(n.is_read) === 0;
                        return (
                          <div 
                            key={n.id}
                            onClick={() => openNotification(n)}
                            className={`py-3 px-2 flex items-start gap-3 rounded-md transition-colors cursor-pointer ${
                              isUnread ? 'bg-emerald-50/50 hover:bg-emerald-50/80' : 'hover:bg-gray-50'
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
                                {n.type === 'QR_SCAN' ? (
                                  <span className="text-[9px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-semibold">
                                    QR Fast Check-in
                                  </span>
                                ) : isUnread ? (
                                  <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-semibold">
                                    Occupied
                                  </span>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="w-px h-6 bg-gray-200 mx-1 hidden sm:block" />

          {/* User Profile & Dropdown */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifs(false);
              }}
              className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 font-semibold text-xs shrink-0">
                {user.username ? user.username.slice(0, 2).toUpperCase() : 'RC'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold text-gray-800 leading-tight">{user.full_name || user.username}</p>
                <p className="text-[10px] text-gray-400 leading-tight">Duty Officer</p>
              </div>
              <ChevronDown size={14} className="text-gray-400 hidden sm:block" />
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-xs font-bold text-gray-900">{user.full_name || user.username}</p>
                  <p className="text-[11px] text-gray-500 font-mono">@{user.username}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-semibold rounded border border-emerald-200">
                    Front Desk Receptionist
                  </span>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setShowCredentialsModal(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 hover:text-emerald-600 font-medium transition-colors"
                  >
                    <Key size={14} />
                    <span>Change Username & Password</span>
                  </button>
                </div>

                <div className="pt-1 border-t border-gray-100">
                  <button
                    onClick={() => {
                      setUser(null);
                      localStorage.removeItem('reception_user');
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-medium transition-colors"
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

      {/* Change Receptionist Credentials Modal */}
      {showCredentialsModal && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-sm p-6 relative">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-md">
                  <Key size={16} />
                </div>
                <h3 className="text-sm font-bold text-gray-900">Receptionist Credentials</h3>
              </div>
              <button 
                onClick={() => setShowCredentialsModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-md"
              >
                <X size={16} />
              </button>
            </div>

            {credentialMsg && (
              <div className={`mt-4 p-3 rounded-md text-xs font-medium flex items-center gap-2 ${
                credentialMsg.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}>
                {credentialMsg.type === 'success' ? <Check size={14} /> : <X size={14} />}
                <span>{credentialMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleUpdateCredentials} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Reception Username <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  placeholder="e.g. reception"
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 font-medium text-gray-800"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Name / Display Title
                </label>
                <input 
                  type="text"
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  placeholder="e.g. Front Desk Officer"
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  New Password <span className="text-[10px] text-gray-400 font-normal">(Leave blank to keep current)</span>
                </label>
                <input 
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input 
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowCredentialsModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={credentialSaving}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                >
                  {credentialSaving && <Loader2 size={13} className="animate-spin" />}
                  <span>{credentialSaving ? 'Saving...' : 'Save Credentials'}</span>
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
            {navSections.map((section, idx) => (
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
                        onClick={() => setActiveTab(item.id)}
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
              onClick={() => setUser(null)}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-normal"
              title="Close Session"
            >
              <LogOut size={16} className="shrink-0" />
              {isSidebarOpen && <span>Close Session</span>}
            </button>
          </div>
        </aside>

        {/* Content View */}
        <main className="flex-1 min-w-0 p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {activeTab === 'dashboard'      && <ReceptionistDashboard onNavigate={setActiveTab} />}
            {activeTab === 'online_checkin' && (
              <OnlineCheckInFlow
                prefillBookingId={prefillBookingId}
                onPrefillConsumed={() => setPrefillBookingId(null)}
              />
            )}
            {activeTab === 'offline_booking' && <OfflineBookingFlow />}
            {activeTab === 'guests'          && <GuestDirectory />}
            {activeTab === 'transactions'    && <Settlements onOpenReports={() => setActiveTab('reports')} />}
            {activeTab === 'history'         && <StayLogs />}
            {activeTab === 'reports'         && <ReportsView userRole="reception" />}
          </div>
        </main>
      </div>

      {/* Guest Arrival Modal Alert Popup */}
      {activeArrivalModal && (() => {
        let modalData: any = {};
        try {
          modalData = typeof activeArrivalModal.data === 'string' 
            ? JSON.parse(activeArrivalModal.data) 
            : (activeArrivalModal.data || {});
        } catch (e) {
          modalData = {};
        }

        const guestName = modalData.guest_name || 'Guest';
        const bookingId = modalData.booking_id || '';
        const note = modalData.arrival_note || 'Standing at Front Desk';
        const roomCat = modalData.room_category || 'Reserved Room';
        const guestPhone = modalData.guest_phone || '';

        return (
          <div className="fixed inset-0 z-[120] bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200/80 max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
              
              {/* Modal Header */}
              <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-700 flex items-center justify-center shrink-0">
                    <Smartphone size={20} className="animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                        Live Arrival Alert
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-gray-900 tracking-tight">Express Guest Check-in</h3>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    markRead(activeArrivalModal.id);
                    setActiveArrivalModal(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Close"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 space-y-4 text-left">
                {/* Live Status Pill */}
                <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200/70 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-emerald-700 uppercase font-bold tracking-wider block">
                      Arrival Status
                    </span>
                    <p className="text-sm font-bold text-emerald-950 mt-0.5 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                      <span>{note}</span>
                    </p>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-800 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 shadow-2xs flex items-center gap-1">
                    <Clock size={11} className="text-emerald-600" />
                    <span>Just Now</span>
                  </span>
                </div>

                {/* Guest Profile Card */}
                <div className="p-3.5 bg-gray-50/70 rounded-xl border border-gray-100 flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0a3622] to-[#124b30] text-emerald-200 font-extrabold text-sm flex items-center justify-center shrink-0 shadow-xs">
                    {guestName.split(' ').map((w: string) => w[0]).filter(Boolean).slice(0, 2).join('') || 'G'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-gray-900 text-sm truncate">{guestName}</span>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 shrink-0">
                        Verified Pass
                      </span>
                    </div>
                    {guestPhone && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 font-mono mt-0.5">
                        <Phone size={11} className="text-gray-400" />
                        <span>{guestPhone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2-Column Meta Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-gray-50/60 rounded-xl border border-gray-100">
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Booking Reference</span>
                    <span className="font-mono font-bold text-gray-900 text-xs mt-1 block truncate">{bookingId}</span>
                  </div>

                  <div className="p-3 bg-gray-50/60 rounded-xl border border-gray-100">
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Assigned Room</span>
                    <span className="font-bold text-gray-900 text-xs mt-1 block truncate">{roomCat}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => {
                      openNotification(activeArrivalModal);
                      setActiveArrivalModal(null);
                      setActiveToast(null);
                    }}
                    className="flex-1 py-2.5 bg-[#0a3622] hover:bg-[#135235] text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <CheckCircle2 size={15} />
                    <span>Open & Complete Check-in</span>
                  </button>

                  <button
                    onClick={() => {
                      markRead(activeArrivalModal.id);
                      setActiveArrivalModal(null);
                    }}
                    className="px-4 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              </div>

            </div>
          </div>
        );
      })()}

      {/* Floating QR Scan Toast Alert */}
      {activeToast && !activeArrivalModal && (
        <div className="fixed bottom-6 right-6 z-[100] max-w-md w-full bg-white border border-gray-300 rounded-lg p-5 shadow-xl text-gray-800">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
                <Smartphone size={18} />
              </div>
              <div>
                <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Guest QR Scan Alert</p>
                <p className="text-sm font-medium text-gray-800 mt-0.5">{activeToast.message}</p>
              </div>
            </div>
            <button onClick={() => setActiveToast(null)} className="text-gray-400 hover:text-gray-600 p-1">
              <X size={16} />
            </button>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => {
                openNotification(activeToast);
                setActiveToast(null);
              }}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs py-2 rounded-md transition-colors"
            >
              Process Express Check-in
            </button>
            <button
              onClick={() => setActiveToast(null)}
              className="px-3.5 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-medium rounded-md transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
