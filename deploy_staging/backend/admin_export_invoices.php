<?php
// backend/admin_export_invoices.php
// Official GST Tax Invoice Generator - Corporate Standard

$env = @parse_ini_file(__DIR__ . '/.env');
$appUrl = rtrim(($env['APP_URL'] ?? 'http://localhost/subraresidency1'), '/');

$logoPath = __DIR__ . '/assets/logo.png';
$logoBase64 = file_exists($logoPath) ? 'data:image/png;base64,' . base64_encode(file_get_contents($logoPath)) : '';

include_once __DIR__ . '/config/db.php';
$db = (new Database())->getConnection();

// Check if a specific booking is requested
$filterBookingId = $_GET['booking_id'] ?? '';

if (!empty($filterBookingId)) {
    $stmt = $db->prepare("
        SELECT b.*, bd.guests, bd.country, bd.address, bd.additional_notes, p.transaction_id, p.amount as paid_amount, p.payment_method 
        FROM bookings b 
        LEFT JOIN booking_details bd ON bd.booking_id = b.id 
        LEFT JOIN payments p ON p.booking_id = b.id AND p.status = 'success'
        WHERE b.booking_id = ? OR b.id = ?
        ORDER BY b.created_at DESC
    ");
    $stmt->execute([$filterBookingId, $filterBookingId]);
} else {
    $stmt = $db->prepare("
        SELECT b.*, bd.guests, bd.country, bd.address, bd.additional_notes, p.transaction_id, p.amount as paid_amount, p.payment_method 
        FROM bookings b 
        LEFT JOIN booking_details bd ON bd.booking_id = b.id 
        LEFT JOIN payments p ON p.booking_id = b.id AND p.status = 'success'
        WHERE b.status != 'pending' 
        ORDER BY b.created_at DESC
    ");
    $stmt->execute();
}
$bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Attach room info to each booking
$roomStmt = $db->prepare("SELECT r.* FROM booking_rooms br JOIN rooms_new r ON r.id = br.room_id WHERE br.booking_id = ?");
foreach ($bookings as &$b) {
    $roomStmt->execute([$b['id']]);
    $b['rooms'] = $roomStmt->fetchAll(PDO::FETCH_ASSOC);
}

function numberToWordsINR($amount) {
    $num = (int)round($amount);
    if ($num <= 0) return 'Zero Rupees Only';

    $ones = [
        0 => '', 1 => 'One', 2 => 'Two', 3 => 'Three', 4 => 'Four', 5 => 'Five', 6 => 'Six', 7 => 'Seven', 8 => 'Eight', 9 => 'Nine',
        10 => 'Ten', 11 => 'Eleven', 12 => 'Twelve', 13 => 'Thirteen', 14 => 'Fourteen', 15 => 'Fifteen', 16 => 'Sixteen', 17 => 'Seventeen', 18 => 'Eighteen', 19 => 'Nineteen'
    ];
    $tens = [
        2 => 'Twenty', 3 => 'Thirty', 4 => 'Forty', 5 => 'Fifty', 6 => 'Sixty', 7 => 'Seventy', 8 => 'Eighty', 9 => 'Ninety'
    ];

    $convertBelowThousand = function($n) use ($ones, $tens) {
        $str = '';
        if ($n >= 100) {
            $h = (int)($n / 100);
            $str .= $ones[$h] . ' Hundred ';
            $n %= 100;
        }
        if ($n >= 20) {
            $t = (int)($n / 10);
            $o = $n % 10;
            $str .= $tens[$t] . ($o ? ' ' . $ones[$o] : '') . ' ';
        } elseif ($n > 0) {
            $str .= $ones[$n] . ' ';
        }
        return trim($str);
    };

    $crores = (int)($num / 10000000);
    $num %= 10000000;
    $lakhs = (int)($num / 100000);
    $num %= 100000;
    $thousands = (int)($num / 1000);
    $remainder = $num % 1000;

    $res = '';
    if ($crores > 0) {
        $res .= $convertBelowThousand($crores) . ' Crore ';
    }
    if ($lakhs > 0) {
        $res .= $convertBelowThousand($lakhs) . ' Lakh ';
    }
    if ($thousands > 0) {
        $res .= $convertBelowThousand($thousands) . ' Thousand ';
    }
    if ($remainder > 0) {
        $res .= $convertBelowThousand($remainder);
    }
    return 'Indian Rupees ' . trim($res) . ' Only';
}

function esc($str) {
    return htmlspecialchars($str ?? '', ENT_QUOTES, 'UTF-8');
}
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Subra Residency - Official GST Tax Invoice</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800;900&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #0a3622;
      --primary-dark: #062316;
      --gold: #b38728;
      --slate-900: #0f172a;
      --slate-700: #334155;
      --slate-600: #475569;
      --slate-500: #64748b;
      --slate-400: #94a3b8;
      --slate-100: #f1f5f9;
      --slate-50: #f8fafc;
      --border: #cbd5e1;
      --border-light: #e2e8f0;
      --emerald-600: #059669;
      --emerald-50: #ecfdf5;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #f1f5f9;
      color: var(--slate-900);
      padding: 30px 16px;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      line-height: 1.4;
    }

    .container {
      max-width: 860px;
      margin: 0 auto;
    }

    /* Actions Bar */
    .actions-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: white;
      padding: 14px 24px;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.06);
      margin-bottom: 24px;
      border: 1px solid var(--border-light);
    }

    .actions-title {
      font-size: 13px;
      font-weight: 700;
      color: var(--slate-700);
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .btn-print {
      background: var(--primary);
      color: white;
      border: none;
      padding: 10px 22px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      border-radius: 8px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s ease;
    }

    .btn-print:hover {
      background: var(--primary-dark);
    }

    /* Official Invoice Sheet */
    .invoice-card {
      background: white;
      border: 1.5px solid var(--border);
      border-radius: 4px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
      padding: 36px 40px;
      position: relative;
      margin-bottom: 32px;
      page-break-after: always;
      break-after: page;
    }

    /* Top Header */
    .inv-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 20px;
      padding-bottom: 18px;
      border-bottom: 2px solid var(--primary);
    }

    .inv-hotel-block {
      display: flex;
      gap: 16px;
      align-items: flex-start;
    }

    .inv-logo {
      width: 64px;
      height: 64px;
      object-fit: contain;
      border-radius: 8px;
      border: 1px solid var(--border-light);
      padding: 3px;
      background: #fff;
    }

    .inv-hotel-title {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 22px;
      font-weight: 900;
      color: var(--primary);
      letter-spacing: 0.04em;
      line-height: 1.2;
    }

    .inv-proprietor {
      font-size: 10px;
      font-weight: 800;
      color: var(--gold);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-top: 2px;
    }

    .inv-address {
      font-size: 10.5px;
      color: var(--slate-600);
      line-height: 1.5;
      margin-top: 4px;
    }

    .inv-tax-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 6px;
      font-size: 10.5px;
      font-weight: 700;
    }

    .inv-tax-chip {
      background: var(--slate-50);
      border: 1px solid var(--border);
      padding: 2px 8px;
      border-radius: 4px;
      color: var(--slate-700);
    }

    .inv-tax-chip strong {
      color: var(--primary);
      font-family: monospace;
    }

    /* Invoice Meta Box (Right) */
    .inv-meta-right {
      text-align: right;
      min-width: 240px;
    }

    .inv-title-main {
      font-size: 18px;
      font-weight: 900;
      color: var(--primary);
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .inv-title-sub {
      font-size: 9px;
      font-weight: 700;
      color: var(--slate-500);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-top: 1px;
    }

    .inv-copy-badge {
      display: inline-block;
      font-size: 9px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      background: #ecfdf5;
      color: #065f46;
      border: 1px solid #a7f3d0;
      padding: 2px 8px;
      border-radius: 4px;
      margin-top: 4px;
    }

    .inv-meta-table {
      margin-top: 8px;
      width: 100%;
      border-collapse: collapse;
      font-size: 10.5px;
    }

    .inv-meta-table td {
      padding: 2px 0;
    }

    .inv-meta-table .label {
      color: var(--slate-500);
      font-weight: 600;
      text-align: left;
    }

    .inv-meta-table .val {
      font-weight: 700;
      color: var(--slate-900);
      text-align: right;
      font-family: monospace;
    }

    /* 2 Column Details Box */
    .inv-details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-top: 16px;
    }

    .details-box {
      border: 1px solid var(--border);
      border-radius: 4px;
      overflow: hidden;
      background: #fff;
    }

    .details-box-header {
      background: var(--slate-100);
      padding: 6px 12px;
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--primary);
      border-bottom: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .details-box-body {
      padding: 10px 12px;
      font-size: 11px;
    }

    .guest-title {
      font-size: 13px;
      font-weight: 800;
      color: var(--primary);
      margin-bottom: 4px;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 4px;
      line-height: 1.4;
    }

    .detail-row .lbl {
      color: var(--slate-500);
      font-weight: 600;
      font-size: 10.5px;
    }

    .detail-row .val {
      color: var(--slate-900);
      font-weight: 700;
      text-align: right;
      font-size: 10.5px;
    }

    /* Itemized GST Table */
    .inv-table-wrap {
      margin-top: 16px;
    }

    .inv-table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid var(--border);
      font-size: 11px;
    }

    .inv-table th {
      background: var(--slate-100);
      color: var(--slate-700);
      font-size: 9.5px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      padding: 8px 10px;
      border: 1px solid var(--border);
      text-align: left;
    }

    .inv-table th.tac, .inv-table td.tac { text-align: center; }
    .inv-table th.tar, .inv-table td.tar { text-align: right; }

    .inv-table td {
      padding: 9px 10px;
      border: 1px solid var(--border);
      color: var(--slate-800);
      vertical-align: middle;
    }

    .sac-badge {
      font-family: monospace;
      font-weight: 700;
      color: var(--slate-700);
      background: var(--slate-50);
      padding: 2px 6px;
      border-radius: 4px;
      border: 1px solid var(--border-light);
    }

    .item-name {
      font-weight: 700;
      color: var(--primary);
      display: block;
    }

    .item-sub {
      font-size: 10px;
      color: var(--slate-500);
      margin-top: 2px;
      display: block;
    }

    /* Summary & Calculation Layout */
    .inv-calc-grid {
      display: grid;
      grid-template-columns: 1.15fr 0.85fr;
      gap: 16px;
      margin-top: 14px;
    }

    .words-box {
      border: 1px solid var(--border);
      border-radius: 4px;
      padding: 10px 12px;
      background: var(--slate-50);
      height: fit-content;
    }

    .words-lbl {
      font-size: 9px;
      font-weight: 800;
      text-transform: uppercase;
      color: var(--slate-500);
      letter-spacing: 0.08em;
      margin-bottom: 3px;
    }

    .words-val {
      font-size: 11.5px;
      font-weight: 700;
      color: var(--primary);
      font-style: italic;
      line-height: 1.4;
    }

    .payment-badge-wrap {
      margin-top: 10px;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 12px;
      background: #fff;
      border: 1px solid var(--border);
      border-radius: 4px;
    }

    .paid-stamp {
      font-size: 11px;
      font-weight: 900;
      letter-spacing: 0.08em;
      color: #047857;
      background: #ecfdf5;
      border: 1.5px solid #059669;
      padding: 3px 10px;
      border-radius: 4px;
      text-transform: uppercase;
    }

    .paid-stamp.pending {
      color: #b45309;
      background: #fffbeb;
      border-color: #d97706;
    }

    .totals-table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid var(--border);
      font-size: 11px;
    }

    .totals-table td {
      padding: 6px 10px;
      border-bottom: 1px solid var(--border-light);
    }

    .totals-table .lbl {
      color: var(--slate-600);
      font-weight: 600;
    }

    .totals-table .val {
      text-align: right;
      font-weight: 700;
      font-family: monospace;
      color: var(--slate-900);
    }

    .totals-table .grand-row {
      background: var(--slate-100);
      border-top: 2px solid var(--primary);
    }

    .totals-table .grand-row td {
      padding: 9px 10px;
      font-size: 12px;
      font-weight: 900;
      color: var(--primary);
    }

    .totals-table .grand-row .val {
      font-size: 14px;
      color: var(--primary);
    }

    /* GST Breakup Table */
    .gst-breakup-table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid var(--border);
      font-size: 10px;
      margin-top: 14px;
    }

    .gst-breakup-table th {
      background: var(--slate-100);
      color: var(--slate-600);
      padding: 5px 8px;
      border: 1px solid var(--border);
      font-weight: 800;
      text-transform: uppercase;
    }

    .gst-breakup-table td {
      padding: 5px 8px;
      border: 1px solid var(--border);
      text-align: right;
      font-family: monospace;
      font-weight: 600;
    }

    .gst-breakup-table td.tac { text-align: center; }

    /* Bottom: Terms & Authorized Signatory */
    .inv-bottom {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 20px;
      margin-top: 18px;
      padding-top: 14px;
      border-top: 1px solid var(--border);
    }

    .terms-box {
      font-size: 9.5px;
      color: var(--slate-600);
      line-height: 1.5;
    }

    .terms-title {
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--slate-900);
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

    .sign-for {
      font-size: 10.5px;
      font-weight: 800;
      text-transform: uppercase;
      color: var(--slate-900);
    }

    .sign-space {
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Playfair Display', serif;
      font-style: italic;
      color: var(--gold);
      font-size: 15px;
      font-weight: 700;
    }

    .sign-line {
      width: 170px;
      border-top: 1px solid var(--border);
      padding-top: 4px;
      font-size: 9.5px;
      font-weight: 700;
      color: var(--slate-500);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .inv-footer-note {
      margin-top: 16px;
      text-align: center;
      font-size: 9px;
      color: var(--slate-400);
      font-weight: 600;
      letter-spacing: 0.04em;
    }

    /* Print Formatting */
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
        border: 1px solid #cbd5e1 !important;
        box-shadow: none !important;
        margin: 0 0 20mm 0 !important;
        padding: 24px 28px !important;
        border-radius: 0 !important;
      }
      @page {
        size: A4 portrait;
        margin: 8mm;
      }
    }
  </style>
