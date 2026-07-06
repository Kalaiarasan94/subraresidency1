const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api/index.php';

export const fetchRoomCategories = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/rooms/categories`);
        if (!response.ok) throw new Error('Failed to fetch rooms');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
};

export const createBooking = async (bookingData: any) => {
    try {
        const response = await fetch(`${API_BASE_URL}/bookings/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
        });
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
};

export const createPaymentOrder = async (payload: { booking_id: string; amount: number; currency?: string }) => {
    try {
        const response = await fetch(`${API_BASE_URL}/payments/createOrder`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
};

export const verifyPayment = async (payload: any) => {
    try {
        const response = await fetch(`${API_BASE_URL}/payments/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
};

export const fetchBookingById = async (bookingId: string) => {
    try {
        const resp = await fetch(`${API_BASE_URL}/bookings/view?booking_id=${encodeURIComponent(bookingId)}`);
        if (!resp.ok) throw new Error('Failed to fetch booking');
        return await resp.json();
    } catch (e) {
        console.error(e);
        return null;
    }
};

export const fetchAdminBookings = async (limit = 50, offset = 0) => {
    try {
        const resp = await fetch(`${API_BASE_URL}/admin/bookings/list?limit=${limit}&offset=${offset}`);
        if (!resp.ok) throw new Error('Failed to fetch admin bookings');
        return await resp.json();
    } catch (e) {
        console.error(e);
        return null;
    }
};

export const fetchRoomAvailability = async (roomId: number, start?: string, end?: string) => {
    try {
        const params = new URLSearchParams();
        if (roomId) params.set('room_id', String(roomId));
        if (start) params.set('start', start);
        if (end) params.set('end', end);
        const response = await fetch(`${API_BASE_URL}/rooms/availabilityList?` + params.toString());
        if (!response.ok) throw new Error('Failed to fetch availability');
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
};

export const updateRoomAvailability = async (payload: any) => {
    try {
        const response = await fetch(`${API_BASE_URL}/rooms/availabilityUpdate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
};

export const fetchBookingForRoomDate = async (roomId: number, date: string) => {
    try {
        const resp = await fetch(`${API_BASE_URL}/rooms/availabilityBooking?room_id=${roomId}&date=${date}`);
        if (!resp.ok) throw new Error('Failed to fetch booking');
        return await resp.json();
    } catch (e) {
        console.error(e);
        return null;
    }
};
export const updateRoomDetails = async (payload: any) => {
    try {
        const response = await fetch(`${API_BASE_URL}/rooms/updateDetails`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
};
