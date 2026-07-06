<?php
// backend/utils/Mailer.php

class Mailer {
    private static function getEnvVars() {
        // Updated to handle both .env formats
        return @parse_ini_file(__DIR__ . '/../.env');
    }

    public static function sendBookingConfirmation($toEmail, $toName, $bookingId, $checkIn, $checkOut, $amount, $roomName = 'Luxury Sanctuary') {
        $env = self::getEnvVars();
        $apiKey = $env['BREVO_API_KEY'] ?? '';
        $senderEmail = $env['BREVO_SENDER_EMAIL'] ?? 'af6402001@smtp-brevo.com';
        $senderName = $env['BREVO_SENDER_NAME'] ?? 'Subra Residency';

        if (empty($apiKey)) {
            error_log("[Mailer] Brevo API Key is missing in .env");
            return false;
        }

        // Calculate nights
        $nights = round((strtotime($checkOut) - strtotime($checkIn)) / 86400);
        if ($nights <= 0) $nights = 1;

        // Pricing breakdown
        $subtotal = $amount - 1350;
        if ($subtotal <= 0) {
            $subtotal = $amount;
            $cleaningFee = 0;
            $serviceFee = 0;
            $nightlyRate = $amount / $nights;
        } else {
            $cleaningFee = 500;
            $serviceFee = 850;
            $nightlyRate = $subtotal / $nights;
        }

        // Beautifully crafted HTML email that acts as a digital voucher
        $htmlContent = "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='utf-8'>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1a202c; background-color: #f7fafc; margin: 0; padding: 20px; }
                .voucher { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-top: 8px solid #0f3a20; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                .header { background: #0f3a20; color: #ffffff; padding: 30px; text-align: center; }
                .header h1 { margin: 0; font-size: 28px; letter-spacing: 2px; color: #ffffff; }
                .header p { margin: 5px 0 0; color: #cda052; text-transform: uppercase; font-size: 12px; letter-spacing: 4px; font-weight: bold; }
                .body { padding: 40px; }
                .status-badge { display: inline-block; padding: 8px 16px; background: #f0fff4; color: #22543d; border: 1px solid #c6f6d5; border-radius: 9999px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 25px; }
                .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; border-bottom: 1px solid #edf2f7; padding-bottom: 30px; margin-bottom: 30px; }
                .detail-item { margin-bottom: 15px; }
                .label { color: #718096; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold; margin-bottom: 4px; display: block; }
                .value { font-size: 15px; font-weight: 600; color: #2d3748; }
                .price-table { width: 100%; border-collapse: collapse; margin: 30px 0; }
                .price-table th { text-align: left; font-size: 11px; text-transform: uppercase; color: #718096; border-bottom: 1px solid #edf2f7; padding-bottom: 10px; }
                .price-table td { padding: 15px 0; border-bottom: 1px solid #f7fafc; }
                .total-row { font-size: 20px; font-weight: 700; color: #0f3a20; }
                .qr-section { text-align: center; padding: 30px; background: #fdfbf7; border-top: 1px dashed #e2e8f0; }
                .qr-code { background: #ffffff; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; display: inline-block; }
                .footer { padding: 30px; text-align: center; color: #a0aec0; font-size: 12px; }
                @media print { body { background: white; padding: 0; } .voucher { border: none; box-shadow: none; width: 100%; max-width: 100%; } }
            </style>
        </head>
        <body>
            <div class='voucher'>
                <div class='header'>
                    <h1>SUBRA RESIDENCY</h1>
                    <p>OFFICIAL BOOKING VOUCHER</p>
                </div>
                <div class='body'>
                    <div class='status-badge'>Confirmed & Paid</div>
                    <p>Dear <strong>{$toName}</strong>, your stay at Subra Residency is officially confirmed. Please present this digital voucher upon arrival.</p>
                    
                    <div style='margin-top: 40px;'>
                        <table style='width: 100%;'>
                            <tr>
                                <td style='width: 50%; vertical-align: top;'>
                                    <span class='label'>Booking Reference</span>
                                    <span class='value'>{$bookingId}</span>
                                </td>
                                <td style='width: 50%; vertical-align: top; text-align: right;'>
                                    <span class='label'>Sanctuary Category</span>
                                    <span class='value'>" . strtoupper($roomName) . "</span>
                                </td>
                            </tr>
                        </table>
                    </div>

                    <div style='margin-top: 25px;'>
                        <table style='width: 100%;'>
                            <tr>
                                <td style='width: 50%;'>
                                    <span class='label'>Check-in Date</span>
                                    <span class='value'>{$checkIn}</span>
                                    <span style='font-size: 10px; color: #a0aec0; display: block;'>After 12:00 PM</span>
                                </td>
                                <td style='width: 50%; text-align: right;'>
                                    <span class='label'>Check-out Date</span>
                                    <span class='value'>{$checkOut}</span>
                                    <span style='font-size: 10px; color: #a0aec0; display: block;'>Before 11:00 AM</span>
                                </td>
                            </tr>
                        </table>
                    </div>

                    <table class='price-table'>
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th style='text-align: right;'>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style='font-size: 14px;'>Accommodation ({$nights} Nights)</td>
                                <td style='text-align: right; font-weight: 500;'>₹ " . number_format($subtotal, 2) . "</td>
                            </tr>
                            <tr>
                                <td style='font-size: 14px;'>Service Fee & Taxes</td>
                                <td style='text-align: right; font-weight: 500;'>₹ 1,350.00</td>
                            </tr>
                            <tr>
                                <td class='total-row' style='padding-top: 20px;'>Total Amount Paid</td>
                                <td class='total-row' style='text-align: right; padding-top: 20px;'>₹ " . number_format($amount, 2) . "</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class='qr-section'>
                    <div class='qr-code'>
                        <img src='https://chart.googleapis.com/chart?cht=qr&chs=180x180&chl=" . urlencode($bookingId) . "' alt='Check-in QR' style='display: block;'>
                    </div>
                    <p style='font-size: 12px; color: #718096; margin-top: 15px; font-weight: 500;'>Scan at front desk for priority check-in</p>
                </div>

                <div class='footer'>
                    <p>Subra Residency • L.B.S Road • Kumbakonam • Tamil Nadu</p>
                    <p>Need help? Call +91 73958 09991 or reply to this email.</p>
                </div>
            </div>
        </body>
        </html>";

        // Call Brevo API (Transactional Email V3)
        $data = [
            'sender' => ['name' => $senderName, 'email' => $senderEmail],
            'to' => [['email' => $toEmail, 'name' => $toName]],
            'subject' => "Your Subra Residency Voucher - {$bookingId}",
            'htmlContent' => $htmlContent
        ];

        $ch = curl_init('https://api.brevo.com/v3/smtp/email');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'api-key: ' . $apiKey,
            'Content-Type: application/json',
            'Accept: application/json'
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);

        if ($httpCode >= 200 && $httpCode < 300) {
            $logMsg = "[" . date('Y-m-d H:i:s') . "] [Mailer] Email sent successfully to $toEmail (Booking $bookingId)\n";
            file_put_contents(__DIR__ . '/../logs/payment.log', $logMsg, FILE_APPEND);
            return true;
        } else {
            $logMsg = "[" . date('Y-m-d H:i:s') . "][Mailer] Brevo API Error (HTTP $httpCode): " . ($response ?: $error) . "\n";
            file_put_contents(__DIR__ . '/../logs/payment.log', $logMsg, FILE_APPEND);
            return false;
        }
    }
}
?>