</head>
<body>

<div class="container">
  <!-- Top Bar -->
  <div class="actions-bar">
    <div>
      <div class="actions-title">Official GST Tax Invoice Folio &bull; Subra Residency</div>
      <div style="font-size: 11px; color: var(--slate-500); margin-top: 2px;">
        Total Records: <?php echo count($bookings); ?> &bull; GSTIN: 33AQQPA7394F2ZN
      </div>
    </div>
    <div style="display: flex; gap: 10px;">
      <button class="btn-print" onclick="window.print()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V2h12v7"></path><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
        Print / Save PDF
      </button>
    </div>
  </div>

  <?php if (count($bookings) === 0): ?>
    <div style="background:white; padding:48px; border-radius:12px; text-align:center; font-weight:700; color:var(--slate-500); border: 1px solid var(--border);">
      No confirmed registration records available for invoice export.
    </div>
  <?php else: ?>
    <?php foreach ($bookings as $b): 
      $checkinDate = new DateTime($b['check_in_date']);
      $checkoutDate = new DateTime($b['check_out_date']);
      $nights = max(1, $checkoutDate->diff($checkinDate)->days);

      $total = (float)($b['total_amount'] ?? 0);

      // Determine GST rate (Hospitality SAC 996311):
      // If room tariff per night <= 7500 -> 12% GST (6% CGST + 6% SGST). If > 7500 -> 18% GST (9% CGST + 9% SGST).
      $tentativeNightRate = $total / max(1, $nights);
      $gstPercent = ($tentativeNightRate > 7500) ? 18 : 12;
      $cgstPercent = $gstPercent / 2;
      $sgstPercent = $gstPercent / 2;
      $divisor = 1 + ($gstPercent / 100);

      $taxableValue = round(($total / $divisor) * 100) / 100;
      $totalTax = round(($total - $taxableValue) * 100) / 100;
      $cgstAmount = round(($totalTax / 2) * 100) / 100;
      $sgstAmount = round(($totalTax - $cgstAmount) * 100) / 100;
      $ratePerNight = round(($taxableValue / max(1, $nights)) * 100) / 100;

      $roomCategory = count($b['rooms']) > 0 ? $b['rooms'][0]['room_name'] : 'Deluxe Executive Room';
      $roomNumber = count($b['rooms']) > 0 ? $b['rooms'][0]['room_number'] : null;
      $roomLabel = $roomCategory . ($roomNumber ? ' (Room ' . $roomNumber . ')' : '');
      $isPaid = isset($b['payment_status']) && strtolower($b['payment_status']) === 'success';

      $invoiceNo = 'SR/2026-27/INV-' . ($b['id'] ?? $b['booking_id']);
      $invoiceDate = (new DateTime($b['created_at'] ?? 'now'))->format('d/m/Y');
      $checkinFormatted = (new DateTime($b['check_in_date']))->format('d/m/Y');
      $checkoutFormatted = (new DateTime($b['check_out_date']))->format('d/m/Y');

      $amountWords = numberToWordsINR($total);
      $inr = function($val) {
        return '₹' . number_format((float)$val, 2, '.', ',');
      };
    ?>
      <div class="invoice-card">
        <!-- Header -->
        <div class="inv-header">
          <div class="inv-hotel-block">
            <?php if (!empty($logoBase64)): ?>
              <img src="<?php echo $logoBase64; ?>" alt="Subra Residency" class="inv-logo">
            <?php endif; ?>
            <div>
              <h1 class="inv-hotel-title">SUBRA RESIDENCY</h1>
              <div class="inv-proprietor">RAGUPATHI ANANDHALAKSHMI &bull; PROPRIETORSHIP</div>
              <div class="inv-address">
                NO.45-1/1187B2, Lal Bahadur Sastry Road, Thanjavur, Tamil Nadu - 612001<br>
                Phone: +91 73958 09991 | 73958 09992 &bull; Email: subraresidency@gmail.com
              </div>
              <div class="inv-tax-chips">
                <span class="inv-tax-chip">GSTIN: <strong>33AQQPA7394F2ZN</strong></span>
                <span class="inv-tax-chip">State: <strong>Tamil Nadu (Code: 33)</strong></span>
                <span class="inv-tax-chip">PAN: <strong>AQQPA7394F</strong></span>
              </div>
            </div>
          </div>

          <div class="inv-meta-right">
            <div class="inv-title-main">TAX INVOICE</div>
            <div class="inv-title-sub">Section 31 of CGST Act, 2017</div>
            <div class="inv-copy-badge">Original for Recipient</div>
            
            <table class="inv-meta-table">
              <tr>
                <td class="label">Invoice No:</td>
                <td class="val"><?php echo esc($invoiceNo); ?></td>
              </tr>
              <tr>
                <td class="label">Invoice Date:</td>
                <td class="val"><?php echo esc($invoiceDate); ?></td>
              </tr>
              <tr>
                <td class="label">Booking Ref:</td>
                <td class="val" style="color:var(--primary);"><?php echo esc($b['booking_id']); ?></td>
              </tr>
              <tr>
                <td class="label">Place of Supply:</td>
                <td class="val">Tamil Nadu (33)</td>
              </tr>
              <tr>
                <td class="label">Reverse Charge:</td>
                <td class="val">No</td>
              </tr>
            </table>
          </div>
        </div>

        <!-- 2 Column Details: Guest (Billed To) & Reservation -->
        <div class="inv-details-grid">
          <!-- Billed To -->
          <div class="details-box">
            <div class="details-box-header">
              <span>Details of Receiver / Billed To</span>
              <span style="font-size:9px; color:var(--slate-500); font-weight:600;">URP (Unregistered)</span>
            </div>
            <div class="details-box-body">
              <div class="guest-title"><?php echo esc($b['guest_name'] ?? 'Walk-in Guest'); ?></div>
              <div class="detail-row">
                <span class="lbl">Phone / Mobile:</span>
                <span class="val"><?php echo esc($b['guest_phone'] ?? '—'); ?></span>
              </div>
              <div class="detail-row">
                <span class="lbl">Email Address:</span>
                <span class="val"><?php echo esc($b['guest_email'] ?? '—'); ?></span>
              </div>
              <div class="detail-row">
                <span class="lbl">Billing Address:</span>
                <span class="val" style="max-width:200px;"><?php echo esc($b['address'] ?? 'Thanjavur, Tamil Nadu'); ?></span>
              </div>
              <div class="detail-row">
                <span class="lbl">State & Code:</span>
                <span class="val"><?php echo esc($b['country'] ?? 'India'); ?> &bull; Tamil Nadu (33)</span>
              </div>
              <div class="detail-row">
                <span class="lbl">GSTIN / UIN:</span>
                <span class="val" style="color:var(--slate-500);">Unregistered Person (URP)</span>
              </div>
            </div>
          </div>

          <!-- Stay Details -->
          <div class="details-box">
            <div class="details-box-header">
              <span>Stay & Booking Particulars</span>
              <span style="font-size:9px; color:var(--primary); font-weight:700;">Confirmed</span>
            </div>
            <div class="details-box-body">
              <div class="detail-row">
                <span class="lbl">Room Category:</span>
                <span class="val" style="color:var(--primary); font-weight:800;"><?php echo esc($roomCategory); ?></span>
              </div>
              <div class="detail-row">
                <span class="lbl">Assigned Room No:</span>
                <span class="val" style="color:var(--primary);"><?php echo esc($roomNumber ? ('Room ' . $roomNumber) : 'Assigned Suite'); ?></span>
              </div>
              <div class="detail-row">
                <span class="lbl">Check-In Arrival:</span>
                <span class="val"><?php echo esc($checkinFormatted); ?> (12:00 PM)</span>
              </div>
              <div class="detail-row">
                <span class="lbl">Check-Out Departure:</span>
                <span class="val"><?php echo esc($checkoutFormatted); ?> (11:00 AM)</span>
              </div>
              <div class="detail-row">
                <span class="lbl">Stay Duration:</span>
                <span class="val"><?php echo $nights; ?> Night(s)</span>
              </div>
              <div class="detail-row">
                <span class="lbl">Guests Registered:</span>
                <span class="val"><?php echo esc($b['guests'] ?? '1 Guest'); ?></span>
              </div>
            </div>
          </div>
        </div>

        <!-- Itemized GST Services Table -->
        <div class="inv-table-wrap">
          <table class="inv-table">
            <thead>
              <tr>
                <th style="width: 32px;" class="tac">#</th>
                <th>Description of Services</th>
                <th class="tac" style="width: 75px;">HSN / SAC</th>
                <th class="tac" style="width: 55px;">Qty</th>
                <th class="tar" style="width: 95px;">Rate / Night</th>
                <th class="tar" style="width: 105px;">Taxable Value</th>
                <th class="tar" style="width: 85px;">CGST (<?php echo $cgstPercent; ?>%)</th>
                <th class="tar" style="width: 85px;">SGST (<?php echo $sgstPercent; ?>%)</th>
                <th class="tar" style="width: 110px;">Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="tac">1</td>
                <td>
                  <span class="item-name"><?php echo esc($roomCategory); ?> Accommodation</span>
                  <span class="item-sub">Stay for <?php echo $nights; ?> Night(s) &bull; <?php echo esc($roomLabel); ?></span>
                </td>
                <td class="tac"><span class="sac-badge">996311</span></td>
                <td class="tac"><?php echo $nights; ?></td>
                <td class="tar"><?php echo $inr($ratePerNight); ?></td>
                <td class="tar"><?php echo $inr($taxableValue); ?></td>
                <td class="tar"><?php echo $inr($cgstAmount); ?></td>
                <td class="tar"><?php echo $inr($sgstAmount); ?></td>
                <td class="tar" style="font-weight: 800; color: var(--primary);"><?php echo $inr($total); ?></td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- GST Breakup & HSN Summary -->
        <table class="gst-breakup-table">
          <thead>
            <tr>
              <th class="tac">SAC Code</th>
              <th>Taxable Value (₹)</th>
              <th>CGST Rate</th>
              <th>CGST Amount (₹)</th>
              <th>SGST Rate</th>
              <th>SGST Amount (₹)</th>
              <th>Total Tax (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="tac">996311</td>
              <td><?php echo number_format($taxableValue, 2); ?></td>
              <td><?php echo $cgstPercent; ?>%</td>
              <td><?php echo number_format($cgstAmount, 2); ?></td>
              <td><?php echo $sgstPercent; ?>%</td>
              <td><?php echo number_format($sgstAmount, 2); ?></td>
              <td style="color:var(--primary); font-weight:800;"><?php echo number_format($totalTax, 2); ?></td>
            </tr>
          </tbody>
        </table>

        <!-- Calculations & Payment Summary Grid -->
        <div class="inv-calc-grid">
          <div>
            <div class="words-box">
              <div class="words-lbl">Invoice Amount in Words</div>
              <div class="words-val"><?php echo esc($amountWords); ?></div>
            </div>

            <div class="payment-badge-wrap">
              <span class="paid-stamp <?php echo $isPaid ? '' : 'pending'; ?>">
                <?php echo $isPaid ? '&#10003; PAID & VERIFIED' : 'PAYMENT PENDING'; ?>
              </span>
              <div style="font-size: 10.5px; color: var(--slate-600); line-height: 1.4;">
                Payment Mode: <strong><?php echo esc($b['payment_method'] ?? 'Online / Razorpay'); ?></strong><br>
                <?php if (!empty($b['transaction_id'])): ?>
                  Txn ID: <strong style="font-family:monospace;"><?php echo esc($b['transaction_id']); ?></strong>
                <?php endif; ?>
              </div>
            </div>
          </div>

          <!-- Totals Column -->
          <div>
            <table class="totals-table">
              <tr>
                <td class="lbl">Taxable Amount:</td>
                <td class="val"><?php echo $inr($taxableValue); ?></td>
              </tr>
              <tr>
                <td class="lbl">Central GST (CGST @ <?php echo $cgstPercent; ?>%):</td>
                <td class="val"><?php echo $inr($cgstAmount); ?></td>
              </tr>
              <tr>
                <td class="lbl">State GST (SGST @ <?php echo $sgstPercent; ?>%):</td>
                <td class="val"><?php echo $inr($sgstAmount); ?></td>
              </tr>
              <tr>
                <td class="lbl">Total GST (<?php echo $gstPercent; ?>%):</td>
                <td class="val" style="color:var(--primary);"><?php echo $inr($totalTax); ?></td>
              </tr>
              <tr>
                <td class="lbl">Round Off:</td>
                <td class="val">₹0.00</td>
              </tr>
              <tr class="grand-row">
                <td>Grand Total (INR):</td>
                <td class="val"><?php echo $inr($total); ?></td>
              </tr>
            </table>
          </div>
        </div>

        <!-- Terms & Authorized Signatory -->
        <div class="inv-bottom">
          <div class="terms-box">
            <div class="terms-title">Terms & Conditions &bull; GST Hospitality Compliance</div>
            <ol>
              <li>Tax is levied under HSN/SAC Code 996311 (Hotel Accommodation Services) as per Govt. of India notifications.</li>
              <li>Standard hotel check-in time is 12:00 PM and check-out time is strictly 11:00 AM.</li>
              <li>Valid Government issued photo identity proof is mandatory for all guests at check-in.</li>
              <li>Disputes, if any, are subject to the exclusive jurisdiction of courts in Thanjavur, Tamil Nadu.</li>
            </ol>
          </div>

          <div class="signatory-box">
            <div class="sign-for">For SUBRA RESIDENCY</div>
            <div class="sign-space">Ragupathi Anandhalakshmi</div>
            <div class="sign-line">Authorised Signatory / Proprietor</div>
          </div>
        </div>

        <div class="inv-footer-note">
          This is a computer-generated Tax Invoice issued under the Central Goods and Services Tax Act, 2017.
        </div>
      </div>
    <?php endforeach; ?>
  <?php endif; ?>
</div>

<script>
  // Auto-print if print query param passed
  if (new URLSearchParams(location.search).get('print') === '1') {
    window.onload = function() {
      setTimeout(function() { window.print(); }, 400);
    };
  }
</script>
</body>
</html>
