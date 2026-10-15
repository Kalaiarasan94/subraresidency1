import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  UserPlus, Calendar, Hotel, 
  FileText, CreditCard, 
  Printer, CheckCircle, ChevronRight,
  IndianRupee, Loader2, ArrowLeft, RefreshCw, Check, Info, AlertCircle
} from 'lucide-react';
import { checkAvailability, createBooking, BACKEND_URL, fetchRoomCategories } from '../../../lib/api';

export const OfflineBookingFlow = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawStep = Math.min(4, Math.max(0, parseInt(searchParams.get('step') || '0', 10)));

  const [formData, setFormData] = useState(() => {
    try {
      const saved = sessionStorage.getItem('offline_booking_formData');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      name: '',
      phone: '',
      email: '',
      checkin: '',
      checkout: '',
      adults: 2,
      children: 0,
      guests: 2,
      idType: 'Aadhar Card'
    };
  });

  const [availableRooms, setAvailableRooms] = useState<any[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<any>(() => {
    try {
      const saved = sessionStorage.getItem('offline_booking_selectedRoom');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  });
  const [paymentMethod, setPaymentMethod] = useState('Cash Payment');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [createdBookingId, setCreatedBookingId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync to sessionStorage to avoid losing state on reload/tab switch
  useEffect(() => {
    try {
      sessionStorage.setItem('offline_booking_formData', JSON.stringify(formData));
    } catch (e) {}
  }, [formData]);

  useEffect(() => {
    try {
      if (selectedRoom) {
        sessionStorage.setItem('offline_booking_selectedRoom', JSON.stringify(selectedRoom));
      } else {
        sessionStorage.removeItem('offline_booking_selectedRoom');
      }
    } catch (e) {}
  }, [selectedRoom]);

  // Guard: If no room is selected, step cannot be 1, 2, or 3
  const currentStep = (!selectedRoom && rawStep > 0 && rawStep < 4) ? 0 : rawStep;

  // Clean up URL parameter if room is null on steps 1..3
  useEffect(() => {
    if (!selectedRoom && rawStep > 0 && rawStep < 4) {
      setSearchParams(prev => {
        const next = new URLSearchParams(prev);
        next.delete('step');
        return next;
      });
    }
  }, [selectedRoom, rawStep, setSearchParams]);

  const setCurrentStep = (newStep: number | ((prev: number) => number)) => {
    const nextVal = typeof newStep === 'function' ? newStep(currentStep) : newStep;
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (nextVal === 0) {
        next.delete('step');
      } else {
        next.set('step', String(nextVal));
      }
      return next;
    });
  };

  // Extra Guest / Adult / Child Charges
  const [extraGuestCharge, setExtraGuestCharge] = useState('');

  // External platform booking states (Other than Walk-in)
  const [bookingSource, setBookingSource] = useState('Walk-in');
  const [customSource, setCustomSource] = useState('');
  const [extReference, setExtReference] = useState('');
  const [otaTotalAmount, setOtaTotalAmount] = useState('');
  const [otaActualRate, setOtaActualRate] = useState('');

  // Category filter states
  const [categories, setCategories] = useState<any[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('All Categories');

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchRoomCategories();
        if (data && Array.isArray(data)) {
          setCategories(data);
        }
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    loadCategories();
  }, []);

  const steps = [
    { label: 'Availability' },
    { label: 'Guest Details' },
    { label: 'Accounting' },
    { label: 'Settlement' },
    { label: 'Receipt' }
  ];

  const loadAvailableRooms = async () => {
    if (!formData.checkin || !formData.checkout) {
      alert("Please select check-in and check-out dates.");
      return false;
    }
    setLoadingRooms(true);
    try {
      const res = await checkAvailability(formData.checkin, formData.checkout);
      if (res && res.status === 'success') {
        setAvailableRooms(res.rooms || []);
        if (selectedRoom && !res.rooms.some((r: any) => r.id === selectedRoom.id)) {
          setSelectedRoom(null);
        }
        return true;
      } else {
        alert(res?.message || "Failed to load room availability.");
        return false;
      }
    } catch (err) {
      console.error(err);
      alert("System error checking room availability.");
      return false;
    } finally {
      setLoadingRooms(false);
    }
  };

  const handleNext = async () => {
    if (currentStep === 0) {
      if (!formData.checkin) return alert("Check-in Date is required.");
      if (!formData.checkout) return alert("Check-out Date is required.");
      if (new Date(formData.checkout) <= new Date(formData.checkin)) {
        return alert("Check-out date must be after check-in date.");
      }
      if (!selectedRoom) {
         if (availableRooms.length === 0) {
           const ok = await loadAvailableRooms();
           if (!ok) return;
         }
         return alert("Please select an available room from the list to proceed.");
      }
    } else if (currentStep === 1) {
      if (!selectedRoom) {
        alert("Please select a room first.");
        return setCurrentStep(0);
      }
      if (!formData.name.trim()) return alert("Guest Name is required.");
      if (!formData.phone.trim()) return alert("Mobile Number is required.");

      if (isOTA) {
        if (!otaTotalAmount || parseFloat(otaTotalAmount) <= 0) {
          return alert("Please enter the Total Amount for this platform reservation.");
        }
        if (!otaActualRate || parseFloat(otaActualRate) <= 0) {
          return alert("Please enter the Actual Rate without platform fee for Hotel Accounts.");
        }
      }
    } else if (currentStep === 2) {
      if (!selectedRoom) {
        alert("Please select a room first.");
        return setCurrentStep(0);
      }
    }
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => setCurrentStep(prev => prev - 1);

  const handleReset = () => {
    try {
      sessionStorage.removeItem('offline_booking_formData');
      sessionStorage.removeItem('offline_booking_selectedRoom');
    } catch (e) {}
    setFormData({
      name: '',
      phone: '',
      email: '',
      checkin: '',
      checkout: '',
      adults: 2,
      children: 0,
      guests: 2,
      idType: 'Aadhar Card'
    });
    setSelectedRoom(null);
    setAvailableRooms([]);
    setPaymentMethod('Cash Payment');
    setAdditionalNotes('');
    setCreatedBookingId('');
    setBookingSource('Walk-in');
    setCustomSource('');
    setExtReference('');
    setExtraGuestCharge('');
    setOtaTotalAmount('');
    setOtaActualRate('');
    setCategoryFilter('All Categories');
    setCurrentStep(0);
  };

  // Accounting calculations
  const checkinDate = formData.checkin ? new Date(formData.checkin) : null;
  const checkoutDate = formData.checkout ? new Date(formData.checkout) : null;
  let nights = 0;
  if (checkinDate && checkoutDate) {
    const diffTime = checkoutDate.getTime() - checkinDate.getTime();
    nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }
  const basePricePerNight = selectedRoom ? Number(selectedRoom.base_price) : 0;
  const roomCost = basePricePerNight * nights;
  const extraPersonCharge = parseFloat(extraGuestCharge) || 0;
  const subtotal = roomCost + extraPersonCharge;
  const tax = Number((subtotal * 0.18).toFixed(2));
  const totalPayable = subtotal + tax;

  const isOTA = bookingSource !== 'Walk-in';
  const finalTotalInvoiceAmount = isOTA && otaTotalAmount ? parseFloat(otaTotalAmount) : totalPayable;
  const finalActualHotelRate = isOTA && otaActualRate ? parseFloat(otaActualRate) : (isOTA ? finalTotalInvoiceAmount : totalPayable);
  const platformFee = isOTA ? Math.max(0, finalTotalInvoiceAmount - finalActualHotelRate) : 0;

  const todayStr = new Date().toLocaleDateString('en-CA');
  const getMinCheckoutStr = () => {
    if (!formData.checkin) return todayStr;
    const d = new Date(formData.checkin);
    d.setDate(d.getDate() + 1);
    return d.toLocaleDateString('en-CA');
  };
  const minCheckoutStr = getMinCheckoutStr();

  const handleCreateOfflineBooking = async () => {
    if (!selectedRoom || !selectedRoom.id) {
      alert("No room selected. Please go back to Room Availability and choose an available room.");
      setCurrentStep(0);
      return;
    }

    if (!formData.name?.trim() || !formData.phone?.trim()) {
      alert("Guest Full Name and Mobile Number are required.");
      setCurrentStep(1);
      return;
    }

    setIsSubmitting(true);
    const finalSource = bookingSource === 'Other' ? (customSource || 'Other') : bookingSource;
    
    const cleanedPaymentMethod = isOTA 
      ? finalSource.toLowerCase() 
      : paymentMethod
        .replace(" Payment", "")
        .replace(" Terminal", "")
        .replace(" / QR Scan", "")
        .replace(" Settlement", "")
        .toLowerCase();

    const payload = {
      name: formData.name,
      email: formData.email || `${formData.phone}@subraresidency.com`,
      phone: formData.phone,
      checkIn: formData.checkin,
      checkOut: formData.checkout,
      guests: `${formData.adults} Adults${formData.children > 0 ? `, ${formData.children} Children` : ''}`,
      adults: formData.adults,
      children: formData.children,
      extra_adults: Math.max(0, formData.adults - 2),
      extra_children: formData.children,
      extra_guest_charge: extraPersonCharge,
      category_id: selectedRoom.category_id || selectedRoom.id,
      room_id: selectedRoom.id,
      amount: finalTotalInvoiceAmount,
      total_amount: finalTotalInvoiceAmount,
      actual_amount: finalActualHotelRate,
      platform_fee: platformFee,
      source: isOTA ? finalSource.toLowerCase() : 'reception',
      booking_source: isOTA ? finalSource : 'Walk-in',
      status: 'confirmed',
      payment_status: 'success',
      payment_method: cleanedPaymentMethod,
      notes: isOTA 
        ? `[Ref ID: ${extReference || 'N/A'}] [OTA: Invoice ₹${finalTotalInvoiceAmount} | Fee ₹${platformFee} | Hotel Net ₹${finalActualHotelRate}] ${additionalNotes}` 
        : (extraPersonCharge > 0 ? `[Extra Guest Charge: ₹${extraPersonCharge}] ${additionalNotes}` : additionalNotes)
    };

    try {
      const res = await createBooking(payload);
      if (res && res.status === 'success') {
        try {
          sessionStorage.removeItem('offline_booking_formData');
          sessionStorage.removeItem('offline_booking_selectedRoom');
        } catch (e) {}
        setCreatedBookingId(res.booking_id);
        setCurrentStep(4);
      } else {
        alert(res?.message || "Failed to create booking folio.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving reservation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* SaaS Step Stepper Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-xs">
        <div className="flex items-center justify-between overflow-x-auto gap-2">
          {steps.map((step, i) => {
            const isDone = i < currentStep;
            const isCurrent = i === currentStep;
            return (
              <div key={i} className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    // Allow navigating back to completed steps
                    if (isDone && (i === 0 || selectedRoom)) setCurrentStep(i);
                  }}
                  disabled={!isDone || (i > 0 && !selectedRoom)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    isCurrent 
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold' 
                      : isDone 
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer' 
                      : 'text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isCurrent ? 'bg-emerald-600 text-white' : isDone ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {isDone ? '✓' : i + 1}
                  </span>
                  <span>{step.label}</span>
                </button>
                {i < steps.length - 1 && <ChevronRight size={14} className="text-gray-300 shrink-0" />}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content Form */}
        <div className="lg:col-span-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs">
            {/* Step 0: Availability Search & Room Selection */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-gray-100">
                  <h3 className="text-sm font-bold text-gray-900">Room Availability & Selection</h3>
                  <p className="text-xs text-gray-500">Select dates and choose an available room</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Check-in Date</label>
                    <input 
                      type="date" 
                      value={formData.checkin}
                      min={todayStr}
                      onChange={e => setFormData(prev => ({ ...prev, checkin: e.target.value }))}
                      className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Check-out Date</label>
                    <input 
                      type="date" 
                      value={formData.checkout}
                      min={minCheckoutStr}
                      onChange={e => setFormData(prev => ({ ...prev, checkout: e.target.value }))}
                      className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Category Filter</label>
                    <select
                      value={categoryFilter}
                      onChange={e => setCategoryFilter(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 bg-white cursor-pointer"
                    >
                      <option value="All Categories">All Categories</option>
                      {categories.map((cat: any) => (
                        <option key={cat.id} value={cat.title}>{cat.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button 
                    onClick={loadAvailableRooms}
                    disabled={loadingRooms}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    {loadingRooms ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
                    <span>{loadingRooms ? 'Searching...' : 'Search Inventory'}</span>
                  </button>
                </div>

                {/* Available Rooms Grid */}
                {loadingRooms ? (
                  <div className="py-12 text-center text-gray-500 space-y-2">
                    <Loader2 size={24} className="animate-spin text-emerald-600 mx-auto" />
                    <p className="text-xs font-medium">Querying available suites for selected dates...</p>
                  </div>
                ) : (() => {
                  const filteredRooms = availableRooms.filter(room => {
                    if (categoryFilter === 'All Categories') return true;
                    return String(room.category_name || room.room_name || '').toLowerCase().trim() === categoryFilter.toLowerCase().trim();
                  });

                  if (availableRooms.length === 0) {
                    return (
                      <div className="py-12 text-center text-gray-400 space-y-2 border border-dashed border-gray-200 rounded-lg">
                        <Hotel size={24} className="mx-auto text-gray-300" />
                        <p className="text-xs font-semibold text-gray-700">Enter dates and click Search Inventory</p>
                        <p className="text-[11px] text-gray-400">Available physical rooms will populate here for direct assignment.</p>
                      </div>
                    );
                  }

                  if (filteredRooms.length === 0) {
                    return (
                      <div className="py-8 text-center text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-xs font-semibold text-gray-800">No rooms available in "{categoryFilter}"</p>
                        <p className="text-[11px] text-gray-400 mt-1">Try switching categories or adjusting the dates.</p>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-700">
                          Available Rooms ({filteredRooms.length})
                        </span>
                        {selectedRoom && (
                          <span className="text-xs text-emerald-700 font-medium">
                            Selected: Room {selectedRoom.room_number}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-1">
                        {filteredRooms.map((room) => {
                          const isSel = selectedRoom?.id === room.id;
                          return (
                            <button 
                              key={room.id}
                              onClick={() => setSelectedRoom(room)} 
                              className={`p-3.5 rounded-lg border text-left transition-all ${
                                isSel 
                                  ? 'border-emerald-600 bg-emerald-50/60 shadow-xs ring-1 ring-emerald-500' 
                                  : 'border-gray-200 bg-white hover:border-emerald-500 hover:shadow-xs'
                              }`}
                            >
                              <div className="flex justify-between items-start">
                                <span className={`text-base font-bold ${isSel ? 'text-emerald-900' : 'text-gray-900'}`}>
                                  {room.room_number}
                                </span>
                                <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                  Available
                                </span>
                              </div>
                              <p className="text-[10px] text-gray-500 mt-1 truncate">
                                {room.category_label || room.category_name}
                              </p>
                              <div className="mt-2 flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-800">
                                  ₹{Number(room.base_price).toLocaleString('en-IN')}
                                </span>
                                {isSel && <Check size={14} className="text-emerald-600 font-bold" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-xs text-gray-400">
                    {selectedRoom ? `Room ${selectedRoom.room_number} ready for assignment` : 'Select a room to proceed'}
                  </span>
                  <button 
                    onClick={handleNext}
                    disabled={!selectedRoom}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-medium rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <span>Proceed to Guest Details</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 1: Guest Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Guest Registration Information</h3>
                    <p className="text-xs text-gray-500">Assigning to Room {selectedRoom?.room_number} ({selectedRoom?.category_name})</p>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-semibold rounded border border-emerald-200">
                    Room {selectedRoom?.room_number}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Guest Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input 
                      value={formData.name}
                      onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500" 
                      placeholder="Enter guest full name" 
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Mobile Number <span className="text-rose-500">*</span>
                    </label>
                    <input 
                      value={formData.phone}
                      onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500" 
                      placeholder="+91 98765 43210" 
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Email Address (Optional)
                    </label>
                    <input 
                      value={formData.email}
                      onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500" 
                      placeholder="guest@example.com" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Primary ID Proof</label>
                    <select 
                      value={formData.idType}
                      onChange={e => setFormData(prev => ({ ...prev, idType: e.target.value }))}
                      className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                    >
                      <option>Aadhar Card</option>
                      <option>Passport</option>
                      <option>Driving License</option>
                      <option>Voter ID</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Booking Channel / Source</label>
                    <select 
                      value={bookingSource}
                      onChange={e => {
                        const val = e.target.value;
                        setBookingSource(val);
                        if (val !== 'Walk-in') {
                          setPaymentMethod('Platform Settlement');
                          setOtaTotalAmount(String(totalPayable));
                          setOtaActualRate(String(Math.round(totalPayable * 0.85)));
                        } else {
                          setPaymentMethod('Cash Payment');
                          setOtaTotalAmount('');
                          setOtaActualRate('');
                        }
                      }}
                      className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                    >
                      <option value="Walk-in">Walk-in (Front Desk Direct)</option>
                      <option value="Booking.com">Booking.com</option>
                      <option value="Airbnb">Airbnb</option>
                      <option value="Agoda">Agoda</option>
                      <option value="MakeMyTrip">MakeMyTrip</option>
                      <option value="Other">Other OTA / Platform</option>
                    </select>
                  </div>

                  {bookingSource === 'Other' && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Platform Name</label>
                      <input 
                        value={customSource}
                        onChange={e => setCustomSource(e.target.value)}
                        className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500" 
                        placeholder="e.g. Yatra, Goibibo"
                      />
                    </div>
                  )}

                  {/* Occupancy Stepper: Adults & Children */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Adults (Age 12+)</label>
                    <div className="flex items-center gap-2">
                      <button 
                        type="button"
                        onClick={() => setFormData(prev => {
                          const a = Math.max(1, prev.adults - 1);
                          return { ...prev, adults: a, guests: a + prev.children };
                        })}
                        className="w-8 h-8 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 flex items-center justify-center font-bold text-sm"
                      >
                        -
                      </button>
                      <span className="w-10 text-center font-bold text-xs text-gray-800">
                        {formData.adults}
                      </span>
                      <button 
                        type="button"
                        onClick={() => setFormData(prev => {
                          const a = prev.adults + 1;
                          return { ...prev, adults: a, guests: a + prev.children };
                        })}
                        className="w-8 h-8 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 flex items-center justify-center font-bold text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Children (Under 12)</label>
                    <div className="flex items-center gap-2">
                      <button 
                        type="button"
                        onClick={() => setFormData(prev => {
                          const c = Math.max(0, prev.children - 1);
                          return { ...prev, children: c, guests: prev.adults + c };
                        })}
                        className="w-8 h-8 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 flex items-center justify-center font-bold text-sm"
                      >
                        -
                      </button>
                      <span className="w-10 text-center font-bold text-xs text-gray-800">
                        {formData.children}
                      </span>
                      <button 
                        type="button"
                        onClick={() => setFormData(prev => {
                          const c = prev.children + 1;
                          return { ...prev, children: c, guests: prev.adults + c };
                        })}
                        className="w-8 h-8 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 flex items-center justify-center font-bold text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Front Desk Extra Person / Child Charges Box */}
                  <div className="sm:col-span-2 bg-emerald-50/70 border border-emerald-200 rounded-lg p-4 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <label className="block text-xs font-bold text-emerald-950">
                            Extra Adult / Child Charges (₹)
                          </label>
                          <span className="px-1.5 py-0.2 text-[9px] font-bold bg-emerald-200 text-emerald-800 rounded">
                            Front Desk Allotment
                          </span>
                        </div>
                        <p className="text-[11px] text-emerald-700 mt-0.5">
                          Directly enter additional person or extra bedding rate to adjust folio
                        </p>
                      </div>
                      {(formData.adults > 2 || formData.children > 0) && (
                        <span className="px-2 py-1 text-[11px] font-bold bg-white text-emerald-800 rounded border border-emerald-300 self-start sm:self-auto">
                          {formData.adults > 2 ? `${formData.adults - 2} Extra Adult${formData.adults - 2 > 1 ? 's' : ''}` : ''}
                          {formData.adults > 2 && formData.children > 0 ? ' + ' : ''}
                          {formData.children > 0 ? `${formData.children} Child${formData.children > 1 ? 'ren' : ''}` : ''}
                        </span>
                      )}
                    </div>
                    <div className="relative max-w-xs pt-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-bold">₹</span>
                      <input 
                        type="number"
                        min="0"
                        value={extraGuestCharge}
                        onChange={e => setExtraGuestCharge(e.target.value)}
                        className="w-full text-xs font-bold text-gray-900 pl-7 pr-3 py-2 bg-white border border-emerald-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500" 
                        placeholder="0.00 (Enter amount if extra guest)"
                      />
                    </div>
                  </div>

                  {/* External Platform (Other than Walk-in) Pricing Section */}
                  {bookingSource !== 'Walk-in' && (
                    <div className="sm:col-span-2 bg-blue-50/70 border border-blue-200 rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between border-b border-blue-200/80 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                          <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                            {bookingSource} Pricing &amp; Financial Split
                          </h4>
                        </div>
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                          Accounts vs Invoice Separation
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Platform Booking Ref ID</label>
                          <input 
                            value={extReference}
                            onChange={e => setExtReference(e.target.value)}
                            className="w-full text-xs px-3 py-2 bg-white border border-blue-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 uppercase font-mono font-bold" 
                            placeholder="e.g. BDC-93821"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-800 mb-1">
                            Total Amount (Guest Invoice ₹) <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">₹</span>
                            <input 
                              type="number"
                              value={otaTotalAmount}
                              onChange={e => setOtaTotalAmount(e.target.value)}
                              className="w-full text-xs font-bold text-gray-900 pl-7 pr-3 py-2 bg-white border border-blue-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500" 
                              placeholder={String(totalPayable)}
                            />
                          </div>
                          <p className="text-[10px] text-gray-500 mt-1">Appears on guest invoice &amp; voucher.</p>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-800 mb-1">
                            Actual Rate without Platform Fee (Hotel Accounts ₹) <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600 text-xs font-bold">₹</span>
                            <input 
                              type="number"
                              value={otaActualRate}
                              onChange={e => setOtaActualRate(e.target.value)}
                              className="w-full text-xs font-bold text-emerald-800 pl-7 pr-3 py-2 bg-white border border-emerald-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500" 
                              placeholder={String(Math.round(totalPayable * 0.85))}
                            />
                          </div>
                          <p className="text-[10px] text-emerald-700 font-medium mt-1">Recorded in Hotel Accounts &amp; Settlements.</p>
                        </div>
                      </div>

                      <div className="p-3 bg-white border border-blue-200 rounded-lg flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Info size={14} className="text-blue-600 shrink-0" />
                          <span>Platform Fee / Commission Deducted:</span>
                          <span className="font-bold text-rose-600 font-mono">
                            ₹{platformFee.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-500">
                          Invoice: <span className="font-bold text-gray-900 font-mono">₹{finalTotalInvoiceAmount.toLocaleString('en-IN')}</span> | Accounts: <span className="font-bold text-emerald-800 font-mono">₹{finalActualHotelRate.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <button 
                    onClick={handleBack}
                    className="text-xs text-gray-500 hover:text-gray-800 font-medium"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handleNext}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <span>Proceed to Accounting</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Accounting & Charges Breakdown */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-gray-100">
                  <h3 className="text-sm font-bold text-gray-900">Charges & Tariff Calculation</h3>
                  <p className="text-xs text-gray-500">Review room tariff, stay nights, extra charges and tax breakdown</p>
                </div>

                <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden">
                  <div className="p-4 bg-gray-50 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-gray-900">
                        {selectedRoom?.category_name} Room #{selectedRoom?.room_number}
                      </p>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {nights} Night{nights > 1 ? 's' : ''} × ₹{basePricePerNight.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-gray-900">
                      ₹{roomCost.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {extraPersonCharge > 0 && (
                    <div className="p-4 bg-white flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-emerald-900">Extra Adult / Child Charges</p>
                        <p className="text-[11px] text-emerald-600">Additional occupant & bedding fee</p>
                      </div>
                      <span className="text-xs font-bold text-emerald-800">
                        +₹{extraPersonCharge.toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}

                  <div className="p-4 bg-white flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-gray-700">Goods & Services Tax (GST 18%)</p>
                      <p className="text-[11px] text-gray-400">Statutory hospitality tax</p>
                    </div>
                    <span className="text-xs font-semibold text-gray-700">
                      ₹{tax.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* If OTA: Show both Total Invoice Amount & Accounts Net Rate */}
                  {isOTA ? (
                    <>
                      <div className="p-4 bg-blue-50/50 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-blue-950">Total Amount on Guest Invoice & Folio</p>
                          <p className="text-[11px] text-blue-700">Gross billed amount on {bookingSource}</p>
                        </div>
                        <span className="text-sm font-bold text-blue-900 font-mono">
                          ₹{finalTotalInvoiceAmount.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="p-4 bg-emerald-50/70 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-emerald-950">Actual Rate without Platform Fee (Hotel Accounts)</p>
                          <p className="text-[11px] text-emerald-700">Net revenue to be credited into Accounts &amp; Settlements</p>
                        </div>
                        <span className="text-sm font-black text-emerald-800 font-mono">
                          ₹{finalActualHotelRate.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="p-4 bg-emerald-50/50 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-emerald-900">Total Payable Amount</p>
                        <p className="text-[11px] text-emerald-700">Inclusive of room charges, extra guests and GST</p>
                      </div>
                      <span className="text-sm font-bold text-emerald-800 font-mono">
                        ₹{totalPayable.toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Special Instructions / Luggage Notes
                  </label>
                  <textarea 
                    value={additionalNotes}
                    onChange={e => setAdditionalNotes(e.target.value)}
                    rows={3}
                    className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500" 
                    placeholder="Enter special requests, arrival transport, extra bedding notes..." 
                  />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <button 
                    onClick={handleBack}
                    className="text-xs text-gray-500 hover:text-gray-800 font-medium"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handleNext}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <span>Proceed to Settlement</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment Settlement */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-gray-100">
                  <h3 className="text-sm font-bold text-gray-900">Payment Collection & Settlement</h3>
                  <p className="text-xs text-gray-500">Record received payment from guest before issuing room key</p>
                </div>

                <div className="space-y-4 max-w-md mx-auto py-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Payment Channel / Method</label>
                    <select 
                      value={paymentMethod}
                      onChange={e => setPaymentMethod(e.target.value)}
                      disabled={isOTA}
                      className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                    >
                      {isOTA ? (
                        <option>Platform Settlement ({bookingSource})</option>
                      ) : (
                        <>
                          <option>Cash Payment</option>
                          <option>Card Terminal</option>
                          <option>UPI / QR Scan</option>
                        </>
                      )}
                    </select>
                  </div>

                  {isOTA ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Total Amount on Guest Invoice (₹)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">₹</span>
                          <input 
                            readOnly
                            value={finalTotalInvoiceAmount.toLocaleString('en-IN')}
                            className="w-full text-sm font-bold text-gray-800 pl-7 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none font-mono" 
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-emerald-800 mb-1">
                          Actual Rate Recorded into Hotel Accounts (₹)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600 text-xs font-bold">₹</span>
                          <input 
                            readOnly
                            value={finalActualHotelRate.toLocaleString('en-IN')}
                            className="w-full text-sm font-bold text-emerald-800 pl-7 pr-3 py-2 bg-emerald-50/70 border border-emerald-300 rounded-lg outline-none font-mono" 
                          />
                        </div>
                        <p className="text-[10px] text-emerald-700 font-medium mt-1">
                          ✓ This net amount without platform fee is credited to accounts &amp; revenue settlements.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Total Settled Amount (₹)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">₹</span>
                        <input 
                          readOnly
                          value={totalPayable.toLocaleString('en-IN')}
                          className="w-full text-sm font-bold text-emerald-800 pl-7 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none font-mono" 
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <button 
                    onClick={handleBack}
                    className="text-xs text-gray-500 hover:text-gray-800 font-medium"
                  >
                    Back
                  </button>
                  <button 
                    disabled={isSubmitting || !selectedRoom}
                    onClick={handleCreateOfflineBooking}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-medium rounded-lg shadow-xs transition-colors flex items-center gap-2"
                  >
                    {isSubmitting && <Loader2 size={13} className="animate-spin" />}
                    <span>{isSubmitting ? 'Registering Booking...' : 'Complete Folio & Issue Key'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Folio Created Receipt */}
            {currentStep === 4 && (
              <div className="text-center py-8 space-y-6">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                  <CheckCircle size={28} />
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-gray-900">Registration Complete</h3>
                  <p className="text-xs text-gray-500">
                    Booking Folio <span className="font-mono font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">{createdBookingId}</span> generated
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button 
                    onClick={() => {
                      window.open(`${BACKEND_URL}/admin_view_booking.php?booking_id=${createdBookingId}&print=1`, '_blank');
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5"
                  >
                    <Printer size={14} />
                    <span>Print Folio Slip</span>
                  </button>

                  <button 
                    onClick={() => {
                      window.open(`${BACKEND_URL}/admin_view_booking.php?booking_id=${createdBookingId}`, '_blank');
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5"
                  >
                    <FileText size={14} />
                    <span>View Full Invoice</span>
                  </button>

                  <button 
                    onClick={handleReset}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg shadow-xs transition-colors"
                  >
                    Start New Registration
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Summary Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs space-y-4">
            <div className="pb-3 border-b border-gray-100 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">Folio Summary</span>
              <span className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-mono font-bold">
                {formData.adults}A {formData.children > 0 ? `+ ${formData.children}C` : ''}
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Room Total ({nights}N)</span>
                <span className="font-semibold text-gray-900 font-mono">₹{roomCost.toLocaleString('en-IN')}</span>
              </div>
              {extraPersonCharge > 0 && (
                <div className="flex justify-between items-center text-emerald-800">
                  <span>Extra Guest Charge</span>
                  <span className="font-semibold font-mono">+₹{extraPersonCharge.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Taxes (GST 18%)</span>
                <span className="font-semibold text-gray-900 font-mono">₹{tax.toLocaleString('en-IN')}</span>
              </div>

              {isOTA ? (
                <>
                  <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
                    <span className="font-bold text-gray-800">Total Invoice (Folio)</span>
                    <span className="text-base font-bold text-blue-800 font-mono">₹{finalTotalInvoiceAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-gray-500">
                    <span>Platform Fee</span>
                    <span className="text-rose-600 font-mono font-bold">-₹{platformFee.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="pt-1.5 border-t border-dashed border-gray-200 flex justify-between items-center">
                    <span className="font-bold text-emerald-800">Accounts Net Rate</span>
                    <span className="text-sm font-bold text-emerald-800 font-mono">₹{finalActualHotelRate.toLocaleString('en-IN')}</span>
                  </div>
                </>
              ) : (
                <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total Payable</span>
                  <span className="text-base font-bold text-emerald-700 font-mono">₹{totalPayable.toLocaleString('en-IN')}</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-gray-100 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-gray-600">
                <UserPlus size={14} className="text-gray-400 shrink-0" />
                <span className="truncate font-medium">{formData.name || 'Guest not specified'}</span>
              </div>

              {selectedRoom && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Hotel size={14} className="text-gray-400 shrink-0" />
                  <span className="font-medium text-emerald-800">
                    Room {selectedRoom.room_number} ({selectedRoom.category_name})
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 text-gray-600">
                <Calendar size={14} className="text-gray-400 shrink-0" />
                <span className="text-[11px] text-gray-500">
                  {formData.checkin && formData.checkout 
                    ? `${formData.checkin} → ${formData.checkout} (${nights} night${nights > 1 ? 's' : ''})`
                    : 'Stay dates not selected'
                  }
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <IndianRupee size={16} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-800">Front Desk Folio Engine</p>
              <p className="text-[10px] text-gray-400">Walk-in &amp; OTA accounts reconciliation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
