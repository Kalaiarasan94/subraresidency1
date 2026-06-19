import { QrCode } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';

export const CheckInView = () => (
  <div className="max-w-2xl mx-auto space-y-8 py-12 animate-in slide-in-from-bottom-4 duration-500">
    <div className="text-center space-y-2">
      <h2 className="text-3xl font-playfair font-bold text-brand-charcoal">Optical Token Verification</h2>
      <p className="text-sm text-brand-charcoal/60">Scan the guest's digital booking pass to initiate automated check-in.</p>
    </div>
    
    <Card className="border-2 border-dashed border-brand-gold/40 bg-white p-12 text-center shadow-2xl">
      <div className="relative inline-block">
        <QrCode size={120} className="text-brand-emerald mx-auto mb-6 animate-pulse" />
        <div className="absolute inset-0 border-2 border-brand-gold/20 rounded-lg animate-ping" />
      </div>
      <div className="space-y-4">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-charcoal/40">Waiting for scanner data...</p>
        <Button variant="gold" size="lg" className="w-full font-bold shadow-xl" onClick={() => alert('Simulated Scan: Guest John Doe Verified.')}>
          Simulate Manual ID Scan
        </Button>
        <p className="text-[10px] text-brand-charcoal/30 font-manrope">Powered by SubraSecureâ„¢ Optical Logic</p>
      </div>
    </Card>
  </div>
);

