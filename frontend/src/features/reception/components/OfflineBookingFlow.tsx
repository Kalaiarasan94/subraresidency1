import { useState } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { 
  UserPlus, Calendar, Hotel, 
  FileText, CreditCard, Mail, 
  Printer, CheckCircle, ChevronRight,
  Plus, Trash2, IndianRupee
} from 'lucide-react';

export const OfflineBookingFlow = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    checkin: '',
    checkout: '',
    guests: 1,
    roomType: 'Standard'
  });

  const steps = [
    { label: 'Guest Details' },
    { label: 'Availability' },
    { label: 'Accounting' },
    { label: 'Payment' },
    { label: 'Receipt' }
  ];

  const handleNext = () => setCurrentStep(prev => prev + 1);
  const handleBack = () => setCurrentStep(prev => prev - 1);

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
                          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                             <UserPlus size={24} />
                          </div>
                          <div>
                             <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Guest Information</h2>
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Registering a new walk-in guest</p>
                          </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                             <input className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 text-xs font-bold text-slate-800 focus:border-emerald-500/50 outline-none transition-all" placeholder="Enter guest full name" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mobile Number</label>
                             <input className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 text-xs font-bold text-slate-800 focus:border-emerald-500/50 outline-none transition-all" placeholder="+91 XXXXX XXXXX" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Check-in Date</label>
                             <input type="date" className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 text-xs font-bold text-slate-800 focus:border-emerald-500/50 outline-none transition-all" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Check-out Date</label>
                             <input type="date" className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 text-xs font-bold text-slate-800 focus:border-emerald-500/50 outline-none transition-all" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Adults / Children</label>
                             <div className="flex items-center gap-4">
                                <button className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all">-</button>
                                <span className="text-sm font-black text-slate-800">02</span>
                                <button className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all">+</button>
                             </div>
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Primary ID Type</label>
                             <select className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 text-xs font-bold text-slate-800 focus:border-emerald-500/50 outline-none transition-all appearance-none">
                                <option>Aadhar Card</option>
                                <option>Passport</option>
                                <option>Driving License</option>
                             </select>
                          </div>
                       </div>
                    </div>
                  )}

                  {currentStep === 1 && (
                    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                       <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
                          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                             <Hotel size={24} />
                          </div>
                          <div>
                             <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Availability Search</h2>
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Available suites for selected dates</p>
                          </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            { room: '101', type: 'Single Deluxe', price: '₹ 2,500' },
                            { room: '205', type: 'Heritage Suite', price: '₹ 5,000' },
                            { room: '308', type: 'Royal View', price: '₹ 7,500' },
                          ].map((room, i) => (
                             <button key={i} onClick={handleNext} className="p-6 rounded-3xl border-2 border-slate-50 bg-white hover:border-emerald-500 hover:shadow-xl transition-all group text-left">
                                <div className="flex justify-between items-start">
                                   <p className="text-2xl font-black text-slate-800 group-hover:text-emerald-700">{room.room}</p>
                                   <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg uppercase tracking-tight">Available</span>
                                </div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{room.type}</p>
                                <p className="text-sm font-black text-slate-800 mt-4">{room.price} <span className="text-[9px] text-slate-400 font-bold">/ NIGHT</span></p>
                             </button>
                          ))}
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
                                <p className="text-sm font-black text-slate-800">Heritage Suite Room #205</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">2 Nights stay x ₹ 5,000</p>
                             </div>
                             <p className="text-sm font-black text-slate-800">₹ 10,000.00</p>
                          </div>
                          
                          <button className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-[10px] font-black text-slate-400 hover:text-emerald-600 hover:border-emerald-200 transition-all uppercase tracking-widest flex items-center justify-center gap-2">
                             <Plus size={14} /> Add Service / Food Order
                          </button>
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
                             <select className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 text-xs font-bold text-slate-800 outline-none appearance-none">
                                <option>Cash Payment</option>
                                <option>Card Terminal</option>
                                <option>UPI / QR Scan</option>
                             </select>
                          </div>
                          <div className="flex flex-col gap-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase text-left tracking-widest">Total Amount Received</label>
                             <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                                <input className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 pl-8 text-xs font-bold text-emerald-700 outline-none" defaultValue="11,800.00" />
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
                          <p className="text-slate-400 font-bold text-sm">Invoice #INV-2026-902 successfully generated</p>
                       </div>

                       <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mt-10">
                          <button className="p-6 rounded-3xl bg-slate-50 border border-slate-100 flex flex-col items-center gap-3 group hover:bg-emerald-600 hover:text-white transition-all">
                             <Printer size={20} />
                             <span className="text-[10px] font-black uppercase tracking-widest">Print Folio</span>
                          </button>
                          <button className="p-6 rounded-3xl bg-slate-50 border border-slate-100 flex flex-col items-center gap-3 group hover:bg-emerald-600 hover:text-white transition-all">
                             <Mail size={20} />
                             <span className="text-[10px] font-black uppercase tracking-widest">Send Email</span>
                          </button>
                       </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="mt-12 flex justify-between items-center">
                    {currentStep > 0 && currentStep < steps.length - 1 && (
                      <button onClick={handleBack} className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-emerald-600 transition-colors">Go Back</button>
                    )}
                    <div></div>
                    {currentStep < steps.length - 1 && (
                      <Button onClick={handleNext} className="bg-[#0b3a24] text-white font-black px-12 rounded-xl py-6 h-auto uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all">
                        {currentStep === steps.length - 2 ? 'Complete Folio' : 'Next Step'}
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
                        <span className="text-sm font-black text-white">₹ 10,000.00</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-emerald-200/50 uppercase tracking-widest">Tax (GST 18%)</span>
                        <span className="text-sm font-black text-white">₹ 1,800.00</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-emerald-200/50 uppercase tracking-widest">Total Payable</span>
                        <span className="text-2xl font-black text-emerald-400">₹ 11,800.00</span>
                     </div>
                  </div>

                  <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10 space-y-4">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                           <UserPlus size={16} />
                        </div>
                        <span className="text-xs font-black uppercase tracking-tight">{formData.name || 'New Guest'}</span>
                     </div>
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                           <Calendar size={16} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-tight">24 Jun - 26 Jun 2026</span>
                     </div>
                  </div>
               </CardContent>
            </Card>

            <div className="p-6 rounded-[2rem] bg-white border border-slate-100 shadow-sm flex items-center gap-4">
               <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                  <IndianRupee size={20} />
               </div>
               <div>
                  <p className="text-[10px] font-black text-slate-800 uppercase tracking-tight">Cashier Support</p>
                  <p className="text-[9px] text-slate-400 font-bold">Extension: 404</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
