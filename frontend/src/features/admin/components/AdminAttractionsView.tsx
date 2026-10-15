import React, { useState, useEffect } from 'react';
import { 
  Save, Plus, Trash2, Edit3, ArrowLeft, Loader2, 
  MapPin, Clock, Car, CheckCircle2, AlertCircle, 
  Search, UploadCloud
} from 'lucide-react';
import { API_BASE_URL, BACKEND_URL } from '../../../lib/api';

interface AdminAttractionsViewProps {
  onBack: () => void;
}

export const AdminAttractionsView: React.FC<AdminAttractionsViewProps> = ({ onBack }) => {
  const [attractions, setAttractions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Form state
  const [editingAttraction, setEditingAttraction] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    distance: '',
    mode: '',
    timing: '',
    dress_code: '',
    special_for: '',
    description: '',
    guest_note: '',
    image_path: '',
    sort_order: '0'
  });

  const [sectionDesc, setSectionDesc] = useState('');
  const [isSavingDesc, setIsSavingDesc] = useState(false);

  const fetchSectionDesc = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/settings`);
      const data = await response.json();
      if (data && data.temple_section_desc) {
        setSectionDesc(data.temple_section_desc);
      } else {
        setSectionDesc("Kumbakonam is surrounded by some of Tamil Nadu's most revered temples, sacred tanks and spiritual landmarks. Guests staying at Subra Residency can easily plan temple visits from the property, as many important temples are located within a short travel distance. Discover the rich spiritual heritage of the region through these iconic destinations.");
      }
    } catch (error) {
      console.error('Error fetching section description:', error);
    }
  };

  const handleSaveSectionDesc = async () => {
    setIsSavingDesc(true);
    try {
      const response = await fetch(`${API_BASE_URL}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ temple_section_desc: sectionDesc })
      });
      if (response.ok) {
        setMessage({ type: 'success', text: 'Spiritual sights page description updated successfully!' });
      } else {
        throw new Error('Failed to save text');
      }
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Failed to update page description.' });
    } finally {
      setIsSavingDesc(false);
    }
  };

  const fetchAttractions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/attractions/list`);
      const json = await response.json();
      if (json.status === 'success' && Array.isArray(json.attractions)) {
        setAttractions(json.attractions);
      }
    } catch (error) {
      console.error('Error fetching attractions:', error);
      setMessage({ type: 'error', text: 'Failed to load attractions.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttractions();
    fetchSectionDesc();
  }, []);

  const handleEditClick = (attraction: any) => {
    setEditingAttraction(attraction);
    setFormData({
      id: attraction.id,
      name: attraction.name,
      distance: attraction.dist,
      mode: attraction.mode,
      timing: attraction.timing,
      dress_code: attraction.dressCode,
      special_for: attraction.specialFor,
      description: attraction.desc,
      guest_note: attraction.guestNote,
      image_path: attraction.image_path,
      sort_order: String(attraction.sort_order || 0)
    });
    setMessage(null);
  };

  const handleAddNewClick = () => {
    setEditingAttraction({ id: 'new' });
    setFormData({
      id: '',
      name: '',
      distance: '',
      mode: '',
      timing: '',
      dress_code: '',
      special_for: '',
      description: '',
      guest_note: '',
      image_path: '',
      sort_order: String(attractions.length * 10 + 10)
    });
    setMessage(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setUploading(true);
    setMessage(null);
    const fd = new FormData();
    fd.append('image', file);

    try {
      const response = await fetch(`${API_BASE_URL}/attractions/uploadImage`, {
        method: 'POST',
        body: fd
      });
      const data = await response.json();
      if (data && data.status === 'success') {
        setFormData(prev => ({ ...prev, image_path: data.image_path }));
        setMessage({ type: 'success', text: 'Image uploaded successfully! Remember to click "Save Attraction".' });
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (error: any) {
      console.error('Image upload error:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to upload image.' });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setMessage({ type: 'error', text: 'Attraction name is required.' });
      return;
    }

    setSaving(true);
    setMessage(null);
    const isNew = !formData.id;
    const url = isNew ? `${API_BASE_URL}/attractions/create` : `${API_BASE_URL}/attractions/update`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();

      if (data && data.status === 'success') {
        setMessage({ type: 'success', text: `Attraction ${isNew ? 'created' : 'updated'} successfully!` });
        setEditingAttraction(null);
        await fetchAttractions();
      } else {
        throw new Error(data.message || 'Save failed');
      }
    } catch (error: any) {
      console.error('Save attraction error:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to save attraction.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      const response = await fetch(`${API_BASE_URL}/attractions/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await response.json();
      if (data && data.status === 'success') {
        setMessage({ type: 'success', text: 'Attraction deleted successfully.' });
        await fetchAttractions();
      } else {
        throw new Error(data.message || 'Delete failed');
      }
    } catch (error: any) {
      console.error('Delete attraction error:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to delete attraction.' });
    }
  };

  const filteredAttractions = attractions.filter(a => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (a.name && a.name.toLowerCase().includes(q)) ||
      (a.specialFor && a.specialFor.toLowerCase().includes(q)) ||
      (a.dist && a.dist.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 antialiased pb-12">
      {/* Top Banner / Navigation */}
      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={editingAttraction ? () => { setEditingAttraction(null); setMessage(null); } : onBack}
            className="p-2 border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
            title="Back to Settings"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-gray-900">
                {editingAttraction ? (editingAttraction.id === 'new' ? 'Add New Attraction' : `Edit ${editingAttraction.name}`) : 'Spiritual Attractions & Temples'}
              </h1>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {editingAttraction ? 'Editor' : `${attractions.length} Attractions`}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {editingAttraction 
                ? 'Configure details, distance, timings, and dynamic google maps route settings.' 
                : 'Manage temple directory, travel distance, suggested timings, and Kumbakonam pilgrimage guide.'}
            </p>
          </div>
        </div>

        {!editingAttraction && (
          <button 
            onClick={handleAddNewClick}
            className="px-3.5 py-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 text-xs font-medium rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus size={14} className="text-gray-600" />
            <span>Add Attraction</span>
          </button>
        )}
      </div>

      {/* Alert Messages */}
      {message && (
        <div className={`p-3.5 rounded-xl flex items-center justify-between text-xs font-semibold border shadow-xs animate-in fade-in ${
          message.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
            : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}>
          <div className="flex items-center gap-2.5">
            {message.type === 'success' ? <CheckCircle2 size={16} className="text-emerald-600 shrink-0" /> : <AlertCircle size={16} className="text-rose-600 shrink-0" />}
            <span>{message.text}</span>
          </div>
          <button 
            onClick={() => setMessage(null)} 
            className="text-gray-400 hover:text-gray-600 text-xs px-2 py-0.5 cursor-pointer"
          >
            &times;
          </button>
        </div>
      )}

      {loading ? (
        <div className="min-h-[300px] flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-gray-200 text-gray-400 gap-3">
          <Loader2 size={28} className="text-blue-600 animate-spin" />
          <p className="text-xs font-medium text-gray-500">Loading spiritual attractions...</p>
        </div>
      ) : editingAttraction ? (
        /* Edit or Add Form */
        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs space-y-4">
              <div className="border-b border-gray-100 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Attraction General Details
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Core information displayed in the Kumbakonam spiritual temples guide
                </p>
              </div>

              <div className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 block">
                    Attraction / Temple Name <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Mahamaham Tank"
                    className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 bg-white shadow-2xs"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 block">
                      Distance from Subra Residency
                    </label>
                    <input 
                      type="text"
                      name="distance"
                      value={formData.distance}
                      onChange={handleInputChange}
                      placeholder="e.g. Approximately 700 meters"
                      className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 bg-white shadow-2xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 block">
                      Recommended Mode of Travel
                    </label>
                    <input 
                      type="text"
                      name="mode"
                      value={formData.mode}
                      onChange={handleInputChange}
                      placeholder="e.g. Walk / Auto"
                      className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 bg-white shadow-2xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 block">
                      Suggested Darshan Timings
                    </label>
                    <input 
                      type="text"
                      name="timing"
                      value={formData.timing}
                      onChange={handleInputChange}
                      placeholder="e.g. 6:00 AM–12:00 PM & 4:00 PM–8:00 PM"
                      className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 bg-white shadow-2xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 block">
                      Dress Code / Protocol
                    </label>
                    <input 
                      type="text"
                      name="dress_code"
                      value={formData.dress_code}
                      onChange={handleInputChange}
                      placeholder="e.g. Traditional Indian attire recommended"
                      className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 bg-white shadow-2xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 block">
                    Special For (Quick highlight / Deity)
                  </label>
                  <input 
                    type="text"
                    name="special_for"
                    value={formData.special_for}
                    onChange={handleInputChange}
                    placeholder="e.g. Chola architecture, sacred holy water tank, spiritual atmosphere"
                    className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 bg-white shadow-2xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 block">
                    Detailed History & Pilgrim Information
                  </label>
                  <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Provide details on temple history, mythology, festivals, and visitor guidelines..."
                    rows={4}
                    className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 bg-white shadow-2xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 block">
                      Visitor Note / Tip for Guests
                    </label>
                    <input 
                      type="text"
                      name="guest_note"
                      value={formData.guest_note}
                      onChange={handleInputChange}
                      placeholder="e.g. Best visited during early morning arati"
                      className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 bg-white shadow-2xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 block">
                      Display Sort Order
                    </label>
                    <input 
                      type="number"
                      name="sort_order"
                      value={formData.sort_order}
                      onChange={handleInputChange}
                      placeholder="e.g. 10"
                      className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 bg-white shadow-2xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Image & Route Map Preview */}
          <div className="space-y-6">
            {/* Image Preview & Upload */}
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs space-y-4">
              <div className="border-b border-gray-100 pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Attraction Photo
                </h3>
              </div>

              <div className="aspect-video bg-gray-50 border border-gray-200 rounded-lg overflow-hidden relative flex items-center justify-center">
                {formData.image_path ? (
                  <img 
                    src={formData.image_path.startsWith('http') ? formData.image_path : `${BACKEND_URL}${formData.image_path}`} 
                    alt="Attraction preview" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="text-center p-4">
                    <UploadCloud size={24} className="mx-auto text-gray-400 mb-1" />
                    <span className="text-xs text-gray-400 font-medium">No image uploaded</span>
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center">
                    <Loader2 size={24} className="animate-spin text-blue-600" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="block">
                  <span className="px-3 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
                    <UploadCloud size={14} />
                    <span>Upload New Photo</span>
                  </span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    className="hidden" 
                    disabled={uploading} 
                  />
                </label>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-gray-500">Image Asset Path / URL</label>
                  <input 
                    type="text"
                    name="image_path"
                    value={formData.image_path}
                    onChange={handleInputChange}
                    placeholder="/uploads/attractions/temple.jpg"
                    className="w-full text-xs font-mono px-2.5 py-1.5 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Dynamic Map Route */}
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs space-y-3">
              <div className="border-b border-gray-100 pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Google Maps Route Preview
                </h3>
              </div>

              <div className="aspect-video bg-gray-50 border border-gray-200 rounded-lg overflow-hidden relative">
                {formData.name ? (
                  <iframe
                    title="Route Preview"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    src={`https://www.google.com/maps?q=Subra+Residency+Kumbakonam+to+${encodeURIComponent(formData.name)}&output=embed`}
                    className="w-full h-full"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                    <MapPin className="text-gray-400 mb-1" size={20} />
                    <span className="text-xs text-gray-400 font-medium">Enter temple name to load map</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => { setEditingAttraction(null); setMessage(null); }}
                className="flex-1 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium rounded-lg shadow-xs transition-colors cursor-pointer text-center"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={saving}
                className="flex-1 py-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 text-xs font-medium rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                {saving ? <Loader2 size={13} className="animate-spin text-gray-600" /> : <Save size={13} className="text-gray-600" />}
                <span>{saving ? 'Saving...' : 'Save Attraction'}</span>
              </button>
            </div>
          </div>
        </form>
      ) : (
        /* Attractions Table View */
        <div className="space-y-6">
          {/* Spiritual Sights Page Description Card */}
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Spiritual Sights Page Description
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Introductory paragraph shown above temple cards on the guest website.
                </p>
              </div>
              <button
                onClick={handleSaveSectionDesc}
                disabled={isSavingDesc}
                className="px-3.5 py-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 text-xs font-medium rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer self-end sm:self-auto disabled:opacity-50"
              >
                {isSavingDesc ? <Loader2 size={13} className="animate-spin text-gray-600" /> : <Save size={13} className="text-gray-600" />}
                <span>{isSavingDesc ? 'Saving...' : 'Save Description'}</span>
              </button>
            </div>
            <textarea
              value={sectionDesc}
              onChange={(e) => setSectionDesc(e.target.value)}
              placeholder="Enter descriptive text..."
              rows={3}
              className="w-full text-xs font-normal leading-relaxed p-3 bg-gray-50/60 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 focus:bg-white transition-all shadow-2xs"
            />
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white">
              <div className="relative w-full sm:w-72">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search temples, deities, or distance..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-800 focus:outline-none focus:bg-white focus:border-gray-300 shadow-2xs"
                />
              </div>
              <div className="text-xs text-gray-500 font-medium">
                Showing {filteredAttractions.length} of {attractions.length} attractions
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50/80 border-b border-gray-200 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4 w-16">Sort</th>
                    <th className="py-3 px-4">Temple / Attraction</th>
                    <th className="py-3 px-4">Distance</th>
                    <th className="py-3 px-4">Travel Mode</th>
                    <th className="py-3 px-4">Suggested Timings</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {filteredAttractions.length > 0 ? (
                    filteredAttractions.map((a: any) => (
                      <tr key={a.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-medium text-gray-400">
                          <span className="bg-gray-100 px-2 py-0.5 rounded border border-gray-200 text-[10px]">
                            {a.sort_order}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0 border border-gray-200 bg-gray-100 shadow-2xs">
                              <img 
                                src={a.image ? (a.image.startsWith('http') ? a.image : `${BACKEND_URL}${a.image}`) : ''} 
                                alt={a.name} 
                                className="w-full h-full object-cover" 
                                onError={(e: any) => { e.target.style.display = 'none'; }}
                              />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 leading-tight">{a.name}</p>
                              {a.specialFor && (
                                <p className="text-[11px] text-gray-500 mt-0.5 max-w-sm truncate">{a.specialFor}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 text-gray-600">
                            <MapPin size={13} className="text-gray-400 shrink-0" />
                            <span>{a.dist || '—'}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-[11px] font-medium border border-gray-200">
                            <Car size={12} className="text-gray-400" />
                            <span>{a.mode || 'Walk / Auto'}</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 text-gray-600">
                            <Clock size={13} className="text-gray-400 shrink-0" />
                            <span>{a.timing || '—'}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button 
                              onClick={() => handleEditClick(a)}
                              className="px-2.5 py-1.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 text-xs font-medium rounded-md shadow-xs transition-colors inline-flex items-center gap-1 cursor-pointer"
                              title="Edit Attraction"
                            >
                              <Edit3 size={12} className="text-gray-500" />
                              <span>Edit</span>
                            </button>
                            <button 
                              onClick={() => handleDelete(a.id, a.name)}
                              className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                              title="Delete Attraction"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-gray-400 font-medium text-xs">
                        {searchQuery ? 'No attractions found matching your search.' : 'No spiritual attractions configured yet.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
