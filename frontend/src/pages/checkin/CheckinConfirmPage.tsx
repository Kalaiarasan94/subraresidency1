import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Loader2, Calendar, Hotel, AlertTriangle, XCircle, User, Phone, ShieldCheck, MapPin, Sparkles } from 'lucide-react';
import { fetchBookingById, notifyQrScan } from '../../lib/api';

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

  useEffect(() => {
    if (!bookingId) return;
    fetchBookingById(bookingId).then((res) => {
      setLoading(false);
      if (res && res.status === 'success' && res.booking) {
        setBooking(res.booking);
      } else {
        setNotFound(true);
      }
    }).catch(() => {
      setLoading(false);
      setNotFound(true);
    });
  }, [bookingId]);

  const handleConfirm = async () => {
    if (!bookingId) return;
    setConfirming(true);
    const res = await notifyQrScan(bookingId, selectedNote);
    setConfirming(false);
    if (res && res.status === 'success') {
      setConfirmed(true);
    } else {
      alert(res?.message || 'Could not notify reception. Please try again or approach the front desk directly.');
    }
  };

  const alreadyProcessed = booking && ALREADY_PROCESSED_STATUSES.includes(String(booking.status).toLowerCase());
  const roomName = booking?.rooms?.[0]?.room_name || booking?.room_category || 'Reserved Room';
  const paymentStatus = booking?.payment_status || 'Paid';

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center px-4 py-8 font-sans selection:bg-amber-500 selection:text-slate-950">
      <div className="w-full max-w-md rounded-3xl bg-slate-950/90 border border-amber-500/30 shadow-[0_0_50px_rgba(205,160,82,0.15)] overflow-hidden backdrop-blur-xl">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0f3a20] via-[#164e2c] to-[#0f3a20] px-6 py-6 text-center border-b border-amber-500/20 relative">
          <div className="absolute top-2 right-4 flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-widest text-amber-400/80 bg-black/30 px-2 py-1 rounded-full">
            <Sparkles size={10} /> Express QR
          </div>
          <h1 className="font-playfair text-xl font-black text-white tracking-widest uppercase">Subra Residency</h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-400 mt-1">Mobile QR Express Check-in</p>
        </div>

        <div className="p-6 space-y-6 text-center">
          {loading && (
            <div className="py-12 flex flex-col items-center gap-3">
              <Loader2 size={32} className="animate-spin text-amber-400" />
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Verifying reservation details…</p>
            </div>
          )}

          {!loading && notFound && (
            <div className="py-8 flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                <XCircle size={36} className="text-rose-400" />
              </div>
              <p className="text-base font-black text-white uppercase tracking-wider">Reservation Not Found</p>
              <p className="text-xs text-slate-400 font-medium max-w-xs">
                We could not find details for booking ID <span className="font-mono text-amber-400">{bookingId}</span>. Please verify your QR code or present your booking code directly at reception.
              </p>
            </div>
          )}

          {!loading && !notFound && booking && !confirmed && !alreadyProcessed && (
            <>
              {/* Booking Identifier Header */}
              <div className="bg-slate-900/80 border border-amber-500/20 rounded-2xl p-4 text-center space-y-1">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-amber-400">Booking Pass</p>
                <p className="font-mono text-2xl font-black tracking-widest text-white">{booking.booking_id}</p>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                  <ShieldCheck size={12} /> Reservation Verified
                </div>
              </div>

              {/* Guest & Room Details Card */}
              <div className="space-y-3 text-left bg-slate-900/50 rounded-2xl p-4 border border-slate-800/80">
                <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Guest Name</p>
                    <p className="text-base font-bold text-white flex items-center gap-2 mt-0.5">
                      <User size={16} className="text-amber-400" /> {booking.guest_name}
                    </p>
                  </div>
                  {booking.phone && (
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1 bg-slate-800/60 px-2 py-1 rounded-md">
                      <Phone size={10} /> {booking.phone}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Room Assigned / Category</p>
                    <p className="text-xs font-bold text-slate-200 flex items-center gap-1.5 mt-1">
                      <Hotel size={14} className="text-amber-400" /> {roomName}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Payment Status</p>
                    <p className="text-xs font-bold text-emerald-400 capitalize mt-1">
                      ● {paymentStatus}
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-3">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Stay Schedule</p>
                  <p className="text-xs font-semibold text-slate-300 flex items-center gap-2 mt-1">
                    <Calendar size={13} className="text-amber-400" />
                    <span>{booking.check_in_date} &rarr; {booking.check_out_date}</span>
                  </p>
                </div>
              </div>

              {/* Arrival Note Selector */}
              <div className="text-left space-y-2">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1">
                  <MapPin size={12} className="text-amber-400" /> Your Current Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ARRIVAL_NOTES.map((note) => (
                    <button
                      key={note}
                      type="button"
                      onClick={() => setSelectedNote(note)}
                      className={`px-3 py-2 text-[11px] font-semibold rounded-xl border text-left transition-all ${
                        selectedNote === note
                          ? 'bg-amber-500/10 border-amber-500 text-amber-300 shadow-[0_0_10px_rgba(205,160,82,0.2)]'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {note}
                    </button>
                  ))}
                </div>
              </div>

              {/* Approve & Alert Button */}
              <button
                onClick={handleConfirm}
                disabled={confirming}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black uppercase tracking-[0.2em] py-4 text-xs rounded-2xl shadow-[0_0_20px_rgba(205,160,82,0.3)] transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {confirming ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Alerting Front Desk…</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={18} />
                    <span>Approve & Notify Reception</span>
                  </>
                )}
              </button>

              <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                Clicking above immediately sends your approval notice directly to the Receptionist Dashboard terminal for instant room key issuance.
              </p>
            </>
          )}

          {/* Success Screen */}
          {!loading && !notFound && confirmed && (
            <div className="py-8 flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <CheckCircle2 size={44} className="text-emerald-400" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-white uppercase tracking-wider">Reception Terminal Alerted!</h3>
                <p className="text-xs font-semibold text-emerald-400">Approval Notification Sent Successfully</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-left space-y-2 w-full text-xs text-slate-300">
                <p className="font-bold text-white flex items-center gap-2">
                  <Sparkles size={14} className="text-amber-400" /> Express Check-in Requested
                </p>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Our receptionist has received your booking details (<span className="text-amber-400 font-mono">{booking?.booking_id}</span>). Please step up to the front desk to receive your key card.
                </p>
              </div>
            </div>
          )}

          {/* Already Processed Screen */}
          {!loading && !notFound && alreadyProcessed && !confirmed && (
            <div className="py-8 flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                <AlertTriangle size={36} className="text-amber-400" />
              </div>
              <p className="text-base font-black text-white uppercase tracking-wider">Already Checked In</p>
              <p className="text-xs text-slate-400 font-medium max-w-xs">
                This reservation (<span className="font-mono text-amber-400">{booking.booking_id}</span>) has already completed check-in at the front desk.
              </p>
            </div>
          )}

          <div className="pt-2 border-t border-slate-900">
            <Link to="/" className="inline-block text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-amber-400 transition-colors">
              Return to Subra Residency Home
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

