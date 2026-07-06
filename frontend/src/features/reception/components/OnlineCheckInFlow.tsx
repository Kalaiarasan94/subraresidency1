import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { 
  Search, QrCode, UserCheck, ShieldCheck, 
  CreditCard, LogIn, ChevronRight, CheckCircle,
  FileText, Smartphone, Printer, Mail,
  Calendar, Users, Hotel
} from 'lucide-react';

const StepIndicator = ({ steps, currentStep }: any) => (
  <div className="flex items-center justify-center space-x-4 mb-12">
    {steps.map((step: string, i: number) => (
      <div key={i} className="flex items-center">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs transition-all duration-500 ${
          i <= currentStep ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' : 'bg-slate-100 text-slate-400'
        }`}>
          {i < currentStep ? <CheckCircle size={18} /> : i + 1}
        </div>
        {i < steps.length - 1 && (
          <div className={`w-12 h-1 mx-2 rounded-full transition-all duration-700 ${i < currentStep ? 'bg-emerald-600' : 'bg-slate-100'}`} />
        )}
      </div>
    ))}
  </div>
);

export const OnlineCheckInFlow = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [bookingId, setBookingId] = useState('');
  const [bookingData, setBookingData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [availableRooms, setAvailableRooms] = useState<any[]>([]);

  const steps = ['Identity', 'Verify', 'Documents', 'Payment', 'Room', 'Success'];

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const findBooking = async () => {
    if (!bookingId) return;
    setLoading(true);
    setError('');
    try {
       const resp = await fetch(`http://localhost:8001/api/index.php/bookings/view?id=${bookingId}`);
       const json = await resp.json();
       if (json.status === 'success') {
         setBookingData({
            id: json.data.booking_id,
            guest: json.data.guest_name,
            phone: json.data.phone_number || 'N/A',
            checkin: json.data.check_in_date,
            checkout: json.data.check_out_date,
            category: json.data.room_category || 'N/A',
            guests: json.data.guests_count || 1,
            total: `₹ ${json.data.total_amount}`,
            paid: `₹ ${json.data.total_amount}`,
            status: json.data.status
         });
         handleNext();
       } else {
         setError('Reservation not found. Please verify the ID.');
       }
    } catch (err) {
       setError('Connection failed. Server might be offline.');
    } finally {
       setLoading(false);
    }
  };

  useEffect(() => {
    if (currentStep === 4 && bookingData) {
      const fetchRooms = async () => {
        try {
          const resp = await fetch('http://localhost:8001/api/index.php/rooms/list');
          const json = await resp.json();
          if (json.status === 'success') {
            const filtered = json.data.filter((r: any) => 
               r.status === 'available' && 
               (r.category_name === bookingData.category || !bookingData.category)
            );
            setAvailableRooms(filtered);
          }
        } catch (err) {}
      };
      fetchRooms();
    }
  }, [currentStep, bookingData]);

  return (
    <div className="max-w-5xl mx-auto py-4">
      <StepIndicator steps={steps} currentStep={currentStep} />

      <div className="animate-in slide-in-from-bottom-4 duration-500">
        {currentStep === 0 && (
          <Card className="border-none shadow-2xl rounded-[2rem] overflow-hidden bg-white">
            <CardContent className="p-12 text-center space-y-8">
              <div className="flex flex-col items-center space-y-6">
                <div className="w-24 h-24 bg-rose-50 rounded-[2rem] flex items-center justify-center text-rose-500 animate-pulse">
                  <QrCode size={48} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Locate Reservation</h3>
                  <p className="text-slate-400 font-bold text-sm">Scan Guest QR or enter Booking ID manually</p>
                </div>
              </div>

              <div className="max-w-md mx-auto space-y-4">
                 <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
                    <input 
                      type="text" 
                      placeholder="Enter Booking ID (e.g. SUBRA-2026-001)" 
                      value={bookingId}
                      onChange={(e) => setBookingId(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-5 pl-14 pr-6 text-sm font-black text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all uppercase tracking-widest"
                    />
                 </div>
                 {error && <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest animate-bounce">{error}</p>}
                 <Button disabled={loading} onClick={findBooking} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-8 rounded-2xl text-lg uppercase tracking-widest shadow-xl shadow-emerald-900/20 active:scale-95 transition-all">
                    {loading ? 'Locating...' : 'Search Booking'}
                 </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 1 && bookingData && (
          <Card className="border-none shadow-2xl rounded-[2rem] overflow-hidden bg-white animate-in zoom-in-95 duration-300">
             <div className="bg-emerald-900 p-8 text-white flex justify-between items-center">
                <div>
                   <p className="text-[10px] font-black uppercase text-emerald-400 tracking-widest mb-1">Reservation ID</p>
                   <h3 className="text-2xl font-black">{bookingData.id}</h3>
                </div>
                <div className="bg-emerald-800/50 p-4 rounded-2xl border border-white/10 text-right">
                   <p className="text-[10px] font-black uppercase text-emerald-400 tracking-widest mb-1">Status</p>
                   <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase">{bookingData.status}</span>
                </div>
             </div>
             <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { label: 'Guest Name', value: bookingData.guest, icon: UserCheck },
                  { label: 'Phone Number', value: bookingData.phone, icon: Smartphone },
                  { label: 'Stay Duration', value: `${bookingData.checkin} - ${bookingData.checkout}`, icon: Calendar },
                  { label: 'Category', value: bookingData.category, icon: Hotel },
                  { label: 'Guests', value: bookingData.guests, icon: Users },
                  { label: 'Total', value: bookingData.total, icon: CreditCard, color: 'text-emerald-700' },
                ].map((item, i) => (
                  <div key={i} className="space-y-1">
                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                       <item.icon size={10} /> {item.label}
                    </p>
                    <p className={`text-sm font-black ${item.color || 'text-slate-800'}`}>{item.value}</p>
                  </div>
                ))}
             </CardContent>
             <div className="p-8 pt-0 flex justify-end gap-4">
                <Button variant="ghost" onClick={handleBack} className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Wrong Booking?</Button>
                <Button onClick={handleNext} className="bg-[#0b3a24] text-white font-black px-10 rounded-xl py-6 h-auto uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2">
                   Proceed to Verification <ChevronRight size={16} />
                </Button>
             </div>
          </Card>
        )}

        {currentStep === 2 && (
          <Card className="border-none shadow-2xl rounded-[2rem] overflow-hidden bg-white">
            <CardContent className="p-12 space-y-10">
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500">
                     <ShieldCheck size={32} />
                  </div>
                  <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Document Verification</h3>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {['Aadhar Card', 'PAN Card', 'Address Proof'].map((doc, i) => (
                    <div key={i} className="p-6 rounded-3xl bg-slate-50 border-2 border-slate-100 flex flex-col items-center text-center space-y-4">
                       <CheckCircle className="text-emerald-500" size={24} />
                       <p className="text-xs font-black text-slate-700 uppercase">{doc}</p>
                    </div>
                  ))}
               </div>
               <div className="flex justify-between pt-8 border-t border-slate-100">
                  <button onClick={handleBack} className="text-xs font-black text-slate-400 uppercase">Go Back</button>
                  <Button onClick={handleNext} className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-12 rounded-xl py-6 h-auto uppercase">Approve & Continue</Button>
               </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 3 && (
          <Card className="border-none shadow-2xl rounded-[2rem] overflow-hidden bg-white">
             <CardContent className="p-12 text-center space-y-10">
                <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mx-auto">
                   <CreditCard size={48} />
                </div>
                <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Payment Status: PAID</h3>
                <Button onClick={handleNext} className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-16 rounded-xl py-6 h-auto uppercase tracking-widest shadow-xl shadow-emerald-900/20">
                   Assign Room Key
                </Button>
             </CardContent>
          </Card>
        )}

        {currentStep === 4 && (
          <Card className="border-none shadow-2xl rounded-[2rem] overflow-hidden bg-white">
             <CardContent className="p-12 space-y-10">
                <div className="flex justify-between items-start">
                   <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Room Allocation</h3>
                   <div className="bg-emerald-50 p-4 rounded-2xl flex items-center gap-3">
                      <Hotel className="text-emerald-600" size={24} />
                      <p className="text-lg font-black text-emerald-700">{availableRooms.length} Available Rooms</p>
                   </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                   {availableRooms.map(room => (
                     <button key={room.id} onClick={handleNext} className="p-8 rounded-3xl border-2 border-slate-100 bg-white hover:border-emerald-500 hover:shadow-xl transition-all group overflow-hidden">
                        <p className="text-3xl font-black text-slate-800 group-hover:text-emerald-700 transition-colors uppercase">{room.room_number}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{room.category_name}</p>
                     </button>
                   ))}
                   {availableRooms.length === 0 && <p className="col-span-full text-center py-10 font-black text-slate-400 uppercase">No rooms available in this category.</p>}
                </div>
             </CardContent>
          </Card>
        )}

        {currentStep === 5 && (
           <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-[#061c12] text-white">
              <CardContent className="p-20 text-center space-y-10">
                 <div className="w-32 h-32 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 mx-auto border-4 border-emerald-500/50">
                    <CheckCircle size={64} className="animate-in zoom-in duration-1000" />
                 </div>
                 <div className="space-y-4">
                    <h2 className="text-4xl font-black uppercase tracking-tighter">Check-in Complete</h2>
                    <p className="text-emerald-500/60 font-bold uppercase tracking-[0.4em] text-[10px]">Session Finalized Successfully</p>
                 </div>
                 <div className="flex justify-center gap-4">
                    <button className="p-6 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all group">
                       <Printer className="text-emerald-500 group-hover:scale-110 transition-transform" />
                    </button>
                    <button className="p-6 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all group">
                       <Mail className="text-emerald-500 group-hover:scale-110 transition-transform" />
                    </button>
                    <Button onClick={() => window.location.reload()} className="bg-emerald-500 hover:bg-emerald-600 text-white font-black px-12 rounded-2xl py-6 h-auto uppercase tracking-widest shadow-2xl shadow-emerald-500/20">
                       New Check-in
                    </Button>
                 </div>
              </CardContent>
           </Card>
        )}
      </div>
    </div>
  );
};
