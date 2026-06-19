import type { LucideIcon } from 'lucide-react';

export type AdminTab = 'analytics' | 'guests' | 'rooms' | 'billing' | 'settings';

export type AdminRoom = {
  id: string;
  type: string;
  status: string;
  price: string;
  floor: string;
  image: string;
};

export type AdminStatConfig = {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
};

