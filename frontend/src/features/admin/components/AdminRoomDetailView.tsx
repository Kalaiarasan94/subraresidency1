import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Star, MapPin, 
  CheckCircle2, Globe, Save, Loader2, Camera, Info,
  Trash2, Plus, Crown, Bed, Users, Layers, Sparkles,
  Wrench, FileText, Check, AlertCircle, Image as ImageIcon
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { 
  updateRoomDetails, 
  uploadGalleryImage, 
  deleteGalleryImage, 
  BACKEND_URL, 
  addSubRoom, 
  updateSubRoom, 
  deleteSubRoom, 
  API_BASE_URL, 
  deleteRoomCategory 
} from '../../../lib/api';
import { 
  resolveRoomImageUrl, 
  handleImageError, 
  extractRoomPrice 
} from '../../../lib/roomImageHelper';

interface Props {
  room: any;
  onBack: () => void;
  onRefresh: () => void;
}

const ALL_AVAILABLE_AMENITIES = [
  "High-Speed WiFi",
  "Air Conditioning",
  "Smart TV",
  "Temple View",
  "Room Service",
  "Attached Bathroom",
  "Hot Water",
  "Mini Fridge",
  "Tea/Coffee Maker",
  "Balcony",
  "Workspace",
  "Daily Housekeeping",
  "In-room Safe",
  "Iron & Board",
  "Hair Dryer",
  "Mini Bar"
];

