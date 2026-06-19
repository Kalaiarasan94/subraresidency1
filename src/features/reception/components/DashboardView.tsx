import { AlertTriangle, CheckCircle2, Clock, DoorOpen } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { KPICard } from './KPICard';

export const DashboardView = () => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KPICard title="Today's Arrivals" value="12" icon={CheckCircle2} trend="+4" color="bg-brand-emerald" />
      <KPICard title="Today's Departures" value="08" icon={Clock} trend="-2" color="bg-brand-gold" />
      <KPICard title="Occupied Rooms" value="24" icon={DoorOpen} trend="+1" color="bg-brand-charcoal" />
      <KPICard title="Pending Actions" value="03" icon={AlertTriangle} trend="0" color="bg-brand-emerald/40" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Card className="lg:col-span-2 border-none shadow-xl">
        <CardHeader>
          <CardTitle className="font-playfair">Recent Check-ins</CardTitle>
          <CardDescription>Real-time guest flow monitoring</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-brand-sand/10 border border-brand-sand/20 hover:border-brand-gold/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand-emerald/10 flex items-center justify-center text-brand-emerald font-bold">JD</div>
                  <div>
                    <p className="font-bold text-brand-charcoal">John Doe</p>
                    <p className="text-[10px] uppercase font-bold text-brand-charcoal/40 tracking-wider">#SR-2026-9412 â€¢ Room 202</p>
                  </div>
                </div>
                <Badge variant="success">Completed</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="border-none shadow-xl bg-brand-emerald text-brand-cream">
        <CardHeader>
          <CardTitle className="font-playfair text-brand-gold">Upcoming Events</CardTitle>
          <CardDescription className="text-brand-cream/60 uppercase tracking-widest text-[10px] font-bold">Temple Festivals & Tourism</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border-l-2 border-brand-gold pl-4 py-1">
            <p className="font-bold text-sm">Mahamaham Rituals</p>
            <p className="text-xs text-brand-cream/60">Starts at 04:30 AM Tomorrow</p>
          </div>
          <div className="border-l-2 border-brand-gold/30 pl-4 py-1">
            <p className="font-bold text-sm">Sarangapani Car Festival</p>
            <p className="text-xs text-brand-cream/60">Next Tuesday â€¢ Peak Demand</p>
          </div>
          <Button variant="gold" className="w-full mt-4 uppercase text-[10px] tracking-[0.2em]">View Event Calendar</Button>
        </CardContent>
      </Card>
    </div>
  </div>
);

