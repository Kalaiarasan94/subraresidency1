<?php
// backend/admin_view_booking.php
$env = @parse_ini_file(__DIR__ . '/.env');
$appUrl = rtrim(($env['APP_URL'] ?? 'http://localhost/subraresidency1'), '/');

// Base64 Logo for 100% reliable print & rendering
$logoPath = __DIR__ . '/assets/logo.png';
$logoBase64 = file_exists($logoPath) ? 'data:image/png;base64,' . base64_encode(file_get_contents($logoPath)) : '';
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Subra Residency - Official GST Tax Invoice</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;0,800;1,700&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #0a3622;
      --primary-light: #135235;
      --gold: #b38728;
      --gold-dark: #8c6716;
      --gold-light: #fbf5e8;
      --gold-border: rgba(179, 135, 40, 0.35);
      --dark: #0f172a;
      --slate-600: #475569;
      --slate-500: #64748b;
      --slate-400: #94a3b8;
      --slate-100: #f1f5f9;
      --slate-50: #f8fafc;
      --border: #e2e8f0;
      --emerald-600: #059669;
      --emerald-50: #ecfdf5;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #f1f5f9;
      color: var(--dark);
      padding: 30px 16px;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      line-height: 1.45;
    }

    .container {
      max-width: 860px;
      margin: 0 auto;
    }

    /* Top Control Bar */
    .actions-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #ffffff;
      padding: 14px 24px;
      border-radius: 14px;
      box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.08);
      margin-bottom: 24px;
      border: 1px solid var(--border);
    }

    .actions-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .badge-portal {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      background: var(--gold-light);
      color: var(--gold-dark);
      padding: 4px 10px;
      border-radius: 6px;
      border: 1px solid var(--gold-border);
    }

    .actions-title {
      font-size: 14px;
      font-weight: 700;
      color: var(--dark);
    }

    .actions-btn-group {
      display: flex;
      gap: 10px;
    }

    .btn {
      padding: 9px 20px;
      font-size: 12px;
      font-weight: 700;
      border-radius: 8px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 7px;
      transition: all 0.2s;
      text-decoration: none;
      border: none;
    }

    .btn-print {
      background: var(--primary);
      color: #ffffff;
      box-shadow: 0 2px 8px rgba(10, 54, 34, 0.25);
    }

    .btn-print:hover {
      background: var(--primary-light);
      transform: translateY(-1px);
    }

    .btn-outline {
      background: #ffffff;
      color: var(--slate-600);
      border: 1px solid var(--border);
    }

    .btn-outline:hover {
      background: var(--slate-50);
      color: var(--dark);
    }

    /* Invoice Paper */
    .invoice-card {
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 10px 35px -5px rgba(15, 23, 42, 0.08);
      border: 1px solid rgba(226, 232, 240, 0.9);
      padding: 40px 44px;
      position: relative;
    }

    /* Top Golden Accent Line */
    .invoice-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 5px;
      background: linear-gradient(90deg, var(--primary) 0%, var(--gold) 50%, var(--primary) 100%);
      border-top-left-radius: 16px;
      border-top-right-radius: 16px;
    }

    /* Header */
    .inv-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-bottom: 24px;
      border-bottom: 2px solid var(--gold-light);
      gap: 20px;
    }

    .inv-brand {
      display: flex;
      align-items: center;
      gap: 18px;
    }

    .inv-logo {
      width: 72px;
      height: 72px;
      object-fit: contain;
      border-radius: 12px;
      border: 1px solid var(--border);
      padding: 4px;
      background: #ffffff;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    }

    .inv-hotel-title {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 24px;
      font-weight: 800;
      letter-spacing: 0.02em;
      color: var(--primary);
      line-height: 1.15;
    }

    .inv-legal-entity {
      font-size: 11px;
      font-weight: 700;
      color: var(--gold-dark);
      margin-top: 3px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .inv-hotel-address {
      font-size: 11px;
      color: var(--slate-600);
      margin-top: 5px;
      line-height: 1.5;
      max-width: 380px;
    }

    .inv-gstin-tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: var(--slate-50);
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 3px 8px;
      font-size: 11px;
      font-weight: 700;
      color: var(--dark);
      margin-top: 6px;
    }

    .inv-gstin-tag span {
      color: var(--primary);
      font-weight: 800;
      letter-spacing: 0.05em;
    }

    .inv-header-meta {
      text-align: right;
    }

    .inv-type-title {
      font-size: 20px;
      font-weight: 800;
      letter-spacing: 0.08em;
      color: var(--primary);
      text-transform: uppercase;
    }

    .inv-sub-type {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.12em;
      color: var(--slate-500);
      text-transform: uppercase;
      margin-top: 2px;
    }

    .inv-number-box {
      margin-top: 10px;
      background: var(--slate-50);
      border: 1px solid var(--border);
      padding: 8px 14px;
      border-radius: 8px;
      display: inline-block;
      text-align: right;
    }

    .inv-num-label {
      font-size: 9px;
      font-weight: 700;
      color: var(--slate-400);
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .inv-num-value {
      font-size: 13px;
      font-weight: 800;
      color: var(--dark);
      font-family: monospace;
    }

    .inv-date-text {
      font-size: 11px;
      color: var(--slate-500);
      margin-top: 4px;
      font-weight: 600;
    }

    /* 2 Column Details Grid */
    .inv-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      padding: 22px 0;
      border-bottom: 1px solid var(--border);
    }

    .inv-grid-col {
      background: var(--slate-50);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 16px 20px;
    }

    .inv-grid-col-title {
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: var(--gold-dark);
      margin-bottom: 10px;
      padding-bottom: 6px;
      border-bottom: 1px solid rgba(179, 135, 40, 0.2);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .inv-guest-name {
      font-size: 15px;
      font-weight: 800;
      color: var(--primary);
      margin-bottom: 6px;
    }

    .inv-info-row {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      margin-bottom: 5px;
      color: var(--slate-600);
    }

    .inv-info-row .label {
      color: var(--slate-500);
      font-weight: 600;
    }

    .inv-info-row .val {
      font-weight: 700;
      color: var(--dark);
      text-align: right;
    }

    .channel-badge {
      font-size: 10px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 4px;
      background: #e0f2fe;
      color: #0369a1;
      display: inline-block;
    }

    /* Table */
    .inv-table-wrap {
      margin: 22px 0;
    }

    .inv-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 11px;
    }

    .inv-table th {
      background: var(--slate-100);
      color: var(--slate-600);
      font-weight: 800;
      text-transform: uppercase;
      font-size: 9.5px;
      letter-spacing: 0.08em;
      padding: 10px 12px;
      text-align: left;
      border-top: 1px solid var(--border);
      border-bottom: 1px solid var(--border);
    }

    .inv-table th.tar, .inv-table td.tar {
      text-align: right;
    }

    .inv-table th.tac, .inv-table td.tac {
      text-align: center;
    }

    .inv-table td {
      padding: 12px 12px;
      border-bottom: 1px solid var(--border);
      color: var(--dark);
      font-weight: 600;
      vertical-align: middle;
    }

    .inv-table td .item-title {
      font-weight: 700;
      color: var(--primary);
      font-size: 12px;
      display: block;
    }

    .inv-table td .item-sub {
      font-size: 10px;
      color: var(--slate-500);
      margin-top: 2px;
      display: block;
    }

    .sac-code {
      font-family: monospace;
      font-weight: 700;
      color: var(--slate-600);
      font-size: 10px;
    }

    /* Summary & Calculation Layout */
    .inv-calc-section {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 24px;
      padding-top: 12px;
    }

    .inv-words-box {
      background: var(--slate-50);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 14px 16px;
    }

    .words-label {
      font-size: 9.5px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--slate-400);
      margin-bottom: 4px;
    }

    .words-text {
      font-size: 12px;
      font-weight: 700;
      color: var(--primary);
      font-style: italic;
    }

    .inv-stamp-wrap {
      margin-top: 14px;
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .paid-stamp {
      border: 2px dashed #059669;
      background: var(--emerald-50);
      color: #047857;
      padding: 6px 14px;
      border-radius: 8px;
      font-weight: 900;
      font-size: 13px;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .paid-stamp.pending {
      border-color: #d97706;
      background: #fffbeb;
      color: #b45309;
    }

    .inv-totals-box {
      background: #ffffff;
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 12px 18px;
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 5px 0;
      font-size: 11px;
      color: var(--slate-600);
    }

    .total-row.tax-split {
      font-size: 10.5px;
      color: var(--slate-500);
      padding-left: 10px;
    }

    .total-row.grand-total {
      border-top: 2px solid var(--gold-light);
      margin-top: 6px;
      padding-top: 8px;
      font-size: 15px;
      font-weight: 800;
      color: var(--primary);
    }

    .total-row.grand-total .val {
      font-size: 18px;
      font-family: monospace;
      color: var(--primary);
    }

    /* Verification & Signatory Section */
    .inv-bottom-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-top: 28px;
      padding-top: 20px;
      border-top: 1px solid var(--border);
    }

    .terms-box {
      font-size: 9.5px;
      color: var(--slate-500);
      line-height: 1.5;
    }

    .terms-title {
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--dark);
      margin-bottom: 4px;
    }

    .terms-box ol {
      padding-left: 14px;
    }

    .terms-box li {
      margin-bottom: 2px;
    }

    .signatory-box {
      text-align: right;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: flex-end;
    }

    .signatory-company {
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      color: var(--dark);
    }

    .signatory-space {
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Playfair Display', serif;
      font-style: italic;
      color: var(--gold-dark);
      font-size: 15px;
      opacity: 0.85;
    }

    .signatory-line {
      width: 180px;
      border-top: 1px solid var(--border);
      padding-top: 4px;
      font-size: 9.5px;
      font-weight: 700;
      color: var(--slate-500);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    /* Footer Note */
    .inv-footer {
      margin-top: 20px;
      text-align: center;
      font-size: 9.5px;
      color: var(--slate-400);
      font-weight: 600;
      letter-spacing: 0.04em;
    }

    /* Print Styles */
    @media print {
      body {
        background: #ffffff !important;
        padding: 0 !important;
        margin: 0 !important;
      }
      .actions-bar {
        display: none !important;
      }
      .container {
        max-width: 100% !important;
        width: 100% !important;
      }
      .invoice-card {
        border: none !important;
        box-shadow: none !important;
        padding: 20px 24px !important;
        border-radius: 0 !important;
      }
      .invoice-card::before {
        display: none !important;
      }
      @page {
        size: A4 portrait;
        margin: 10mm;
      }
    }
  </style>
</head>
<body>

<div class="container">
  <!-- Top Bar -->
  <div class="actions-bar">
    <div class="actions-left">
      <span class="badge-portal">GST Certified</span>
      <div class="actions-title">Official Tax Invoice &bull; Subra Residency</div>
    </div>
    <div class="actions-btn-group">
      <button class="btn btn-outline" onclick="window.history.back()">
        &larr; Back
      </button>
      <button class="btn btn-print" onclick="window.print()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V2h12v7"></path><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
        Print / Save PDF
      </button>
    </div>
  </div>

  <!-- Invoice Sheet -->
  <div class="invoice-card" id="invoice-sheet">
    <div style="text-align: center; padding: 40px; color: var(--slate-500); font-weight: 600;">
      Loading reservation details...
    </div>
  </div>
</div>

<script>
  const APP_URL = <?php echo json_encode($appUrl); ?>;
  const LOGO_DATA = <?php echo json_encode($logoBase64); ?>;
  const params = new URLSearchParams(location.search);
  const bookingId = params.get('booking_id');
  const sheet = document.getElementById('invoice-sheet');

  function numberToWordsINR(amount) {
    const num = Math.round(Number(amount));
    if (isNaN(num) || num === 0) return 'Zero Rupees Only';
    
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
      'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    function convertTwoDigits(n) {
      if (n < 20) return ones[n];
      const t = Math.floor(n / 10);
      const o = n % 10;
      return tens[t] + (o ? ' ' + ones[o] : '');
    }

    function convertThreeDigits(n) {
      const h = Math.floor(n / 100);
      const r = n % 100;
      let res = '';
      if (h) res += ones[h] + ' Hundred';
      if (r) res += (res ? ' ' : '') + convertTwoDigits(r);
      return res;
    }

    let n = num;
    const crore = Math.floor(n / 10000000);
    n %= 10000000;
    const lakh = Math.floor(n / 100000);
    n %= 100000;
    const thousand = Math.floor(n / 1000);
    n %= 1000;
    const remainder = n;

    let parts = [];
    if (crore) parts.push(convertThreeDigits(crore) + ' Crore');
    if (lakh) parts.push(convertThreeDigits(lakh) + ' Lakh');
    if (thousand) parts.push(convertThreeDigits(thousand) + ' Thousand');
    if (remainder) parts.push(convertThreeDigits(remainder));

    return 'Indian Rupees ' + parts.join(' ') + ' Only';
  }

  const esc = (v) => (v === null || v === undefined) ? '' : String(v).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  if (!bookingId) {
    sheet.innerHTML = '<div style="color: #dc2626; text-align: center; padding: 40px; font-weight: 700;">Error: Booking ID parameter missing.</div>';
  } else {
    fetch('api/index.php/admin/bookings/view?booking_id=' + encodeURIComponent(bookingId))
      .then(res => res.json())
      .then(data => {
        if (data.status !== 'success' || !data.booking) {
          sheet.innerHTML = '<div style="color: #dc2626; text-align: center; padding: 40px; font-weight: 700;">Booking record not found.</div>';
          return;
        }

        const b = data.booking;
        const total = parseFloat(b.total_amount || 0);

        // Calculate nights
        const cin = new Date(b.check_in_date);
        const cout = new Date(b.check_out_date);
        const diffDays = Math.max(1, Math.ceil(Math.abs(cout - cin) / (1000 * 60 * 60 * 24)));

        // GST Breakdown (12% Standard Hotel Accommodation SAC 996311)
        // 6% CGST + 6% SGST
        const extraCharge = parseFloat(b.extra_guest_charge || 0);
        const taxableTotal = Math.round((total / 1.12) * 100) / 100;
        const totalGst = Math.round((total - taxableTotal) * 100) / 100;
        const cgst = Math.round((totalGst / 2) * 100) / 100;
        const sgst = Math.round((totalGst - cgst) * 100) / 100;

        const extraTaxable = extraCharge > 0 ? Math.round((extraCharge / 1.12) * 100) / 100 : 0;
        const roomTaxable = Math.max(0, taxableTotal - extraTaxable);
        const roomRatePerNight = Math.round((roomTaxable / diffDays) * 100) / 100;

        const isPaid = (b.payment_status && b.payment_status.toLowerCase() === 'success');
        const formattedDate = new Date(b.created_at || Date.now()).toLocaleDateString('en-IN', {
          day: '2-digit', month: 'short', year: 'numeric'
        });

        const roomName = (b.rooms && b.rooms[0] && b.rooms[0].room_name) || 'Executive Room';
        const roomNumbers = (b.rooms && b.rooms.length > 0)
          ? b.rooms.map(r => r.room_number).filter(Boolean).join(', ')
          : 'Standard Assignment';

        const sourceLabel = b.booking_source || 'Direct Online';
        const inr = (v) => '₹' + Number(v || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const inrWhole = (v) => '₹' + Math.round(Number(v || 0)).toLocaleString('en-IN');

        const logoHtml = LOGO_DATA 
          ? `<img src="${LOGO_DATA}" alt="Subra Residency Logo" class="inv-logo" />`
          : `<div class="inv-logo" style="display:flex;align-items:center;justify-content:center;background:#0a3622;color:#fff;font-weight:900;font-size:24px;">SR</div>`;

        sheet.innerHTML = `
          <!-- Header -->
          <div class="inv-header">
            <div class="inv-brand">
              ${logoHtml}
              <div>
                <h1 class="inv-hotel-title">SUBRA RESIDENCY</h1>
                <div class="inv-legal-entity">RAGUPATHI ANANDHALAKSHMI &bull; PROPRIETORSHIP</div>
                <div class="inv-hotel-address">
                  NO.45-1/1187B2, Lal Bahadur Sastry Road, Thanjavur, Tamil Nadu - 612001<br>
                  Phone: +91 73958 09991 | 73958 09992 &bull; Email: subraresidency@gmail.com
                </div>
                <div class="inv-gstin-tag">
                  GSTIN: <span>33AQQPA7394F2ZN</span> &bull; State: <span>Tamil Nadu (33)</span>
                </div>
              </div>
            </div>
            <div class="inv-header-meta">
              <div class="inv-type-title">TAX INVOICE</div>
              <div class="inv-sub-type">Original for Recipient</div>
              <div class="inv-number-box">
                <div class="inv-num-label">Invoice Reference</div>
                <div class="inv-num-value">SR/2026/INV-${esc(b.id || b.booking_id)}</div>
                <div class="inv-date-text">Date: ${esc(formattedDate)}</div>
              </div>
            </div>
          </div>

          <!-- 2 Column Details Grid -->
          <div class="inv-grid">
            <!-- Left: Guest Details -->
            <div class="inv-grid-col">
              <div class="inv-grid-col-title">
                <span>Billed To (Guest Details)</span>
                <span style="color:var(--slate-400); font-size:9px;">Place of Supply: TN (33)</span>
              </div>
              <div class="inv-guest-name">${esc(b.guest_name || 'Walk-in Guest')}</div>
              <div class="inv-info-row">
                <span class="label">Mobile / Phone:</span>
                <span class="val">${esc(b.guest_phone || '—')}</span>
              </div>
              <div class="inv-info-row">
                <span class="label">Email Address:</span>
                <span class="val">${esc(b.guest_email || '—')}</span>
              </div>
              <div class="inv-info-row">
                <span class="label">Guest Address:</span>
                <span class="val">${esc(b.address || 'Thanjavur, Tamil Nadu')}</span>
              </div>
              <div class="inv-info-row">
                <span class="label">Country / State:</span>
                <span class="val">${esc(b.country || 'India')} / Tamil Nadu</span>
              </div>
            </div>

            <!-- Right: Stay Details -->
            <div class="inv-grid-col">
              <div class="inv-grid-col-title">
                <span>Stay & Reservation Details</span>
                <span class="channel-badge">${esc(sourceLabel)}</span>
              </div>
              <div class="inv-info-row">
                <span class="label">Booking Ref ID:</span>
                <span class="val" style="font-family:monospace; color:var(--primary); font-weight:800;">${esc(b.booking_id)}</span>
              </div>
              <div class="inv-info-row">
                <span class="label">Room Category:</span>
                <span class="val">${esc(roomName)}</span>
              </div>
              <div class="inv-info-row">
                <span class="label">Assigned Room No:</span>
                <span class="val" style="color:var(--primary); font-weight:800;">${esc(roomNumbers)}</span>
              </div>
              <div class="inv-info-row">
                <span class="label">Check-In Arrival:</span>
                <span class="val">${esc(b.check_in_date)} (12:00 PM)</span>
              </div>
              <div class="inv-info-row">
                <span class="label">Check-Out Departure:</span>
                <span class="val">${esc(b.check_out_date)} (11:00 AM)</span>
              </div>
              <div class="inv-info-row">
                <span class="label">Stay Duration & Guests:</span>
                <span class="val">${diffDays} Night(s) &bull; ${esc(b.guests || '1 Guest')}</span>
              </div>
            </div>
          </div>

          <!-- Itemized Table -->
          <div class="inv-table-wrap">
            <table class="inv-table">
              <thead>
                <tr>
                  <th style="width: 36px;" class="tac">#</th>
                  <th>Service Description</th>
                  <th class="tac">HSN / SAC</th>
                  <th class="tac">Qty / Nights</th>
                  <th class="tar">Rate per Night (₹)</th>
                  <th class="tar">Taxable Value (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="tac">1</td>
                  <td>
                    <span class="item-title">${esc(roomName)} Accommodations</span>
                    <span class="item-sub">Room(s): ${esc(roomNumbers)} &bull; ${diffDays} Night(s) Stay</span>
                  </td>
                  <td class="tac"><span class="sac-code">996311</span></td>
                  <td class="tac">${diffDays}</td>
                  <td class="tar">${inr(roomRatePerNight)}</td>
                  <td class="tar">${inr(roomTaxable)}</td>
                </tr>
                ${extraCharge > 0 ? `
                <tr>
                  <td class="tac">2</td>
                  <td>
                    <span class="item-title">Extra Guest / Additional Occupancy Charges</span>
                    <span class="item-sub">Adults: ${b.extra_adults || 0}, Children: ${b.extra_children || 0}</span>
                  </td>
                  <td class="tac"><span class="sac-code">996311</span></td>
                  <td class="tac">1</td>
                  <td class="tar">${inr(extraTaxable)}</td>
                  <td class="tar">${inr(extraTaxable)}</td>
                </tr>
                ` : ''}
              </tbody>
            </table>
          </div>

          <!-- Calculation & Stamp -->
          <div class="inv-calc-section">
            <div>
              <div class="inv-words-box">
                <div class="words-label">Total Amount in Words</div>
                <div class="words-text">${numberToWordsINR(total)}</div>
              </div>

              <div class="inv-stamp-wrap">
                <div class="paid-stamp ${isPaid ? '' : 'pending'}">
                  ${isPaid ? '&#10003; PAID & VERIFIED' : '&#9203; PAYMENT PENDING'}
                </div>
                ${b.transaction_id ? `
                  <div style="font-size: 10px; color: var(--slate-500); font-family: monospace;">
                    Txn Ref: <strong>${esc(b.transaction_id)}</strong>
                  </div>
                ` : ''}
              </div>
            </div>

            <!-- Totals Box -->
            <div class="inv-totals-box">
              <div class="total-row">
                <span>Total Taxable Amount:</span>
                <span style="font-weight:700;">${inr(taxableTotal)}</span>
              </div>
              <div class="total-row tax-split">
                <span>Central GST (CGST @ 6%):</span>
                <span>${inr(cgst)}</span>
              </div>
              <div class="total-row tax-split">
                <span>State GST (SGST @ 6%):</span>
                <span>${inr(sgst)}</span>
              </div>
              <div class="total-row" style="border-top:1px dashed var(--border); margin-top:4px; padding-top:4px;">
                <span>Total Tax (GST 12%):</span>
                <span style="font-weight:700; color:var(--primary);">${inr(totalGst)}</span>
              </div>
              <div class="total-row grand-total">
                <span>Invoice Total:</span>
                <span class="val">${inrWhole(total)}</span>
              </div>
            </div>
          </div>

          <!-- Bottom: Terms & Signature -->
          <div class="inv-bottom-section">
            <div class="terms-box">
              <div class="terms-title">Terms & Conditions &bull; GST Hospitality Compliance</div>
              <ol>
                <li>Goods & Services Tax (GST) applied under SAC Code 996311 as per Govt. of India regulations.</li>
                <li>Check-out time is strictly 11:00 AM. Late check-out is subject to room availability and tariffs.</li>
                <li>The registration certificate is prominently displayed at the principal place of business.</li>
                <li>All disputes are subject to the exclusive jurisdiction of Thanjavur Courts.</li>
              </ol>
            </div>

            <div class="signatory-box">
              <div class="signatory-company">For SUBRA RESIDENCY</div>
              <div class="signatory-space">Ragupathi Anandhalakshmi</div>
              <div class="signatory-line">Authorized Signatory</div>
            </div>
          </div>

          <!-- Footer -->
          <div class="inv-footer">
            This is a system generated GST Tax Invoice &bull; Subra Residency &bull; Lal Bahadur Sastry Road, Thanjavur
          </div>
        `;

        if (params.get('print') === '1') {
          setTimeout(() => { window.print(); }, 400);
        }
      })
      .catch(err => {
        console.error(err);
        sheet.innerHTML = '<div style="color: #dc2626; text-align: center; padding: 40px; font-weight: 700;">Error retrieving booking voucher.</div>';
      });
  }
</script>

</body>
</html>
