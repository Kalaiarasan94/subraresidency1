import { BedDouble, Plus } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import type { AdminRoom } from '../types';

type RoomManagementTableProps = {
  rooms: AdminRoom[];
  onAdd: () => void;
  onEdit: (room: AdminRoom) => void;
};

export const RoomManagementTable = ({ rooms, onAdd, onEdit }: RoomManagementTableProps) => {
  return (
    <Card className="border-none shadow-sm overflow-hidden bg-white">
      <CardHeader className="border-b border-brand-sand/30 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-playfair">Global Room Inventory</CardTitle>
          <CardDescription>Manage property units, pricing, and availability states</CardDescription>
        </div>
        <Button variant="gold" size="sm" className="font-bold gap-2" onClick={onAdd}>
          <Plus size={16} /> Add New Room
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-brand-sand/20 border-b border-brand-sand/30">
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-brand-charcoal/40">Photo</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-brand-charcoal/40">Room ID</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-brand-charcoal/40">Category</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-brand-charcoal/40">Floor</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-brand-charcoal/40">Base Price</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-brand-charcoal/40">Status</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-brand-charcoal/40 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-sand/30">
            {rooms.map((row) => (
              <tr key={row.id} className="hover:bg-brand-sand/10 transition-colors">
                <td className="px-6 py-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-brand-sand/30 bg-brand-sand/10">
                    {row.image ? (
                      <img src={row.image} alt={row.id} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-brand-charcoal/20">
                        <BedDouble size={20} />
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-brand-emerald">{row.id}</td>
                <td className="px-6 py-4 text-sm font-semibold">{row.type}</td>
                <td className="px-6 py-4 text-sm text-brand-charcoal/60">{row.floor}</td>
                <td className="px-6 py-4 text-sm font-bold text-brand-gold">{row.price}</td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-tighter ${
                    row.status === 'Available' ? 'bg-emerald-100 text-emerald-800' :
                    row.status === 'Occupied' ? 'bg-blue-100 text-blue-800' :
                    row.status === 'Reserved' ? 'bg-amber-100 text-amber-800' :
                    'bg-slate-100 text-slate-800'
                  }`}>
                    {row.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Button variant="ghost" size="sm" className="text-brand-emerald font-bold text-[10px] uppercase" onClick={() => onEdit(row)}>Edit</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};

