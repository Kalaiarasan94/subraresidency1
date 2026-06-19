import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Card, CardContent } from '../../../components/ui/card';
import type { ReceptionRoom } from '../types';

export const RoomBoard = ({ rooms }: { rooms: ReceptionRoom[] }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-playfair font-bold text-brand-charcoal">Room Inventory Matrix</h2>
          <p className="text-xs text-brand-charcoal/60 font-manrope uppercase tracking-wider">Live physical room occupancy status</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="text-xs uppercase font-bold tracking-widest">Filter</Button>
          <Button variant="gold" size="sm" className="text-xs uppercase font-bold tracking-widest">Update All</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {rooms.map((room) => (
          <Card key={room.id} className="hover:shadow-lg transition-shadow border-brand-sand/20 bg-white">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-playfair font-black text-brand-emerald">{room.id}</span>
                <Badge variant={room.color as any}>{room.status}</Badge>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-brand-charcoal/40 uppercase tracking-widest">{room.type}</p>
                <p className="text-sm font-manrope font-semibold text-brand-charcoal truncate">
                  {room.guest !== '-' ? room.guest : 'Ready for Check-in'}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

