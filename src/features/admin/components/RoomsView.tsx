import type { AdminRoom } from '../types';
import { RoomManagementTable } from './RoomManagementTable';

type RoomsViewProps = {
  rooms: AdminRoom[];
  onAdd: () => void;
  onEdit: (room: AdminRoom) => void;
};

export const RoomsView = ({ rooms, onAdd, onEdit }: RoomsViewProps) => (
  <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
    <div className="flex justify-between items-end">
      <div>
        <p className="text-xs font-bold text-brand-gold uppercase tracking-[0.2em] mb-1">Infrastructure Control</p>
        <h2 className="text-3xl font-playfair font-bold text-brand-charcoal">Room Inventory</h2>
      </div>
    </div>
    <RoomManagementTable rooms={rooms} onAdd={onAdd} onEdit={onEdit} />
  </div>
);

