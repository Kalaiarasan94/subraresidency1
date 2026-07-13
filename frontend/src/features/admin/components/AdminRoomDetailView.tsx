import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Star, MapPin, 
  CheckCircle2, Globe, Save, Loader2, Camera, Info,
  Trash2, Plus, Crown
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { updateRoomDetails, uploadGalleryImage, deleteGalleryImage, BACKEND_URL, addSubRoom, updateSubRoom, deleteSubRoom, API_BASE_URL } from '../../../lib/api';

interface Props {
  room: any;
  onBack: () => void;
  onRefresh: () => void;
}

const ALL_AVAILABLE_AMENITIES = [
  "High-Speed WiFi",
  "Smart TV",
  "Mini Fridge",
  "Room Service",
  "Workspace",
  "Temple View",
  "Air Conditioning",
  "Tea/Coffee Maker",
  "Iron & Board",
  "Balcony",
  "In-room Safe",
  "Hair Dryer",
  "Mini Bar",
  "Daily Housekeeping",
  "Hot Water",
  "Attached Bathroom"
];

export const AdminRoomDetailView: React.FC<Props> = ({ room, onBack, onRefresh }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    id: room.id,
    room_name: room.title || room.room_name,
    base_price: room.price_24h || room.price?.replace(/[^0-9]/g, '') || '',
    full_description: room.full_description || room.description || '',
    house_rules: room.house_rules || '',
    status: room.status || 'Available',
    featured_image: room.image 
      ? room.image.replace('http://localhost:8001', '').replace(/https?:\/\/[^\/]+/i, '').replace(/^\/subraresidency1\/backend/i, '') 
      : '',
    max_adults: room.adults || '',
    max_children: room.children || '',
    floor_number: room.floor || room.floor_number || '',
    bed_type: room.bed_type || '',
    room_size: room.size || '',
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

  const [newRoomNumber, setNewRoomNumber] = useState('');
  const [newRoomName, setNewRoomName] = useState('');
  const [newFloorNumber, setNewFloorNumber] = useState('1');
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

  useEffect(() => {
    setGalleryList(room.images && room.images.length > 0 ? room.images : (room.image ? [room.image] : []));
    setSelectedAmenities(room.amenities || []);
    setAvailableAmenities(Array.from(new Set([...ALL_AVAILABLE_AMENITIES, ...(room.amenities || [])])));
    setFormData({
      id: room.id,
      room_name: room.title || room.room_name,
      base_price: room.price_24h || room.price?.replace(/[^0-9]/g, '') || '',
      full_description: room.full_description || room.description || '',
      house_rules: room.house_rules || '',
      status: room.status || 'Available',
      featured_image: room.image 
        ? room.image.replace('http://localhost:8001', '').replace(/https?:\/\/[^\/]+/i, '').replace(/^\/subraresidency1\/backend/i, '') 
        : '',
      max_adults: room.adults || '',
      max_children: room.children || '',
      floor_number: room.floor || room.floor_number || '',
      bed_type: room.bed_type || '',
      room_size: room.size || ''
    });
  }, [room]);

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
        // First photo added becomes the featured image automatically
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

  return (
    <div className="bg-white min-h-screen rounded-3xl border border-slate-200 overflow-hidden shadow-sm font-sans relative">
      {/* Admin Action Bar */}
      <div className="bg-emerald-900 px-8 py-4 flex justify-between items-center text-white sticky top-0 z-50 shadow-md">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-emerald-100 hover:text-white transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-xs uppercase tracking-widest">Back to Inventory</span>
        </button>
        
        <div className="flex gap-4">
           <Button 
             onClick={handleSave}
             disabled={isSaving}
             className="bg-white text-emerald-900 hover:bg-emerald-50 px-8 py-2 rounded-lg font-bold text-xs uppercase tracking-widest shadow-lg flex items-center gap-2 min-w-[140px]"
           >
             {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
             {isSaving ? 'Saving...' : 'Save All Changes'}
           </Button>
        </div>
      </div>

      <div className="p-8 max-w-6xl mx-auto">
        {/* Mirror Frontend UI - Now with Editable Fields */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-slate-100 pb-8">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
               <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest border border-emerald-100">Direct In-Place Editor</span>
               {room.show_on_website ? (
                 <span className="flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase border border-emerald-100"><Globe size={10} /> Live on Website</span>
               ) : (
                 <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-0.5 rounded uppercase border border-slate-100">Draft / Internal</span>
               )}
            </div>
            
            <div className="group relative">
                <input 
                    name="room_name"
                    value={formData.room_name}
                    onChange={handleChange}
                    className="text-4xl font-bold text-slate-900 mb-1 tracking-tight w-full bg-transparent border-b-2 border-transparent hover:border-emerald-200 focus:border-emerald-500 focus:outline-none transition-all py-1"
                    placeholder="Enter Room Category Name"
                />
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-3 pl-1">Room Category Title</span>
            </div>

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
          
          <div className="text-right bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
             <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-2 flex items-center justify-end gap-1"><Info size={12}/> Nightly Rate (INR)</p>
             <div className="flex items-center justify-end">
                <span className="text-2xl font-bold text-emerald-600 mr-1">₹</span>
                <input 
                    name="base_price"
                    type="number"
                    value={formData.base_price}
                    onChange={handleChange}
                    className="text-3xl font-bold text-emerald-600 bg-transparent w-32 text-right focus:outline-none border-b-2 border-emerald-200 focus:border-emerald-600 appearance-none"
                    style={{ MozAppearance: 'textfield' }}
                />
             </div>
          </div>
        </div>

        {/* Gallery Preview / Image Editor Section */}
        <div className="space-y-4 mb-12">
            <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><Camera size={14}/> Image Gallery Configuration</h3>
                <div className="flex gap-3 items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Featured Path:</span>
                    <input 
                        name="featured_image"
                        value={formData.featured_image}
                        onChange={handleChange}
                        className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 w-80 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g. /uploads/rooms/room_1.png"
                    />
                    <label className="bg-[#0b336b] hover:bg-[#072145] text-white text-[10px] font-black uppercase px-4 py-2.5 rounded-lg active:scale-95 transition-all cursor-pointer flex items-center gap-2">
                        <Plus size={12} /> Add Photo
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                </div>
            </div>
            
            <div className="grid grid-cols-4 gap-3 h-80 rounded-2xl overflow-hidden border border-slate-100 shadow-sm relative group">
               {isUploading && (
                  <div className="absolute inset-0 bg-white/80 z-20 flex flex-col items-center justify-center gap-2 rounded-2xl">
                     <Loader2 className="animate-spin text-emerald-600" size={24} />
                     <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Uploading Photo...</span>
                  </div>
               )}

               {/* Left Main (Featured Image Panel) */}
               <div className="col-span-2 row-span-2 overflow-hidden bg-slate-100 relative group/cell border-2 border-emerald-500 rounded-xl">
                 {(() => {
                   const featuredFullUrl = formData.featured_image 
                     ? (formData.featured_image.startsWith('http') ? formData.featured_image : `${BACKEND_URL}${formData.featured_image}`)
                     : (galleryList[0] || '');

                   return featuredFullUrl ? (
                     <>
                       <img src={featuredFullUrl} className="w-full h-full object-cover" alt="Primary" />
                       <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[9px] font-black uppercase px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                         <Crown size={10} className="fill-white" /> Featured Primary
                       </div>
                       
                       <div className="absolute inset-0 bg-black/45 opacity-0 group-hover/cell:opacity-100 transition-opacity flex items-center justify-center gap-3">
                         <button 
                           onClick={() => handleImageDelete(featuredFullUrl)}
                           className="bg-rose-600 hover:bg-rose-700 text-white p-2.5 rounded-full shadow-lg transition-transform hover:scale-110"
                           title="Delete Image"
                         >
                           <Trash2 size={16} />
                         </button>
                       </div>
                     </>
                   ) : (
                     <label className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                       <Plus size={24} className="text-slate-400 mb-1" />
                       <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Upload Main Image</span>
                       <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                     </label>
                   );
                 })()}
               </div>

               {/* Right Panels (remaining slots 1 to 4) */}
               {(() => {
                 const featuredClean = formData.featured_image.replace('http://localhost:8001', '').replace(BACKEND_URL, '').split('?')[0];
                 const otherImages = galleryList.filter(img => {
                   const cleanImg = img.replace('http://localhost:8001', '').replace(BACKEND_URL, '').split('?')[0];
                   return cleanImg !== featuredClean;
                 });

                 const displayImages = [
                   otherImages[0] || null,
                   otherImages[1] || null,
                   otherImages[2] || null,
                   otherImages[3] || null
                 ];

                 return displayImages.map((imgUrl, idx) => (
                   <div key={idx} className="overflow-hidden bg-slate-100 relative group/cell rounded-xl border border-slate-200 min-h-[140px]">
                     {imgUrl ? (
                       <>
                         <img src={imgUrl} className="w-full h-full object-cover" alt={`Gallery ${idx + 1}`} />
                         <div className="absolute inset-0 bg-black/55 opacity-0 group-hover/cell:opacity-100 transition-opacity flex items-center justify-center gap-2">
                           <button 
                             onClick={() => handleSetFeatured(imgUrl)}
                             className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full shadow-lg transition-transform hover:scale-110"
                             title="Set as Featured"
                           >
                             <Crown size={12} />
                           </button>
                           <button 
                             onClick={() => handleImageDelete(imgUrl)}
                             className="bg-rose-600 hover:bg-rose-700 text-white p-2 rounded-full shadow-lg transition-transform hover:scale-110"
                             title="Delete Image"
                           >
                             <Trash2 size={12} />
                           </button>
                         </div>
                       </>
                     ) : (
                       <label className="w-full h-full flex flex-col items-center justify-center border border-dashed border-slate-250 hover:border-indigo-400 hover:bg-indigo-50/20 rounded-xl cursor-pointer transition-all">
                         <Plus size={16} className="text-slate-400" />
                         <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider mt-1">Add Photo</span>
                         <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                       </label>
                     )}
                   </div>
                 ));
               })()}
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-12">
             <section className="pb-12 border-b border-slate-100">
                <h3 className="text-sm font-bold text-[#4f46e5] uppercase tracking-widest mb-4">Official Public Description</h3>
                <textarea 
                    name="full_description"
                    value={formData.full_description}
                    onChange={handleChange}
                    rows={8}
                    className="w-full p-6 text-slate-700 leading-relaxed text-lg whitespace-pre-wrap font-medium bg-slate-50 rounded-2xl border-2 border-transparent hover:border-slate-200 focus:border-indigo-500 focus:bg-white focus:outline-none transition-all shadow-inner"
                    placeholder="Describe this sanctuary for your guests..."
                />
             </section>

             <section className="pb-12 border-b border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <h3 className="text-sm font-bold text-[#4f46e5] uppercase tracking-widest">Amenity Highlights</h3>
                  
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      placeholder="Add custom amenity..."
                      value={customAmenity}
                      onChange={(e) => setCustomAmenity(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomAmenity(); } }}
                      className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-44"
                    />
                    <button 
                      type="button"
                      onClick={handleAddCustomAmenity}
                      className="bg-[#4f46e5] hover:bg-[#3b35b3] text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-lg active:scale-95 transition-all shadow-sm"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all duration-200 active:scale-95 ${
                          isSelected 
                            ? 'border-[#4f46e5] bg-indigo-50/50 text-slate-900 font-bold' 
                            : 'border-slate-100 hover:border-slate-200 text-slate-500 font-medium'
                        }`}
                      >
                         <CheckCircle2 size={16} className={isSelected ? 'text-[#4f46e5] fill-indigo-50' : 'text-slate-300'} />
                         <span className="text-xs tracking-tight">{amenity}</span>
                      </button>
                    );
                  })}
                </div>
             </section>              <section className="pb-12 border-b border-slate-100">
                <h3 className="text-sm font-bold text-[#4f46e5] uppercase tracking-widest mb-4">Internal Specs</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                   <div className="text-center">
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Max Adults</p>
                      <input 
                        name="max_adults"
                        type="number"
                        value={formData.max_adults}
                        onChange={handleChange}
                        className="text-lg font-bold text-slate-800 bg-transparent text-center border-b border-transparent hover:border-slate-300 focus:outline-none focus:border-indigo-500 w-12"
                      />
                   </div>
                   <div className="text-center border-l border-slate-200 pl-4">
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Max Children</p>
                      <input 
                        name="max_children"
                        type="number"
                        value={formData.max_children}
                        onChange={handleChange}
                        className="text-lg font-bold text-slate-800 bg-transparent text-center border-b border-transparent hover:border-slate-300 focus:outline-none focus:border-indigo-500 w-12"
                      />
                   </div>
                   <div className="text-center border-l border-slate-200 pl-4">
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Bed Configuration</p>
                      <input 
                        name="bed_type"
                        value={formData.bed_type}
                        onChange={handleChange}
                        className="text-lg font-bold text-slate-800 bg-transparent text-center border-b border-transparent hover:border-slate-300 focus:outline-none focus:border-indigo-500 w-full"
                      />
                   </div>
                   <div className="text-center border-l border-slate-200 pl-4">
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Area (sq ft)</p>
                      <input 
                        name="room_size"
                        value={formData.room_size}
                        onChange={handleChange}
                        className="text-lg font-bold text-slate-800 bg-transparent text-center border-b border-transparent hover:border-slate-300 focus:outline-none focus:border-indigo-500 w-20"
                      />
                   </div>
                   <div className="text-center border-l border-slate-200 pl-4">
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Floor</p>
                      <input 
                        name="floor_number"
                        value={formData.floor_number}
                        onChange={handleChange}
                        className="text-lg font-bold text-slate-800 bg-transparent text-center border-b border-transparent hover:border-slate-300 focus:outline-none focus:border-indigo-500 w-20"
                      />
                   </div>
                 </div>
              </section>

             <section className="pb-12 border-b border-slate-100">
                <h3 className="text-sm font-bold text-[#4f46e5] uppercase tracking-widest mb-4 flex items-center justify-between">
                  <span>Assigned Room Numbers</span>
                  <span className="text-[10px] text-slate-400 font-bold lowercase">({subRooms.length} rooms)</span>
                </h3>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                  {/* Add sub-room form */}
                  <div className="flex flex-col sm:flex-row gap-3 items-end bg-white p-4 rounded-xl border border-slate-200">
                    <div className="flex-1 space-y-1 w-full">
                      <label className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">New Room Number</label>
                      <input
                        type="text"
                        value={newRoomNumber}
                        onChange={(e) => setNewRoomNumber(e.target.value)}
                        placeholder="e.g. 101"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="flex-1 space-y-1 w-full">
                      <label className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">Room Name (Optional)</label>
                      <input
                        type="text"
                        value={newRoomName}
                        onChange={(e) => setNewRoomName(e.target.value)}
                        placeholder="e.g. Deluxe Room 101"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="w-full sm:w-28 space-y-1">
                      <label className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">Floor</label>
                      <input
                        type="text"
                        value={newFloorNumber}
                        onChange={(e) => setNewFloorNumber(e.target.value)}
                        placeholder="e.g. 1"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <Button
                      onClick={handleAddSubRoom}
                      disabled={isActionSubRoom || !newRoomNumber.trim()}
                      className="bg-[#4f46e5] hover:bg-[#3b35b3] text-white text-[10px] font-bold uppercase tracking-wider h-10 px-4 rounded-lg flex items-center gap-1.5 w-full sm:w-auto shadow-md"
                    >
                      <Plus size={14} /> Add Room
                    </Button>
                  </div>

                  {/* List of sub-rooms */}
                  {loadingSubRooms ? (
                    <p className="text-[10px] text-slate-500 animate-pulse text-center py-4 font-bold">Loading rooms list...</p>
                  ) : subRooms.length > 0 ? (
                    <div className="divide-y divide-slate-100 bg-white border border-slate-200 rounded-xl overflow-hidden">
                      {subRooms.map((subRoom) => {
                        const isEditing = editingSubRoomId === subRoom.id;
                        return (
                          <div key={subRoom.id} className="p-4 flex items-center justify-between gap-4">
                            {isEditing ? (
                              <div className="flex flex-1 flex-col sm:flex-row gap-2 items-end">
                                <div className="flex-1 space-y-1 w-full">
                                  <label className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">Room Number</label>
                                  <input
                                    type="text"
                                    value={editRoomNumber}
                                    onChange={(e) => setEditRoomNumber(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none"
                                  />
                                </div>
                                <div className="flex-1 space-y-1 w-full">
                                  <label className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">Room Name</label>
                                  <input
                                    type="text"
                                    value={editRoomName}
                                    onChange={(e) => setEditRoomName(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none"
                                  />
                                </div>
                                <div className="w-full sm:w-20 space-y-1">
                                  <label className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">Floor</label>
                                  <input
                                    type="text"
                                    value={editFloorNumber}
                                    onChange={(e) => setEditFloorNumber(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none"
                                  />
                                </div>
                                <div className="flex gap-1.5 w-full sm:w-auto mt-2 sm:mt-0">
                                  <Button
                                    onClick={() => handleUpdateSubRoom(subRoom.id)}
                                    disabled={isActionSubRoom}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-[9px] font-bold uppercase h-8 px-2.5 rounded shadow-sm"
                                  >
                                    Save
                                  </Button>
                                  <Button
                                    onClick={() => setEditingSubRoomId(null)}
                                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[9px] font-bold uppercase h-8 px-2.5 rounded"
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="flex items-center gap-3">
                                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
                                  <div>
                                    <p className="text-xs font-bold text-slate-800">{subRoom.room_name || `Room ${subRoom.room_number}`}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Room No: {subRoom.room_number} • Floor {subRoom.floor_number || '1'}</p>
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
                                    className="bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-slate-200 text-[9px] font-bold uppercase h-8 px-2.5 rounded shadow-sm"
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    onClick={() => handleDeleteSubRoom(subRoom.id)}
                                    disabled={isActionSubRoom}
                                    className="bg-rose-50 hover:bg-rose-100 text-rose-650 border border-rose-200 text-[9px] font-bold uppercase h-8 px-2.5 rounded shadow-sm"
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
                  ) : (
                    <p className="text-xs text-slate-400 text-center py-6 border border-dashed border-slate-200 rounded-xl bg-white italic">No room numbers assigned yet. Add one above.</p>
                  )}
                </div>
             </section>
          </div>           <div className="lg:col-span-1">
             <Card className="rounded-3xl shadow-xl border-indigo-100 bg-indigo-50/20 overflow-hidden sticky top-28">
                <CardContent className="p-8 space-y-6">
                   <h3 className="text-xs font-bold text-indigo-700 uppercase tracking-widest mb-4 border-b border-indigo-150 pb-2 flex items-center justify-between">
                       Status & Rules
                       <span className="animate-pulse bg-indigo-500 h-2 w-2 rounded-full"></span>
                   </h3>
                   
                   <div className="space-y-4">
                      <div className="flex flex-col gap-2 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Inventory Status</span>
                         <select 
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className={`text-sm font-black uppercase tracking-wider bg-transparent focus:outline-none border-none cursor-pointer ${formData.status === 'Available' ? 'text-indigo-600' : 'text-amber-600'}`}
                         >
                            <option value="Available">Available</option>
                            <option value="Booked">Booked</option>
                            <option value="Cleaning">Cleaning</option>
                            <option value="Maintenance">Maintenance</option>
                         </select>
                      </div>
                      
                      {formData.status === 'Maintenance' && (
                          <div className="flex flex-col gap-3 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 animate-in slide-in-from-top duration-350">
                             <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest">Maintenance Start Date</span>
                                <input 
                                   type="date"
                                   name="maintenance_start"
                                   value={formData.maintenance_start}
                                   onChange={handleChange}
                                   className="text-sm font-bold bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                             </div>
                             <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest">Maintenance End Date</span>
                                <input 
                                   type="date"
                                   name="maintenance_end"
                                   value={formData.maintenance_end}
                                   min={formData.maintenance_start}
                                   onChange={handleChange}
                                   className="text-sm font-bold bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                             </div>
                          </div>
                       )}
                      
                      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">House Rules Summary</p>
                         <textarea 
                            name="house_rules"
                            value={formData.house_rules}
                            onChange={handleChange}
                            rows={4}
                            className="w-full text-sm font-medium text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-transparent focus:border-indigo-500 focus:bg-white focus:outline-none transition-all italic"
                            placeholder="e.g. No loud music. Check-out by 11 AM."
                         />
                      </div>
                   </div>

                   <Button 
                     onClick={handleSave}
                     disabled={isSaving}
                     className="w-full bg-[#4f46e5] hover:bg-[#3b35b3] text-white font-bold uppercase tracking-widest py-8 rounded-2xl shadow-xl h-auto transition-all active:scale-95 group shadow-indigo-500/20"
                   >
                     {isSaving ? (
                        <span className="flex items-center gap-3">
                            <Loader2 className="animate-spin" /> COMMITTING CHANGES...
                        </span>
                     ) : (
                        <span className="flex flex-col items-center">
                            <span className="text-sm">Save Sanctuary Update</span>
                            <span className="text-[9px] text-indigo-200 font-black mt-1 group-hover:text-white">FORCE GLOBAL SYNC</span>
                        </span>
                     )}
                   </Button>

                   <div className="text-center pt-2">
                       <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest opacity-50 px-4">
                           Updates take place immediately on the customer-facing website and mobile app.
                       </p>
                   </div>
                </CardContent>
             </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