export const AdminRoomDetailView: React.FC<Props> = ({ room, onBack, onRefresh }) => {
  const [activeTab, setActiveTab] = useState<'specs' | 'gallery' | 'amenities' | 'units' | 'description'>('specs');
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const initialPrice = extractRoomPrice(room);

  const [formData, setFormData] = useState({
    id: room.id,
    room_name: room.title || room.room_name || '',
    base_price: initialPrice > 0 ? String(initialPrice) : (room.price_24h || room.base_price_24h || ''),
    price_12h: room.price_12h || room.base_price_12h || '',
    full_description: room.full_description || room.description || '',
    highlights: room.highlights || '',
    house_rules: room.house_rules || '',
    status: room.status || 'Available',
    featured_image: room.image 
      ? room.image.replace('http://localhost:8001', '').replace(/https?:\/\/[^\/]+/i, '').replace(/^\/subraresidency1\/backend/i, '') 
      : '',
    max_adults: room.adults || '2',
    max_children: room.children || '1',
    max_guests: room.max_guests || '3',
    floor_number: room.floor || room.floor_number || '1',
    bed_type: room.bed_type || 'King Bed',
    room_size: room.size || '',
    category_tag: room.category_tag || room.tag || 'Premium',
    maintenance_start: room.maintenance_start || '',
    maintenance_end: room.maintenance_end || ''
  });

  const [galleryList, setGalleryList] = useState<string[]>(
    room.images && room.images.length > 0 ? room.images : (room.image ? [room.image] : [])
  );
  const [isUploading, setIsUploading] = useState(false);

  const [customAmenity, setCustomAmenity] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(room.amenities || []);
  const [availableAmenities, setAvailableAmenities] = useState<string[]>(() => {
    return Array.from(new Set([...ALL_AVAILABLE_AMENITIES, ...(room.amenities || [])]));
  });

  const [subRooms, setSubRooms] = useState<any[]>([]);
  const [loadingSubRooms, setLoadingSubRooms] = useState(true);

  // Sub-room creation
  const [newRoomNumber, setNewRoomNumber] = useState('');
  const [newRoomName, setNewRoomName] = useState('');
  const [newFloorNumber, setNewFloorNumber] = useState('1');
  
  // Sub-room editing
  const [editingSubRoomId, setEditingSubRoomId] = useState<number | null>(null);
  const [editRoomNumber, setEditRoomNumber] = useState('');
  const [editRoomName, setEditRoomName] = useState('');
  const [editFloorNumber, setEditFloorNumber] = useState('1');
  const [isActionSubRoom, setIsActionSubRoom] = useState(false);

  const loadSubRooms = async () => {
    setLoadingSubRooms(true);
    try {
      const response = await fetch(`${API_BASE_URL}/rooms/subRooms?category_id=${room.id}`);
      const json = await response.json();
      if (json.status === 'success' && Array.isArray(json.rooms)) {
        setSubRooms(json.rooms);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSubRooms(false);
    }
  };

  useEffect(() => {
    loadSubRooms();
  }, [room.id]);

  useEffect(() => {
    const price = extractRoomPrice(room);
    setGalleryList(room.images && room.images.length > 0 ? room.images : (room.image ? [room.image] : []));
    setSelectedAmenities(room.amenities || []);
    setAvailableAmenities(Array.from(new Set([...ALL_AVAILABLE_AMENITIES, ...(room.amenities || [])])));
    setFormData({
      id: room.id,
      room_name: room.title || room.room_name || '',
      base_price: price > 0 ? String(price) : (room.price_24h || room.base_price_24h || ''),
      price_12h: room.price_12h || room.base_price_12h || '',
      full_description: room.full_description || room.description || '',
      highlights: room.highlights || '',
      house_rules: room.house_rules || '',
      status: room.status || 'Available',
      featured_image: room.image 
        ? room.image.replace('http://localhost:8001', '').replace(/https?:\/\/[^\/]+/i, '').replace(/^\/subraresidency1\/backend/i, '') 
        : '',
      max_adults: room.adults || '2',
      max_children: room.children || '1',
      max_guests: room.max_guests || '3',
      floor_number: room.floor || room.floor_number || '1',
      bed_type: room.bed_type || 'King Bed',
      room_size: room.size || '',
      category_tag: room.category_tag || room.tag || 'Premium',
      maintenance_start: room.maintenance_start || '',
      maintenance_end: room.maintenance_end || ''
    });
  }, [room]);

  const handleAddSubRoom = async () => {
    if (!newRoomNumber.trim()) return;
    setIsActionSubRoom(true);
    try {
      const res = await addSubRoom({
        category_id: room.id,
        room_number: newRoomNumber.trim(),
        room_name: newRoomName.trim(),
        floor_number: newFloorNumber
      });
      if (res && res.status === 'success') {
        setNewRoomNumber('');
        setNewRoomName('');
        setNewFloorNumber('1');
        await loadSubRooms();
      } else {
        alert(res?.message || 'Failed to add room number.');
      }
    } catch (err) {
      console.error(err);
      alert('Error adding room number.');
    } finally {
      setIsActionSubRoom(false);
    }
  };

  const handleUpdateSubRoom = async (id: number) => {
    if (!editRoomNumber.trim()) return;
    setIsActionSubRoom(true);
    try {
      const res = await updateSubRoom({
        id,
        room_number: editRoomNumber.trim(),
        room_name: editRoomName.trim(),
        floor_number: editFloorNumber
      });
      if (res && res.status === 'success') {
        setEditingSubRoomId(null);
        await loadSubRooms();
      } else {
        alert(res?.message || 'Failed to update room number.');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating room number.');
    } finally {
      setIsActionSubRoom(false);
    }
  };

  const handleDeleteSubRoom = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this room number?')) return;
    setIsActionSubRoom(true);
    try {
      const res = await deleteSubRoom(id);
      if (res && res.status === 'success') {
        await loadSubRooms();
      } else {
        alert(res?.message || 'Failed to delete room number.');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting room number.');
    } finally {
      setIsActionSubRoom(false);
    }
  };

  const handleAddCustomAmenity = () => {
    if (!customAmenity.trim()) return;
    const name = customAmenity.trim();
    if (!availableAmenities.includes(name)) {
      setAvailableAmenities(prev => [...prev, name]);
    }
    if (!selectedAmenities.includes(name)) {
      setSelectedAmenities(prev => [...prev, name]);
    }
    setCustomAmenity('');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setIsUploading(true);
    try {
      const result = await uploadGalleryImage(room.id, file);
      if (result && result.image_path) {
        const newUrl = `${BACKEND_URL}${result.image_path}`;
        setGalleryList(prev => [...prev, newUrl]);
        setFormData(prev => (prev.featured_image ? prev : { ...prev, featured_image: result.image_path }));
      } else {
        alert(result?.message || "Failed to upload image.");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageDelete = async (imagePath: string) => {
    if (!confirm("Are you sure you want to delete this image from the gallery?")) return;
    try {
      const result = await deleteGalleryImage(room.id, imagePath);
      if (result && result.message) {
        setGalleryList(prev => prev.filter(img => img !== imagePath));
        
        const cleanPath = imagePath.replace('http://localhost:8001', '').replace(BACKEND_URL, '');
        const currentFeatured = formData.featured_image.replace('http://localhost:8001', '').replace(BACKEND_URL, '');
        if (cleanPath === currentFeatured) {
          const remaining = galleryList.filter(img => img !== imagePath);
          const nextFeatured = remaining.length > 0 
            ? remaining[0].replace('http://localhost:8001', '').replace(BACKEND_URL, '')
            : '';
          setFormData(prev => ({ ...prev, featured_image: nextFeatured }));
        }
      } else {
        alert("Failed to delete image.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting image.");
    }
  };

  const handleSetFeatured = (imagePath: string) => {
    let relativePath = imagePath.replace('http://localhost:8001', '').replace(BACKEND_URL, '');
    if (relativePath && !relativePath.startsWith('/')) {
      relativePath = '/' + relativePath;
    }
    setFormData(prev => ({ ...prev, featured_image: relativePath }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (formData.status === 'Maintenance') {
      if (!formData.maintenance_start || !formData.maintenance_end) {
        alert("Please select both start date and end date for maintenance.");
        return;
      }
      if (new Date(formData.maintenance_start) > new Date(formData.maintenance_end)) {
        alert("Maintenance start date cannot be after the end date.");
        return;
      }
    }
    setIsSaving(true);
    try {
      const result = await updateRoomDetails({
        ...formData,
        amenities: selectedAmenities
      });
      if (result && result.message) {
        alert("Changes saved successfully!");
        onRefresh();
      } else {
        alert("Failed to save changes.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = async () => {
    setIsDeleting(true);
    try {
      const res = await deleteRoomCategory(room.id);
      if (res && res.status === 'success') {
        alert("Room category deleted successfully!");
        onRefresh();
        onBack();
      } else {
        alert(res?.message || "Failed to delete room category.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while deleting.");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm font-sans relative overflow-hidden">
      {/* Sleek SaaS Action Header Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200/80 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Inventory</span>
          </button>
          
          <div className="h-4 w-px bg-gray-200 hidden sm:block" />

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-900">{formData.room_name || 'Room Configuration'}</span>
              <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${
                formData.status === 'Maintenance' 
                  ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${formData.status === 'Maintenance' ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'}`} />
                {formData.status}
              </span>
            </div>
            <p className="text-[11px] text-gray-400">ID: #{room.id} • Category Editor</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <Button
            onClick={() => setShowDeleteModal(true)}
            disabled={isSaving || isDeleting}
            variant="outline"
            className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 text-xs px-3.5 py-2 h-auto rounded-lg font-medium transition-colors"
          >
            <Trash2 size={13} className="mr-1.5" />
            Delete Room
          </Button>

          <Button 
            onClick={handleSave}
            disabled={isSaving || isDeleting}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-5 py-2 h-auto rounded-lg font-medium shadow-xs transition-all flex items-center gap-1.5"
          >
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            <span>{isSaving ? 'Saving...' : 'Save All Changes'}</span>
          </Button>
        </div>
      </div>

      {/* Hero Overview Card */}
      <div className="p-6 md:p-8 border-b border-gray-100 bg-gradient-to-b from-gray-50/60 to-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200/60 flex items-center gap-1">
                <Globe size={11} /> Live Website Category
              </span>
              <span className="bg-blue-50 text-blue-700 text-[10px] font-semibold px-2.5 py-0.5 rounded-full border border-blue-200/60 flex items-center gap-1">
                <Sparkles size={11} /> {formData.category_tag || 'Premium'}
              </span>
            </div>

            <div className="group">
              <input 
                name="room_name"
                value={formData.room_name}
                onChange={handleChange}
                className="text-2xl sm:text-3xl font-bold text-gray-900 w-full bg-transparent border-b border-transparent hover:border-gray-300 focus:border-emerald-500 focus:outline-none transition-colors py-0.5"
                placeholder="Enter Room Category Name"
              />
              <span className="text-[10px] text-gray-400 uppercase tracking-wider block mt-1">
                Category Title • Click text above to rename
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 font-medium pt-1">
              <div className="flex items-center gap-1 text-amber-600">
                <Star size={14} className="fill-amber-400 text-amber-400" />
                <span className="font-semibold text-gray-800">4.9 Internal Rating</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <MapPin size={14} className="text-gray-400" />
                <span>Kumbakonam Residency</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1 text-blue-600">
                <Users size={14} />
                <span>{subRooms.length} Physical Units Mapped</span>
              </div>
            </div>
          </div>

          {/* Pricing Highlight Pill Box */}
          <div className="bg-white border border-emerald-100 rounded-xl p-4 shadow-2xs lg:w-72 shrink-0">
            <p className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Info size={11} /> 24h Nightly Rate (INR)
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-emerald-600">₹</span>
              <input 
                name="base_price"
                type="number"
                value={formData.base_price}
                onChange={handleChange}
                className="text-2xl font-bold text-emerald-600 bg-transparent w-full focus:outline-none border-b border-emerald-200 focus:border-emerald-500"
                placeholder="1999"
              />
            </div>
            <p className="text-[10px] text-gray-400 mt-1.5">
              Standard 24-hour check-in/out rate shown on portal.
            </p>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="flex items-center gap-2 mt-8 border-b border-gray-200 overflow-x-auto pb-px">
          {[
            { id: 'specs', label: 'Pricing & Specs', icon: Layers },
            { id: 'gallery', label: `Photo Gallery (${galleryList.length})`, icon: ImageIcon },
            { id: 'amenities', label: `Amenities (${selectedAmenities.length})`, icon: CheckCircle2 },
            { id: 'units', label: `Sub-Rooms (${subRooms.length} Units)`, icon: Bed },
            { id: 'description', label: 'Public Description & Rules', icon: FileText }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-emerald-600 text-emerald-700 font-semibold bg-emerald-50/40 rounded-t-lg'
                    : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-emerald-600' : 'text-gray-400'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="p-6 md:p-8">
        {/* TAB 1: PRICING & SPECS */}
        {activeTab === 'specs' && (
          <div className="space-y-8 max-w-4xl">
            {/* Rates Section */}
            <div className="bg-white border border-gray-200/80 rounded-xl p-5 shadow-2xs space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Nightly & Hourly Pricing Structures
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    24-Hour Base Nightly Rate (₹ INR) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-semibold">₹</span>
                    <input 
                      type="number"
                      name="base_price"
                      value={formData.base_price}
                      onChange={handleChange}
                      placeholder="1999"
                      className="w-full text-xs pl-7 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">Default 24h occupancy rate applied across bookings.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    12-Hour Flexible Rate (₹ INR) <span className="text-gray-400 text-[10px]">(Optional)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-semibold">₹</span>
                    <input 
                      type="number"
                      name="price_12h"
                      value={formData.price_12h}
                      onChange={handleChange}
                      placeholder="1200"
                      className="w-full text-xs pl-7 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">Flex rate for short transit stays and temple visits.</p>
                </div>
              </div>
            </div>

            {/* Room Specifications */}
            <div className="bg-white border border-gray-200/80 rounded-xl p-5 shadow-2xs space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                Physical Specifications & Capacity
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 pt-1">
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 uppercase mb-1">Max Guests</label>
                  <input 
                    name="max_guests"
                    type="number"
                    value={formData.max_guests}
                    onChange={handleChange}
                    className="w-full text-xs p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold"
                    placeholder="3"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-gray-500 uppercase mb-1">Adults</label>
                  <input 
                    name="max_adults"
                    type="number"
                    value={formData.max_adults}
                    onChange={handleChange}
                    className="w-full text-xs p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold"
                    placeholder="2"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-gray-500 uppercase mb-1">Children</label>
                  <input 
                    name="max_children"
                    type="number"
                    value={formData.max_children}
                    onChange={handleChange}
                    className="w-full text-xs p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold"
                    placeholder="1"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-gray-500 uppercase mb-1">Bed Setup</label>
                  <input 
                    name="bed_type"
                    type="text"
                    value={formData.bed_type}
                    onChange={handleChange}
                    className="w-full text-xs p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold"
                    placeholder="King Bed"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-gray-500 uppercase mb-1">Area (sq ft)</label>
                  <input 
                    name="room_size"
                    type="text"
                    value={formData.room_size}
                    onChange={handleChange}
                    className="w-full text-xs p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold"
                    placeholder="420"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-gray-500 uppercase mb-1">Default Floor</label>
                  <input 
                    name="floor_number"
                    type="text"
                    value={formData.floor_number}
                    onChange={handleChange}
                    className="w-full text-xs p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold"
                    placeholder="2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Category Badge Tag</label>
                  <input 
                    name="category_tag"
                    type="text"
                    value={formData.category_tag}
                    onChange={handleChange}
                    placeholder="e.g. Royal Emerald, Luxury Suite, Deluxe"
                    className="w-full text-xs p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">Highlighted on website cards as the primary tier badge.</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Inventory Operational Status</label>
                  <select 
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full text-xs p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white font-semibold"
                  >
                    <option value="Available">Available (Bookable Online & Reception)</option>
                    <option value="Maintenance">Maintenance (Temporarily Closed)</option>
                    <option value="Cleaning">Housekeeping / Cleaning</option>
                    <option value="Booked">Fully Booked</option>
                  </select>
                </div>
              </div>

              {/* Maintenance Period Picker if active */}
              {formData.status === 'Maintenance' && (
                <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 space-y-3 animate-in fade-in">
                  <p className="text-xs font-semibold text-amber-800 flex items-center gap-1.5">
                    <Wrench size={13} className="text-amber-600" />
                    Scheduled Maintenance Window
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-medium text-amber-800 mb-1">Start Date</label>
                      <input 
                        type="date"
                        name="maintenance_start"
                        value={formData.maintenance_start}
                        onChange={handleChange}
                        className="w-full text-xs p-2 bg-white border border-amber-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-amber-800 mb-1">End Date</label>
                      <input 
                        type="date"
                        name="maintenance_end"
                        value={formData.maintenance_end}
                        min={formData.maintenance_start}
                        onChange={handleChange}
                        className="w-full text-xs p-2 bg-white border border-amber-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: PHOTO GALLERY */}
        {activeTab === 'gallery' && (
          <div className="space-y-6 max-w-5xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-200 gap-3">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Photo Gallery & Hero Showcase</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  High-resolution photography representing this room class. The featured primary image will be displayed on the website card.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <label className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium px-4 py-2 rounded-lg cursor-pointer flex items-center gap-1.5 shadow-xs transition-colors">
                  <Plus size={14} />
                  <span>{isUploading ? 'Uploading...' : 'Upload New Photo'}</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploading} className="hidden" />
                </label>
              </div>
            </div>

            {/* Featured Primary Image Hero Banner */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                  <Crown size={14} className="text-amber-500 fill-amber-400" />
                  Primary Featured Image
                </span>
                <span className="text-[11px] text-gray-400 font-mono">
                  {formData.featured_image || 'Auto fallback'}
                </span>
              </div>

              <div className="relative aspect-[21/9] sm:aspect-[2.5/1] bg-gray-200 rounded-xl overflow-hidden shadow-inner group">
                <img 
                  src={resolveRoomImageUrl(formData.featured_image, room.id)} 
                  alt="Primary Featured"
                  onError={(e) => handleImageError(e, room.id)}
                  className="w-full h-full object-cover"
                />
                
                <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                  <Crown size={11} className="fill-white" /> Active Cover Photo
                </div>

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <label className="bg-white/95 hover:bg-white text-gray-800 text-xs font-medium px-3.5 py-2 rounded-lg cursor-pointer shadow-md flex items-center gap-1.5">
                    <Plus size={13} /> Change Photo
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                  {formData.featured_image && (
                    <button
                      onClick={() => handleImageDelete(formData.featured_image)}
                      className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium px-3.5 py-2 rounded-lg shadow-md flex items-center gap-1.5"
                    >
                      <Trash2 size={13} /> Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Gallery Grid */}
            <div>
              <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">
                All Gallery Photos ({galleryList.length})
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {galleryList.map((imgUrl, idx) => {
                  const resolved = resolveRoomImageUrl(imgUrl, idx);
                  const isFeatured = formData.featured_image && imgUrl.includes(formData.featured_image.replace(/^\//, ''));

                  return (
                    <div 
                      key={idx} 
                      className={`relative aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden border group shadow-2xs ${
                        isFeatured ? 'ring-2 ring-emerald-500 border-transparent' : 'border-gray-200'
                      }`}
                    >
                      <img 
                        src={resolved} 
                        alt={`Room photo ${idx + 1}`}
                        onError={(e) => handleImageError(e, idx)}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                        loading="lazy"
                      />

                      {isFeatured && (
                        <div className="absolute top-2 left-2 bg-emerald-600 text-white text-[9px] font-semibold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                          <Crown size={10} className="fill-white" /> Featured
                        </div>
                      )}

                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                        {!isFeatured && (
                          <button
                            onClick={() => handleSetFeatured(imgUrl)}
                            className="bg-white/90 hover:bg-white text-gray-800 p-2 rounded-lg shadow-xs text-xs font-medium flex items-center gap-1"
                            title="Set as featured cover"
                          >
                            <Crown size={12} className="text-amber-500 fill-amber-400" />
                          </button>
                        )}
                        <button
                          onClick={() => handleImageDelete(imgUrl)}
                          className="bg-rose-600 hover:bg-rose-700 text-white p-2 rounded-lg shadow-xs"
                          title="Delete photo"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* Upload Card Dropzone */}
                <label className="aspect-[4/3] border-2 border-dashed border-gray-300 hover:border-emerald-500 hover:bg-emerald-50/20 rounded-xl flex flex-col items-center justify-center p-4 cursor-pointer transition-all text-center">
                  <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1.5">
                    <Plus size={18} />
                  </div>
                  <span className="text-xs font-semibold text-gray-700">Add Photo</span>
                  <span className="text-[10px] text-gray-400 mt-0.5">JPG, PNG, WEBP</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploading} className="hidden" />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: AMENITIES */}
        {activeTab === 'amenities' && (
          <div className="space-y-6 max-w-4xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-200 gap-3">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Room Amenities & Inclusions</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Select amenities offered in this category. Guests see these features during booking.
                </p>
              </div>

              {/* Custom Amenity Adder */}
              <div className="flex items-center gap-2">
                <input 
                  type="text"
                  placeholder="Custom amenity..."
                  value={customAmenity}
                  onChange={(e) => setCustomAmenity(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomAmenity(); } }}
                  className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 w-44"
                />
                <Button 
                  onClick={handleAddCustomAmenity}
                  className="bg-gray-900 hover:bg-emerald-600 text-white text-xs px-3 py-1.5 h-auto rounded-lg"
                >
                  Add
                </Button>
              </div>
            </div>

            {/* Grid of Amenity Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {availableAmenities.map((amenity: string, i: number) => {
                const isSelected = selectedAmenities.includes(amenity);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setSelectedAmenities(prev => prev.filter(a => a !== amenity));
                      } else {
                        setSelectedAmenities(prev => [...prev, amenity]);
                      }
                    }}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all text-xs font-medium ${
                      isSelected 
                        ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900 shadow-2xs' 
                        : 'border-gray-200 hover:border-gray-300 text-gray-600 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 border ${
                      isSelected 
                        ? 'bg-emerald-600 border-emerald-600 text-white' 
                        : 'border-gray-300 bg-white'
                    }`}>
                      {isSelected && <Check size={11} strokeWidth={3} />}
                    </div>
                    <span className="truncate">{amenity}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: PHYSICAL SUB-ROOMS (INVENTORY) */}
        {activeTab === 'units' && (
          <div className="space-y-6 max-w-4xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-200 gap-3">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Physical Room Units ({subRooms.length})</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Assign individual room numbers (e.g. 101, 102, 201) to this category for the reception grid.
                </p>
              </div>
            </div>

            {/* Add Sub-Room Card */}
            <div className="bg-gray-50/70 border border-gray-200 rounded-xl p-4">
              <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">
                + Add Physical Room Number
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 mb-1">Room Number *</label>
                  <input
                    type="text"
                    value={newRoomNumber}
                    onChange={(e) => setNewRoomNumber(e.target.value)}
                    placeholder="e.g. 204"
                    className="w-full text-xs p-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-medium text-gray-600 mb-1">Room Title (Optional)</label>
                  <input
                    type="text"
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    placeholder="e.g. Executive Temple View 204"
                    className="w-full text-xs p-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-gray-600 mb-1">Floor</label>
                  <input
                    type="text"
                    value={newFloorNumber}
                    onChange={(e) => setNewFloorNumber(e.target.value)}
                    placeholder="2"
                    className="w-full text-xs p-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold"
                  />
                </div>
              </div>

              <div className="mt-3 flex justify-end">
                <Button
                  onClick={handleAddSubRoom}
                  disabled={isActionSubRoom || !newRoomNumber.trim()}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-4 py-2 h-auto rounded-lg font-medium shadow-xs"
                >
                  <Plus size={14} className="mr-1" />
                  Add Room Number
                </Button>
              </div>
            </div>

            {/* List of Sub-Rooms */}
            {loadingSubRooms ? (
              <div className="py-8 text-center text-gray-400 text-xs">
                <Loader2 size={18} className="animate-spin mx-auto mb-2 text-emerald-600" />
                Loading physical inventory...
              </div>
            ) : subRooms.length === 0 ? (
              <div className="border border-dashed border-gray-300 rounded-xl p-8 text-center bg-white">
                <Bed size={22} className="mx-auto text-gray-300 mb-2" />
                <p className="text-xs font-semibold text-gray-700">No Room Numbers Assigned Yet</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Use the form above to add your first room number (e.g. 101).</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xs">
                {subRooms.map((subRoom) => {
                  const isEditing = editingSubRoomId === subRoom.id;

                  return (
                    <div key={subRoom.id} className="p-3.5 flex items-center justify-between gap-4 hover:bg-gray-50/60 transition-colors">
                      {isEditing ? (
                        <div className="flex flex-1 flex-col sm:flex-row gap-2.5 items-end">
                          <div className="w-28">
                            <label className="block text-[10px] font-medium text-gray-500 uppercase">Room No</label>
                            <input
                              type="text"
                              value={editRoomNumber}
                              onChange={(e) => setEditRoomNumber(e.target.value)}
                              className="w-full bg-white border border-gray-200 rounded-lg p-1.5 text-xs font-semibold"
                            />
                          </div>

                          <div className="flex-1">
                            <label className="block text-[10px] font-medium text-gray-500 uppercase">Title</label>
                            <input
                              type="text"
                              value={editRoomName}
                              onChange={(e) => setEditRoomName(e.target.value)}
                              className="w-full bg-white border border-gray-200 rounded-lg p-1.5 text-xs"
                            />
                          </div>

                          <div className="w-20">
                            <label className="block text-[10px] font-medium text-gray-500 uppercase">Floor</label>
                            <input
                              type="text"
                              value={editFloorNumber}
                              onChange={(e) => setEditFloorNumber(e.target.value)}
                              className="w-full bg-white border border-gray-200 rounded-lg p-1.5 text-xs"
                            />
                          </div>

                          <div className="flex items-center gap-1.5">
                            <Button
                              onClick={() => handleUpdateSubRoom(subRoom.id)}
                              disabled={isActionSubRoom}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1.5 h-auto rounded"
                            >
                              Save
                            </Button>
                            <Button
                              onClick={() => setEditingSubRoomId(null)}
                              variant="outline"
                              className="text-xs px-3 py-1.5 h-auto rounded"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs border border-emerald-200/60">
                              {subRoom.room_number}
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-900">
                                {subRoom.room_name || `Room ${subRoom.room_number}`}
                              </p>
                              <p className="text-[11px] text-gray-400">
                                Floor {subRoom.floor_number || '1'} • Status: {subRoom.status || 'Available'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <Button
                              onClick={() => {
                                setEditingSubRoomId(subRoom.id);
                                setEditRoomNumber(subRoom.room_number);
                                setEditRoomName(subRoom.room_name || '');
                                setEditFloorNumber(subRoom.floor_number || '1');
                              }}
                              variant="outline"
                              className="text-gray-600 hover:text-gray-900 border-gray-200 text-xs px-2.5 py-1.5 h-auto rounded-lg"
                            >
                              Edit
                            </Button>
                            <Button
                              onClick={() => handleDeleteSubRoom(subRoom.id)}
                              disabled={isActionSubRoom}
                              variant="outline"
                              className="text-rose-600 hover:bg-rose-50 border-rose-200 text-xs px-2.5 py-1.5 h-auto rounded-lg"
                            >
                              Delete
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: PUBLIC DESCRIPTION & RULES */}
        {activeTab === 'description' && (
          <div className="space-y-6 max-w-4xl">
            <div className="pb-3 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">Public Website Description & House Rules</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                These descriptions appear on the guest-facing room overview and booking confirmation vouchers.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Official Public Description
                </label>
                <textarea 
                  name="full_description"
                  value={formData.full_description}
                  onChange={handleChange}
                  rows={5}
                  className="w-full p-3.5 text-xs text-gray-800 leading-relaxed bg-white rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all"
                  placeholder="Describe this room category for your guests..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Highlights / Short Bullet Summary
                </label>
                <input 
                  type="text"
                  name="highlights"
                  value={formData.highlights}
                  onChange={handleChange}
                  placeholder="e.g. Mahamaham Tank View, Traditional Teak Decor, Soundproof Sanctuary"
                  className="w-full text-xs p-3 bg-white rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  House Rules & Policies
                </label>
                <textarea 
                  name="house_rules"
                  value={formData.house_rules}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-3.5 text-xs text-gray-800 leading-relaxed bg-white rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  placeholder="e.g. Check-in from 12 PM, Check-out by 11 AM. No smoking inside the suite."
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-xs z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-gray-200 animate-in fade-in zoom-in-95">
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
              <AlertCircle size={22} />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1.5">Delete Room Category</h3>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              Are you sure you want to permanently delete <span className="font-semibold text-gray-800">"{formData.room_name}"</span>? 
              This will remove all associated physical room units and booking associations.
            </p>
            <div className="flex gap-2.5 justify-end">
              <Button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                variant="outline"
                className="text-xs px-4 py-2 border-gray-200"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteCategory}
                disabled={isDeleting}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs px-4 py-2 flex items-center gap-1.5"
              >
                {isDeleting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                Confirm Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
