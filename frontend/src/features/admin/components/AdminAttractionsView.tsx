import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Edit3, ArrowLeft, Loader2, Image as ImageIcon, MapPin, Clock, Car, Footprints } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
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
        setMessage({ type: 'success', text: 'Image uploaded successfully! Remember to save changes.' });
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

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center justify-between border-b border-slate-100 pb-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={editingAttraction ? () => { setEditingAttraction(null); setMessage(null); } : onBack}
            className="border-slate-200 hover:bg-slate-50 rounded-full w-10 h-10 p-0"
          >
            <ArrowLeft size={18} />
          </Button>
          <div>
            <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">
              {editingAttraction ? (editingAttraction.id === 'new' ? 'Add New Attraction' : `Edit ${editingAttraction.name}`) : 'Spiritual Attractions'}
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              {editingAttraction ? 'Configure details, distance, timings, and dynamic google maps settings.' : 'Manage temple details and local sights near Subra Residency.'}
            </p>
          </div>
        </div>
        {!editingAttraction && (
          <Button 
            onClick={handleAddNewClick}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-widest px-6 h-12 shadow-xl shadow-indigo-500/10 rounded-xl"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Attraction
          </Button>
        )}
      </div>

      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-indigo-50 text-indigo-850 border border-indigo-150' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
          <span className="text-sm font-bold uppercase tracking-tight">{message.text}</span>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 space-y-4">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          <p className="text-indigo-900 font-bold uppercase tracking-widest text-xs">Loading Attractions...</p>
        </div>
      ) : editingAttraction ? (
        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white p-6">
              <CardHeader className="p-0 pb-4 mb-4 border-b border-slate-100">
                <CardTitle className="text-sm font-black uppercase text-indigo-950 tracking-wider">Attraction General Details</CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Attraction Name</label>
                  <Input 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Mahamaham Tank"
                    className="bg-slate-50 border-slate-200 h-11 font-bold focus-visible:ring-indigo-600/20"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Distance from Hotel</label>
                    <Input 
                      name="distance"
                      value={formData.distance}
                      onChange={handleInputChange}
                      placeholder="e.g. Approximately 700 meters"
                      className="bg-slate-50 border-slate-200 h-11 font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Mode of Travel</label>
                    <Input 
                      name="mode"
                      value={formData.mode}
                      onChange={handleInputChange}
                      placeholder="e.g. Walk / Auto"
                      className="bg-slate-50 border-slate-200 h-11 font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Suggested Timings</label>
                    <Input 
                      name="timing"
                      value={formData.timing}
                      onChange={handleInputChange}
                      placeholder="e.g. 6:00 AM–12:00 PM"
                      className="bg-slate-50 border-slate-200 h-11 font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Dress Code</label>
                    <Input 
                      name="dress_code"
                      value={formData.dress_code}
                      onChange={handleInputChange}
                      placeholder="e.g. Modest attire recommended"
                      className="bg-slate-50 border-slate-200 h-11 font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Special For (Quick highlight)</label>
                  <Input 
                    name="special_for"
                    value={formData.special_for}
                    onChange={handleInputChange}
                    placeholder="e.g. Chola architecture, sculptural beauty..."
                    className="bg-slate-50 border-slate-200 h-11 font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Detailed Description</label>
                  <Textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Detailed history and description..."
                    rows={5}
                    className="bg-slate-50 border-slate-200 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Guest Note (Residency advice)</label>
                  <Input 
                    name="guest_note"
                    value={formData.guest_note}
                    onChange={handleInputChange}
                    placeholder="e.g. Since it is very close to hotel, guests can visit by walk."
                    className="bg-slate-50 border-slate-200 h-11 font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Sort Order</label>
                  <Input 
                    name="sort_order"
                    type="number"
                    value={formData.sort_order}
                    onChange={handleInputChange}
                    className="bg-slate-50 border-slate-200 h-11 font-bold w-28"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white p-6">
              <CardHeader className="p-0 pb-4 mb-4 border-b border-slate-100">
                <CardTitle className="text-sm font-black uppercase text-indigo-950 tracking-wider">Cover Image</CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-slate-55 transition-colors relative min-h-[160px]">
                  {formData.image_path ? (
                    <div className="space-y-3 w-full text-center">
                      <img 
                        src={formData.image_path.startsWith('http') ? formData.image_path : `${BACKEND_URL}${formData.image_path}`} 
                        alt="Preview" 
                        className="w-full h-32 object-cover rounded-lg border border-slate-100" 
                      />
                      <button 
                        type="button" 
                        onClick={() => setFormData(prev => ({ ...prev, image_path: '' }))}
                        className="text-[9px] font-black uppercase text-rose-500 hover:text-rose-700 tracking-widest"
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <ImageIcon className="mx-auto text-slate-350 mb-2" size={32} />
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No Image Configured</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">Upload New Photo</label>
                  <input 
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:uppercase file:bg-indigo-50 file:text-indigo-700 file:cursor-pointer hover:file:bg-indigo-100"
                  />
                  {uploading && (
                    <div className="flex items-center gap-2 mt-1">
                      <Loader2 className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
                      <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">Uploading to server...</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Direct Image URL / Path</label>
                  <Input 
                    name="image_path"
                    value={formData.image_path}
                    onChange={handleInputChange}
                    placeholder="/uploads/attractions/mahamaham.jpg"
                    className="bg-slate-50 border-slate-200 text-xs font-semibold font-mono"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white p-6">
              <CardHeader className="p-0 pb-4 mb-4 border-b border-slate-100">
                <CardTitle className="text-sm font-black uppercase text-indigo-950 tracking-wider">Dynamic Map Preview</CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                <div className="aspect-video bg-slate-150 border border-slate-200 rounded-xl overflow-hidden relative">
                  {formData.name ? (
                    <iframe
                      title="Route Preview"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      src={`https://www.google.com/maps?q=Subra+Residency+Kumbakonam+to+${formData.name}&output=embed`}
                      className="w-full h-full"
                    ></iframe>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                      <MapPin className="text-slate-400 mb-1" size={20} />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Configure name to load route map</span>
                    </div>
                  )}
                </div>
                <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 text-[10px] text-indigo-900 font-bold leading-normal">
                  💡 The map iframe route will automatically update on the front-end to guide guests from Subra Residency directly to the configured attraction!
                </div>
              </CardContent>
            </Card>

            <Button 
              type="submit"
              disabled={saving}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-widest h-12 shadow-xl shadow-emerald-500/10 rounded-xl"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Save Attraction Details
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white p-6">
            <CardHeader className="p-0 pb-4 mb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-sm font-black uppercase text-indigo-950 tracking-wider">Spiritual Sights Page Description</CardTitle>
                <CardDescription className="text-xs text-slate-500 font-medium mt-1">Edit the paragraph text shown above the temple details section on the customer website.</CardDescription>
              </div>
              <Button
                onClick={handleSaveSectionDesc}
                disabled={isSavingDesc}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-widest px-4 h-9 shadow-md rounded-lg flex items-center gap-1.5 self-end sm:self-auto"
              >
                {isSavingDesc ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                Save Text
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Textarea
                value={sectionDesc}
                onChange={(e) => setSectionDesc(e.target.value)}
                placeholder="Enter description text..."
                rows={3}
                className="bg-slate-50 border-slate-200 text-xs font-semibold leading-relaxed"
              />
            </CardContent>
          </Card>

          <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white overflow-hidden">
            <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/60 border-b border-slate-100 text-[9px] uppercase font-black text-slate-455 tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Sort</th>
                    <th className="px-6 py-4">Attraction</th>
                    <th className="px-6 py-4">Distance</th>
                    <th className="px-6 py-4">Mode</th>
                    <th className="px-6 py-4">Timings</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-bold text-slate-700">
                  {attractions.length > 0 ? (
                    attractions.map((a: any) => (
                      <tr key={a.id} className="hover:bg-slate-50/40 transition-colors">
                        <td className="px-6 py-4 font-mono font-bold text-slate-400">{a.sort_order}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-slate-100">
                              <img src={a.image} alt={a.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="font-extrabold text-slate-900 leading-tight uppercase tracking-tight">{a.name}</p>
                              <p className="text-[9px] text-slate-400 font-semibold mt-0.5 max-w-sm truncate">{a.specialFor}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-500 flex items-center gap-1.5 mt-3"><MapPin size={12} className="text-slate-350 shrink-0" /> {a.dist}</td>
                        <td className="px-6 py-4 text-slate-500 font-semibold uppercase tracking-wider">{a.mode}</td>
                        <td className="px-6 py-4 text-slate-400 font-medium">{a.timing}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleEditClick(a)}
                              className="border-slate-200 hover:bg-slate-50 hover:text-indigo-600 h-8 rounded-lg text-[10px] font-black uppercase tracking-wider"
                            >
                              <Edit3 size={12} className="mr-1.5" /> Edit
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleDelete(a.id, a.name)}
                              className="border-slate-200 hover:bg-rose-50 text-slate-500 hover:text-rose-600 h-8 rounded-lg text-[10px] font-black uppercase tracking-wider"
                            >
                              <Trash2 size={12} className="mr-1.5" /> Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-slate-400 uppercase tracking-widest font-black text-[10px]">
                        No attractions configured.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        </div>
      )}
    </div>
  );
};
