export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost/subraresidency1/backend/api/index.php';
export const API_DIR_URL = API_BASE_URL.endsWith('/index.php') 
  ? API_BASE_URL.substring(0, API_BASE_URL.lastIndexOf('/')) 
  : API_BASE_URL;
export const BACKEND_URL = API_BASE_URL.includes('/backend')
  ? API_BASE_URL.substring(0, API_BASE_URL.indexOf('/backend') + 8)
  : (API_BASE_URL.includes('/api/') 
      ? API_BASE_URL.substring(0, API_BASE_URL.indexOf('/api/'))
      : API_BASE_URL.substring(0, API_BASE_URL.lastIndexOf('/')));

export const getPublicAppUrl = (): string => {
    if (import.meta.env.VITE_APP_URL) {
        return (import.meta.env.VITE_APP_URL as string).replace(/\/+$/, '');
    }
    if (import.meta.env.VITE_CUSTOMER_DOMAIN && (import.meta.env.VITE_CUSTOMER_DOMAIN as string).trim() !== '') {
        const domain = (import.meta.env.VITE_CUSTOMER_DOMAIN as string).trim();
        if (!domain.includes('localhost') && !domain.includes('127.0.0.1')) {
            return `https://${domain.replace(/^https?:\/\//, '')}`.replace(/\/+$/, '');
        }
    }
    if (import.meta.env.VITE_API_BASE_URL && !import.meta.env.VITE_API_BASE_URL.includes('localhost') && !import.meta.env.VITE_API_BASE_URL.includes('127.0.0.1')) {
        try {
            const urlObj = new URL(import.meta.env.VITE_API_BASE_URL as string);
            return urlObj.origin.replace(/\/+$/, '');
        } catch (e) {}
    }
    if (typeof window !== 'undefined' && window.location.origin) {
        const hostname = window.location.hostname;
        if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
            return window.location.origin.replace(/\/+$/, '');
        }
    }
    return 'https://subraresidency.com';
};

// Generic fetch with credentials for multi-user session isolation
export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const defaultOptions: RequestInit = {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        }
    };
    return fetch(`${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`, {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...(options.headers || {})
        }
    });
};

export interface CartItem {
    id: number;
    category_id: number;
    category_name: string;
    room_id: number | null;
    room_number: string;
    room_name: string;
    featured_image?: string;
    check_in: string;
    check_out: string;
    nights: number;
    guests: number;
    adults: number;
    children: number;
    price_per_night: number;
    total_price: number;
    created_at?: string;
}

export interface CartData {
    id: number;
    items: CartItem[];
    total_items: number;
    subtotal: number;
    total_amount: number;
}

// ==========================================
// CART APIS (Multi-User Session Isolated)
// ==========================================

export const fetchCart = async (): Promise<CartData | null> => {
    try {
        const res = await apiFetch('/cart', { method: 'GET' });
        if (!res.ok) throw new Error('Failed to fetch cart');
        const data = await res.json();
        return data.cart || { id: 0, items: [], total_items: 0, subtotal: 0, total_amount: 0 };
    } catch (err) {
        console.error('fetchCart Error:', err);
        return null;
    }
};

