import type { LucideIcon } from 'lucide-react';

export type ReceptionView = 'dashboard' | 'checkin' | 'walkin' | 'rooms' | 'arrivals';

export type ReceptionRoom = {
  id: string;
  type: string;
  status: string;
  guest: string;
  color: string;
};

export type WalkInFormData = {
  name: string;
  phone: string;
  type: string;
  checkIn: string;
  checkOut: string;
};

export type ReceptionNavItem = {
  id: ReceptionView;
  label: string;
  icon: LucideIcon;
};

