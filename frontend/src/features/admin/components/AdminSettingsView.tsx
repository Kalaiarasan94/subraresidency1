import { useState } from 'react';
import { 
  Users, Layout, Mail, ChevronRight, 
  ArrowRight, UserCheck, Settings2,
  Lock, Bell, FileText,
  DollarSign, MapPin, Globe, Share2, Code
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { AdminWebsiteSettings } from './AdminWebsiteSettings';
import { AdminUsersView } from './AdminUsersView';

export const AdminSettingsView = () => {
  const [activeSection, setActiveSection] = useState<'main' | 'website' | 'users' | 'email' | 'rooms' | 'security'>('main');

  if (activeSection === 'website') {
    return <AdminWebsiteSettings onBack={() => setActiveSection('main')} />;
  }

  if (activeSection === 'users') {
    return <AdminUsersView onBack={() => setActiveSection('main')} />;
  }

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-700">
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">System Management & Settings</h1>
          <p className="text-sm text-slate-500 font-medium">Configure global residency parameters, users, and security.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* 1. User Management */}
        <SettingsCard 
          title="User Management"
          icon={Users}
          links={[
            { label: 'Admin Users', icon: UserCheck },
            { label: 'Reception Users', icon: Users },
            { label: 'Roles & Permissions', icon: Lock }
          ]}
          action="Manage Users"
          onAction={() => setActiveSection('users')}
        />

        {/* 2. Website Settings */}
        <SettingsCard 
          title="Website Settings"
          icon={Layout}
          links={[
            { label: 'General Settings', icon: Settings2 },
            { label: 'SEO Settings', icon: Globe },
            { label: 'Social Links', icon: Share2 },
            { label: 'Custom Code', icon: Code }
          ]}
          action="Manage Settings"
          onAction={() => setActiveSection('website')}
        />

        {/* 3. Email & Notifications */}
        <SettingsCard 
          title="Email & Notifications"
          icon={Mail}
          links={[
            { label: 'Email Templates', icon: FileText },
            { label: 'Booking Confirmation', icon: Bell },
            { label: 'Invoice Email', icon: DollarSign },
            { label: 'Check-in Email', icon: MapPin }
          ]}
          action="Manage Emails"
          onAction={() => setActiveSection('email')}
        />
      </div>
    </div>
  );
};

const SettingsCard = ({ title, icon: Icon, links, action, onAction }: any) => (
  <Card className="border-none shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full bg-white">
    <CardHeader className="pb-4 border-b border-slate-50">
      <CardTitle className="text-sm font-black uppercase text-emerald-900 tracking-wider flex items-center gap-3">
        <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
           <Icon size={16} />
        </div>
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="p-0 flex-grow">
      <div className="divide-y divide-slate-50">
        {links.map((link: any, i: number) => (
          <div 
            key={i} 
            onClick={onAction}
            className="flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-slate-50 transition-colors group"
          >
            <div className="p-1.5 rounded-md bg-slate-50 text-slate-400 group-hover:text-emerald-600 group-hover:bg-emerald-50 transition-all">
              <link.icon size={14} />
            </div>
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-600 group-hover:text-slate-900">{link.label}</span>
            <ChevronRight size={14} className="ml-auto text-slate-300 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
          </div>
        ))}
      </div>
    </CardContent>
    <div className="p-4 bg-slate-50/50 mt-auto">
      <Button onClick={onAction} className="w-full bg-emerald-900 hover:bg-black text-white text-[10px] font-black uppercase tracking-widest h-10 shadow-lg shadow-emerald-900/10 active:scale-95 transition-all">
        {action} <ArrowRight size={12} className="ml-2" />
      </Button>
    </div>
  </Card>
);


