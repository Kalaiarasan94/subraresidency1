import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { API_BASE_URL } from '../../../lib/api';


interface Room {
  room_number: number;
  category: string;
  floor: string;
  price: number;
  status: 'available' | 'occupied';
}

interface RoomManagementProps {
  onAddRoom?: () => void;
}

export const RoomManagement: React.FC<RoomManagementProps> = ({ onAddRoom }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [roomNumber, setRoomNumber] = useState('');
  const [category, setCategory] = useState('');
  const [floor, setFloor] = useState('');
  const [price, setPrice] = useState('');
  const [categories, setCategories] = useState<Array<{id:number; title:string}>>([]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryAdults, setNewCategoryAdults] = useState('2');
  const [newCategoryGuests, setNewCategoryGuests] = useState('0');
  const [status, setStatus] = useState('available');

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/rooms/categories`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setCategories(data);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error('Failed to fetch categories', err);
    }
  };

  // Load rooms from backend
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/rooms/list`);
        const data = await response.json();
        setRooms(data);
      } catch (err) {
        console.error('Failed to fetch rooms', err);
        setRooms([]);
      }
    };
    fetchRooms();
    fetchCategories();
  }, []);

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const response = await fetch(`${API_BASE_URL}/rooms/createCategory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: newCategoryName,
          adults: parseInt(newCategoryAdults) || 2,
          children: parseInt(newCategoryGuests) || 0
        }),
      });
      if (!response.ok) throw new Error('Failed to create category');
      const data = await response.json();
      setCategories(prev => [...prev, { id: data.id, title: data.title }]);
      setCategory(data.id.toString());
      setIsAddingCategory(false);
      setNewCategoryName('');
      setNewCategoryAdults('2');
      setNewCategoryGuests('0');
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStatus = async (room: Room) => {
    const newStatus = room.status === 'available' ? 'occupied' : 'available';
    try {
      const response = await fetch(`${API_BASE_URL}/rooms/updateStatus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ room_number: room.room_number, status: newStatus }),
      });
      if (!response.ok) throw new Error('Failed to update status');
      setRooms(prev => prev.map(r => (r.room_number === room.room_number ? { ...r, status: newStatus } : r)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/rooms/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          room_number: roomNumber,
          category_id: category,
          floor,
          price: parseFloat(price),
          status,
        }),
      });
      if (!response.ok) throw new Error('Failed to add room');
      setRooms(prev => [
        ...prev,
        {
          room_number: parseInt(roomNumber),
          category,
          floor,
          price: parseFloat(price),
          status: status as 'available' | 'occupied',
        },
      ]);
      setShowModal(false);
      setRoomNumber('');
      setCategory('');
      setFloor('');
      setPrice('');
      setStatus('available');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-catalogue-green mb-1">Room Management</h1>
          <p className="text-slate-500">Manage room inventory and status.</p>
        </div>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 tracking-widest border-b border-slate-100">
                  <th className="px-6 py-4">Room No</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Floor</th>
                  <th className="px-6 py-4">Price (24h)</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {rooms.map(room => (
                  <tr key={room.room_number} className="hover:bg-brand-cream/10 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-catalogue-green">{room.room_number}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{room.category}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{room.floor}</td>
                    <td className="px-6 py-4 text-sm font-bold text-catalogue-gold">₹{room.price}</td>
                    <td className="px-6 py-4">
                      <Badge className={`rounded-none px-3 py-1 font-bold text-[10px] uppercase tracking-wider ${room.status === 'occupied' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button variant="ghost" className="text-slate-400 hover:text-catalogue-gold text-[10px]" onClick={() => toggleStatus(room)}>
                        {room.status === 'available' ? 'Mark Occupied' : 'Mark Available'}
                      </Button>
                      <Button variant="ghost" className="text-slate-400 hover:text-catalogue-gold text-[10px]">Edit</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal for adding a new room */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-playfair font-bold text-catalogue-green mb-4">Add New Room</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Room Number</label>
                <input type="text" required value={roomNumber} onChange={e => setRoomNumber(e.target.value)} className="mt-1 w-full border border-slate-300 rounded-none p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Category</label>
                {isAddingCategory ? (
                  <div className="mt-1 flex flex-col space-y-2">
                    <input 
                      type="text" 
                      placeholder="New Category Name" 
                      value={newCategoryName} 
                      onChange={e => setNewCategoryName(e.target.value)} 
                      className="w-full border border-slate-300 rounded-none p-2 text-sm" 
                    />
                    <div className="flex space-x-2">
                      <input 
                        type="number" 
                        placeholder="Adults" 
                        value={newCategoryAdults} 
                        onChange={e => setNewCategoryAdults(e.target.value)} 
                        className="w-1/2 border border-slate-300 rounded-none p-2 text-sm" 
                        min="1"
                      />
                      <input 
                        type="number" 
                        placeholder="Children/Guests" 
                        value={newCategoryGuests} 
                        onChange={e => setNewCategoryGuests(e.target.value)} 
                        className="w-1/2 border border-slate-300 rounded-none p-2 text-sm" 
                        min="0"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button type="button" onClick={handleCreateCategory} className="bg-catalogue-gold text-white px-4 w-full">Save</Button>
                      <Button type="button" variant="outline" onClick={() => setIsAddingCategory(false)} className="text-slate-500 w-full">Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <select
                      required
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      className="mt-1 w-full border border-slate-300 rounded-none p-2"
                    >
                      <option value="">Select category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.title}</option>
                      ))}
                    </select>
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-2 border-slate-300 text-slate-600"
                      onClick={() => setIsAddingCategory(true)}
                    >
                      + Add Category
                    </Button>
                  </>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Floor</label>
                <input type="text" required value={floor} onChange={e => setFloor(e.target.value)} className="mt-1 w-full border border-slate-300 rounded-none p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Price (24h)</label>
                <input type="number" required value={price} onChange={e => setPrice(e.target.value)} className="mt-1 w-full border border-slate-300 rounded-none p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Status</label>
                <select value={status} onChange={e => setStatus(e.target.value)} className="mt-1 w-full border border-slate-300 rounded-none p-2">
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="border-slate-300 text-slate-600">Cancel</Button>
                <Button type="submit" className="bg-catalogue-green text-white">Add Room</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
