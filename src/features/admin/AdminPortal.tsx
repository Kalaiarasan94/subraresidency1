import React, { useState } from 'react';
import { initialRooms } from './data';
import { AdminHeader } from './components/AdminHeader';
import { AdminSidebar } from './components/AdminSidebar';
import { AnalyticsView } from './components/AnalyticsView';
import { BillingView } from './components/BillingView';
import { RoomModal } from './components/RoomModal';
import { RoomsView } from './components/RoomsView';
import { SettingsView } from './components/SettingsView';
import type { AdminRoom, AdminTab } from './types';

export const AdminPortal = () => {
  const [activeTab, setActiveTab] = React.useState<AdminTab>('analytics');
  const [rooms, setRooms] = useState<AdminRoom[]>(initialRooms);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<AdminRoom | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleAddRoom = () => {
    setEditingRoom(null);
    setPreviewImage(null);
    setIsModalOpen(true);
  };

  const handleEditRoom = (room: AdminRoom) => {
    setEditingRoom(room);
    setPreviewImage(room.image || null);
    setIsModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const roomData: AdminRoom = {
      id: formData.get('id') as string,
      type: formData.get('type') as string,
      status: formData.get('status') as string,
      price: formData.get('price') as string,
      floor: formData.get('floor') as string,
      image: previewImage || (formData.get('image') as string),
    };

    if (editingRoom) {
      setRooms(rooms.map(r => r.id === editingRoom.id ? roomData : r));
    } else {
      setRooms([...rooms, roomData]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-[#FDFBF7] font-manrope overflow-hidden relative">
      {isModalOpen && (
        <RoomModal
          editingRoom={editingRoom}
          previewImage={previewImage}
          onClose={() => setIsModalOpen(false)}
          onImageChange={handleImageChange}
          onPreviewClear={() => setPreviewImage(null)}
          onSave={handleSaveRoom}
        />
      )}

      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader activeTab={activeTab} />

        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-brand-sand/10">
          {activeTab === 'analytics' && <AnalyticsView />}
          {activeTab === 'rooms' && <RoomsView rooms={rooms} onAdd={handleAddRoom} onEdit={handleEditRoom} />}
          {activeTab === 'billing' && <BillingView />}
          {activeTab === 'settings' && <SettingsView />}
        </div>
      </main>
    </div>
  );
};

