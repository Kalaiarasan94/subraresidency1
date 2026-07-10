import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { API_BASE_URL } from '../../../lib/api';

interface Props {
  onAddRoom?: () => void;
  onEditRoom?: (room: any) => void;
}

export const CategoryManagement: React.FC<Props> = ({ onAddRoom, onEditRoom }) => {
  const [categories, setCategories] = useState<any[]>([]);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/rooms/categories`);
      if (res.status === 404) {
          setCategories([]);
          return;
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        setCategories(data);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error('Failed to fetch rooms', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Room Management</h1>
          <p className="text-sm text-slate-500 font-medium">Control inventory, pricing, and visibility.</p>
        </div>
        <Button onClick={() => onAddRoom?.()} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2 rounded-lg text-sm h-auto shadow-sm">
          + Add New Room
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat, idx) => (
          <Card key={idx} className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all rounded-xl overflow-hidden group">
            <div className="relative aspect-video bg-slate-100">
              {cat.image ? (
                <img src={cat.image} alt={cat.title || cat.room_name} className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-300 font-bold uppercase text-xs">No Preview</div>
              )}
              <div className="absolute top-2 right-2">
                 <Button 
                   onClick={() => onEditRoom?.(cat)}
                   className="bg-white text-indigo-600 hover:bg-indigo-600 hover:text-white border border-indigo-150 font-bold text-[10px] px-3 py-1.5 h-auto rounded-md shadow-sm"
                 >
                   Edit
                 </Button>
              </div>
            </div>
            <CardContent className="p-5">
              <h3 className="text-lg font-bold text-slate-800 mb-1">{cat.title || cat.room_name}</h3>
              <p className="text-indigo-650 font-bold text-sm mb-4">₹{Number(cat.price || cat.base_price).toLocaleString('en-IN')} / Night</p>
              
              <div className="grid grid-cols-3 gap-2 border-y border-slate-50 py-3 mb-4">
                 <div className="text-center">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Adults</p>
                    <p className="text-sm font-bold text-slate-700">{cat.adults || cat.max_adults}</p>
                 </div>
                 <div className="text-center border-x border-slate-50">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Bed</p>
                    <p className="text-sm font-bold text-slate-700 truncate px-1">{cat.bed_type?.split(' ')[0]}</p>
                 </div>
                 <div className="text-center">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Status</p>
                    <p className="text-xs font-bold text-indigo-600 uppercase">Live</p>
                 </div>
              </div>
              
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {cat.description || cat.full_description || "No public description provided for this room configuration."}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
