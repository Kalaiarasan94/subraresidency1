import React, { useState, useEffect } from 'react';
import { 
  Save, Globe, Mail, Phone, MapPin, Share2, ArrowLeft, 
  CheckCircle2, AlertCircle, Loader2, Sparkles, Image as ImageIcon,
  Clock, ExternalLink, Trash2, UploadCloud, RefreshCw
} from 'lucide-react';
import { API_BASE_URL, BACKEND_URL } from '../../../lib/api';

interface WebsiteSettingsProps {
  onBack: () => void;
}

export const AdminWebsiteSettings: React.FC<WebsiteSettingsProps> = ({ onBack }) => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'contact' | 'seo' | 'banner'>('general');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/settings`);
      const data = await response.json();
      setSettings(data || {});
    } catch (error) {
      console.error('Error fetching settings:', error);
      setMessage({ type: 'error', text: 'Failed to load website settings.' });
    } finally {
      setLoading(false);
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setUploadingBanner(true);
    setMessage(null);
    
    const formData = new FormData();
    formData.append('banner', file);
    
    try {
      const response = await fetch(`${API_BASE_URL}/settings/uploadBanner`, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (data && data.status === 'success') {
        handleChange('popup_banner_image', data.image_path);
        setMessage({ type: 'success', text: 'Banner image uploaded successfully! Click "Save Changes" to apply.' });
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (error: any) {
      console.error('Error uploading banner:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to upload banner.' });
    } finally {
      setUploadingBanner(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch(`${API_BASE_URL}/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Website configuration saved successfully.' });
      } else {
        throw new Error('Failed to update settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'Failed to save settings to server.' });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-gray-200">
        <Loader2 className="w-8 h-8 text-slate-800 animate-spin" />
        <p className="text-gray-500 font-semibold text-xs mt-3">Loading Website Settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 antialiased">
      {/* Top Header */}
      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 border border-gray-300 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors shadow-xs"
            title="Back to System Settings"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-gray-900">
                Website Configuration
              </h1>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                Live Portal
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Control residency branding, SEO tags, guest contact points, and promotional popup banners
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchSettings}
            disabled={saving}
            className="px-3 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            title="Reload current settings from server"
          >
            <RefreshCw size={13} />
            <span>Reset</span>
          </button>

          <button 
            disabled={saving}
            onClick={handleSave}
            className="px-5 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-lg shadow-xs inline-flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
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
            className="text-gray-400 hover:text-gray-600 text-xs px-2 py-0.5"
          >
            &times;
          </button>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-1.5 p-1 bg-gray-100 rounded-xl border border-gray-200 text-xs w-fit">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-3.5 py-1.5 font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
            activeTab === 'general'
              ? 'bg-white text-gray-900 shadow-xs'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Globe size={14} />
          <span>General Info</span>
        </button>

        <button
          onClick={() => setActiveTab('contact')}
          className={`px-3.5 py-1.5 font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
            activeTab === 'contact'
              ? 'bg-white text-gray-900 shadow-xs'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Phone size={14} />
          <span>Contact & Social</span>
        </button>

        <button
          onClick={() => setActiveTab('seo')}
          className={`px-3.5 py-1.5 font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
            activeTab === 'seo'
              ? 'bg-white text-gray-900 shadow-xs'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Share2 size={14} />
          <span>SEO & Metadata</span>
        </button>

        <button
          onClick={() => setActiveTab('banner')}
          className={`px-3.5 py-1.5 font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
            activeTab === 'banner'
              ? 'bg-white text-gray-900 shadow-xs'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Sparkles size={14} />
          <span>Popup Offer Banner</span>
          {settings.popup_banner_enabled === 'true' && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          )}
        </button>
      </div>

      {/* TAB 1: GENERAL INFO */}
      {activeTab === 'general' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <Globe size={16} className="text-slate-700" />
              <h2 className="text-sm font-bold text-gray-900">Hotel Identity & Branding</h2>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Residency Brand Name</label>
              <input 
                type="text"
                value={settings.site_name || ''} 
                onChange={(e) => handleChange('site_name', e.target.value)}
                placeholder="e.g. Subra Residency"
                className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-colors"
              />
              <span className="text-[11px] text-gray-400">Displayed in headers, invoices, and confirmation emails</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Site Tagline / Description</label>
              <textarea 
                rows={3}
                value={settings.site_description || ''} 
                onChange={(e) => handleChange('site_description', e.target.value)}
                placeholder="Briefly describe your hotel, location advantages, or hospitality philosophy..."
                className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-colors"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <Clock size={16} className="text-slate-700" />
              <h2 className="text-sm font-bold text-gray-900">Front Desk Check-in Policies</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Check-in Time</label>
                <input 
                  type="text"
                  value={settings.check_in_time || ''} 
                  onChange={(e) => handleChange('check_in_time', e.target.value)}
                  placeholder="e.g. 12:00 PM"
                  className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Check-out Time</label>
                <input 
                  type="text"
                  value={settings.check_out_time || ''} 
                  onChange={(e) => handleChange('check_out_time', e.target.value)}
                  placeholder="e.g. 11:00 AM"
                  className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-colors"
                />
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-gray-600 leading-relaxed">
              <span className="font-bold text-gray-800">Guest Notice:</span> Check-in and check-out times will be automatically printed on all reservation vouchers and confirmation emails.
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CONTACT & SOCIAL */}
      {activeTab === 'contact' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Direct Communication */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <Phone size={16} className="text-slate-700" />
              <h2 className="text-sm font-bold text-gray-900">Direct Contact Information</h2>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Public Reception Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input 
                  type="text"
                  value={settings.site_phone || ''} 
                  onChange={(e) => handleChange('site_phone', e.target.value)}
                  placeholder="+91 73958 09991, 73958 09992"
                  className="w-full text-xs pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Official Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input 
                  type="email"
                  value={settings.site_email || ''} 
                  onChange={(e) => handleChange('site_email', e.target.value)}
                  placeholder="subraresidency@gmail.com"
                  className="w-full text-xs pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Physical Residency Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400" size={14} />
                <textarea 
                  rows={3}
                  value={settings.site_address || ''} 
                  onChange={(e) => handleChange('site_address', e.target.value)}
                  placeholder="NO.45-1/1187B2, Lal Bahadur Sastry Road, Thanjavur - 612001..."
                  className="w-full text-xs pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Social Channels */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <Share2 size={16} className="text-slate-700" />
              <h2 className="text-sm font-bold text-gray-900">Social Media & Channels</h2>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Facebook Page URL</label>
              <input 
                type="text"
                value={settings.social_facebook || ''} 
                onChange={(e) => handleChange('social_facebook', e.target.value)}
                placeholder="https://facebook.com/subraresidency"
                className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Instagram Profile URL</label>
              <input 
                type="text"
                value={settings.social_instagram || ''} 
                onChange={(e) => handleChange('social_instagram', e.target.value)}
                placeholder="https://instagram.com/subraresidency"
                className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Twitter / X URL</label>
              <input 
                type="text"
                value={settings.social_twitter || ''} 
                onChange={(e) => handleChange('social_twitter', e.target.value)}
                placeholder="https://x.com/subraresidency"
                className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SEO & METADATA */}
      {activeTab === 'seo' && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs space-y-4 max-w-3xl">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <Share2 size={16} className="text-slate-700" />
            <div>
              <h2 className="text-sm font-bold text-gray-900">Search Engine Optimization (SEO)</h2>
              <p className="text-xs text-gray-500">Configure how Subra Residency appears in Google searches and social shares</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Meta Title Tag</label>
            <input 
              type="text"
              value={settings.seo_title || ''} 
              onChange={(e) => handleChange('seo_title', e.target.value)}
              placeholder="Subra Residency | Luxury Hotel in Thanjavur near Big Temple"
              className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
            />
            <span className="text-[11px] text-gray-400">Recommended length: 50-60 characters</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">SEO Keywords (Comma Separated)</label>
            <input 
              type="text"
              value={settings.seo_keywords || ''} 
              onChange={(e) => handleChange('seo_keywords', e.target.value)}
              placeholder="Thanjavur hotel, budget stay Thanjavur, AC rooms near Brihadeeswarar Temple, residency"
              className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
            />
          </div>

          {/* Google Preview Snippet */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
              Google Search Preview
            </span>
            <div className="text-blue-700 text-sm font-medium hover:underline cursor-pointer truncate">
              {settings.seo_title || settings.site_name || 'Subra Residency | Premium Hotel in Thanjavur'}
            </div>
            <div className="text-[11px] text-emerald-800">
              https://subraresidency.com/
            </div>
            <div className="text-xs text-gray-600 line-clamp-2">
              {settings.site_description || 'Book your spiritual and heritage stay at Subra Residency in Thanjavur. Best rates, modern amenities, 24/7 reception.'}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: POPUP OFFER BANNER */}
      {activeTab === 'banner' && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs space-y-6 max-w-3xl">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-amber-600" />
              <div>
                <h2 className="text-sm font-bold text-gray-900">Promotional Modal / Festival Banner</h2>
                <p className="text-xs text-gray-500">Floating announcement shown to website visitors on initial load</p>
              </div>
            </div>

            {/* iOS Style Modern Toggle */}
            <label className="inline-flex items-center gap-2.5 cursor-pointer">
              <span className="text-xs font-semibold text-gray-700">
                {settings.popup_banner_enabled === 'true' ? 'Active' : 'Disabled'}
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={settings.popup_banner_enabled === 'true'}
                onClick={() => handleChange('popup_banner_enabled', settings.popup_banner_enabled === 'true' ? 'false' : 'true')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.popup_banner_enabled === 'true' ? 'bg-emerald-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    settings.popup_banner_enabled === 'true' ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </label>
          </div>

          {/* Banner Redirect Link */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Redirect Link on Banner Click (Optional)</label>
            <div className="relative">
              <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input 
                type="text"
                value={settings.popup_banner_link || ''} 
                onChange={(e) => handleChange('popup_banner_link', e.target.value)}
                placeholder="e.g. /rooms or https://..."
                className="w-full text-xs pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
              />
            </div>
            <span className="text-[11px] text-gray-400">Guests clicking the banner will be routed to this URL</span>
          </div>

          {/* Banner Image Preview & Upload */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-700">Banner Graphic Image</label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              {/* Preview Box */}
              {settings.popup_banner_image ? (
                <div className="relative rounded-xl border border-gray-200 overflow-hidden bg-gray-50 shadow-xs group">
                  <img 
                    src={`${BACKEND_URL}${settings.popup_banner_image}`}
                    alt="Active Promotional Banner" 
                    className="w-full h-44 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleChange('popup_banner_image', '')}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1 transition-colors"
                    >
                      <Trash2 size={13} />
                      <span>Remove</span>
                    </button>
                  </div>
                  <div className="p-2.5 bg-white border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-600">
                    <span className="truncate">{settings.popup_banner_image}</span>
                    <span className="font-semibold text-emerald-700">Active</span>
                  </div>
                </div>
              ) : (
                <div className="h-44 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/70 flex flex-col items-center justify-center text-gray-400 p-4 text-center">
                  <ImageIcon size={28} className="text-gray-300 mb-1" />
                  <span className="text-xs font-semibold text-gray-500">No Banner Image Set</span>
                  <span className="text-[10px] text-gray-400 mt-0.5">Upload a banner using the selector on the right</span>
                </div>
              )}

              {/* Upload Drop Area */}
              <div className="space-y-2">
                <label className="relative flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-slate-800 rounded-xl p-6 transition-all cursor-pointer bg-gray-50/50 hover:bg-white group text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBannerUpload}
                    disabled={uploadingBanner}
                    className="sr-only"
                  />
                  {uploadingBanner ? (
                    <div className="flex flex-col items-center gap-2 py-2">
                      <Loader2 size={24} className="text-slate-900 animate-spin" />
                      <span className="text-xs font-bold text-gray-700">Processing & Converting to WebP...</span>
                    </div>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-slate-900 group-hover:text-white text-slate-700 flex items-center justify-center transition-colors mb-2 shadow-xs">
                        <UploadCloud size={20} />
                      </div>
                      <span className="text-xs font-bold text-gray-800 group-hover:text-black">
                        Choose New Banner Image
                      </span>
                      <span className="text-[10px] text-gray-400 mt-1">
                        PNG, JPG, or WebP. Auto-compressed & scaled.
                      </span>
                    </>
                  )}
                </label>
                <div className="text-[11px] text-gray-500 text-center">
                  Recommended aspect ratio: 16:9 or 4:3 (e.g. 1200 &times; 800 px)
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Sticky Action Bar */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs flex items-center justify-between">
        <span className="text-xs text-gray-500">
          Unsaved changes will not affect the live website until you click Save.
        </span>
        <button 
          disabled={saving}
          onClick={handleSave}
          className="px-6 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-lg shadow-xs inline-flex items-center gap-2 transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          <span>{saving ? 'Saving Changes...' : 'Save Configuration'}</span>
        </button>
      </div>

    </div>
  );
};
