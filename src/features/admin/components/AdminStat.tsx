import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/card';

type AdminStatProps = {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
};

export const AdminStat = ({ title, value, change, icon: Icon }: AdminStatProps) => (
  <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
    <CardContent className="p-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <p className="text-xs font-bold text-brand-charcoal/40 uppercase tracking-widest">{title}</p>
          <p className="text-2xl font-manrope font-extrabold text-brand-charcoal">{value}</p>
          <p className={`text-[10px] font-bold ${change.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>
            {change} <span className="text-brand-charcoal/30 font-normal">vs last month</span>
          </p>
        </div>
        <div className="w-12 h-12 rounded-full bg-brand-sand/30 flex items-center justify-center text-brand-emerald">
          <Icon size={24} />
        </div>
      </div>
    </CardContent>
  </Card>
);

