import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/card';

type KPICardProps = {
  title: string;
  value: string;
  icon: LucideIcon;
  trend: string;
  color: string;
};

export const KPICard = ({ title, value, icon: Icon, trend, color }: KPICardProps) => (
  <Card className="border-none shadow-md overflow-hidden">
    <CardContent className="p-6">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <p className="text-xs font-bold text-brand-charcoal/40 uppercase tracking-widest">{title}</p>
          <p className="text-3xl font-playfair font-bold text-brand-charcoal">{value}</p>
          <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
            {trend} <span className="text-brand-charcoal/30 font-normal">than yesterday</span>
          </p>
        </div>
        <div className={`p-3 rounded-luxury ${color} text-white shadow-lg`}>
          <Icon size={24} />
        </div>
      </div>
    </CardContent>
  </Card>
);

