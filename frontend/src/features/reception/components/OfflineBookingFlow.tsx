import { useState } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { 
  UserPlus, Calendar, Hotel, 
  FileText, CreditCard, 
  Printer, CheckCircle, ChevronRight,
  IndianRupee, Loader2
} from 'lucide-react';
import { checkAvailability, createBooking, BACKEND_URL } from '../../../lib/api';

export const OfflineBookingFlow = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    checkin: '',
    checkout: '',
    guests: 2,
    idType: 'Aadhar Card'
  });

  const [availableRooms, setAvailableRooms] = useState<any[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState('Cash Payment');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [createdBookingId, setCreatedBookingId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { label: 'Availability' },
    { label: 'Guest Details' },
    { label: 'Accounting' },
    { label: 'Payment' },
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
        // Reset selected room if not in the new available list
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
         const ok = await loadAvailableRooms();
         if (!ok) return;
         return; // Stay on step 0 to let them select a room
      }
    } else if (currentStep === 1) {
      if (!formData.name.trim()) return alert("Guest Name is required.");
      if (!formData.phone.trim()) return alert("Mobile Number is required.");
    }
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => setCurrentStep(prev => prev - 1);

  const handleReset = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      checkin: '',
      checkout: '',
      guests: 2,
      idType: 'Aadhar Card'
    });
    setSelectedRoom(null);
    setAvailableRooms([]);
    setPaymentMethod('Cash Payment');
    setAdditionalNotes('');
    setCreatedBookingId('');
    setCurrentStep(0);
  };

  const handleCreateOfflineBooking = async () => {
    setIsSubmitting(true);
    const cleanedPaymentMethod = paymentMethod
      .replace(" Payment", "")
      .replace(" Terminal", "")
      .replace(" / QR Scan", "")
      .toLowerCase();

    const payload = {
      name: formData.name,
      email: formData.email || `${formData.phone}@subraresidency.com`,
      phone: formData.phone,
      checkIn: formData.checkin,
      checkOut: formData.checkout,
      guests: String(formData.guests) + " Guests",
      category_id: selectedRoom.category_id,
      room_id: selectedRoom.id,
      amount: totalPayable,
      source: 'reception',
      status: 'confirmed',
      payment_status: 'success',
      payment_method: cleanedPaymentMethod,
      notes: additionalNotes
    };

    try {
      const res = await createBooking(payload);
      if (res && res.status === 'success') {
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
  const tax = Number((roomCost * 0.18).toFixed(2));
  const totalPayable = roomCost + tax;

  return (
    <div className="max-w-6xl mx-auto py-4">
      {/* Horizontal Progress */}
      <div className="flex items-center justify-center gap-4 mb-10 overflow-x-auto pb-4 custom-scrollbar px-4">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-3">
             <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl border-2 transition-all min-w-max ${
               i <= currentStep ? 'bg-[#0b3a24] border-[#0b3a24] text-white shadow-xl shadow-[#0b3a24]/20' : 'bg-white border-slate-100 text-slate-400'
             }`}>
                <span className="text-xs font-black">{i + 1}</span>
                <span className="text-[10px] font-black uppercase tracking-widest">{step.label}</span>
                {i < currentStep && <CheckCircle size={14} className="text-emerald-400" />}
             </div>
             {i < steps.length - 1 && <ChevronRight size={16} className="text-slate-200" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         {/* Main Form Area */}
         <div className="lg:col-span-8">
            <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
               <CardContent className="p-10">
                  {currentStep === 0 && (
                    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                       <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
                          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                             <Hotel size={24} />
                          </div>
                          <div>
                             <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Availability Search</h2>
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Select dates and find available suites</p>
                          </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Check-in Date</label>
                             <input 
                               type="date" 
                               value={formData.checkin}
                               onChange={e => setFormData(prev => ({ ...prev, checkin: e.target.value }))}
                               className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 text-xs font-bold text-slate-800 focus:border-emerald-500/50 outline-none transition-all" 
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Check-out Date</label>
                             <input 
                               type="date" 
                               value={formData.checkout}
                               onChange={e => setFormData(prev => ({ ...prev, checkout: e.target.value }))}
                               className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 text-xs font-bold text-slate-800 focus:border-emerald-500/50 outline-none transition-all" 
                             />
                          </div>
                          <div className="flex items-end">
                             <Button 
                               onClick={loadAvailableRooms}
                               disabled={loadingRooms}
                               className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest shadow-lg transition-all"
                             >
                                {loadingRooms ? <Loader2 className="animate-spin" size={16} /> : 'Search Rooms'}
                             </Button>
                          </div>
                       </div>

                       {loadingRooms ? (
                          <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-500">
                             <Loader2 className="animate-spin text-emerald-600" size={32} />
                             <span className="text-xs font-bold uppercase tracking-widest">Searching available rooms...</span>
                          </div>
                       ) : availableRooms.length === 0 ? (
                          formData.checkin && formData.checkout ? (
                            <div className="text-center py-20 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                               <p className="text-sm font-black text-slate-600 uppercase tracking-tight">No Rooms Available</p>
                               <p className="text-[10px] text-slate-400 mt-2 font-bold">Try changing check-in or checkout dates.</p>
                            </div>
                          ) : (
                            <div className="text-center py-20 bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
                               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Select dates above to view availability</p>
                            </div>
                          )
                       ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                             {availableRooms.map((room) => {
                               const isSel = selectedRoom?.id === room.id;
                               return (
                                 <button 
                                   key={room.id}
                                   onClick={() => setSelectedRoom(room)} 
                                   className={`p-6 rounded-3xl border-2 transition-all text-left group ${
                                      isSel 
                                        ? 'border-emerald-600 bg-emerald-50/20 shadow-lg' 
                                        : 'border-slate-50 bg-white hover:border-emerald-500/50 hover:shadow-xl'
                                   }`}
                                 >
                                    <div className="flex justify-between items-start">
                                       <p className={`text-2xl font-black ${isSel ? 'text-emerald-800' : 'text-slate-800'}`}>{room.room_number}</p>
                                       <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg uppercase tracking-tight">Available</span>
                                    </div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{room.category_name}</p>
                                    <div className="mt-4 flex justify-between items-center">
                                       <span className="text-xs font-black text-slate-800">₹ {Number(room.base_price).toLocaleString('en-IN')}</span>
                                       {isSel && <CheckCircle size={16} className="text-emerald-600" />}
                                    </div>
                                 </button>
                               );
                             })}
                          </div>
                       )}
                    </div>
                  )}

                  {currentStep === 1 && (
                    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                       <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
                          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                             <UserPlus size={24} />
                          </div>
                          <div>
                             <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Guest Information</h2>
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Registering guest for Room {selectedRoom?.room_number}</p>
                          </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                             <input 
                               value={formData.name}
                               onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                               className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 text-xs font-bold text-slate-800 focus:border-emerald-500/50 outline-none transition-all" 
                               placeholder="Enter guest full name" 
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mobile Number</label>
                             <input 
                               value={formData.phone}
                               onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                               className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 text-xs font-bold text-slate-800 focus:border-emerald-500/50 outline-none transition-all" 
                               placeholder="+91 XXXXX XXXXX" 
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                             <input 
                               value={formData.email}
                               onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                               className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 text-xs font-bold text-slate-800 focus:border-emerald-500/50 outline-none transition-all" 
                               placeholder="guest@example.com (optional)" 
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-bold">Primary ID Type</label>
                             <select 
                               value={formData.idType}
                               onChange={e => setFormData(prev => ({ ...prev, idType: e.target.value }))}
                               className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 text-xs font-bold text-slate-800 focus:border-emerald-500/50 outline-none transition-all"
                             >
                                <option>Aadhar Card</option>
                                <option>Passport</option>
                                <option>Driving License</option>
                                <option>Voter ID</option>
                             </select>
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Guests (Adults + Kids)</label>
                             <div className="flex items-center gap-4">
                                <button 
                                  onClick={() => setFormData(prev => ({ ...prev, guests: Math.max(1, prev.guests - 1) }))}
                                  className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all font-bold"
                                >
                                  -
                                </button>
                                <span className="text-sm font-black text-slate-800 w-8 text-center">{String(formData.guests).padStart(2, '0')}</span>
                                <button 
                                  onClick={() => setFormData(prev => ({ ...prev, guests: prev.guests + 1 }))}
                                  className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all font-bold"
                                >
                                  +
                                </button>
                             </div>
                          </div>
                       </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                       <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
                          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                             <FileText size={24} />
                          </div>
                          <div>
                             <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Bill Generation</h2>
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Manual invoice adjustment and items</p>
                          </div>
                       </div>

                       <div className="space-y-4">
                          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                             <div>
                                <p className="text-sm font-black text-slate-800">{selectedRoom?.category_name} Room #{selectedRoom?.room_number}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                                  {nights} Nights stay x ₹ {basePricePerNight.toLocaleString('en-IN')}
                                </p>
                             </div>
                             <p className="text-sm font-black text-slate-800">₹ {roomCost.toLocaleString('en-IN')}</p>
                          </div>

                          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                             <div>
                                <p className="text-sm font-black text-slate-800">Tax Charge</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">GST (18%)</p>
                             </div>
                             <p className="text-sm font-black text-slate-800">₹ {tax.toLocaleString('en-IN')}</p>
                          </div>
                          
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Special Requests / Stay Notes</label>
                             <textarea 
                               value={additionalNotes}
                               onChange={e => setAdditionalNotes(e.target.value)}
                               rows={3}
                               className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 text-xs font-bold text-slate-800 focus:border-emerald-500/50 outline-none transition-all resize-none" 
                               placeholder="Add guest special requests, luggage info, extra bed requirements..." 
                             />
                          </div>
                       </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 text-center py-10">
                       <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto">
                          <CreditCard size={40} />
                       </div>
                       <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Settlement</h2>
                       <div className="max-w-sm mx-auto space-y-6">
                          <div className="flex flex-col gap-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase text-left tracking-widest">Payment Method</label>
                             <select 
                               value={paymentMethod}
                               onChange={e => setPaymentMethod(e.target.value)}
                               className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 text-xs font-bold text-slate-800 outline-none"
                             >
                                <option>Cash Payment</option>
                                <option>Card Terminal</option>
                                <option>UPI / QR Scan</option>
                             </select>
                          </div>
                          <div className="flex flex-col gap-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase text-left tracking-widest font-bold">Total Amount Received</label>
                             <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                                <input 
                                  readOnly
                                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 pl-8 text-xs font-bold text-emerald-700 outline-none" 
                                  value={totalPayable.toLocaleString('en-IN')} 
                                />
                             </div>
                          </div>
                       </div>
                    </div>
                  )}

                  {currentStep === 4 && (
                    <div className="space-y-8 animate-in zoom-in-95 duration-500 text-center py-10">
                       <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-200">
                          <CheckCircle size={40} />
                       </div>
                       <div className="space-y-2">
                          <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Folio Created</h2>
                          <p className="text-emerald-700 font-bold text-sm">Invoice / Reservation <b className="bg-emerald-50 px-2 py-1 rounded text-emerald-900 border border-emerald-100">{createdBookingId}</b> generated</p>
                          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mt-10">
                           <button onClick={() => {
                              window.open(`${BACKEND_URL}/admin_view_booking.php?booking_id=${createdBookingId}&print=1`, '_blank');
                           }} className="p-6 rounded-3xl bg-slate-50 border border-slate-100 flex flex-col items-center gap-3 group hover:bg-[#0b3a24] hover:text-white transition-all">
                              <Printer size={20} />
                              <span className="text-[10px] font-black uppercase tracking-widest font-bold">Print Folio</span>
                           </button>
                           <button onClick={() => {
                              window.open(`${BACKEND_URL}/admin_view_booking.php?booking_id=${createdBookingId}`, '_blank');
                           }} className="p-6 rounded-3xl bg-slate-50 border border-slate-100 flex flex-col items-center gap-3 group hover:bg-[#0b3a24] hover:text-white transition-all">
                              <FileText size={20} />
                              <span className="text-[10px] font-black uppercase tracking-widest font-bold">View Invoice</span>
                           </button>
                        </div>
                       </div>

                       <div className="mt-10">
                          <button 
                            onClick={handleReset}
                            className="bg-[#0b3a24] text-white px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-[#082819] hover:shadow-emerald-900/20 active:scale-95 transition-all"
                          >
                             Start New Registration
                          </button>
                       </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="mt-12 flex justify-between items-center">
                    {currentStep > 0 && currentStep < steps.length - 1 && (
                      <button 
                        onClick={handleBack} 
                        className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-emerald-600 transition-colors"
                      >
                         Go Back
                      </button>
                    )}
                    <div></div>
                    {currentStep < steps.length - 2 && (
                      <Button 
                        onClick={handleNext}
                        className="bg-[#0b3a24] text-white font-black px-12 rounded-xl py-6 h-auto uppercase tracking-[0.2em] shadow-xl hover:bg-[#082819] hover:shadow-emerald-900/20 active:scale-95 transition-all"
                      >
                         Next Step
                      </Button>
                    )}
                    {currentStep === steps.length - 2 && (
                      <Button 
                        disabled={isSubmitting}
                        onClick={handleCreateOfflineBooking}
                        className="bg-[#0b3a24] text-white font-black px-12 rounded-xl py-6 h-auto uppercase tracking-[0.2em] shadow-xl hover:bg-[#082819] hover:shadow-emerald-900/20 active:scale-95 transition-all flex items-center gap-2"
                      >
                         {isSubmitting && <Loader2 className="animate-spin" size={16} />}
                         Complete Folio
                      </Button>
                    )}
                  </div>
               </CardContent>
            </Card>
         </div>

         {/* Sidebar Summary Area */}
         <div className="lg:col-span-4 space-y-6">
            <Card className="border-none shadow-xl rounded-[2.5rem] bg-[#0b3a24] text-white overflow-hidden sticky top-28">
               <div className="p-8 border-b border-white/10">
                  <h3 className="text-sm font-black uppercase tracking-widest text-emerald-400">Order Summary</h3>
               </div>
               <CardContent className="p-8 space-y-8">
                  <div className="space-y-6">
                     <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-emerald-200/50 uppercase tracking-widest">Room Total</span>
                        <span className="text-sm font-black text-white">₹ {roomCost.toLocaleString('en-IN')}</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-emerald-200/50 uppercase tracking-widest">Tax (GST 18%)</span>
                        <span className="text-sm font-black text-white">₹ {tax.toLocaleString('en-IN')}</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-emerald-200/50 uppercase tracking-widest">Total Payable</span>
                        <span className="text-2xl font-black text-emerald-400">₹ {totalPayable.toLocaleString('en-IN')}</span>
                     </div>
                  </div>

                  <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10 space-y-4">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                           <UserPlus size={16} />
                        </div>
                        <span className="text-xs font-black uppercase tracking-tight truncate max-w-[150px]">{formData.name || 'New Guest'}</span>
                     </div>
                     {selectedRoom && (
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                              <Hotel size={16} />
                           </div>
                           <span className="text-xs font-black uppercase tracking-tight">Room {selectedRoom.room_number} ({selectedRoom.category_name})</span>
                        </div>
                     )}
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                           <Calendar size={16} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-tight">
                           {formData.checkin && formData.checkout 
                             ? `${new Date(formData.checkin).toLocaleDateString('en-IN', {day:'numeric', month:'short'})} - ${new Date(formData.checkout).toLocaleDateString('en-IN', {day:'numeric', month:'short'})}`
                             : 'Checkin Dates'
                           }
                        </span>
                     </div>
                  </div>
               </CardContent>
            </Card>

            <div className="p-6 rounded-[2rem] bg-white border border-slate-100 shadow-sm flex items-center gap-4">
               <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                  <IndianRupee size={20} />
               </div>
               <div>
                  <p className="text-[10px] font-black text-slate-800 uppercase tracking-tight font-bold">Subra Staff Console</p>
                  <p className="text-[9px] text-slate-400 font-bold">Logged in as Receptionist</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
