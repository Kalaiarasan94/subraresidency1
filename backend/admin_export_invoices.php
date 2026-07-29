<?php
// backend/admin_export_invoices.php
$env = @parse_ini_file(__DIR__ . '/.env');
$appUrl = rtrim(($env['APP_URL'] ?? 'http://localhost/subraresidency1'), '/');

include_once __DIR__ . '/config/db.php';
$db = (new Database())->getConnection();

// Fetch all bookings except pending
$stmt = $db->prepare("
    SELECT b.*, bd.guests, bd.country, bd.address, bd.additional_notes, p.transaction_id, p.amount as paid_amount 
    FROM bookings b 
    LEFT JOIN booking_details bd ON bd.booking_id = b.id 
    LEFT JOIN payments p ON p.booking_id = b.id AND p.status = 'success'
    WHERE b.status != 'pending' 
    ORDER BY b.created_at DESC
");
$stmt->execute();
$bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Attach room info to each booking
$roomStmt = $db->prepare("SELECT r.* FROM booking_rooms br JOIN rooms_new r ON r.id = br.room_id WHERE br.booking_id = ?");
foreach ($bookings as &$b) {
    $roomStmt->execute([$b['id']]);
    $b['rooms'] = $roomStmt->fetchAll(PDO::FETCH_ASSOC);
}

$ICONS = [
    'mail' => '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="m22 7-10 5L2 7"></path></svg>',
    'phone' => '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>',
    'globe' => '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M2 12h20"></path><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>',
    'pin' => '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>',
    'check' => '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><path d="m22 4-10 10-3-3"></path></svg>',
    'checkSmall' => '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><path d="m22 4-10 10-3-3"></path></svg>',
    'clock' => '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>'
];
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Subra Residency - Master Invoices Export</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@700;800;900&display=swap" rel="stylesheet">
  <style>
    :root {
      --green: #0f3a20;
      --gold: #cda052;
      --text-dark: #1e293b;
      --text-muted: #64748b;
      --slate-400: #94a3b8;
      --slate-500: #64748b;
      --slate-700: #334155;
      --slate-800: #1e293b;
      --bg-slate: #f8fafc;
      --border-light: #f1f5f9;
      --border-gray: #e2e8f0;
      --emerald-50: #ecfdf5;
      --emerald-100: #d1fae5;
      --emerald-600: #059669;
      --emerald-700: #047857;
      --emerald-800: #065f46;
      --amber-50: #fffbeb;
      --amber-100: #fef3c7;
      --amber-600: #d97706;
      --amber-700: #b45309;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Outfit', sans-serif;
      background-color: #f1f5f9;
      color: var(--text-dark);
      padding: 40px 20px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .container { max-width: 850px; margin: 0 auto; }

    /* Actions Bar */
    .actions-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: white;
      padding: 16px 32px;
      border-radius: 20px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.05);
      margin-bottom: 24px;
    }

    .actions-title {
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: var(--text-muted);
    }

    .btn-print {
      background: var(--green);
      color: white;
      border: none;
      padding: 12px 28px;
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      border-radius: 12px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s ease;
      box-shadow: 0 4px 12px rgba(11, 58, 36, 0.2);
    }

    .btn-print:hover {
      background: #061c12;
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(11, 58, 36, 0.3);
    }

    /* Invoice Page */
    .page {
      background: white;
      border-radius: 28px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.08);
      border: 8px double var(--gold);
      padding: 48px;
      position: relative;
      margin-bottom: 40px;
      page-break-after: always;
      break-after: page;
    }

    /* Header */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 24px;
      padding-bottom: 28px;
      border-bottom: 1px solid rgba(205, 160, 82, 0.2);
      flex-wrap: wrap;
    }

    .hotel-name {
      font-family: 'Playfair Display', serif;
      font-size: 26px;
      font-weight: 900;
      letter-spacing: 0.06em;
      color: var(--green);
    }

    .hotel-tagline {
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.25em;
      color: var(--slate-400);
      margin-top: 6px;
    }

    .hotel-address {
      font-size: 11px;
      font-weight: 600;
      color: var(--slate-500);
      line-height: 1.6;
      margin-top: 8px;
    }

    .header-right { text-align: right; }

    .status-icon {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: var(--emerald-50);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: auto;
      box-shadow: 0 4px 12px rgba(0,0,0,0.06);
    }

    .status-icon.pending { background: var(--amber-50); }

    .status-pill {
      display: inline-block;
      margin-top: 10px;
      font-size: 10px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      padding: 6px 16px;
      border-radius: 999px;
      background: var(--emerald-100);
      color: var(--emerald-800);
    }

    .status-pill.pending { background: var(--amber-100); color: var(--amber-700); }

    .invoice-date {
      font-size: 11px;
      font-weight: 700;
      color: var(--slate-400);
      margin-top: 8px;
    }

    /* Main layout */
    .main-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 40px;
      margin-top: 32px;
    }

    .col-right {
      border-left: 1px solid rgba(205, 160, 82, 0.2);
      padding-left: 32px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 24px;
    }

    .label-gold {
      font-size: 10px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.25em;
      color: var(--gold);
      margin-bottom: 10px;
    }

    /* Invoice recipient */
    .guest-name {
      font-family: 'Playfair Display', serif;
      font-size: 20px;
      font-weight: 800;
      color: var(--green);
      margin-bottom: 10px;
    }

    .guest-meta {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px 16px;
      font-size: 12px;
      font-weight: 600;
      color: var(--slate-500);
    }

    .guest-meta div { display: flex; align-items: center; gap: 8px; }
    .guest-meta svg { flex-shrink: 0; color: var(--slate-400); }

    /* Booking meta card */
    .meta-card {
      background: rgba(248, 250, 252, 0.8);
      border: 1px solid var(--border-light);
      border-radius: 16px;
      padding: 22px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 18px 24px;
      margin: 28px 0;
    }

    .meta-card label {
      display: block;
      font-size: 9px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: var(--slate-400);
      margin-bottom: 3px;
    }

    .meta-card span {
      font-size: 13px;
      font-weight: 800;
      color: var(--green);
    }

    .meta-card span.plain { color: var(--slate-700); font-weight: 700; }

    /* Table */
    .bill-table { width: 100%; border-collapse: collapse; font-size: 12px; }

    .bill-table th {
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--slate-400);
      padding-bottom: 10px;
      border-bottom: 1px solid var(--border-gray);
      text-align: left;
    }

    .bill-table th:nth-child(2) { text-align: center; }
    .bill-table th:nth-child(3), .bill-table th:nth-child(4) { text-align: right; }

    .bill-table td {
      padding: 14px 0;
      border-bottom: 1px solid var(--border-light);
      font-weight: 600;
      color: #475569;
    }

    .bill-table td:nth-child(2) { text-align: center; font-weight: 800; color: var(--slate-800); }
    .bill-table td:nth-child(3), .bill-table td:nth-child(4) { text-align: right; font-weight: 800; color: var(--slate-800); }

    .bill-table .desc-main { font-weight: 800; text-transform: uppercase; color: var(--slate-800); display: block; }
    .bill-table .desc-sub { font-size: 10px; font-weight: 600; color: var(--slate-400); display: block; margin-top: 2px; }

    .bill-table .total-label {
      text-align: right;
      font-weight: 800;
      text-transform: uppercase;
      font-size: 10px;
      color: var(--slate-400);
      border-bottom: none;
    }

    .bill-table .total-amount {
      text-align: right;
      font-weight: 900;
      font-size: 16px;
      color: var(--green);
      border-bottom: none;
    }

    /* Reception QR */
    .qr-wrap { text-align: center; }

    .qr-box {
      display: inline-block;
      position: relative;
      background: white;
      border: 1px solid rgba(205, 160, 82, 0.2);
      border-radius: 16px;
      padding: 16px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.06);
      margin-top: 6px;
    }

    .qr-box img { width: 150px; height: 150px; display: block; }

    .qr-corner {
      position: absolute;
      width: 22px;
      height: 22px;
      border-color: var(--gold);
    }
    .qr-corner.tl { top: 4px; left: 4px; border-top: 2px solid; border-left: 2px solid; }
    .qr-corner.tr { top: 4px; right: 4px; border-top: 2px solid; border-right: 2px solid; }
    .qr-corner.bl { bottom: 4px; left: 4px; border-bottom: 2px solid; border-left: 2px solid; }
    .qr-corner.br { bottom: 4px; right: 4px; border-bottom: 2px solid; border-right: 2px solid; }

    .qr-caption {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--slate-500);
      line-height: 1.6;
      max-width: 190px;
      margin: 14px auto 0;
    }

    /* Paid stamp */
    .stamp {
      border: 2px dashed rgba(16, 185, 129, 0.3);
      background: rgba(236, 253, 245, 0.5);
      border-radius: 14px;
      padding: 16px;
      text-align: center;
      transform: rotate(-3deg);
    }

    .stamp.pending { border-color: rgba(217, 119, 6, 0.35); background: rgba(255, 251, 235, 0.6); }

    .stamp-label {
      font-size: 9px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: var(--emerald-600);
    }

    .stamp.pending .stamp-label { color: var(--amber-600); }

    .stamp-value {
      font-family: 'Playfair Display', serif;
      font-size: 18px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--emerald-700);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      margin-top: 2px;
    }

    .stamp.pending .stamp-value { color: var(--amber-700); }

    .stamp-txn {
      font-size: 8px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--slate-400);
      margin-top: 4px;
    }

    /* Footer */
    .footer {
      margin-top: 32px;
      padding-top: 20px;
      border-top: 1px solid var(--border-light);
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 8px;
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--slate-400);
    }

    @media (max-width: 700px) {
      .main-grid { grid-template-columns: 1fr; }
      .col-right { border-left: none; padding-left: 0; border-top: 1px solid rgba(205, 160, 82, 0.2); padding-top: 24px; }
      .guest-meta { grid-template-columns: 1fr; }
      .meta-card { grid-template-columns: 1fr; }
      .header { flex-direction: column; }
      .header-right { text-align: left; }
      .status-icon { margin-left: 0; }
    }

    /* Print Styles */
    @media print {
      body { background: white; padding: 0; }
      .actions-bar { display: none; }
      .page {
        box-shadow: none;
        border: 8px double var(--gold);
        margin: 0;
        padding: 40px;
        page-break-after: always;
        break-after: page;
      }
    }
  </style>
