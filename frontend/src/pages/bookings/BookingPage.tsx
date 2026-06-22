import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { QrCode } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchBookingById, createBooking, createPaymentOrder, verifyPayment } from '../../lib/api';

export default function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state || {}) as any;
  const bookingId = state?.bookingId || '';
  const room = state?.room || {};
  const guest = state?.guest || {};
  const [bookingFull, setBookingFull] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({ name: '', phone: '', email: '', checkIn: '', checkOut: '', guests: '2 Guests' });

  useEffect(() => {
    const id = bookingId || (state?.bookingIdFromQuery);
    if (id) {
      fetchBookingById(id).then((res) => {
        if (res && res.status === 'success') setBookingFull(res.booking);
      });
    }
  }, [bookingId]);

  // no-op useEffect kept minimal
  useEffect(() => {}, []);

  const handleStartPayment = async () => {
    // create booking (pending)
    setIsSubmitting(true);
    try {
      const bookingResp = await createBooking({
        ...bookingDetails,
        category_id: room.id,
        amount: room.price || room.price_24h || 3500
      });
      if (!bookingResp || bookingResp.status !== 'success') {
        alert('Failed to create booking.');
        setIsSubmitting(false);
        return;
      }
      const bid = bookingResp.booking_id;
      // request payment order
      const amountValue = Number(room?.price || room?.price_24h || 3500);
      const orderResp = await createPaymentOrder({ booking_id: bid, amount: amountValue });
      if (!orderResp || orderResp.status !== 'success') {
        alert('Failed to create payment order.');
        setIsSubmitting(false);
        return;
      }
      const order = orderResp.order;
      const keyId = orderResp.key_id;

      const loadRzp = () => new Promise((res, rej) => {
        if ((window as any).Razorpay) return res(true);
        const s = document.createElement('script');
        s.src = 'https://checkout.razorpay.com/v1/checkout.js';
        s.onload = () => res(true);
        s.onerror = () => rej(false);
        document.body.appendChild(s);
      });

      await loadRzp();
      const options = {
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Subra Residency',
        description: room?.title,
        order_id: order.id,
        handler: async function (response: any) {
          const verifyResp = await verifyPayment({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            booking_id: bid
          });
          setIsSubmitting(false);
          if (verifyResp && verifyResp.status === 'success') {
            // navigate to same page with booking state for consistent display
            navigate('/bookings', { state: { bookingId: bid, room, guest: bookingDetails, amount: amountValue, checkIn: bookingDetails.checkIn, checkOut: bookingDetails.checkOut } });
          } else {
            alert('Payment verification failed.');
          }
        },
        prefill: {
          name: bookingDetails.name,
          email: bookingDetails.email,
          contact: bookingDetails.phone
        }
      } as any;

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (err) {
      setIsSubmitting(false);
      alert('Payment failed to start.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <img src={room?.images?.[0] || room?.image} alt={room?.title} className="w-full h-96 object-cover" />
          <div className="p-8">
            <h1 className="text-4xl font-playfair font-black text-catalogue-green">{room?.title || 'Room'}</h1>
            <p className="mt-2 text-sm text-slate-600">{room?.short_description || room?.full_description}</p>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-emerald-50 p-4 rounded">
                <p className="text-xs text-slate-500 uppercase">Check-in</p>
                <p className="font-bold">{state?.checkIn || '—'}</p>
              </div>
              <div className="bg-emerald-50 p-4 rounded">
                <p className="text-xs text-slate-500 uppercase">Check-out</p>
                <p className="font-bold">{state?.checkOut || '—'}</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm text-slate-500 uppercase">Guest</h3>
              <p className="font-bold">{guest?.name || '-'}</p>
              <p className="text-sm text-slate-500">{guest?.phone || ''} • {guest?.email || ''}</p>
            </div>

            <div className="mt-6">
              <h3 className="text-sm text-slate-500 uppercase">Booking ID</h3>
              <p className="font-black text-lg text-catalogue-green">{bookingId || '—'}</p>
            </div>

            <div className="mt-8">
              <Button onClick={() => navigate('/')} className="bg-catalogue-green text-white">Return to Home</Button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          { !bookingId && room && room.id ? (
            <Card className="rounded-2xl shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-lg font-bold text-catalogue-green">Reserve & Pay</h3>
                <div className="mt-4 text-sm text-slate-600 space-y-3">
                  <input value={bookingDetails.name} onChange={(e) => setBookingDetails({...bookingDetails, name: e.target.value})} placeholder="Full name" className="w-full p-3 border rounded" />
                  <input value={bookingDetails.phone} onChange={(e) => setBookingDetails({...bookingDetails, phone: e.target.value})} placeholder="Phone" className="w-full p-3 border rounded" />
                  <input value={bookingDetails.email} onChange={(e) => setBookingDetails({...bookingDetails, email: e.target.value})} placeholder="Email" className="w-full p-3 border rounded" />
                  <div className="grid grid-cols-2 gap-2">
                    <input type="date" value={bookingDetails.checkIn} onChange={(e) => setBookingDetails({...bookingDetails, checkIn: e.target.value})} className="w-full p-3 border rounded" />
                    <input type="date" value={bookingDetails.checkOut} onChange={(e) => setBookingDetails({...bookingDetails, checkOut: e.target.value})} className="w-full p-3 border rounded" />
                  </div>
                </div>
                <div className="mt-6">
                  <Button className="w-full bg-catalogue-green text-white" onClick={handleStartPayment} disabled={isSubmitting}>{isSubmitting ? 'Processing...' : `Pay ₹${room?.price || room?.price_24h || '3500'}`}</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="rounded-2xl shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-lg font-bold text-catalogue-green">Payment & Invoice</h3>
                <div className="mt-4 text-sm text-slate-600">
                  <p className="flex items-center gap-3"><span className="font-bold">Amount:</span> ₹{state?.amount || room?.price || bookingFull?.paid_amount || '—'}</p>
                  <p className="mt-3">You can download your invoice and show the QR at reception.</p>
                </div>
                <div className="mt-6">
                  <Button className="w-full bg-catalogue-gold text-white" onClick={() => window.print()}>Download PDF Invoice</Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="rounded-2xl shadow-lg">
            <CardContent className="p-8 text-center">
              <h3 className="text-lg font-bold text-catalogue-green">Booking QR</h3>
              <div className="mt-6">
                <div className="w-44 h-44 mx-auto bg-slate-100 rounded-lg flex items-center justify-center">
                  {bookingId || bookingFull?.booking_id ? (
                    <img src={`https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=${encodeURIComponent(bookingId || bookingFull?.booking_id)}`} alt="QR" />
                  ) : (
                    <QrCode size={80} />
                  )}
                </div>
                <p className="text-xs mt-4 text-slate-500">Show this QR at reception for check-in.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-lg font-bold text-catalogue-green">Need Help?</h3>
              <p className="text-sm text-slate-600">Contact reception at +91 98765 43210 or email support@subraresidency.com</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
