import { BarChart3, BedDouble, CreditCard, Settings, Users } from 'lucide-react';
import type { AdminTab } from '../types';

type AdminSidebarProps = {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
};

const navItems: { id: AdminTab; icon: typeof BarChart3 }[] = [
  { id: 'analytics', icon: BarChart3 },
  { id: 'guests', icon: Users },
  { id: 'rooms', icon: BedDouble },
  { id: 'billing', icon: CreditCard },
  { id: 'settings', icon: Settings },
];

export const AdminSidebar = ({ activeTab, onTabChange }: AdminSidebarProps) => (
  <aside className="w-20 bg-brand-charcoal flex flex-col items-center py-8 gap-8 border-r border-white/5 shrink-0">
    <div className="w-10 h-10 bg-brand-gold rounded-lg flex items-center justify-center font-cinzel font-black text-brand-charcoal text-xl shadow-lg shadow-brand-gold/20">
      S
    </div>
    <nav className="flex flex-col gap-6">
      {navItems.map((item) => (
        <button 
          key={item.id} 
          onClick={() => onTabChange(item.id)}
          className={`p-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-brand-emerald text-brand-cream' : 'text-brand-cream/30 hover:text-brand-cream hover:bg-white/5'}`}
        >
          <item.icon size={20} />
        </button>
      ))}
    </nav>
  </aside>
);

