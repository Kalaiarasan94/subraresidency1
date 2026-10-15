import { useState } from 'react';
import { 
  Users, Layout, Mail, ChevronRight, 
  ArrowRight, UserCheck, Settings2,
  Lock, Bell, FileText,
  ReceiptIndianRupee, MapPin, Globe, Share2, Code, Clock, Car
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { AdminWebsiteSettings } from './AdminWebsiteSettings';
import { AdminUsersView } from './AdminUsersView';
import { AdminAttractionsView } from './AdminAttractionsView';

export const AdminSettingsView = () => {
  const [activeSection, setActiveSection] = useState<'main' | 'website' | 'users' | 'email' | 'rooms' | 'security' | 'attractions'>('main');

  if (activeSection === 'website') {
    return <AdminWebsiteSettings onBack={() => setActiveSection('main')} />;
  }

  if (activeSection === 'users') {
    return <AdminUsersView onBack={() => setActiveSection('main')} />;
  }

  if (activeSection === 'attractions') {
    return <AdminAttractionsView onBack={() => setActiveSection('main')} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">System Management & Settings</h1>
          <p className="text-xs text-gray-500 mt-0.5">Configure global residency parameters, staff credentials, and system settings.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* 1. User Management */}
        <SettingsCard 
          title="User Management"
          subtitle="Admin & Reception Accounts"
          icon={Users}
          links={[
            { label: 'Admin Accounts & Passwords', icon: UserCheck },
            { label: 'Reception Staff Logins', icon: Users },
            { label: 'Security & Access Keys', icon: Lock }
          ]}
          action="Manage Users & Passwords"
          onAction={() => setActiveSection('users')}
        />

        {/* 2. Website Settings */}
        <SettingsCard 
          title="Website Configuration"
          subtitle="Branding, SEO & Portal"
          icon={Layout}
          links={[
            { label: 'Hotel Profile & Contact Info', icon: Settings2 },
            { label: 'Meta SEO & Social Links', icon: Globe },
            { label: 'Social & Share Links', icon: Share2 },
            { label: 'Custom Scripts & Header Tags', icon: Code }
          ]}
          action="Configure Website"
          onAction={() => setActiveSection('website')}
        />

        {/* 3. Email & Notifications */}
        <SettingsCard 
          title="Email & Notifications"
          subtitle="Alerts & Templates"
          icon={Mail}
          links={[
            { label: 'Email Template Customization', icon: FileText },
            { label: 'Booking Confirmation Email', icon: Bell },
            { label: 'Invoice & Settlement Receipts', icon: ReceiptIndianRupee },
            { label: 'Express Check-in Notifications', icon: MapPin }
          ]}
          action="Configure Emails"
          onAction={() => setActiveSection('email')}
        />

        {/* 4. Spiritual Attractions */}
        <SettingsCard 
          title="Spiritual Sights"
          subtitle="Kumbakonam Temples & Sights"
          icon={MapPin}
          links={[
            { label: 'Temple Directory & Timings', icon: MapPin },
            { label: 'Darshan Schedules & Festivals', icon: Clock },
            { label: 'Travel Modes & Map Routes', icon: Car }
          ]}
          action="Manage Attractions"
          onAction={() => setActiveSection('attractions')}
        />
      </div>
    </div>
  );
};

const SettingsCard = ({ title, subtitle, icon: Icon, links, action, onAction }: any) => (
  <div className="crm-card bg-white border border-gray-200 rounded-lg shadow-xs hover:border-gray-300 transition-colors flex flex-col justify-between overflow-hidden">
    <div>
      <div className="p-4 border-b border-gray-100 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
          <Icon size={18} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900 leading-tight">{title}</h3>
          {subtitle && <p className="text-[11px] text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="divide-y divide-gray-50 py-1">
        {links.map((link: any, i: number) => (
          <div 
            key={i} 
            onClick={onAction}
            className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50/70 transition-colors group"
          >
            <link.icon size={14} className="text-gray-400 group-hover:text-emerald-700 transition-colors shrink-0" />
            <span className="text-xs text-gray-700 group-hover:text-gray-900 font-medium">{link.label}</span>
            <ChevronRight size={13} className="ml-auto text-gray-300 group-hover:text-gray-500 transition-colors" />
          </div>
        ))}
      </div>
    </div>
    <div className="p-4 pt-2 border-t border-gray-100 bg-gray-50/40">
      <Button 
        onClick={onAction} 
        variant="outline"
        className="w-full bg-white hover:bg-gray-50 border-gray-200 text-gray-700 text-xs font-medium h-9 rounded-md shadow-xs transition-colors"
      >
        {action} <ArrowRight size={12} className="ml-1.5" />
      </Button>
    </div>
  </div>
);


