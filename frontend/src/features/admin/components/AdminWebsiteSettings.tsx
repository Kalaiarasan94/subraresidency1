import React, { useState, useEffect } from 'react';
import { Save, Globe, Mail, Phone, MapPin, Share2, ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { API_BASE_URL } from '../../../lib/api';

interface WebsiteSettingsProps {
  onBack: () => void;
}

export const AdminWebsiteSettings: React.FC<WebsiteSettingsProps> = ({ onBack }) => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/settings`);
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
      setMessage({ type: 'error', text: 'Failed to load settings.' });
    } finally {
      setLoading(false);
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
        setMessage({ type: 'success', text: 'Settings updated successfully!' });
      } else {
        throw new Error('Failed to update settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'Failed to save settings.' });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
        <p className="text-emerald-900 font-bold uppercase tracking-widest text-xs">Loading Settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onBack}
            className="border-slate-200 hover:bg-slate-50 rounded-full w-10 h-10 p-0"
          >
            <ArrowLeft size={18} />
          </Button>
          <div>
            <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Website Configuration</h1>
            <p className="text-sm text-slate-500 font-medium">Manage your residency's online presence and contact details.</p>
          </div>
        </div>
        <Button 
          disabled={saving}
          onClick={handleSave}
          className="bg-emerald-900 hover:bg-black text-white text-xs font-black uppercase tracking-widest px-8 h-12 shadow-xl shadow-emerald-900/20"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
          {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span className="text-sm font-bold uppercase tracking-tight">{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* General Details */}
        <Card className="border-none shadow-xl shadow-slate-200/50">
          <CardHeader className="border-b border-slate-50 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                <Globe size={18} />
              </div>
              <div>
                <CardTitle className="text-sm font-black uppercase tracking-wider">General Information</CardTitle>
                <CardDescription className="text-xs font-medium">Basic identity of your residency.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Residency Name</label>
              <Input 
                value={settings.site_name || ''} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('site_name', e.target.value)}
                placeholder="e.g. Subra Residency"
                className="bg-slate-50 border-none h-12 font-bold focus-visible:ring-emerald-600/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Site Description</label>
              <Textarea 
                value={settings.site_description || ''} 
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange('site_description', e.target.value)}
                placeholder="Briefly describe your residency..."
                className="bg-slate-50 border-none min-h-[100px] font-medium focus-visible:ring-emerald-600/20"
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Check-in Time</label>
                <Input 
                  value={settings.check_in_time || ''} 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('check_in_time', e.target.value)}
                  className="bg-slate-50 border-none h-12 font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Check-out Time</label>
                <Input 
                  value={settings.check_out_time || ''} 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('check_out_time', e.target.value)}
                  className="bg-slate-50 border-none h-12 font-bold"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="border-none shadow-xl shadow-slate-200/50">
          <CardHeader className="border-b border-slate-50 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                <Phone size={18} />
              </div>
              <div>
                <CardTitle className="text-sm font-black uppercase tracking-wider">Contact Details</CardTitle>
                <CardDescription className="text-xs font-medium">How guests can reach you.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Public Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input 
                  value={settings.site_email || ''} 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('site_email', e.target.value)}
                  className="bg-slate-50 border-none h-12 pl-12 font-bold"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input 
                  value={settings.site_phone || ''} 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('site_phone', e.target.value)}
                  className="bg-slate-50 border-none h-12 pl-12 font-bold"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Physical Address</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 text-slate-400" size={16} />
                <Textarea 
                  value={settings.site_address || ''} 
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange('site_address', e.target.value)}
                  className="bg-slate-50 border-none min-h-[100px] pl-12 pt-4 font-medium"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SEO Settings */}
        <Card className="border-none shadow-xl shadow-slate-200/50">
          <CardHeader className="border-b border-slate-50 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                <Share2 size={18} />
              </div>
              <div>
                <CardTitle className="text-sm font-black uppercase tracking-wider">SEO & Visibility</CardTitle>
                <CardDescription className="text-xs font-medium">Search engine optimization parameters.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">SEO Title Tag</label>
              <Input 
                value={settings.seo_title || ''} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('seo_title', e.target.value)}
                className="bg-slate-50 border-none h-12 font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">SEO Keywords</label>
              <Input 
                value={settings.seo_keywords || ''} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('seo_keywords', e.target.value)}
                className="bg-slate-50 border-none h-12 font-medium"
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Media Links */}
        <Card className="border-none shadow-xl shadow-slate-200/50">
          <CardHeader className="border-b border-slate-50 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                <Share2 size={18} />
              </div>
              <div>
                <CardTitle className="text-sm font-black uppercase tracking-wider">Social Presence</CardTitle>
                <CardDescription className="text-xs font-medium">Connect your social media accounts.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Facebook URL</label>
              <Input 
                value={settings.social_facebook || ''} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('social_facebook', e.target.value)}
                className="bg-slate-50 border-none h-12 font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Instagram URL</label>
              <Input 
                value={settings.social_instagram || ''} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('social_instagram', e.target.value)}
                className="bg-slate-50 border-none h-12 font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Twitter URL</label>
              <Input 
                value={settings.social_twitter || ''} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('social_twitter', e.target.value)}
                className="bg-slate-50 border-none h-12 font-medium"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
