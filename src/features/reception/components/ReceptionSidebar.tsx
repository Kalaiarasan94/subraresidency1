import { CalendarDays, DoorOpen, LayoutDashboard, LogOut, QrCode, UserPlus } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { getPortalUrl } from '../../../app/portalDomains';
import type { ReceptionNavItem, ReceptionView } from '../types';

type ReceptionSidebarProps = {
  activeView: ReceptionView;
  onViewChange: (view: ReceptionView) => void;
};

const navItems: ReceptionNavItem[] = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
  { id: 'checkin', label: 'QR Check-in', icon: QrCode },
  { id: 'walkin', label: 'Walk-in Booking', icon: UserPlus },
  { id: 'rooms', label: 'Room Board', icon: DoorOpen },
  { id: 'arrivals', label: 'Daily Arrivals', icon: CalendarDays },
];

export const ReceptionSidebar = ({ activeView, onViewChange }: ReceptionSidebarProps) => (
  <aside className="w-72 bg-brand-emerald text-brand-cream flex flex-col sticky top-0 h-screen">
    <div className="p-8 border-b border-brand-cream/10">
      <div className="font-cinzel text-xl font-bold tracking-tighter flex flex-col leading-none">
        <span className="text-brand-gold">SUBRA</span>
        <span className="text-[10px] tracking-[0.3em] font-normal">RESIDENCY</span>
      </div>
      <div className="mt-2 text-[9px] uppercase tracking-widest text-brand-gold font-bold">Reception Portal</div>
    </div>

    <nav className="flex-1 p-4 space-y-2 mt-4">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onViewChange(item.id)}
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
            activeView === item.id 
              ? 'bg-brand-gold text-brand-charcoal font-bold shadow-lg' 
              : 'hover:bg-white/5 text-brand-cream/70'
          }`}
        >
          <item.icon size={20} />
          {item.label}
        </button>
      ))}
    </nav>

    <div className="p-4 mt-auto">
      <a href={getPortalUrl('customer')}>
        <Button variant="ghost" className="w-full justify-start text-brand-cream/60 hover:text-brand-gold hover:bg-white/5 gap-4">
          <LogOut size={20} /> Logout
        </Button>
      </a>
    </div>
  </aside>
);

