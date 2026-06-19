import { Check } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';

export const SettingsView = () => (
  <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
    <div className="flex justify-between items-end">
      <div>
        <p className="text-xs font-bold text-brand-gold uppercase tracking-[0.2em] mb-1">System Configuration</p>
        <h2 className="text-3xl font-playfair font-bold text-brand-charcoal">Global Settings</h2>
      </div>
      <Button variant="gold" className="gap-2">
        <Check size={16} /> Save Settings
      </Button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <aside className="space-y-2">
        {['General Info', 'Notifications', 'Security', 'User Management', 'API Access'].map((item, i) => (
          <button key={i} className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all ${i === 0 ? 'bg-brand-emerald text-brand-cream shadow-md' : 'text-brand-charcoal/60 hover:bg-brand-sand/30'}`}>
            {item}
          </button>
        ))}
      </aside>

      <div className="md:col-span-2 space-y-6">
        <Card className="border-none shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="font-playfair text-xl">Property Details</CardTitle>
            <CardDescription>Core identity and contact information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-brand-charcoal/60">Property Name</label>
                <input className="w-full bg-brand-sand/20 border-brand-sand/30 rounded-lg p-3 outline-none" defaultValue="The Subra Heritage" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-brand-charcoal/60">Property ID</label>
                <input className="w-full bg-brand-sand/20 border-brand-sand/30 rounded-lg p-3 outline-none" defaultValue="KUM-01" disabled />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-brand-charcoal/60">Official Email</label>
              <input className="w-full bg-brand-sand/20 border-brand-sand/30 rounded-lg p-3 outline-none" defaultValue="info@subraheritage.com" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-brand-charcoal/60">Contact Number</label>
              <input className="w-full bg-brand-sand/20 border-brand-sand/30 rounded-lg p-3 outline-none" defaultValue="+91 98765 43210" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="font-playfair text-xl">Operational Preferences</CardTitle>
            <CardDescription>Configure basic hotel operations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-2">
              <div>
                <p className="font-bold text-brand-charcoal">Auto-Confirm Direct Bookings</p>
                <p className="text-xs text-brand-charcoal/60">Skip manual approval for website reservations</p>
              </div>
              <div className="w-12 h-6 bg-brand-emerald rounded-full relative p-1 cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full absolute right-1" />
              </div>
            </div>
            <div className="flex items-center justify-between p-2">
              <div>
                <p className="font-bold text-brand-charcoal">SMS Guest Notifications</p>
                <p className="text-xs text-brand-charcoal/60">Send automated booking details via SMS</p>
              </div>
              <div className="w-12 h-6 bg-brand-sand rounded-full relative p-1 cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full absolute left-1" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);

