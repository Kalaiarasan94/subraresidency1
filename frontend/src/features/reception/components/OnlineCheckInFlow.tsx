import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, QrCode, UserCheck, ShieldCheck, 
  CreditCard, ChevronRight, CheckCircle,
  Smartphone, Printer, FileText, Mail,
  Calendar, Users, Hotel, Loader2,
  Check, AlertCircle, Trash2, ArrowLeft, RefreshCw, IndianRupee, Plus
} from 'lucide-react';
import { API_BASE_URL, BACKEND_URL } from '../../../lib/api';

const StepIndicator = ({ steps, currentStep, onSelectStep }: { steps: string[]; currentStep: number; onSelectStep?: (i: number) => void }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-3 mb-6 shadow-xs">
    <div className="flex items-center justify-between overflow-x-auto gap-2">
      {steps.map((step: string, i: number) => {
        const isDone = i < currentStep;
        const isCurrent = i === currentStep;
        return (
          <div key={i} className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                if (isDone && onSelectStep) onSelectStep(i);
              }}
              disabled={!isDone}
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
              <span>{step}</span>
            </button>
            {i < steps.length - 1 && <ChevronRight size={14} className="text-gray-300 shrink-0" />}
          </div>
        );
      })}
    </div>
  </div>
);

const ALREADY_PROCESSED_STATUSES = ['checked-in', 'checked-out', 'completed'];

type OnlineCheckInFlowProps = {
  prefillBookingId?: string | null;
  onPrefillConsumed?: () => void;
};

