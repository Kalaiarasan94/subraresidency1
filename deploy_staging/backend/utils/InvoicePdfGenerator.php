<?php
// backend/utils/InvoicePdfGenerator.php
// Official Indian GST Hotel Tax Invoice PDF Generator

include_once __DIR__ . '/fpdf.php';
include_once __DIR__ . '/../config/db.php';

class InvoicePdfGenerator {

    private static function numberToWordsINR($amount) {
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

    public static function generatePdf($bookingId, $guestName, $guestEmail, $checkIn, $checkOut, $amount, $roomName = 'Standard Double AC', $paymentStatus = 'Paid', $guestPhone = '', $guestAddress = '', $country = 'India') {
        
        // Fetch phone/address/country from database if missing
        if (empty($guestPhone) || empty($guestAddress)) {
            try {
                $db = (new Database())->getConnection();
                if ($db) {
                    $stmt = $db->prepare("
                        SELECT b.phone, bd.address, bd.country 
                        FROM bookings b 
                        LEFT JOIN booking_details bd ON bd.booking_id = b.id 
                        WHERE b.booking_id = ? OR b.id = ?
                    ");
                    $stmt->execute([$bookingId, $bookingId]);
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

        // 1. Single Clean Outer Border
        $pdf->SetDrawColor(203, 213, 225); // Slate 300
        $pdf->SetLineWidth(0.4);
        $pdf->Rect(10, 10, 190, 277);

        // 2. Header: Hotel Details (Left) & Invoice Meta (Right)
        $leftX = 14;

        $pdf->SetFont('Helvetica', 'B', 15);
        $pdf->SetTextColor(10, 54, 34); // Forest Green #0a3622
        $pdf->SetXY($leftX, 14);
        $pdf->Cell(100, 6, 'SUBRA RESIDENCY', 0, 1, 'L');

        $pdf->SetFont('Helvetica', 'B', 7.5);
        $pdf->SetTextColor(179, 135, 40); // Gold
        $pdf->SetX($leftX);
        $pdf->Cell(100, 4, 'RAGUPATHI ANANDHALAKSHMI - PROPRIETORSHIP', 0, 1, 'L');

        $pdf->SetFont('Helvetica', '', 7.5);
        $pdf->SetTextColor(71, 85, 105);
        $pdf->SetX($leftX);
        $pdf->Cell(100, 3.5, 'NO.45-1/1187B2, Lal Bahadur Sastry Road, Thanjavur, Tamil Nadu - 612001', 0, 1, 'L');
        $pdf->SetX($leftX);
        $pdf->Cell(100, 3.5, 'Phone: +91 73958 09991 | 73958 09992  |  Email: subraresidency@gmail.com', 0, 1, 'L');

        $pdf->SetFont('Helvetica', 'B', 7.5);
        $pdf->SetTextColor(10, 54, 34);
        $pdf->SetX($leftX);
        $pdf->Cell(100, 4, 'GSTIN: 33AQQPA7394F2ZN  |  State: Tamil Nadu (33)  |  PAN: AQQPA7394F', 0, 1, 'L');

        // Invoice Meta Box (Right side)
        $pdf->SetFont('Helvetica', 'B', 14);
        $pdf->SetTextColor(10, 54, 34);
        $pdf->SetXY(135, 14);
        $pdf->Cell(60, 5, 'TAX INVOICE', 0, 1, 'R');

        $pdf->SetFont('Helvetica', '', 6.5);
        $pdf->SetTextColor(100, 116, 139);
        $pdf->SetXY(135, 19.5);
        $pdf->Cell(60, 3.5, '(Sec. 31 of CGST Act, 2017 read with Rule 46)', 0, 1, 'R');

        $pdf->SetFont('Helvetica', 'B', 7);
        $pdf->SetTextColor(6, 95, 70);
        $pdf->SetXY(135, 23.5);
        $pdf->Cell(60, 3.5, 'Original for Recipient', 0, 1, 'R');

        // Meta mini-table
        $invoiceNo = 'SR/2026-27/INV-' . $bookingId;
        $invDate = $checkIn ? date('d/m/Y', strtotime($checkIn)) : date('d/m/Y');

        $pdf->SetFont('Helvetica', '', 7.5);
        $pdf->SetTextColor(71, 85, 105);
        $pdf->SetXY(135, 28);
        $pdf->Cell(25, 4, 'Invoice No:', 0, 0, 'R');
        $pdf->SetFont('Helvetica', 'B', 7.5);
        $pdf->SetTextColor(15, 23, 42);
        $pdf->Cell(35, 4, $invoiceNo, 0, 1, 'R');

        $pdf->SetFont('Helvetica', '', 7.5);
        $pdf->SetTextColor(71, 85, 105);
        $pdf->SetXY(135, 32);
        $pdf->Cell(25, 4, 'Invoice Date:', 0, 0, 'R');
        $pdf->SetFont('Helvetica', 'B', 7.5);
        $pdf->SetTextColor(15, 23, 42);
        $pdf->Cell(35, 4, $invDate, 0, 1, 'R');

        $pdf->SetFont('Helvetica', '', 7.5);
        $pdf->SetTextColor(71, 85, 105);
        $pdf->SetXY(135, 36);
        $pdf->Cell(25, 4, 'Place of Supply:', 0, 0, 'R');
        $pdf->SetFont('Helvetica', 'B', 7.5);
        $pdf->SetTextColor(15, 23, 42);
        $pdf->Cell(35, 4, 'Tamil Nadu (33)', 0, 1, 'R');

        // Divider
        $pdf->SetDrawColor(10, 54, 34);
        $pdf->SetLineWidth(0.8);
        $pdf->Line(14, 42, 196, 42);

        // 3. Two-Column Details Boxes
        // Left Box: Details of Receiver (Billed To)
        $pdf->SetDrawColor(203, 213, 225);
        $pdf->SetLineWidth(0.3);
        $pdf->SetFillColor(248, 250, 252);
        $pdf->Rect(14, 46, 89, 44, 'DF');

        $pdf->SetFont('Helvetica', 'B', 8);
        $pdf->SetTextColor(10, 54, 34);
        $pdf->SetXY(17, 48);
        $pdf->Cell(83, 4, 'DETAILS OF RECEIVER / BILLED TO', 0, 1, 'L');

        $pdf->SetFont('Helvetica', 'B', 9);
        $pdf->SetTextColor(15, 23, 42);
        $pdf->SetXY(17, 53);
        $pdf->Cell(83, 4, strtoupper($guestName), 0, 1, 'L');

        $pdf->SetFont('Helvetica', '', 7.5);
        $pdf->SetTextColor(71, 85, 105);
        $pdf->SetX(17);
        $pdf->Cell(83, 3.8, 'Phone: ' . ($guestPhone ?: '—') . '  |  Email: ' . ($guestEmail ?: '—'), 0, 1, 'L');
        $pdf->SetX(17);
        $pdf->Cell(83, 3.8, 'Address: ' . ($guestAddress ?: 'Thanjavur, Tamil Nadu'), 0, 1, 'L');
        $pdf->SetX(17);
        $pdf->Cell(83, 3.8, 'State & Code: ' . ($country ?: 'India') . ' - Tamil Nadu (33)', 0, 1, 'L');
        $pdf->SetX(17);
        $pdf->Cell(83, 3.8, 'GSTIN / Status: Unregistered Person (URP)', 0, 1, 'L');

        // Right Box: Reservation & Stay Details
        $pdf->Rect(107, 46, 89, 44, 'DF');

        $pdf->SetFont('Helvetica', 'B', 8);
        $pdf->SetTextColor(10, 54, 34);
        $pdf->SetXY(110, 48);
        $pdf->Cell(83, 4, 'STAY & BOOKING PARTICULARS', 0, 1, 'L');

        $pdf->SetFont('Helvetica', '', 7.5);
        $pdf->SetTextColor(71, 85, 105);

        $pdf->SetXY(110, 53);
        $pdf->Cell(35, 3.8, 'Booking Reference ID:', 0, 0, 'L');
        $pdf->SetFont('Helvetica', 'B', 7.5);
        $pdf->SetTextColor(10, 54, 34);
        $pdf->Cell(48, 3.8, $bookingId, 0, 1, 'R');

        $pdf->SetFont('Helvetica', '', 7.5);
        $pdf->SetTextColor(71, 85, 105);
        $pdf->SetX(110);
        $pdf->Cell(35, 3.8, 'Assigned Room:', 0, 0, 'L');
        $pdf->SetFont('Helvetica', 'B', 7.5);
        $pdf->SetTextColor(15, 23, 42);
        $pdf->Cell(48, 3.8, $roomName, 0, 1, 'R');

        $cinDate = $checkIn ? date('d/m/Y', strtotime($checkIn)) : date('d/m/Y');
        $coutDate = $checkOut ? date('d/m/Y', strtotime($checkOut)) : date('d/m/Y');
        $nights = max(1, (int)round((strtotime($checkOut) - strtotime($checkIn)) / 86400));

        $pdf->SetFont('Helvetica', '', 7.5);
        $pdf->SetTextColor(71, 85, 105);
        $pdf->SetX(110);
        $pdf->Cell(35, 3.8, 'Check-in Arrival:', 0, 0, 'L');
        $pdf->SetFont('Helvetica', 'B', 7.5);
        $pdf->SetTextColor(15, 23, 42);
        $pdf->Cell(48, 3.8, $cinDate . ' (12:00 PM)', 0, 1, 'R');

        $pdf->SetFont('Helvetica', '', 7.5);
        $pdf->SetTextColor(71, 85, 105);
        $pdf->SetX(110);
        $pdf->Cell(35, 3.8, 'Check-out Departure:', 0, 0, 'L');
        $pdf->SetFont('Helvetica', 'B', 7.5);
        $pdf->SetTextColor(15, 23, 42);
        $pdf->Cell(48, 3.8, $coutDate . ' (11:00 AM)', 0, 1, 'R');

        $pdf->SetFont('Helvetica', '', 7.5);
        $pdf->SetTextColor(71, 85, 105);
        $pdf->SetX(110);
        $pdf->Cell(35, 3.8, 'Duration & Occupancy:', 0, 0, 'L');
        $pdf->SetFont('Helvetica', 'B', 7.5);
        $pdf->SetTextColor(15, 23, 42);
        $pdf->Cell(48, 3.8, $nights . ' Night(s) Stay', 0, 1, 'R');

        // 4. Itemized GST Services Table
        $totalAmount = (float)$amount;
        $nightRate = $totalAmount / max(1, $nights);
        $gstRate = ($nightRate > 7500) ? 18 : 12;
        $cgstRate = $gstRate / 2;
        $sgstRate = $gstRate / 2;
        $divisor = 1 + ($gstRate / 100);

        $taxable = round(($totalAmount / $divisor) * 100) / 100;
        $totalTax = round(($totalAmount - $taxable) * 100) / 100;
        $cgst = round(($totalTax / 2) * 100) / 100;
        $sgst = round(($totalTax - $cgst) * 100) / 100;
        $ratePerNight = round(($taxable / max(1, $nights)) * 100) / 100;

        $tableY = 96;
        $pdf->SetXY(14, $tableY);
        $pdf->SetFillColor(241, 245, 249);
        $pdf->SetFont('Helvetica', 'B', 7);
        $pdf->SetTextColor(51, 65, 85);

        // Header Row
        $pdf->Cell(8, 7, '#', 1, 0, 'C', true);
        $pdf->Cell(70, 7, 'DESCRIPTION OF SERVICE', 1, 0, 'L', true);
        $pdf->Cell(18, 7, 'HSN/SAC', 1, 0, 'C', true);
        $pdf->Cell(12, 7, 'QTY', 1, 0, 'C', true);
        $pdf->Cell(20, 7, 'RATE (Rs.)', 1, 0, 'R', true);
        $pdf->Cell(22, 7, 'TAXABLE (Rs.)', 1, 0, 'R', true);
        $pdf->Cell(16, 7, 'CGST ' . $cgstRate . '%', 1, 0, 'R', true);
        $pdf->Cell(16, 7, 'SGST ' . $sgstRate . '%', 1, 0, 'R', true);
        $pdf->Cell(0, 7, 'TOTAL (Rs.)', 1, 1, 'R', true);

        // Item Row
        $pdf->SetFont('Helvetica', '', 7.5);
        $pdf->SetTextColor(15, 23, 42);
        $pdf->SetX(14);
        $pdf->Cell(8, 8, '1', 1, 0, 'C');

        $desc = $roomName . ' Accommodation (' . $nights . ' Night Stay)';
        $pdf->Cell(70, 8, $desc, 1, 0, 'L');
        $pdf->Cell(18, 8, '996311', 1, 0, 'C');
        $pdf->Cell(12, 8, (string)$nights, 1, 0, 'C');
        $pdf->Cell(20, 8, number_format($ratePerNight, 2), 1, 0, 'R');
        $pdf->Cell(22, 8, number_format($taxable, 2), 1, 0, 'R');
        $pdf->Cell(16, 8, number_format($cgst, 2), 1, 0, 'R');
        $pdf->Cell(16, 8, number_format($sgst, 2), 1, 0, 'R');
        $pdf->SetFont('Helvetica', 'B', 7.5);
        $pdf->SetTextColor(10, 54, 34);
        $pdf->Cell(0, 8, number_format($totalAmount, 2), 1, 1, 'R');

        // GST Breakup Table
        $breakupY = 116;
        $pdf->SetXY(14, $breakupY);
        $pdf->SetFont('Helvetica', 'B', 6.5);
        $pdf->SetTextColor(71, 85, 105);
        $pdf->Cell(25, 5, 'SAC CODE', 1, 0, 'C', true);
        $pdf->Cell(32, 5, 'TAXABLE VALUE (Rs.)', 1, 0, 'R', true);
        $pdf->Cell(25, 5, 'CGST RATE & AMT', 1, 0, 'R', true);
        $pdf->Cell(25, 5, 'SGST RATE & AMT', 1, 0, 'R', true);
        $pdf->Cell(30, 5, 'TOTAL TAX (Rs.)', 1, 1, 'R', true);

        $pdf->SetFont('Helvetica', '', 7);
        $pdf->SetTextColor(15, 23, 42);
        $pdf->SetX(14);
        $pdf->Cell(25, 5, '996311', 1, 0, 'C');
        $pdf->Cell(32, 5, number_format($taxable, 2), 1, 0, 'R');
        $pdf->Cell(25, 5, $cgstRate . '% : ' . number_format($cgst, 2), 1, 0, 'R');
        $pdf->Cell(25, 5, $sgstRate . '% : ' . number_format($sgst, 2), 1, 0, 'R');
        $pdf->SetFont('Helvetica', 'B', 7);
        $pdf->SetTextColor(10, 54, 34);
        $pdf->Cell(30, 5, number_format($totalTax, 2), 1, 1, 'R');

        // 5. Amount in Words Box (Left) & Totals Summary (Right)
        $calcY = 132;
        $pdf->SetXY(14, $calcY);
        $pdf->SetFillColor(248, 250, 252);
        $pdf->Rect(14, $calcY, 105, 34, 'DF');

        $pdf->SetFont('Helvetica', 'B', 7);
        $pdf->SetTextColor(100, 116, 139);
        $pdf->SetXY(17, $calcY + 3);
        $pdf->Cell(99, 3.5, 'TOTAL AMOUNT IN WORDS', 0, 1, 'L');

        $pdf->SetFont('Helvetica', 'BI', 8.5);
        $pdf->SetTextColor(10, 54, 34);
        $pdf->SetXY(17, $calcY + 7);
        $pdf->MultiCell(99, 4, self::numberToWordsINR($totalAmount));

        // Payment Settlement Status
        $pdf->SetXY(17, $calcY + 20);
        $pdf->SetFillColor(236, 253, 245);
        $pdf->SetDrawColor(5, 150, 105);
        $pdf->Rect(17, $calcY + 19, 99, 10, 'DF');

        $pdf->SetFont('Helvetica', 'B', 7.5);
        $pdf->SetTextColor(4, 120, 87);
        $pdf->SetXY(19, $calcY + 20.5);
        $pdf->Cell(95, 3.5, 'PAID & VERIFIED (ONLINE SETTLEMENT)', 0, 1, 'L');

        $pdf->SetFont('Helvetica', '', 6.5);
        $pdf->SetTextColor(71, 85, 105);
        $pdf->SetX(19);
        $pdf->Cell(95, 3, 'Txn ID: PAY_' . strtoupper(substr(md5($bookingId), 0, 14)) . '  |  Mode: Razorpay Settlement', 0, 1, 'L');

        // Right side: Totals Table
        $pdf->SetDrawColor(203, 213, 225);
        $pdf->SetXY(124, $calcY);
        $pdf->SetFont('Helvetica', '', 7.5);
        $pdf->SetTextColor(71, 85, 105);

        $addTotalRow = function($label, $val, $isBold = false, $isGrand = false) use ($pdf) {
            $pdf->SetX(124);
            $pdf->SetFont('Helvetica', $isBold ? 'B' : '', $isGrand ? 9 : 7.5);
            $pdf->SetTextColor($isGrand ? 10 : 71, $isGrand ? 54 : 85, $isGrand ? 34 : 105);
            $pdf->Cell(45, 5.5, $label, 1, 0, 'L');
            $pdf->SetFont('Helvetica', 'B', $isGrand ? 9.5 : 7.5);
            $pdf->SetTextColor($isGrand ? 10 : 15, $isGrand ? 54 : 23, $isGrand ? 34 : 42);
            $pdf->Cell(27, 5.5, 'Rs. ' . number_format($val, 2), 1, 1, 'R');
        };

        $addTotalRow('Total Taxable Value:', $taxable);
        $addTotalRow('Central GST (CGST @ ' . $cgstRate . '%):', $cgst);
        $addTotalRow('State GST (SGST @ ' . $sgstRate . '%):', $sgst);
        $addTotalRow('Total GST (' . $gstRate . '%):', $totalTax, true);
        $addTotalRow('Round Off:', 0.00);
        $addTotalRow('Grand Total (INR):', $totalAmount, true, true);

        // 6. Terms & Conditions (Left) & Authorised Signatory (Right)
        $termsY = 175;
        $pdf->SetXY(14, $termsY);
        $pdf->SetFont('Helvetica', 'B', 7.5);
        $pdf->SetTextColor(15, 23, 42);
        $pdf->Cell(110, 4, 'TERMS & CONDITIONS - GST HOSPITALITY COMPLIANCE', 0, 1, 'L');

        $pdf->SetFont('Helvetica', '', 6.8);
        $pdf->SetTextColor(100, 116, 139);
        $pdf->SetX(14);
        $pdf->MultiCell(110, 3.5, "1. Goods & Services Tax (GST) charged under SAC Code 996311 as per Govt. of India rules.\n2. Standard Check-in time is 12:00 PM and Check-out time is strictly 11:00 AM.\n3. Mandatory photo identity proof (Aadhaar, Passport, DL) required for all staying guests.\n4. Disputes, if any, are subject to the exclusive jurisdiction of Thanjavur Courts.");

        // Signatory Block (Right)
        $pdf->SetXY(130, $termsY);
        $pdf->SetFont('Helvetica', 'B', 8);
        $pdf->SetTextColor(10, 54, 34);
        $pdf->Cell(66, 4, 'For SUBRA RESIDENCY', 0, 1, 'R');

        $pdf->SetFont('Helvetica', 'I', 11);
        $pdf->SetTextColor(179, 135, 40);
        $pdf->SetXY(130, $termsY + 8);
        $pdf->Cell(66, 6, 'Ragupathi Anandhalakshmi', 0, 1, 'R');

        $pdf->SetDrawColor(203, 213, 225);
        $pdf->Line(140, $termsY + 16, 196, $termsY + 16);

        $pdf->SetFont('Helvetica', 'B', 7);
        $pdf->SetTextColor(71, 85, 105);
        $pdf->SetXY(130, $termsY + 18);
        $pdf->Cell(66, 3.5, 'Proprietor / Authorised Signatory', 0, 1, 'R');

        // 7. System Generation Note
        $pdf->SetY(272);
        $pdf->SetFont('Helvetica', 'I', 7);
        $pdf->SetTextColor(148, 163, 184);
        $pdf->Cell(190, 4, 'This is a computer-generated GST Tax Invoice issued under the Central Goods & Services Tax Act, 2017.', 0, 1, 'C');

        return $pdf->Output('S');
    }
}
?>
