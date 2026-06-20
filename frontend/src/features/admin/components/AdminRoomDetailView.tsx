import React from 'react';
import { 
  ArrowLeft, Star, MapPin, 
  CheckCircle2, Edit3, Trash2, Globe
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';

interface Props {
  room: any;
  onBack: () => void;
  onEdit: (room: any) => void;
  onDelete?: (id: number) => void;
}

export const AdminRoomDetailView: React.FC<Props> = ({ room, onBack, onEdit, onDelete }) => {
  const galleryImages = room.images && room.images.length > 0 ? room.images : [room.image];

  return (
    <div className="bg-white min-h-screen rounded-3xl border border-slate-200 overflow-hidden shadow-sm font-sans">
      {/* Admin Action Bar */}
      <div className="bg-emerald-900 px-8 py-4 flex justify-between items-center text-white">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-emerald-100 hover:text-white transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-xs uppercase tracking-widest">Back to Inventory</span>
        </button>
        <div className="flex gap-4">
           <Button 
             onClick={() => onEdit(room)}
             className="bg-white text-emerald-900 hover:bg-emerald-50 px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-widest shadow-lg flex items-center gap-2"
           >
             <Edit3 size={14} /> Full Edit Configuration
           </Button>
           {onDelete && (
             <Button 
               variant="outline"
               onClick={() => onDelete(room.id)}
               className="border-emerald-700 text-emerald-100 hover:bg-rose-500 hover:text-white hover:border-rose-500 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all"
             >
               <Trash2 size={14} />
             </Button>
           )}
        </div>
      </div>

      <div className="p-8 max-w-6xl mx-auto">
        {/* Mirror Frontend UI */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-slate-100 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
               <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest border border-emerald-100">Official Preview</span>
               {room.show_on_website ? (
                 <span className="flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase border border-emerald-100"><Globe size={10} /> Live on Website</span>
               ) : (
                 <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-0.5 rounded uppercase border border-slate-100">Draft / Internal</span>
               )}
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-3 tracking-tight">
              {room.title || room.room_name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 font-bold">
              <div className="flex items-center gap-1">
                <Star size={16} className="text-amber-500 fill-amber-500" />
                <span className="text-slate-800">4.9 Internal Rating</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <MapPin size={16} />
                <span>Kumbakonam Residency</span>
              </div>
            </div>
          </div>
          <div className="text-right">
             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Nightly Rate</p>
             <p className="text-3xl font-bold text-emerald-600">₹{room.price || room.base_price}</p>
          </div>
        </div>

        {/* Gallery Preview */}
        <div className="grid grid-cols-4 gap-3 h-80 mb-12 rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
           <div className="col-span-2 row-span-2 overflow-hidden bg-slate-100">
              <img src={galleryImages[0]} className="w-full h-full object-cover" />
           </div>
           <div className="overflow-hidden bg-slate-100"><img src={galleryImages[1] || galleryImages[0]} className="w-full h-full object-cover" /></div>
           <div className="overflow-hidden bg-slate-100"><img src={galleryImages[2] || galleryImages[0]} className="w-full h-full object-cover" /></div>
           <div className="overflow-hidden bg-slate-100"><img src={galleryImages[3] || galleryImages[0]} className="w-full h-full object-cover" /></div>
           <div className="overflow-hidden bg-slate-100 opacity-50"><img src={galleryImages[4] || galleryImages[0]} className="w-full h-full object-cover" /></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-12">
             <section className="pb-12 border-b border-slate-100">
                <h3 className="text-sm font-bold text-emerald-600 uppercase tracking-widest mb-4">Official Public Description</h3>
                <p className="text-slate-700 leading-relaxed text-lg whitespace-pre-wrap font-medium">
                   {room.full_description || room.description || "No detailed description entered for this room."}
                </p>
             </section>

             <section className="pb-12 border-b border-slate-100">
                <h3 className="text-sm font-bold text-emerald-600 uppercase tracking-widest mb-6">Amenity Highlights</h3>
                <div className="grid grid-cols-2 gap-y-4">
                  {(room.amenities || []).map((amenity: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 text-slate-700">
                       <CheckCircle2 size={18} className="text-emerald-500" />
                       <span className="font-bold text-sm tracking-tight">{amenity}</span>
                    </div>
                  ))}
                </div>
             </section>

             <section className="pb-12 border-b border-slate-100">
                <h3 className="text-sm font-bold text-emerald-600 uppercase tracking-widest mb-4">Internal Specs</h3>
                <div className="grid grid-cols-3 gap-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                   <div className="text-center">
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Max Adults</p>
                      <p className="text-xl font-bold text-slate-800">{room.adults || 2}</p>
                   </div>
                   <div className="text-center border-x border-slate-200 px-4">
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Bed Configuration</p>
                      <p className="text-xl font-bold text-slate-800">{room.bed_type || 'King'}</p>
                   </div>
                   <div className="text-center">
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Area</p>
                      <p className="text-xl font-bold text-slate-800">{room.size || '450'} ft²</p>
                   </div>
                </div>
             </section>
          </div>

          <div className="lg:col-span-1">
             <Card className="rounded-3xl shadow-lg border-emerald-100 bg-emerald-50/30 overflow-hidden sticky top-24">
                <CardContent className="p-8 space-y-6">
                   <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-4 border-b border-emerald-100 pb-2">Status & Rules</h3>
                   <div className="space-y-4">
                      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
                         <span className="text-xs font-bold text-slate-400 uppercase">Live Status</span>
                         <span className={`text-xs font-black uppercase tracking-widest ${room.status === 'Available' ? 'text-emerald-600' : 'text-amber-600'}`}>
                           {room.status}
                         </span>
                      </div>
                      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">House Rules Summary</p>
                         <p className="text-sm font-medium text-slate-600 leading-relaxed whitespace-pre-wrap italic">
                            {room.house_rules || "No specific rules configured."}
                         </p>
                      </div>
                   </div>
                   <Button 
                     onClick={() => onEdit(room)}
                     className="w-full bg-emerald-900 hover:bg-emerald-800 text-white font-bold uppercase tracking-widest py-6 rounded-xl shadow-lg h-auto transition-all active:scale-95"
                   >
                     Navigate to Editor
                   </Button>
                </CardContent>
             </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
