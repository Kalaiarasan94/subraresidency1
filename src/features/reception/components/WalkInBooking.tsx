import React, { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import type { WalkInFormData } from '../types';

export const WalkInBooking = ({ onConfirm }: { onConfirm: (data: WalkInFormData) => void }) => {
  const [formData, setFormData] = useState<WalkInFormData>({
    name: '',
    phone: '',
    type: 'Deluxe Heritage Room',
    checkIn: '',
    checkOut: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(formData);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-playfair font-bold text-brand-charcoal">New Walk-in Reservation</h2>
          <p className="text-sm text-brand-charcoal/60 uppercase tracking-widest font-bold">Front-desk booking engine</p>
        </div>
      </div>
      <Card className="border-none shadow-2xl bg-white">
        <CardContent className="p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-charcoal/40">Guest Full Name</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} type="text" className="w-full bg-brand-sand/20 border-brand-sand/30 rounded-lg p-3 outline-none focus:ring-2 focus:ring-brand-gold" placeholder="Enter guest name" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-charcoal/40">Mobile Number</label>
                <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} type="text" className="w-full bg-brand-sand/20 border-brand-sand/30 rounded-lg p-3 outline-none focus:ring-2 focus:ring-brand-gold" placeholder="+91 00000 00000" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-charcoal/40">Room Category</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-brand-sand/20 border-brand-sand/30 rounded-lg p-3 outline-none focus:ring-2 focus:ring-brand-gold">
                  <option>Deluxe Heritage Room</option>
                  <option>Executive Temple Suite</option>
                  <option>Subra Royal Family Suite</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-charcoal/40">Duration of Stay</label>
                <div className="grid grid-cols-2 gap-2">
                  <input required value={formData.checkIn} onChange={e => setFormData({...formData, checkIn: e.target.value})} type="date" className="bg-brand-sand/20 border-brand-sand/30 rounded-lg p-3 text-sm outline-none" />
                  <input required value={formData.checkOut} onChange={e => setFormData({...formData, checkOut: e.target.value})} type="date" className="bg-brand-sand/20 border-brand-sand/30 rounded-lg p-3 text-sm outline-none" />
                </div>
              </div>
            </div>
            <div className="p-6 bg-brand-emerald text-brand-cream rounded-luxury">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest opacity-60">Estimated Total</p>
                  <p className="text-3xl font-playfair font-bold">â‚¹7,000.00</p>
                </div>
                <Button type="submit" variant="gold" className="font-bold px-12 h-12">Confirm & Assign Room</Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

