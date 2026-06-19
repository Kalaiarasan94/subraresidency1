import type { ReceptionRoom } from './types';

export const initialReceptionRooms: ReceptionRoom[] = [
  { id: '101', type: 'Deluxe Heritage', status: 'Occupied', guest: 'Ramesh Kumar', color: 'destructive' },
  { id: '102', type: 'Deluxe Heritage', status: 'Available', guest: '-', color: 'success' },
  { id: '201', type: 'Executive Suite', status: 'Cleaning', guest: '-', color: 'warning' },
  { id: '202', type: 'Executive Suite', status: 'Reserved', guest: 'Anita Sharma', color: 'default' },
  { id: '301', type: 'Royal Family', status: 'Occupied', guest: 'Venkatesh Iyer', color: 'destructive' },
  { id: '302', type: 'Royal Family', status: 'Available', guest: '-', color: 'success' },
  { id: '401', type: 'Deluxe Heritage', status: 'Maintenance', guest: '-', color: 'secondary' },
  { id: '402', type: 'Deluxe Heritage', status: 'Occupied', guest: 'John Doe', color: 'destructive' },
];

