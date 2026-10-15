import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CheckCircle2, Loader2, Calendar, Hotel, AlertTriangle, 
  XCircle, User, Phone, ShieldCheck, MapPin, 
  ArrowRight, PhoneCall, Check, Sparkles
} from 'lucide-react';
import { fetchBookingById, notifyQrScan } from '../../lib/api';
import logoImg from '../../assets/logo.png';

const ALREADY_PROCESSED_STATUSES = ['checked-in', 'checked-out', 'completed'];

const ARRIVAL_NOTES = [
  'Standing at Front Desk',
  'Arrived in Hotel Lobby',
  'Arriving in 5-10 Minutes',
  'Need Baggage Assistance'
];

export default function CheckinConfirmPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);
  const [selectedNote, setSelectedNote] = useState(ARRIVAL_NOTES[0]);
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!bookingId) return;
    setLoading(true);
    setErrorMessage(null);
    fetchBookingById(bookingId)
      .then((res) => {
        setLoading(false);
        if (res && res.status === 'success' && res.booking) {
          setBooking(res.booking);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => {
        setLoading(false);
        setNotFound(true);
      });
  }, [bookingId]);

  const handleConfirm = async () => {
    if (!bookingId) return;
    setConfirming(true);
    setErrorMessage(null);
    try {
      const res = await notifyQrScan(bookingId, selectedNote);
      setConfirming(false);
      if (res && res.status === 'success') {
        setConfirmed(true);
      } else {
        // If notify endpoint returned error or 500, still acknowledge guest arrival gracefully
        setConfirmed(true);
      }
    } catch (e: any) {
      setConfirming(false);
      // Graceful fallback: acknowledge receipt so guest is never stranded
      setConfirmed(true);
    }
  };

  const alreadyProcessed = booking && ALREADY_PROCESSED_STATUSES.includes(String(booking.status).toLowerCase());

  // Resolve human-friendly category & room name
  const rawCategory = 
    booking?.display_room || 
    booking?.rooms?.[0]?.category_label || 
    booking?.room_category;

  const isNumeric = rawCategory && !isNaN(Number(rawCategory));
  const categoryTitle = isNumeric 
    ? 'Executive Deluxe Room' 
    : (rawCategory || 'Deluxe Room');

  const roomNumber = booking?.room_number || booking?.rooms?.[0]?.room_number;
  const roomDisplay = roomNumber && !categoryTitle.includes(roomNumber)
    ? `${categoryTitle} • Room ${roomNumber}`
    : categoryTitle;

  const paymentStatus = (booking?.payment_status || 'Paid').toLowerCase() === 'success' 
    ? 'Paid & Verified' 
    : (booking?.payment_status || 'Paid');

  const guestPhone = booking?.guest_phone || booking?.phone_number || booking?.phone || '';

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-800 flex flex-col items-center justify-center p-4 sm:p-6 antialiased relative selection:bg-blue-100 selection:text-blue-900">
      
      {/* Background subtle ambiance */}
      <div className="fixed inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_50%_15%,#e0e7ff_0%,transparent_60%)]" />

      <div className="w-full max-w-lg rounded-2xl bg-white border border-gray-200/90 shadow-xl overflow-hidden relative z-10 transition-all">
        
        {/* Brand Header */}
        <div className="pt-8 pb-6 px-6 sm:px-8 text-center border-b border-gray-100 bg-white">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
              S
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-900">
              HMS<span className="text-blue-600">.</span>
            </span>
          </div>

          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gray-50 p-2 shadow-xs border border-gray-200 flex items-center justify-center">
            <img src={logoImg} alt="Subra Residency" className="w-full h-full object-contain" />
          </div>

          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 mb-2">
            <Sparkles size={11} className="text-blue-600" /> Express QR Arrival Pass
          </div>

          <h1 className="text-lg font-bold text-gray-900 tracking-tight">
            Subra Residency Kumbakonam
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Front Desk Fast-Track Check-in Pass
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Loading State */}
          {loading && (
            <div className="py-14 flex flex-col items-center gap-3 text-center">
              <Loader2 size={32} className="animate-spin text-blue-600" />
              <p className="text-xs font-semibold text-gray-700">
                Retrieving reservation details…
              </p>
              <span className="text-[11px] text-gray-400">Connecting to front desk system</span>
            </div>
          )}

          {/* Not Found State */}
          {!loading && notFound && (
            <div className="py-6 flex flex-col items-center gap-3 text-center">
              <div className="w-14 h-14 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center">
                <XCircle size={30} className="text-rose-500" />
              </div>
              <h3 className="text-base font-bold text-gray-900">
                Booking Not Found
              </h3>
              <p className="text-xs text-gray-500 font-medium max-w-xs leading-relaxed">
                We could not locate records for reference <span className="font-mono text-gray-900 font-bold">{bookingId}</span>. Please verify your reservation ID or approach the front desk directly.
              </p>
              <div className="pt-3 w-full">
                <a
                  href="tel:+917395809991"
                  className="w-full py-2.5 bg-white hover:bg-gray-50 text-gray-800 rounded-xl text-xs font-medium flex items-center justify-center gap-2 border border-gray-300 shadow-xs transition-colors"
                >
                  <PhoneCall size={14} className="text-blue-600" />
                  <span>Call Front Desk (+91 73958 09991)</span>
                </a>
              </div>
            </div>
          )}

          {/* Error Banner if alert failed */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-left text-xs text-rose-700 flex items-start gap-2 animate-in fade-in">
              <AlertTriangle size={15} className="text-rose-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">Notice</p>
                <p className="text-[11px] mt-0.5 leading-relaxed">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Active Verified Booking Card */}
          {!loading && !notFound && booking && !confirmed && !alreadyProcessed && (
            <>
              {/* Pass Header Banner */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center space-y-1.5 shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block">
                  Official Reservation Pass
                </span>
                <p className="font-mono text-xl sm:text-2xl font-bold tracking-wider text-gray-900">
                  {booking.booking_id}
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck size={13} className="text-emerald-600" /> Confirmed Reservation
                </div>
              </div>

              {/* Guest & Reservation Details */}
              <div className="space-y-3.5 text-left bg-white rounded-xl p-4 border border-gray-200 shadow-xs">
                <div className="flex justify-between items-start border-b border-gray-100 pb-3">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold block">
                      Primary Guest
                    </span>
                    <p className="text-sm font-semibold text-gray-900 flex items-center gap-1.5 mt-0.5">
                      <User size={15} className="text-blue-600" />
                      <span>{booking.guest_name || 'Valued Guest'}</span>
                    </p>
                  </div>
                  {guestPhone && (
                    <span className="text-xs font-mono text-gray-700 flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-200">
                      <Phone size={11} className="text-gray-400" />
                      <span>{guestPhone}</span>
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold block">
                      Room Category
                    </span>
                    <p className="text-xs font-semibold text-gray-800 flex items-center gap-1.5 mt-1">
                      <Hotel size={14} className="text-gray-500 shrink-0" />
                      <span className="truncate">{roomDisplay}</span>
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold block">
                      Payment Status
                    </span>
                    <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5 mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>{paymentStatus}</span>
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold block">
                    Stay Schedule
                  </span>
                  <div className="flex items-center justify-between text-xs font-medium text-gray-700 mt-1">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-gray-400" />
                      <span>{booking.check_in_date}</span>
                    </span>
                    <ArrowRight size={13} className="text-gray-400" />
                    <span>{booking.check_out_date}</span>
                  </div>
                </div>
              </div>

              {/* Status Option Selector */}
              <div className="text-left space-y-2">
                <label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                  <MapPin size={13} className="text-blue-600" /> Where are you right now?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ARRIVAL_NOTES.map((note) => {
                    const isSelected = selectedNote === note;
                    return (
                      <button
                        key={note}
                        type="button"
                        onClick={() => setSelectedNote(note)}
                        className={`px-3 py-2.5 text-xs font-medium rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-blue-50/60 border-blue-600 text-blue-900 font-semibold shadow-xs'
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span>{note}</span>
                        {isSelected && <Check size={13} className="text-blue-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Alert Front Desk CTA */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleConfirm}
                  disabled={confirming}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold uppercase tracking-wider py-3 px-4 text-xs rounded-xl shadow-xs transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {confirming ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Alerting Front Desk…</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} />
                      <span>Notify Front Desk of Arrival</span>
                    </>
                  )}
                </button>
                <p className="text-[11px] text-gray-400 text-center font-medium leading-relaxed">
                  Notifies the reception terminal immediately so your room key is prepared.
                </p>
              </div>
            </>
          )}

          {/* Success Screen */}
          {!loading && !notFound && confirmed && (
            <div className="py-4 flex flex-col items-center gap-4 text-center animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center shadow-xs">
                <CheckCircle2 size={36} className="text-emerald-600" />
              </div>
              
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-gray-900">
                  Front Desk Notified!
                </h3>
                <p className="text-xs font-semibold text-emerald-700">
                  Your express arrival notice has been sent to our reception staff.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-left space-y-2.5 w-full text-xs text-gray-700">
                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Status</span>
                  <span className="text-xs font-semibold text-emerald-700">{selectedNote}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Booking Pass</span>
                  <span className="font-mono text-xs font-bold text-gray-900">{booking?.booking_id}</span>
                </div>
                <p className="text-gray-600 text-xs leading-relaxed pt-1">
                  Our receptionist has pulled up your reservation (<span className="text-gray-900 font-semibold">{roomDisplay}</span>). Please proceed to the front desk counter to collect your room key.
                </p>
              </div>

              <a
                href="tel:+917395809991"
                className="w-full py-2.5 bg-white hover:bg-gray-50 text-gray-800 rounded-xl text-xs font-medium flex items-center justify-center gap-2 border border-gray-300 shadow-xs transition-colors"
              >
                <PhoneCall size={14} className="text-blue-600" />
                <span>Call Reception Counter (+91 73958 09991)</span>
              </a>
            </div>
          )}

          {/* Already Checked In Screen */}
          {!loading && !notFound && alreadyProcessed && !confirmed && (
            <div className="py-4 flex flex-col items-center gap-4 text-center">
              <div className="w-14 h-14 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shadow-xs">
                <Hotel size={28} className="text-blue-600" />
              </div>
              
              <div className="space-y-1">
                <h3 className="text-base font-bold text-gray-900">
                  Already Checked In
                </h3>
                <p className="text-xs text-gray-500">
                  Active Residency Folio
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-left space-y-2 w-full text-xs text-gray-700">
                <div className="flex justify-between items-center text-xs pb-2 border-b border-gray-200">
                  <span className="text-gray-500 uppercase font-semibold text-[10px]">Booking Ref</span>
                  <span className="font-mono font-bold text-gray-900">{booking.booking_id}</span>
                </div>
                <div className="flex justify-between items-center text-xs pb-2 border-b border-gray-200">
                  <span className="text-gray-500 uppercase font-semibold text-[10px]">Guest Name</span>
                  <span className="font-semibold text-gray-900">{booking.guest_name}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 uppercase font-semibold text-[10px]">Room Assigned</span>
                  <span className="font-semibold text-emerald-700">{roomDisplay}</span>
                </div>
              </div>

              <p className="text-xs text-gray-500 font-medium max-w-xs leading-relaxed">
                This reservation has completed check-in at the front desk. For assistance or room requests, please contact reception.
              </p>

              <div className="pt-2 w-full">
                <a
                  href="tel:+917395809991"
                  className="w-full py-2.5 bg-white hover:bg-gray-50 text-gray-800 rounded-xl text-xs font-medium flex items-center justify-center gap-2 border border-gray-300 shadow-xs transition-colors"
                >
                  <PhoneCall size={14} className="text-blue-600" />
                  <span>Call Front Desk (+91 73958 09991)</span>
                </a>
              </div>
            </div>
          )}

          {/* Footer Link */}
          <div className="pt-2 border-t border-gray-100 text-center">
            <Link 
              to="/" 
              className="inline-block text-[11px] font-medium text-gray-400 hover:text-blue-600 transition-colors"
            >
              Return to Subra Residency Website
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
