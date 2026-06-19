import { Bell, Search } from 'lucide-react';

export const ReceptionHeader = () => (
  <header className="h-20 bg-white border-b border-brand-sand/30 flex items-center justify-between px-8 shrink-0">
    <div className="relative w-96">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-charcoal/30" size={18} />
      <input 
        type="text" 
        placeholder="Search booking ID, guest name..." 
        className="w-full bg-brand-sand/20 border-none rounded-full pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-gold"
      />
    </div>
    <div className="flex items-center gap-6">
      <button className="relative text-brand-charcoal/60 hover:text-brand-emerald transition-colors">
        <Bell size={22} />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-gold text-brand-charcoal text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">3</span>
      </button>
      <div className="flex items-center gap-3 pl-6 border-l border-brand-sand/50">
        <div className="text-right">
          <p className="text-xs font-bold text-brand-charcoal leading-none">Vignesh S.</p>
          <p className="text-[10px] text-brand-charcoal/40 uppercase font-bold tracking-tighter">Front Office Lead</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-brand-gold flex items-center justify-center font-bold text-brand-charcoal">VS</div>
      </div>
    </div>
  </header>
);