export const addToCart = async (payload: {
    category_id: number;
    room_id?: number;
    room_number?: string;
    check_in: string;
    check_out: string;
    guests?: number;
    adults?: number;
    children?: number;
}): Promise<{ status: string; message: string; cart: CartData } | null> => {
    try {
        const res = await apiFetch('/cart/add', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        return data;
    } catch (err) {
        console.error('addToCart Error:', err);
        return null;
    }
};

export const updateCartItem = async (payload: {
    item_id: number;
    check_in?: string;
    check_out?: string;
    guests?: number;
    adults?: number;
    children?: number;
    room_id?: number;
}): Promise<{ status: string; message: string; cart: CartData } | null> => {
    try {
        const res = await apiFetch('/cart/update', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        return data;
    } catch (err) {
        console.error('updateCartItem Error:', err);
        return null;
    }
};

export const removeFromCart = async (itemId: number): Promise<{ status: string; message: string; cart: CartData } | null> => {
    try {
        const res = await apiFetch('/cart/remove', {
            method: 'POST',
            body: JSON.stringify({ item_id: itemId })
        });
        const data = await res.json();
        return data;
    } catch (err) {
        console.error('removeFromCart Error:', err);
        return null;
    }
};

export const clearCart = async (): Promise<{ status: string; message: string; cart: CartData } | null> => {
    try {
        const res = await apiFetch('/cart/clear', {
            method: 'POST'
        });
        const data = await res.json();
        return data;
    } catch (err) {
        console.error('clearCart Error:', err);
        return null;
    }
};

export const checkoutCart = async (payload: {
    name: string;
    email: string;
    phone: string;
    address?: string;
    country?: string;
    special_requests?: string;
    payment_method?: string;
}): Promise<{ status: string; booking_id: string; booking_ids?: string[]; total_amount: number; message: string } | null> => {
    try {
        const res = await apiFetch('/cart/checkout', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        return data;
    } catch (err) {
        console.error('checkoutCart Error:', err);
        return null;
    }
};

// ==========================================
// ROOMS & BOOKINGS APIS
// ==========================================

export const fetchRoomCategories = async () => {
    try {
        const response = await apiFetch('/rooms/categories', { method: 'GET' });
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
        const response = await apiFetch('/bookings/create', {
            method: 'POST',
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
        const response = await apiFetch('/payments/createOrder', {
            method: 'POST',
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
        const response = await apiFetch('/payments/verify', {
            method: 'POST',
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
        const resp = await apiFetch(`/bookings/view?booking_id=${encodeURIComponent(bookingId)}`, { method: 'GET' });
        if (!resp.ok) throw new Error('Booking not found');
        return await resp.json();
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
};

export const scanQrCode = async (code: string) => {
    try {
        const resp = await apiFetch('/bookings/qrScan', {
            method: 'POST',
            body: JSON.stringify({ code })
        });
        return await resp.json();
    } catch (e) {
        console.error(e);
        return { success: false, message: 'Network or server error during QR scan' };
    }
};

export const fetchAdminBookings = async (limit: number = 50, offset: number = 0) => {
    try {
        const resp = await apiFetch(`/admin/bookings/list?limit=${limit}&offset=${offset}`, { method: 'GET' });
        if (!resp.ok) throw new Error('Failed to fetch admin bookings');
        return await resp.json();
    } catch (e) {
        console.error(e);
        return null;
    }
};

export const cancelBooking = async (bookingId: string, reason?: string) => {
    try {
        const resp = await apiFetch('/admin/bookings/cancel', {
            method: 'POST',
            body: JSON.stringify({ booking_id: bookingId, reason })
        });
        return await resp.json();
    } catch (e) {
        console.error(e);
        return null;
    }
};

export const fetchAvailabilityList = async (month: number, year: number, category_id?: number) => {
    try {
        const params = new URLSearchParams({ month: String(month), year: String(year) });
        if (category_id) params.append('category_id', String(category_id));
        const response = await apiFetch('/rooms/availabilityList?' + params.toString(), { method: 'GET' });
        if (!response.ok) throw new Error('Failed to query availability list');
        return await response.json();
    } catch (e) {
        console.error(e);
        return null;
    }
};

export const updateAvailability = async (payload: { room_id: number; date: string; status: string; notes?: string; price_override?: number }) => {
    try {
        const response = await apiFetch('/rooms/availabilityUpdate', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        return await response.json();
    } catch (e) {
        console.error(e);
        return null;
    }
};

export const fetchAvailabilityBooking = async (roomId: number, date: string) => {
    try {
        const resp = await apiFetch(`/rooms/availabilityBooking?room_id=${roomId}&date=${date}`, { method: 'GET' });
        if (!resp.ok) throw new Error('Failed to fetch booking');
        return await resp.json();
    } catch (e) {
        console.error(e);
        return null;
    }
};

export const updateRoomDetails = async (payload: any) => {
    try {
        const response = await apiFetch('/rooms/updateDetails', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
};

export const deleteRoomCategory = async (categoryId: number | string) => {
    try {
        const response = await apiFetch('/rooms/deleteCategory', {
            method: 'POST',
            body: JSON.stringify({ id: categoryId })
        });
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
};

export const uploadGalleryImage = async (roomId: number | string, file: File) => {
    try {
        const formData = new FormData();
        formData.append('room_id', String(roomId));
        formData.append('image', file);

        const response = await fetch(`${API_BASE_URL}/rooms/uploadGalleryImage`, {
            method: 'POST',
            credentials: 'include',
            body: formData
        });
        return await response.json();
    } catch (error) {
        console.error('Upload Error:', error);
        return null;
    }
};

export const deleteGalleryImage = async (roomId: number | string, imagePath: string) => {
    try {
        const response = await apiFetch('/rooms/deleteGalleryImage', {
            method: 'POST',
            body: JSON.stringify({ room_id: roomId, image_path: imagePath })
        });
        return await response.json();
    } catch (error) {
        console.error('Delete Error:', error);
        return null;
    }
};

export const checkAvailability = async (checkin: string, checkout: string) => {
    try {
        const response = await apiFetch(`/rooms/checkAvailability?checkin=${checkin}&checkout=${checkout}`, { method: 'GET' });
        if (!response.ok) throw new Error('Failed to query availability');
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
};

export const addSubRoom = async (payload: { category_id: number; room_number: string; room_name?: string; floor_number?: string }) => {
    try {
        const response = await apiFetch('/rooms/addSubRoom', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
};

export const updateSubRoom = async (payload: { id: number; room_number: string; room_name?: string; floor_number?: string }) => {
    try {
        const response = await apiFetch('/rooms/updateSubRoom', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
};

export const fetchRoomAvailability = async (roomId: number, start: string, end: string) => {
    try {
        const response = await apiFetch(`/rooms/availability?room_id=${roomId}&start=${start}&end=${end}`, { method: 'GET' });
        if (!response.ok) throw new Error('Failed to fetch availability');
        return await response.json();
    } catch (e) {
        console.error(e);
        return [];
    }
};

export const updateRoomAvailability = async (payload: { room_id: number; date: string; status: string; notes?: string; price_override?: number }) => {
    return updateAvailability(payload);
};

export const notifyQrScan = async (code: string) => {
    return scanQrCode(code);
};

export const fetchBookingForRoomDate = async (roomId: number, date: string) => {
    return fetchAvailabilityBooking(roomId, date);
};

export const deleteSubRoom = async (id: number) => {
    try {
        const response = await apiFetch('/rooms/deleteSubRoom', {
            method: 'POST',
            body: JSON.stringify({ id })
        });
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
};