</head>
<body>

<div class="container">
  <!-- Actions Bar -->
  <div class="actions-bar">
    <div class="actions-title">Master Folio Invoice Exporter (<?php echo count($bookings); ?> Registrations)</div>
    <button class="btn-print" onclick="window.print()">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V2h12v7"></path><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
      Print All Invoices
    </button>
  </div>

  <?php if (count($bookings) === 0): ?>
    <div style="background:white; padding:40px; border-radius:20px; text-align:center; font-weight:bold; color:var(--text-muted)">
      No active registrations available for invoice export.
    </div>
  <?php else: ?>
    <?php foreach ($bookings as $b): 
      $checkinDate = new DateTime($b['check_in_date']);
      $checkoutDate = new DateTime($b['check_out_date']);
      $nights = max(1, $checkoutDate->diff($checkinDate)->days);

      $total = (float)($b['total_amount'] ?? 0);
      $roomCost = round(($total / 1.18) * 100) / 100;
      $tax = round(($total - $roomCost) * 100) / 100;
      $basePricePerNight = round(($roomCost / $nights) * 100) / 100;

      $roomCategory = count($b['rooms']) > 0 ? $b['rooms'][0]['room_name'] : 'Luxury Sanctuary';
      $roomNumber = count($b['rooms']) > 0 ? $b['rooms'][0]['room_number'] : null;
      $sanctuaryLabel = $roomCategory . ($roomNumber ? ' (Room ' . $roomNumber . ')' : '');
      $isPaid = isset($b['payment_status']) && strtolower($b['payment_status']) === 'success';

      $invoiceDate = (new DateTime($b['created_at'] ?? 'now'))->format('Y-m-d');
      $systemTimestamp = (new DateTime($b['created_at'] ?? 'now'))->format('d/m/Y h:i A');

      $confirmUrl = $appUrl . '/checkin-confirm/' . urlencode($b['booking_id']);
      $qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' . urlencode($confirmUrl);
    ?>
      <div class="page">
        <div class="header">
          <div>
            <div class="hotel-name">Subra Residency</div>
            <div class="hotel-tagline">Stay Away From Home &bull; Kumbakonam</div>
            <div class="hotel-address">
              L.B.S Road, Near Railway Station, Kumbakonam, Tamil Nadu<br>
              Ph: +91 73958 09991 | 73958 09992
            </div>
          </div>
          <div class="header-right">
            <div class="status-icon <?php echo $isPaid ? '' : 'pending'; ?>" style="color: <?php echo $isPaid ? '#059669' : '#d97706'; ?>;">
              <?php echo $isPaid ? $ICONS['check'] : $ICONS['clock']; ?>
            </div>
            <span class="status-pill <?php echo $isPaid ? '' : 'pending'; ?>"><?php echo $isPaid ? 'Booking Confirmed' : 'Payment Pending'; ?></span>
            <div class="invoice-date">Invoice Date: <?php echo htmlspecialchars($invoiceDate); ?></div>
          </div>
        </div>

        <div class="main-grid">
          <div class="col-left">
            <div class="label-gold">Invoice Recipient</div>
            <div class="guest-name"><?php echo htmlspecialchars($b['guest_name'] ?? '—'); ?></div>
            <div class="guest-meta">
              <div><?php echo $ICONS['mail']; ?> <?php echo htmlspecialchars($b['guest_email'] ?? '—'); ?></div>
              <div><?php echo $ICONS['phone']; ?> <?php echo htmlspecialchars($b['guest_phone'] ?? '—'); ?></div>
              <div><?php echo $ICONS['globe']; ?> <?php echo htmlspecialchars($b['country'] ?? '—'); ?></div>
              <div><?php echo $ICONS['pin']; ?> <?php echo htmlspecialchars($b['address'] ?? '—'); ?></div>
            </div>

            <div class="meta-card">
              <div>
                <label>Booking Identifier</label>
                <span><?php echo htmlspecialchars($b['booking_id']); ?></span>
              </div>
              <div>
                <label>Assigned Sanctuary</label>
                <span><?php echo htmlspecialchars($sanctuaryLabel); ?></span>
              </div>
              <div>
                <label>Check-in Arrival</label>
                <span class="plain"><?php echo htmlspecialchars($b['check_in_date']); ?></span>
              </div>
              <div>
                <label>Check-out Departure</label>
                <span class="plain"><?php echo htmlspecialchars($b['check_out_date']); ?></span>
              </div>
            </div>

            <div class="label-gold">Invoice Statement</div>
            <table class="bill-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <span class="desc-main"><?php echo htmlspecialchars($roomCategory); ?></span>
                    <span class="desc-sub">Accommodation staying for <?php echo $nights; ?> Night(s)</span>
                  </td>
                  <td>1</td>
                  <td>₹<?php echo number_format($basePricePerNight, 2); ?></td>
                  <td>₹<?php echo number_format($roomCost, 2); ?></td>
                </tr>
                <tr>
                  <td>
                    <span class="desc-main" style="text-transform:none;">Goods &amp; Services Tax (GST)</span>
                    <span class="desc-sub">18% Standard Hospitality Levy</span>
                  </td>
                  <td>1</td>
                  <td>₹<?php echo number_format($tax, 2); ?></td>
                  <td>₹<?php echo number_format($tax, 2); ?></td>
                </tr>
                <tr>
                  <td colspan="2"></td>
                  <td class="total-label">Grand Total</td>
                  <td class="total-amount">₹<?php echo number_format($total, 2); ?></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="col-right">
            <div class="qr-wrap">
              <div class="label-gold">Reception QR</div>
              <div class="qr-box">
                <span class="qr-corner tl"></span>
                <span class="qr-corner tr"></span>
                <span class="qr-corner bl"></span>
                <span class="qr-corner br"></span>
                <img src="<?php echo $qrUrl; ?>" alt="QR">
              </div>
              <p class="qr-caption">Scan to confirm receptionist self check-in details.</p>
            </div>

            <div class="stamp <?php echo $isPaid ? '' : 'pending'; ?>">
              <div class="stamp-label">Secure Payment Status</div>
              <div class="stamp-value"><?php echo $isPaid ? $ICONS['checkSmall'] : ''; ?> <?php echo $isPaid ? 'Paid' : 'Pending'; ?></div>
              <?php if (!empty($b['transaction_id'])): ?>
                <div class="stamp-txn">Txn ID: <?php echo htmlspecialchars($b['transaction_id']); ?></div>
              <?php endif; ?>
            </div>
          </div>
        </div>

        <div class="footer">
          <span>Authorized Subra Residency Digital Invoice</span>
          <span>System Timestamp: <?php echo htmlspecialchars($systemTimestamp); ?></span>
        </div>
      </div>
    <?php endforeach; ?>
  <?php endif; ?>
</div>

<script>
  window.onload = function() {
    setTimeout(function() {
      window.print();
    }, 1000);
  };
</script>
</body>
</html>
