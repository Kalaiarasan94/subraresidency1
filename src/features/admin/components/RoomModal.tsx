import React from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import type { AdminRoom } from '../types';

type RoomModalProps = {
  editingRoom: AdminRoom | null;
  previewImage: string | null;
  onClose: () => void;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPreviewClear: () => void;
  onSave: (event: React.FormEvent) => void;
};

export const RoomModal = ({ editingRoom, previewImage, onClose, onImageChange, onPreviewClear, onSave }: RoomModalProps) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-charcoal/80 backdrop-blur-sm">
    <div className="bg-white w-full max-w-md rounded-luxury shadow-2xl overflow-hidden p-8 animate-in zoom-in-95 duration-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-playfair text-2xl font-bold text-brand-charcoal">{editingRoom ? 'Edit Room' : 'Add New Room'}</h2>
        <button onClick={onClose}><X size={24} className="text-brand-charcoal/40" /></button>
      </div>
      <form onSubmit={onSave} className="space-y-4">
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-brand-charcoal/60">Room ID</label>
          <input name="id" defaultValue={editingRoom?.id} required className="w-full bg-brand-sand/20 border-brand-sand/30 rounded-lg p-3 outline-none" placeholder="e.g. 501" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-brand-charcoal/60">Category</label>
          <select name="type" defaultValue={editingRoom?.type || 'Deluxe Heritage'} className="w-full bg-brand-sand/20 border-brand-sand/30 rounded-lg p-3 outline-none">
            <option>Deluxe Heritage</option>
            <option>Executive Suite</option>
            <option>Royal Family</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-brand-charcoal/60">Room Photo</label>
          <div className="flex flex-col gap-3">
            {previewImage && (
              <div className="relative w-full h-32 rounded-lg overflow-hidden border border-brand-sand/30">
                <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                <button 
                  type="button" 
                  onClick={onPreviewClear}
                  className="absolute top-2 right-2 p-1 bg-white/80 rounded-full text-brand-charcoal hover:bg-white"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={onImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Button type="button" variant="outline" className="w-full border-dashed border-2 border-brand-sand/50 h-12 text-brand-charcoal/40 font-bold">
                  <Plus size={16} className="mr-2" /> Upload Photo
                </Button>
              </div>
              <div className="flex-1">
                <input name="image" defaultValue={editingRoom?.image} className="w-full bg-brand-sand/20 border-brand-sand/30 rounded-lg p-3 outline-none h-12 text-sm" placeholder="Or paste URL..." />
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-charcoal/60">Floor</label>
            <input name="floor" defaultValue={editingRoom?.floor} required className="w-full bg-brand-sand/20 border-brand-sand/30 rounded-lg p-3 outline-none" placeholder="e.g. 5th Floor" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-charcoal/60">Price</label>
            <input name="price" defaultValue={editingRoom?.price} required className="w-full bg-brand-sand/20 border-brand-sand/30 rounded-lg p-3 outline-none" placeholder="â‚¹4,000" />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-brand-charcoal/60">Status</label>
          <select name="status" defaultValue={editingRoom?.status || 'Available'} className="w-full bg-brand-sand/20 border-brand-sand/30 rounded-lg p-3 outline-none">
            <option>Available</option>
            <option>Occupied</option>
            <option>Reserved</option>
            <option>Maintenance</option>
          </select>
        </div>
        <Button type="submit" variant="gold" className="w-full h-12 font-bold uppercase tracking-widest text-xs mt-4">
          {editingRoom ? 'Update Room' : 'Save Room'}
        </Button>
      </form>
    </div>
  </div>
);

