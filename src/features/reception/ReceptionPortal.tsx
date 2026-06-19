import { useState } from 'react';
import { initialReceptionRooms } from './data';
import { CheckInView } from './components/CheckInView';
import { DashboardView } from './components/DashboardView';
import { ReceptionHeader } from './components/ReceptionHeader';
import { ReceptionSidebar } from './components/ReceptionSidebar';
import { RoomBoard } from './components/RoomBoard';
import { WalkInBooking } from './components/WalkInBooking';
import type { ReceptionRoom, ReceptionView, WalkInFormData } from './types';

export const ReceptionPortal = () => {
  const [activeView, setActiveView] = useState<ReceptionView>('dashboard');
  const [rooms, setRooms] = useState<ReceptionRoom[]>(initialReceptionRooms);

  const handleWalkInConfirm = (data: WalkInFormData) => {
    const availableRoom = rooms.find(r => r.status === 'Available' && r.type.includes(data.type.split(' ')[0]));
    if (availableRoom) {
      setRooms(rooms.map(r => r.id === availableRoom.id ? { ...r, status: 'Occupied', guest: data.name, color: 'destructive' } : r));
      alert(`Booking confirmed for ${data.name}! Room ${availableRoom.id} assigned.`);
      setActiveView('rooms');
    } else {
      alert('No available rooms in this category!');
    }
  };

  return (
    <div className="flex min-h-screen bg-brand-sand/20 font-manrope">
      <ReceptionSidebar activeView={activeView} onViewChange={setActiveView} />

      <main className="flex-1 flex flex-col overflow-hidden">
        <ReceptionHeader />

        <div className="flex-1 overflow-y-auto p-8 bg-[#F8F4EB]/50">
          {activeView === 'dashboard' && <DashboardView />}
          {activeView === 'rooms' && <RoomBoard rooms={rooms} />}
          {activeView === 'walkin' && <WalkInBooking onConfirm={handleWalkInConfirm} />}
          {activeView === 'checkin' && <CheckInView />}
        </div>
      </main>
    </div>
  );
};

