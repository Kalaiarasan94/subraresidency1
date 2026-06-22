<!doctype html>
<html>
<head><meta charset="utf-8"><title>Booking Viewer</title>
<style>body{font-family:Arial,Helvetica,sans-serif;padding:20px} .box{max-width:800px;margin:0 auto;border:1px solid #eee;padding:20px;border-radius:8px} .kv{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px dashed #f0f0f0}</style>
</head><body>
<div class="box">
  <h2>Booking Viewer</h2>
  <div id="content">Loading...</div>
</div>
<script>
  const params = new URLSearchParams(location.search);
  const id = params.get('booking_id');
  if (!id) { document.getElementById('content').innerText='booking_id required in query'; }
  else {
    fetch('/api/index.php/admin/bookings/view?booking_id='+encodeURIComponent(id))
      .then(r=>r.json()).then(j=>{
        if (j.status!=='success') { document.getElementById('content').innerText='Not found'; return; }
        const b = j.booking;
        document.getElementById('content').innerHTML = `
          <div class='kv'><b>Booking ID</b><span>${b.booking_id}</span></div>
          <div class='kv'><b>Guest</b><span>${b.guest_name} ${b.guest_phone}</span></div>
          <div class='kv'><b>Stay</b><span>${b.check_in_date} to ${b.check_out_date}</span></div>
          <div class='kv'><b>Rooms</b><span>${(b.rooms||[]).map(r=>r.room_number||r.room_name).join(', ')}</span></div>
          <div class='kv'><b>Paid</b><span>${b.paid_amount || b.total_amount}</span></div>
          <div class='kv'><b>Status</b><span>${b.status} / ${b.payment_status}</span></div>
          <div style='margin-top:16px'><button onclick='window.print()'>Print</button></div>
        `;
      }).catch(e=>{document.getElementById('content').innerText='Error fetching booking'});
  }
</script>
</body></html>