export const OnlineCheckInFlow = ({ prefillBookingId, onPrefillConsumed }: OnlineCheckInFlowProps = {}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentStep = Math.min(5, Math.max(0, parseInt(searchParams.get('checkin_step') || '0', 10)));

  const setCurrentStep = (newStep: number | ((prev: number) => number)) => {
    const nextVal = typeof newStep === 'function' ? newStep(currentStep) : newStep;
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (nextVal === 0) {
        next.delete('checkin_step');
      } else {
        next.set('checkin_step', String(nextVal));
      }
      return next;
    });
  };

  const [bookingId, setBookingId] = useState('');
  const [bookingData, setBookingData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [availableRooms, setAvailableRooms] = useState<any[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [guestEmail, setGuestEmail] = useState('');

  // Editable guest counts & extra charges
  const [editableGuests, setEditableGuests] = useState(1);
  const [editableChildren, setEditableChildren] = useState(0);
  const [initialGuests, setInitialGuests] = useState(1);
  const [baseTotalAmount, setBaseTotalAmount] = useState(0);
  const [extraGuestCharge, setExtraGuestCharge] = useState('');
  const [isUpdatingGuests, setIsUpdatingGuests] = useState(false);
  
  // Interactive doc verification states
  const [verifiedDocs, setVerifiedDocs] = useState<string[]>(['Aadhar Card']);
  const [otherProofName, setOtherProofName] = useState('');
  const toggleDoc = (doc: string) => {
    setVerifiedDocs(prev =>
      prev.includes(doc) ? prev.filter(d => d !== doc) : [...prev, doc]
    );
    if (doc === 'Other Proofs' && verifiedDocs.includes('Other Proofs')) {
      setOtherProofName('');
    }
  };

  // Payment status override
  const [paymentStatusOverride, setPaymentStatusOverride] = useState<string>('');
  const [selectedRoom, setSelectedRoom] = useState<any>(null);

  const steps = ['Identity', 'Verify Details', 'Documents', 'Room Allocation', 'Payment & Settle', 'Confirmation'];

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const resetFlow = () => {
    setCurrentStep(0);
    setBookingId('');
    setBookingData(null);
    setGuestEmail('');
    setVerifiedDocs(['Aadhar Card']);
    setOtherProofName('');
    setPaymentStatusOverride('');
    setAvailableRooms([]);
    setLoadingRooms(false);
    setError('');
    setSelectedRoom(null);
    setExtraGuestCharge('');
    setBaseTotalAmount(0);
  };

  const findBooking = async (idOverride?: string) => {
    const targetId = idOverride ?? bookingId;
    if (!targetId) return;
    setLoading(true);
    setError('');
    try {
       const resp = await fetch(`${API_BASE_URL}/bookings/view?booking_id=${targetId}`);
       const json = await resp.json();
       if (json.status === 'success') {
         if (ALREADY_PROCESSED_STATUSES.includes(String(json.data.status).toLowerCase())) {
           alert('This booking has already been checked in / allocated.');
           setLoading(false);
           return;
         }
          const numTotal = parseFloat(json.data.total_amount) || 0;
          const numExtra = parseFloat(json.data.extra_guest_charge) || 0;
          setBaseTotalAmount(numTotal - numExtra > 0 ? numTotal - numExtra : numTotal);
          setExtraGuestCharge(numExtra > 0 ? String(numExtra) : '');

          setBookingData({
             id: json.data.booking_id,
             dbId: json.data.id,
             guest: json.data.guest_name,
             phone: json.data.phone_number || 'N/A',
             checkin: json.data.check_in_date,
             checkout: json.data.check_out_date,
             category: json.data.room_category || 'N/A',
             category_id: json.data.category_id || null,
             base_price: json.data.base_price || json.data.rooms?.[0]?.base_price,
             guests: json.data.guests_count || '1 Guest',
             children: json.data.children_count || 0,
             total: `₹ ${numTotal.toLocaleString('en-IN')}`,
             rawTotal: numTotal,
             paid: `₹ ${json.data.paid_amount || numTotal}`,
             status: json.data.status
          });
          const numericGuests = parseInt(json.data.guests_count) || 1;
          setEditableGuests(numericGuests);
          setInitialGuests(numericGuests);
          setEditableChildren(parseInt(json.data.children_count) || 0);
          setGuestEmail(json.data.guest_email || '');
          setPaymentStatusOverride(json.data.payment_status === 'success' ? 'success' : 'pending');
          setCurrentStep(1);
       } else {
          setError(json.message || 'No reservation found matching this Reference ID.');
       }
    } catch (err) {
       setError('Connection failed. Server might be offline.');
    } finally {
       setLoading(false);
    }
  };

  const handleSaveGuestsAndProceed = async () => {
    if (!bookingData) return;
    setIsUpdatingGuests(true);

    const extraAmount = parseFloat(extraGuestCharge) || 0;
    const computedNewTotal = baseTotalAmount + extraAmount;

    try {
      const resp = await fetch(`${API_BASE_URL}/admin/bookings/updateGuests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          booking_id: bookingData.id,
          guests: `${editableGuests} Guests`,
          children: editableChildren,
          extra_charge: extraAmount,
          new_total_amount: computedNewTotal,
          extra_adults: Math.max(0, editableGuests - (initialGuests || 2)),
          extra_children: editableChildren
        })
      });
      const json = await resp.json();
      if (json.status === 'success') {
        const finalTotal = json.new_total_amount ? parseFloat(json.new_total_amount) : computedNewTotal;
        setBookingData((prev: any) => ({
          ...prev,
          guests: `${editableGuests} Guests`,
          children: editableChildren,
          total: `₹ ${finalTotal.toLocaleString('en-IN')}`,
          rawTotal: finalTotal,
          extraGuestCharge: extraAmount
        }));
        handleNext();
      } else {
        alert(json.message || "Failed to update guest details.");
      }
    } catch (e) {
      console.error(e);
      alert("Error saving guest details.");
    } finally {
      setIsUpdatingGuests(false);
    }
  };

  // Auto-search when arriving here via a QR-scan notification click
  useEffect(() => {
    if (prefillBookingId) {
      setBookingId(prefillBookingId);
      findBooking(prefillBookingId);
      onPrefillConsumed?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefillBookingId]);

  const updateCheckInPayment = async (status: string) => {
    if (!bookingData) return;
    try {
      const resp = await fetch(`${API_BASE_URL}/admin/bookings/updatePaymentStatus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_id: bookingData.id, status })
      });
      const json = await resp.json();
      if (json.status === 'success') {
        setBookingData((prev: any) => ({ ...prev, status: status === 'success' ? 'confirmed' : 'pending' }));
        setPaymentStatusOverride(status === 'success' ? 'success' : 'pending');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteCheckInBooking = async () => {
    if (!bookingData) return;
    if (!window.confirm("Are you sure you want to cancel this booking and delete this record?")) return;
    try {
      const resp = await fetch(`${API_BASE_URL}/management/deletePayment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_id: bookingData.id })
      });
      const json = await resp.json();
      if (json.status === 'success') {
        alert("Booking cancelled and deleted successfully.");
        resetFlow();
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (currentStep === 3 && bookingData) {
      const fetchRooms = async () => {
        setLoadingRooms(true);
        try {
          const checkin  = bookingData.checkin  || '';
          const checkout = bookingData.checkout || '';
          const params   = new URLSearchParams({ checkin, checkout });
          if (bookingData.dbId) params.set('booking_id', String(bookingData.dbId));
          if (bookingData.category_id) params.set('category_id', String(bookingData.category_id));

          const resp = await fetch(`${API_BASE_URL}/rooms/checkAvailability?${params}`);
          const json = await resp.json();
          if (json.status === 'success' && Array.isArray(json.rooms)) {
            setAvailableRooms(json.rooms);
          } else {
            setAvailableRooms([]);
          }
        } catch (err) {
          console.error("Error loading available rooms:", err);
          setAvailableRooms([]);
        } finally {
          setLoadingRooms(false);
        }
      };
      fetchRooms();
    }
  }, [currentStep, bookingData]);

  const handleSelectRoomAndCheckin = async (roomId: number) => {
    setIsFinalizing(true);
    try {
      const resp = await fetch(`${API_BASE_URL}/admin/bookings/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_id: bookingData.id, room_id: roomId })
      });
      const json = await resp.json();
      if (json.status === 'success') {
        handleNext();
      } else {
        alert(json.message || "Failed to complete check-in.");
      }
    } catch (e) {
      console.error(e);
      alert("Error contacting reservation check-in service.");
    } finally {
      setIsFinalizing(false);
    }
  };

  const extraAmountNum = parseFloat(extraGuestCharge) || 0;
  const liveTotalCalculated = baseTotalAmount + extraAmountNum;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Step Stepper Header */}
      <StepIndicator steps={steps} currentStep={currentStep} onSelectStep={(i) => setCurrentStep(i)} />

      {/* Step 0: Search / Locate Reservation */}
      {currentStep === 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-xs">
          <div className="max-w-xl mx-auto text-center space-y-6">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mx-auto border border-emerald-200">
              <QrCode size={24} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">Locate Online Reservation</h2>
              <p className="text-xs text-gray-500 mt-1">
                Scan guest check-in QR code or enter booking reference ID (e.g. SUBRA-2026-001 or HBK...)
              </p>
            </div>

            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Enter Booking ID (e.g. HBK2026...)" 
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') findBooking(); }}
                  className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-xs font-medium text-gray-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 uppercase tracking-wider"
                />
              </div>

              {error && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs font-medium flex items-center gap-2">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                disabled={loading || !bookingId.trim()}
                onClick={() => findBooking()}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-medium text-xs py-2.5 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
                <span>{loading ? 'Locating Reservation...' : 'Search Booking'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 1: Verify Reservation Details & Add Extra Person Charges */}
      {currentStep === 1 && bookingData && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-xs overflow-hidden">
          {/* Card Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                ID
              </div>
              <div>
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Booking Reference</span>
                <p className="text-sm font-bold text-gray-900 font-mono">{bookingData.id}</p>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold uppercase tracking-wider">
              {bookingData.status}
            </span>
          </div>

          <div className="p-6 space-y-6">
            {/* Meta Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block">Guest Name</span>
                <p className="text-xs font-bold text-gray-900 mt-1">{bookingData.guest}</p>
              </div>

              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block">Phone Number</span>
                <p className="text-xs font-bold text-gray-900 mt-1">{bookingData.phone}</p>
              </div>

              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block">Category</span>
                <p className="text-xs font-bold text-emerald-700 mt-1">{bookingData.category}</p>
              </div>

              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block">Stay Window</span>
                <p className="text-xs font-bold text-gray-900 mt-1">{bookingData.checkin} → {bookingData.checkout}</p>
              </div>

              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block">Original Bill / Total</span>
                <p className="text-xs font-bold text-gray-900 font-mono mt-1">₹{baseTotalAmount.toLocaleString('en-IN')}</p>
              </div>

              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block">Payment Status</span>
                <p className={`text-xs font-bold mt-1 ${paymentStatusOverride === 'success' ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {paymentStatusOverride.toUpperCase()}
                </p>
              </div>
            </div>

            {/* Occupancy Stepper & Front Desk Extra Guest Charges Input */}
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 pb-2">
                <div>
                  <span className="text-xs font-bold text-gray-900 uppercase tracking-wider block">
                    Occupancy Verification &amp; Extra Charges
                  </span>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Adjust primary guests count and enter front desk extra person / child bedding fees
                  </p>
                </div>
                {(editableGuests > (initialGuests || 2) || editableChildren > 0 || extraAmountNum > 0) && (
                  <span className="px-2.5 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded border border-emerald-300 self-start sm:self-auto">
                    Extra Occupant Adjusted
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    Adults (Age 12+)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={editableGuests}
                    onChange={(e) => setEditableGuests(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    Children (Under 12)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={editableChildren}
                    onChange={(e) => setEditableChildren(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Extra Guest Fee Input */}
              <div className="bg-white border border-emerald-200 rounded-lg p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold text-emerald-950">
                      Extra Adult / Child Amount (₹)
                    </label>
                    <p className="text-[10px] text-gray-500">
                      Enter additional amount to charge the guest at the front desk
                    </p>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 font-mono">
                    +₹{extraAmountNum.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="relative max-w-xs">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">₹</span>
                  <input
                    type="number"
                    min="0"
                    value={extraGuestCharge}
                    onChange={(e) => setExtraGuestCharge(e.target.value)}
                    placeholder="0.00 (Enter extra person amount)"
                    className="w-full bg-white border border-emerald-300 rounded-lg pl-7 pr-3 py-2 text-xs font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-gray-500">Original Booking Base Bill:</span>
                  <span className="font-semibold text-gray-700 font-mono">₹{baseTotalAmount.toLocaleString('en-IN')}</span>
                </div>

                {extraAmountNum > 0 && (
                  <div className="flex items-center justify-between text-xs text-emerald-800">
                    <span className="font-medium">+ Extra Adult / Child Charges:</span>
                    <span className="font-bold font-mono">+₹{extraAmountNum.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-dashed border-gray-200 flex items-center justify-between text-xs font-bold">
                  <span className="text-gray-900">Updated Total Folio (Invoice Total):</span>
                  <span className="text-emerald-700 font-mono text-sm">
                    ₹{liveTotalCalculated.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button 
                onClick={resetFlow}
                className="text-xs text-gray-500 hover:text-gray-800 font-medium"
              >
                Cancel &amp; Search Different Booking
              </button>
              <button
                onClick={handleSaveGuestsAndProceed}
                disabled={isUpdatingGuests}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
              >
                {isUpdatingGuests && <Loader2 size={13} className="animate-spin" />}
                <span>Save Occupancy &amp; Proceed to Documents</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Document Verification */}
      {currentStep === 2 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Government Identity Verification</h3>
              <p className="text-xs text-gray-500">Select verified physical identification proofs presented by guest</p>
            </div>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[11px] font-semibold rounded border border-emerald-200">
              Mandatory KYC
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {['Aadhar Card', 'PAN Card', 'Passport / DL', 'Other Proofs'].map((doc, i) => {
              const isChecked = verifiedDocs.includes(doc);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggleDoc(doc)}
                  className={`p-3.5 rounded-lg border text-left transition-all flex flex-col justify-between h-24 ${
                    isChecked 
                      ? 'border-emerald-600 bg-emerald-50/60 shadow-xs ring-1 ring-emerald-500' 
                      : 'border-gray-200 bg-white hover:border-emerald-500 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900">{doc}</span>
                    {isChecked && <Check size={14} className="text-emerald-600" />}
                  </div>
                  <span className={`text-[10px] font-medium ${isChecked ? 'text-emerald-700' : 'text-gray-400'}`}>
                    {isChecked ? 'Verified' : 'Click to Verify'}
                  </span>
                </button>
              );
            })}
          </div>

          {verifiedDocs.includes('Other Proofs') && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Specify Other Government ID Document
              </label>
              <input 
                value={otherProofName}
                onChange={e => setOtherProofName(e.target.value)}
                placeholder="e.g. Government Employee ID, NRI Card, Overseas Citizen Card"
                className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <button 
              onClick={handleBack}
              className="text-xs text-gray-500 hover:text-gray-800 font-medium"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={verifiedDocs.includes('Other Proofs') && !otherProofName.trim()}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-medium rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>Approve &amp; Allocate Room</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Room Allocation */}
      {currentStep === 3 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Room Allocation</h3>
              <p className="text-xs text-gray-500">
                Category: <span className="font-semibold text-emerald-800">{bookingData?.category}</span> ({availableRooms.length} available)
              </p>
            </div>
            <button
              onClick={() => {
                setCurrentStep(3);
              }}
              className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md border border-gray-200 hover:bg-gray-50"
              title="Refresh Room List"
            >
              <RefreshCw size={14} />
            </button>
          </div>

          {loadingRooms ? (
            <div className="py-12 text-center text-gray-500 space-y-2">
              <Loader2 size={24} className="animate-spin text-emerald-600 mx-auto" />
              <p className="text-xs font-medium">Scanning inventory for available rooms...</p>
            </div>
          ) : availableRooms.length === 0 ? (
            <div className="py-12 text-center text-gray-400 space-y-2 border border-dashed border-gray-200 rounded-lg">
              <Hotel size={24} className="mx-auto text-gray-300" />
              <p className="text-xs font-semibold text-gray-700">No rooms available in this category for the requested dates</p>
              <p className="text-[11px] text-gray-400">All rooms might be occupied or reserved.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {availableRooms.map((room) => {
                const isSelected = selectedRoom?.id === room.id;
                return (
                  <button
                    key={room.id}
                    onClick={() => {
                      setSelectedRoom(room);
                      handleNext();
                    }}
                    className={`p-4 rounded-lg border text-left transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/60 shadow-xs ring-1 ring-emerald-500'
                        : 'border-gray-200 bg-white hover:border-emerald-500 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-gray-900">{room.room_number}</span>
                      <span className="text-[9px] bg-emerald-50 text-emerald-800 font-semibold px-1.5 py-0.5 rounded border border-emerald-200">
                        Available
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1 truncate">
                      {room.category_label || room.category_name || bookingData.category}
                    </p>
                    <p className="text-xs font-bold text-gray-800 mt-2">
                      ₹{Number(room.base_price || 0).toLocaleString('en-IN')}
                    </p>
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <button 
              onClick={handleBack}
              className="text-xs text-gray-500 hover:text-gray-800 font-medium"
            >
              Back
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Payment Review & Final Check-In Confirmation */}
      {currentStep === 4 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs space-y-6">
          <div className="pb-4 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-900">Payment Status &amp; Room Finalization</h3>
            <p className="text-xs text-gray-500">Review settlement status and assign key to complete check-in</p>
          </div>

          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block">Assigned Room</span>
              <p className="text-sm font-bold text-gray-900">Room {selectedRoom?.room_number}</p>
              <p className="text-xs text-gray-500">{selectedRoom?.category_label || selectedRoom?.category_name || bookingData?.category}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block">Total Bill</span>
              <p className="text-sm font-bold text-emerald-800 font-mono">{bookingData?.total}</p>
              {extraAmountNum > 0 && (
                <span className="text-[10px] text-emerald-700 font-medium block">
                  (Includes Extra Guest Fee: ₹{extraAmountNum.toLocaleString('en-IN')})
                </span>
              )}
              <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                paymentStatusOverride === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {paymentStatusOverride === 'success' ? 'PAID' : 'PENDING'}
              </span>
            </div>
          </div>

          {/* Quick Payment Status Buttons */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-700">Update Settlement</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => updateCheckInPayment('success')}
                className={`py-2 px-3 border rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                  paymentStatusOverride === 'success'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-semibold'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <CheckCircle size={14} className="text-emerald-600" />
                <span>Mark Paid</span>
              </button>

              <button
                type="button"
                onClick={() => updateCheckInPayment('pending')}
                className={`py-2 px-3 border rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                  paymentStatusOverride === 'pending'
                    ? 'bg-amber-50 border-amber-500 text-amber-800 font-semibold'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <AlertCircle size={14} className="text-amber-600" />
                <span>Mark Pending</span>
              </button>

              <button
                type="button"
                onClick={deleteCheckInBooking}
                className="py-2 px-3 border border-rose-200 text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                <Trash2 size={14} />
                <span>Cancel Booking</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <button 
              onClick={handleBack}
              className="text-xs text-gray-500 hover:text-gray-800 font-medium"
            >
              Back
            </button>
            <button
              onClick={() => handleSelectRoomAndCheckin(selectedRoom?.id)}
              disabled={isFinalizing || !selectedRoom}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-medium rounded-lg shadow-xs transition-colors flex items-center gap-2"
            >
              {isFinalizing && <Loader2 size={14} className="animate-spin" />}
              <span>{isFinalizing ? 'Finalizing Check-in...' : 'Complete Check-in & Hand Key'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Check-in Success Confirmation */}
      {currentStep === 5 && (
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-xs text-center space-y-6">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
            <CheckCircle size={28} />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold text-gray-900">Check-in Completed Successfully!</h3>
            <p className="text-xs text-gray-500">
              Guest <span className="font-semibold text-gray-800">{bookingData?.guest}</span> is checked into{' '}
              <span className="font-semibold text-emerald-700">Room {selectedRoom?.room_number}</span>
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button 
              onClick={() => window.open(`${BACKEND_URL}/admin_view_booking.php?booking_id=${bookingId}&print=1`, '_blank')}
              className="px-4 py-2 border border-gray-300 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5"
            >
              <Printer size={14} />
              <span>Print Registration Slip</span>
            </button>

            <button 
              onClick={() => window.open(`${BACKEND_URL}/admin_view_booking.php?booking_id=${bookingId}`, '_blank')}
              className="px-4 py-2 border border-gray-300 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5"
            >
              <FileText size={14} />
              <span>View Invoice</span>
            </button>

            <button 
              onClick={resetFlow}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg shadow-xs transition-colors"
            >
              Check-in Another Guest
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
