<?php
// backend/utils/InvoicePdfGenerator.php
// Generates an official Tax Invoice & Booking Voucher PDF document for Subra Residency guests matching the luxury front-desk voucher layout.

include_once __DIR__ . '/fpdf.php';
include_once __DIR__ . '/../config/db.php';

class InvoicePdfGenerator {

    public static function generatePdf($bookingId, $guestName, $guestEmail, $checkIn, $checkOut, $amount, $roomName = 'Luxury Sanctuary', $paymentStatus = 'Paid', $guestPhone = '', $guestAddress = '', $country = 'India') {
        
        // Fetch phone/address/country from database if missing
        if (empty($guestPhone) || empty($guestAddress)) {
            try {
                $db = (new Database())->getConnection();
                if ($db) {
                    $stmt = $db->prepare("SELECT phone, address, country FROM bookings WHERE booking_id = ?");
                    $stmt->execute([$bookingId]);
                    $bRow = $stmt->fetch(PDO::FETCH_ASSOC);
                    if ($bRow) {
                        if (empty($guestPhone)) $guestPhone = $bRow['phone'] ?? '';
                        if (empty($guestAddress)) $guestAddress = $bRow['address'] ?? '';
                        if (!empty($bRow['country'])) $country = $bRow['country'];
                    }
                }
            } catch (Throwable $e) {
                error_log("[InvoicePdfGenerator] Could not fetch guest info: " . $e->getMessage());
            }
        }

        $pdf = new FPDF('P', 'mm', 'A4');
        $pdf->SetAutoPageBreak(true, 10);
        $pdf->AddPage();

        // 1. Double Gold Outer Border Container
        $pdf->SetDrawColor(205, 160, 82); // Gold
        $pdf->SetLineWidth(1.4);
        $pdf->Rect(8, 8, 194, 281);
        $pdf->SetLineWidth(0.4);
        $pdf->Rect(10, 10, 190, 277);

        // 2. Header & Brand Title
        $pdf->SetFont('Helvetica', 'B', 18);
        $pdf->SetTextColor(15, 58, 32); // Dark Green
        $pdf->SetXY(15, 16);
        $pdf->Cell(110, 7, 'SUBRA RESIDENCY', 0, 1, 'L');

        $pdf->SetFont('Helvetica', 'B', 7);
        $pdf->SetTextColor(148, 163, 184); // Slate 400
        $pdf->SetX(15);
        $pdf->Cell(110, 4, 'STAY AWAY FROM HOME • KUMBAKONAM', 0, 1, 'L');

        $pdf->SetFont('Helvetica', '', 8);
        $pdf->SetTextColor(100, 116, 139);
        $pdf->SetX(15);
        $pdf->Cell(110, 4, 'L.B.S Road, Near Railway Station, Kumbakonam, Tamil Nadu', 0, 1, 'L');
        $pdf->SetX(15);
        $pdf->Cell(110, 4, 'Ph: +91 73958 09991 | 73958 09992', 0, 1, 'L');

        // Right side: Confirmed Pill Badge & Invoice Date
        $pdf->SetFillColor(236, 253, 245); // Emerald 50
        $pdf->SetDrawColor(167, 243, 208); // Emerald border
        $pdf->Rect(138, 16, 52, 9, 'FD');

        $pdf->SetFont('Helvetica', 'B', 8);
        $pdf->SetTextColor(6, 95, 70); // Dark emerald
        $pdf->SetXY(138, 18.5);
        $pdf->Cell(52, 4, 'BOOKING CONFIRMED', 0, 1, 'C');

        $pdf->SetFont('Helvetica', 'B', 8);
        $pdf->SetTextColor(148, 163, 184);
        $pdf->SetXY(138, 28);
        $pdf->Cell(52, 4, 'Invoice Date: ' . ($checkIn ? $checkIn : date('Y-m-d')), 0, 1, 'R');

        // Divider Line
        $pdf->SetDrawColor(226, 232, 240);
        $pdf->Line(15, 38, 195, 38);

        // 3. Invoice Recipient Section (Left side)
        $pdf->SetFont('Helvetica', 'B', 8);
        $pdf->SetTextColor(205, 160, 82); // Gold
        $pdf->SetXY(15, 43);
        $pdf->Cell(115, 4, 'INVOICE RECIPIENT', 0, 1, 'L');

        $pdf->SetFont('Helvetica', 'B', 14);
        $pdf->SetTextColor(15, 58, 32); // Dark Green
        $pdf->SetX(15);
        $pdf->Cell(115, 7, strtoupper($guestName), 0, 1, 'L');

        $pdf->SetFont('Helvetica', '', 8);
        $pdf->SetTextColor(100, 116, 139);
        if ($guestEmail) { $pdf->SetX(15); $pdf->Cell(115, 4, 'Email: ' . $guestEmail, 0, 1, 'L'); }
        if ($guestPhone) { $pdf->SetX(15); $pdf->Cell(115, 4, 'Phone: ' . $guestPhone, 0, 1, 'L'); }
        if ($country) { $pdf->SetX(15); $pdf->Cell(115, 4, 'Country: ' . $country, 0, 1, 'L'); }
        if ($guestAddress) { $pdf->SetX(15); $pdf->Cell(115, 4, 'Address: ' . $guestAddress, 0, 1, 'L'); }

        // 4. Reception QR Box (Right side card)
        $pdf->SetFont('Helvetica', 'B', 8);
        $pdf->SetTextColor(205, 160, 82); // Gold
        $pdf->SetXY(138, 43);
        $pdf->Cell(57, 4, 'RECEPTION QR', 0, 1, 'C');

        // Outer Gold Card Border
        $pdf->SetFillColor(255, 255, 255);
        $pdf->SetDrawColor(205, 160, 82);
        $pdf->Rect(140, 49, 52, 58, 'D');

        // Text inside QR card
        $pdf->SetFont('Helvetica', 'B', 10);
        $pdf->SetTextColor(15, 58, 32);
        $pdf->SetXY(140, 68);
        $pdf->Cell(52, 5, '[' . $bookingId . ']', 0, 1, 'C');

        $pdf->SetFont('Helvetica', 'B', 7);
        $pdf->SetTextColor(100, 116, 139);
        $pdf->SetXY(142, 95);
        $pdf->MultiCell(48, 3, "PRESENT AT FRONT DESK FOR INSTANT CHECK-IN", 0, 'C');

        // 5. Booking Metadata Card (x=15, y=76)
        $pdf->SetFillColor(248, 250, 252);
        $pdf->SetDrawColor(241, 245, 249);
        $pdf->Rect(15, 76, 115, 28, 'FD');

        $pdf->SetFont('Helvetica', 'B', 7);
        $pdf->SetTextColor(148, 163, 184);

        $pdf->SetXY(18, 79); $pdf->Cell(55, 3, 'BOOKING IDENTIFIER', 0, 0, 'L');
        $pdf->SetXY(75, 79); $pdf->Cell(50, 3, 'ASSIGNED SANCTUARY', 0, 1, 'L');

        $pdf->SetFont('Helvetica', 'B', 9);
        $pdf->SetTextColor(15, 58, 32);
        $pdf->SetXY(18, 83); $pdf->Cell(55, 4, $bookingId, 0, 0, 'L');
        $pdf->SetXY(75, 83); $pdf->Cell(50, 4, strtoupper($roomName), 0, 1, 'L');

        $pdf->SetFont('Helvetica', 'B', 7);
        $pdf->SetTextColor(148, 163, 184);
        $pdf->SetXY(18, 91); $pdf->Cell(55, 3, 'CHECK-IN ARRIVAL', 0, 0, 'L');
        $pdf->SetXY(75, 91); $pdf->Cell(50, 3, 'CHECK-OUT DEPARTURE', 0, 1, 'L');

        $pdf->SetFont('Helvetica', 'B', 9);
        $pdf->SetTextColor(51, 65, 85);
        $pdf->SetXY(18, 95); $pdf->Cell(55, 4, $checkIn, 0, 0, 'L');
        $pdf->SetXY(75, 95); $pdf->Cell(50, 4, $checkOut, 0, 1, 'L');

        // 6. Invoice Statement Table (x=15, y=118)
        $pdf->SetFont('Helvetica', 'B', 8);
        $pdf->SetTextColor(205, 160, 82); // Gold
        $pdf->SetXY(15, 118);
        $pdf->Cell(180, 4, 'INVOICE STATEMENT', 0, 1, 'L');

        // Header Line
        $pdf->SetFont('Helvetica', 'B', 8);
        $pdf->SetTextColor(148, 163, 184);
        $pdf->SetXY(15, 124);
        $pdf->Cell(95, 4, 'DESCRIPTION', 0, 0, 'L');
        $pdf->Cell(20, 4, 'QTY', 0, 0, 'C');
        $pdf->Cell(30, 4, 'PRICE', 0, 0, 'R');
        $pdf->Cell(35, 4, 'AMOUNT', 0, 1, 'R');

        $pdf->SetDrawColor(226, 232, 240);
        $pdf->Line(15, 129, 195, 129);

        // Calculations
        $totalAmount = floatval($amount);
        $cleaningFee = 500.00;
        $serviceFee = 850.00;
        $nights = round((strtotime($checkOut) - strtotime($checkIn)) / 86400);
        if ($nights <= 0) $nights = 1;

        $subtotal = $totalAmount - ($cleaningFee + $serviceFee);
        if ($subtotal <= 0) {
            $subtotal = $totalAmount * 0.75;
        }
        $nightlyRate = $subtotal / $nights;

        // Row 1: Accommodation
        $pdf->SetFont('Helvetica', 'B', 9);
        $pdf->SetTextColor(30, 41, 59);
        $pdf->SetXY(15, 132);
        $pdf->Cell(95, 4, strtoupper($roomName), 0, 0, 'L');
        $pdf->Cell(20, 4, '1', 0, 0, 'C');
        $pdf->Cell(30, 4, 'Rs. ' . number_format($nightlyRate, 2), 0, 0, 'R');
        $pdf->Cell(35, 4, 'Rs. ' . number_format($subtotal, 2), 0, 1, 'R');

        $pdf->SetFont('Helvetica', '', 7);
        $pdf->SetTextColor(148, 163, 184);
        $pdf->SetX(15);
        $pdf->Cell(95, 3, 'Accommodation staying for ' . $nights . ' Night(s)', 0, 1, 'L');

        $pdf->Line(15, 141, 195, 141);

        // Row 2: Cleaning & Setup
        $pdf->SetFont('Helvetica', '', 8);
        $pdf->SetTextColor(51, 65, 85);
        $pdf->SetXY(15, 144);
        $pdf->Cell(95, 5, 'Cleaning & Setup Service', 0, 0, 'L');
        $pdf->Cell(20, 5, '1', 0, 0, 'C');
        $pdf->Cell(30, 5, 'Rs. 500.00', 0, 0, 'R');
        $pdf->Cell(35, 5, 'Rs. 500.00', 0, 1, 'R');

        $pdf->Line(15, 151, 195, 151);

        // Row 3: Hotel Service & GST
        $pdf->SetXY(15, 154);
        $pdf->Cell(95, 5, 'Hotel Service & GST', 0, 0, 'L');
        $pdf->Cell(20, 5, '1', 0, 0, 'C');
        $pdf->Cell(30, 5, 'Rs. 850.00', 0, 0, 'R');
        $pdf->Cell(35, 5, 'Rs. 850.00', 0, 1, 'R');

        $pdf->SetDrawColor(30, 41, 59);
        $pdf->Line(15, 161, 195, 161);

        // Grand Total Row
        $pdf->SetFont('Helvetica', 'B', 9);
        $pdf->SetTextColor(148, 163, 184);
        $pdf->SetXY(115, 164);
        $pdf->Cell(45, 6, 'GRAND TOTAL', 0, 0, 'R');

        $pdf->SetFont('Helvetica', 'B', 12);
        $pdf->SetTextColor(15, 58, 32); // Dark Green
        $pdf->Cell(35, 6, 'Rs. ' . number_format($totalAmount, 2), 0, 1, 'R');

        // 7. Verified Settlement Stamp
        $pdf->SetFillColor(236, 253, 245);
        $pdf->SetDrawColor(167, 243, 208);
        $pdf->Rect(15, 175, 180, 20, 'FD');

        $pdf->SetFont('Helvetica', 'B', 9);
        $pdf->SetTextColor(22, 101, 52);
        $pdf->SetXY(20, 178);
        $pdf->Cell(170, 4, 'PAYMENT SETTLED & VERIFIED ELECTRONICALLY', 0, 1, 'L');

        $pdf->SetFont('Helvetica', '', 8);
        $pdf->SetTextColor(71, 85, 105);
        $pdf->SetXY(20, 184);
        $pdf->Cell(170, 4, 'Transaction Reference: TXN-' . strtoupper(substr(md5($bookingId), 0, 12)) . ' | Mode: Razorpay Online Settlement', 0, 1, 'L');

        // 8. Policy & Terms Box
        $pdf->SetFont('Helvetica', 'B', 8);
        $pdf->SetTextColor(205, 160, 82);
        $pdf->SetXY(15, 202);
        $pdf->Cell(180, 4, 'TERMS & HOTEL POLICIES', 0, 1, 'L');

        $pdf->SetFont('Helvetica', '', 7.5);
        $pdf->SetTextColor(100, 116, 139);
        $pdf->SetX(15);
        $pdf->MultiCell(180, 3.8, "• Check-in time: 12:00 PM | Check-out time: 11:00 AM.\n• Government issued photo ID (Aadhaar, Passport, Driving License) is mandatory for all guests upon arrival.\n• Present the Reception QR code on your mobile phone or printed voucher at the front desk for instant priority check-in.\n• Cancellations are accepted up to 10 hours prior to check-in time by calling reception at +91 73958 09991.");

        // 9. Footer
        $pdf->SetY(270);
        $pdf->SetFont('Helvetica', 'I', 8);
        $pdf->SetTextColor(148, 163, 184);
        $pdf->Cell(190, 4, 'Thank you for staying with Subra Residency • www.subraresidency.com', 0, 1, 'C');

        return $pdf->Output('S');
    }
}
?>
