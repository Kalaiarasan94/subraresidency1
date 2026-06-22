<?php
// backend/utils/Mailer.php

class Mailer {
    private static function getEnvVars() {
        return parse_ini_file(__DIR__ . '/../.env');
    }


    public static function sendBookingConfirmation($toEmail, $toName, $bookingId, $checkIn, $checkOut, $amount, $roomName = 'Luxury Sanctuary') {
        $url = 'https://api.brevo.com/v3/smtp/email';

        // Calculate nights and pricing breakdown for email invoice
        $nights = round((strtotime($checkOut) - strtotime($checkIn)) / 86400);
        if ($nights <= 0) $nights = 1;
        
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

        $htmlContent = "
        <html>
        <head>
            <style>
                body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #334155; background-color: #f8fafc; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 20px auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
                .header { background-color: #0f3a20; color: #ffffff; padding: 25px; text-align: center; border-radius: 12px 12px 0 0; border-bottom: 4px solid #cda052; }
                .header h1 { font-family: 'Playfair Display', Georgia, serif; margin: 0; font-size: 24px; letter-spacing: 2px; }
                .header p { margin: 5px 0 0 0; font-size: 10px; text-transform: uppercase; letter-spacing: 3px; color: #cda052; }
                .content { padding: 25px 10px; }
                .greeting { font-size: 16px; font-weight: bold; color: #0f3a20; }
                .details-box { background-color: #f8fafc; border: 1px solid #f1f5f9; padding: 20px; border-radius: 12px; margin: 20px 0; }
                .details-box table { width: 100%; border-collapse: collapse; font-size: 13px; }
                .details-box td { padding: 6px 0; }
                .details-label { color: #64748b; font-weight: bold; text-transform: uppercase; font-size: 10px; letter-spacing: 1px; }
                .details-value { color: #0f3a20; font-weight: bold; text-align: right; }
                .invoice-table { width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 13px; }
                .invoice-table th { border-bottom: 2px solid #e2e8f0; text-align: left; padding: 10px 0; color: #64748b; text-transform: uppercase; font-size: 10px; letter-spacing: 1px; }
                .invoice-table td { padding: 12px 0; border-bottom: 1px solid #f1f5f9; }
                .grand-total { font-size: 16px; font-weight: bold; color: #0f3a20; text-align: right; }
                .qr-container { text-align: center; margin: 30px auto; padding: 20px; border: 1px solid rgba(205, 160, 82, 0.3); border-radius: 16px; background-color: #ffffff; max-width: 240px; }
                .qr-container h3 { color: #0f3a20; margin: 0 0 10px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; }
                .qr-img { width: 180px; height: 180px; display: block; margin: 0 auto; border: 1px solid #f1f5f9; border-radius: 8px; }
                .qr-desc { font-size: 9px; color: #64748b; margin: 10px 0 0 0; text-transform: uppercase; font-weight: bold; letter-spacing: 1px; }
                .footer { text-align: center; font-size: 11px; color: #94a3b8; margin-top: 30px; border-t: 1px solid #f1f5f9; padding-top: 20px; }
                .payment-stamp { display: inline-block; border: 2px dashed rgba(16, 185, 129, 0.4); background-color: #ecfdf5; color: #047857; font-weight: bold; padding: 8px 15px; border-radius: 8px; font-size: 14px; letter-spacing: 2px; margin: 15px 0; text-transform: uppercase; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>SUBRA RESIDENCY</h1>
                    <p>Stay Away from Home • Kumbakonam</p>
                </div>
                <div class='content'>
                    <p class='greeting'>Dear {$toName},</p>
                    <p>Thank you for choosing Subra Residency! Your payment has been processed successfully, and your reservation is now **fully secured**.</p>
                    
                    <div style='text-align: center;'>
                        <span class='payment-stamp'>✓ PAID & CONFIRMED</span>
                    </div>

                    <!-- Stay Details -->
                    <div class='details-box'>
                        <table>
                            <tr>
                                <td class='details-label'>Booking ID</td>
                                <td class='details-value'>{$bookingId}</td>
                            </tr>
                            <tr>
                                <td class='details-label'>Sanctuary Stay</td>
                                <td class='details-value' style='text-transform: uppercase;'>{$roomName}</td>
                            </tr>
                            <tr>
                                <td class='details-label'>Check-In</td>
                                <td class='details-value'>{$checkIn}</td>
                            </tr>
                            <tr>
                                <td class='details-label'>Check-Out</td>
                                <td class='details-value'>{$checkOut}</td>
                            </tr>
                        </table>
                    </div>

                    <!-- Invoice Statement -->
                    <table class='invoice-table'>
                      <thead>
                        <tr>
                          <th style='width: 60%;'>Description</th>
                          <th style='text-align: center; width: 10%;'>Qty</th>
                          <th style='text-align: right; width: 30%;'>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <strong style='color: #334155; text-transform: uppercase;'>{$roomName}</strong><br />
                            <span style='font-size: 11px; color: #94a3b8;'>Stay of {$nights} Night(s) @ " . number_format($nightlyRate, 2) . " / NT</span>
                          </td>
                          <td style='text-align: center;'>1</td>
                          <td style='text-align: right;'>₹" . number_format($subtotal, 2) . "</td>
                        </tr>
                        " . ($cleaningFee > 0 ? "
                        <tr>
                          <td style='color: #64748b;'>Cleaning & Setup Service</td>
                          <td style='text-align: center;'>1</td>
                          <td style='text-align: right;'>₹" . number_format($cleaningFee, 2) . "</td>
                        </tr>
                        " : "") . "
                        " . ($serviceFee > 0 ? "
                        <tr>
                          <td style='color: #64748b;'>Hotel Service & GST</td>
                          <td style='text-align: center;'>1</td>
                          <td style='text-align: right;'>₹" . number_format($serviceFee, 2) . "</td>
                        </tr>
                        " : "") . "
                        <tr>
                          <td colspan='2' style='text-align: right; font-weight: bold; border-top: 1px solid #e2e8f0; padding-top: 15px;'>GRAND TOTAL (PAID)</td>
                          <td class='grand-total' style='border-top: 1px solid #e2e8f0; padding-top: 15px;'>₹" . number_format($amount, 2) . "</td>
                        </tr>
                      </tbody>
                    </table>

                    <!-- Check-in QR Code -->
                    <div class='qr-container'>
                        <h3>Reception QR</h3>
                        <img class='qr-img' src='https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=" . urlencode($bookingId) . "' alt='Booking QR' />
                        <p class='qr-desc'>Present at front desk to check-in</p>
                    </div>
                    
                    <p style='margin-top: 30px;'>If you require any assistance or would like to modify your stay, please reply directly to this email or call us at +91 73958 09991.</p>
                    <p>We look forward to hosting you!</p>
                    <p>Warm regards,<br><strong>The Subra Residency Team</strong></p>
                </div>
                <div class='footer'>
                    Authorized Subra Residency Digital Invoice. All rights reserved.<br />
                    L.B.S Road, Near Railway Station, Kumbakonam, Tamil Nadu
                </div>
            </div>
        </body>
        </html>";

        $env = self::getEnvVars();
        $smtp_server = "smtp-relay.brevo.com";
        $port = 465;
        $username = $env['BREVO_SENDER_EMAIL'] ?? '';
        $password = $env['BREVO_API_KEY'] ?? '';
        $from = $env['BREVO_SENDER_EMAIL'] ?? '';
        $senderName = $env['BREVO_SENDER_NAME'] ?? 'Subra Residency';

        $socket = fsockopen("ssl://" . $smtp_server, $port, $errno, $errstr, 15);
        if (!$socket) {
            error_log("Brevo SMTP connection failed: $errstr ($errno)");
            return false;
        }

        $read = function($socket) {
            $response = "";
            while ($line = fgets($socket, 512)) {
                $response .= $line;
                if (substr($line, 3, 1) == " ") {
                    break;
                }
            }
            return $response;
        };

        $send = function($socket, $cmd) use ($read) {
            fputs($socket, $cmd . "\r\n");
            return $read($socket);
        };

        $res = $read($socket); // 220
        $res .= $send($socket, "EHLO localhost"); // 250
        $res .= $send($socket, "AUTH LOGIN"); // 334
        $res .= $send($socket, base64_encode($username)); // 334
        $res .= $send($socket, base64_encode($password)); // 235 (Success)
        
        if (strpos($res, "235") === false) {
            error_log("Brevo SMTP Auth Failed:\n" . $res);
            fclose($socket);
            return false;
        }

        $send($socket, "MAIL FROM: <$from>"); // 250
        $send($socket, "RCPT TO: <$toEmail>"); // 250
        $send($socket, "DATA"); // 354
        
        // Headers & Body
        $headers = "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
        $headers .= "From: \"$senderName\" <$from>\r\n";
        $headers .= "To: \"$toName\" <$toEmail>\r\n";
        $headers .= "Subject: Booking Confirmed - $bookingId\r\n";
        $headers .= "Date: " . date("r") . "\r\n";
        
        fputs($socket, $headers . "\r\n" . $htmlContent . "\r\n.\r\n");
        $dataResp = $read($socket); // 250
        
        $send($socket, "QUIT"); // 221
        fclose($socket);

        if (strpos($dataResp, "250") === false) {
            error_log("Brevo SMTP Data Send Failed: " . $dataResp);
            return false;
        }

        return true;
    }
}
?>
