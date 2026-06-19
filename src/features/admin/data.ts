import type { AdminRoom } from './types';

export const revenueData = [
  { name: 'Mon', revenue: 45000, occupancy: 65 },
  { name: 'Tue', revenue: 52000, occupancy: 72 },
  { name: 'Wed', revenue: 48000, occupancy: 68 },
  { name: 'Thu', revenue: 61000, occupancy: 85 },
  { name: 'Fri', revenue: 85000, occupancy: 95 },
  { name: 'Sat', revenue: 98000, occupancy: 98 },
  { name: 'Sun', revenue: 75000, occupancy: 82 },
];

export const pieData = [
  { name: 'Direct', value: 45, color: '#0B4D46' },
  { name: 'OTA (Booking.com)', value: 30, color: '#C89B3C' },
  { name: 'Corporate', value: 15, color: '#1C1C1C' },
  { name: 'Others', value: 10, color: '#EDE4D3' },
];

export const billingData = [
  { id: 'INV-2024-001', guest: 'Rahul Sharma', amount: 'â‚¹12,450', date: '2024-06-10', status: 'Paid', method: 'UPI' },
  { id: 'INV-2024-002', guest: 'Priya Patel', amount: 'â‚¹8,900', date: '2024-06-11', status: 'Pending', method: 'Credit Card' },
  { id: 'INV-2024-003', guest: 'Amit Kumar', amount: 'â‚¹22,100', date: '2024-06-11', status: 'Paid', method: 'Cash' },
  { id: 'INV-2024-004', guest: 'Sneha Gupta', amount: 'â‚¹15,600', date: '2024-06-12', status: 'Refunded', method: 'Bank Transfer' },
];

export const initialRooms: AdminRoom[] = [
  { id: '101', type: 'Deluxe Heritage', status: 'Available', price: 'â‚¹3,500', floor: '1st Floor', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80' },
  { id: '201', type: 'Executive Suite', status: 'Occupied', price: 'â‚¹5,500', floor: '2nd Floor', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80' },
  { id: '301', type: 'Royal Family', status: 'Reserved', price: 'â‚¹9,000', floor: '3rd Floor', image: 'https://images.unsplash.com/photo-1591088398332-8a7761a9e044?auto=format&fit=crop&w=800&q=80' },
  { id: '401', type: 'Deluxe Heritage', status: 'Maintenance', price: 'â‚¹3,500', floor: '4th Floor', image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80' },
];

