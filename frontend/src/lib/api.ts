// frontend/src/lib/api.ts

const API_BASE_URL = 'http://localhost:8001/api/index.php';

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
