import { ChevronDown, Globe } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { getPortalUrl } from '../../../app/portalDomains';
import type { AdminTab } from '../types';

export const AdminHeader = ({ activeTab }: { activeTab: AdminTab }) => (
  <header className="h-16 border-b border-brand-sand/50 bg-white flex items-center justify-between px-8 shrink-0">
    <div className="flex items-center gap-4">
      <h1 className="font-playfair text-xl font-bold text-brand-charcoal uppercase tracking-widest">
        {activeTab} Portal
      </h1>
      <Badge variant="outline" className="text-[10px] border-brand-gold/30 text-brand-gold bg-brand-gold/5">PROPERTY ID: KUM-01</Badge>
    </div>
    <div className="flex items-center gap-4">
      <a href={getPortalUrl('customer')}>
        <Button variant="ghost" size="sm" className="gap-2 text-xs font-bold">
          <Globe size={14} /> View Website
        </Button>
      </a>
      <div className="h-4 w-px bg-brand-sand/50 mx-2" />
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-brand-emerald text-brand-cream flex items-center justify-center font-bold text-xs">AD</div>
        <ChevronDown size={14} className="text-brand-charcoal/40" />
      </div>
    </div>
  </header>
);

