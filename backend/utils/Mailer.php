<?php
// backend/utils/Mailer.php

include_once __DIR__ . '/BookingSlipGenerator.php';
include_once __DIR__ . '/InvoicePdfGenerator.php';
include_once __DIR__ . '/../config/db.php';
include_once __DIR__ . '/../models/Settings.php';

class Mailer {
    private static function getEnvVars() {
        return @parse_ini_file(__DIR__ . '/../.env');
    }

    private static function getSitePhone() {
        try {
            $db = (new Database())->getConnection();
            if ($db) {
                $settings = new Settings($db);
                $phone = $settings->getByKey('site_phone');
                if (!empty($phone)) return $phone;
            }
        } catch (Exception $e) {
            error_log("[Mailer] Could not load site_phone setting: " . $e->getMessage());
        }
        return '+91 98765 43210';
    }

    public static function sendBookingConfirmation($toEmail, $toName, $bookingId, $checkIn, $checkOut, $amount, $roomName = 'Luxury Sanctuary') {
        $sitePhone = self::getSitePhone();

        // Calculate nights
        $nights = round((strtotime($checkOut) - strtotime($checkIn)) / 86400);
        if ($nights <= 0) $nights = 1;

        // Pricing breakdown
        $subtotal = $amount - 1350;
        if ($subtotal <= 0) {
            $subtotal = $amount;
            $nightlyRate = $amount / $nights;
        } else {
            $nightlyRate = $subtotal / $nights;
        }

        $nightlyRateFormatted = number_format($nightlyRate, 2);
        $subtotalFormatted = number_format($subtotal, 2);
        $totalAmountFormatted = number_format($amount, 2);

        $env = self::getEnvVars();
        $publicAppUrl = rtrim(($env['APP_URL'] ?? 'https://subraresidency.com'), '/');
        $qrCheckinUrl = "{$publicAppUrl}/checkin-confirm/{$bookingId}";
        $qrImageUrl = "https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=" . urlencode($qrCheckinUrl);

        // Fetch guest details for email
        $guestPhone = '';
        $guestAddress = '';
        $guestCountry = 'India';
        try {
            $db = (new Database())->getConnection();
            if ($db) {
                $stmt = $db->prepare("SELECT phone, address, country FROM bookings WHERE booking_id = ?");
                $stmt->execute([$bookingId]);
                $bRow = $stmt->fetch(PDO::FETCH_ASSOC);
                if ($bRow) {
                    $guestPhone = $bRow['phone'] ?? '';
                    $guestAddress = $bRow['address'] ?? '';
                    if (!empty($bRow['country'])) $guestCountry = $bRow['country'];
                }
            }
        } catch (Throwable $e) {}

        // Beautifully crafted HTML email matching exact front-desk luxury voucher layout
        $htmlContent = "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='utf-8'>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.5; color: #1e293b; background-color: #f8fafc; margin: 0; padding: 25px 15px; }
                .voucher-card { max-width: 680px; margin: 0 auto; background: #ffffff; border: 8px double #cda052; border-radius: 24px; padding: 35px; box-shadow: 0 10px 25px rgba(0,0,0,0.06); }
                .header-table { width: 100%; border-bottom: 1px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 25px; }
                .brand-title { font-size: 24px; font-weight: 900; color: #0f3a20; letter-spacing: 2px; margin: 0; text-transform: uppercase; }
                .brand-sub { font-size: 9px; font-weight: 700; color: #94a3b8; letter-spacing: 3px; text-transform: uppercase; margin: 4px 0 6px; }
                .brand-addr { font-size: 11px; color: #64748b; margin: 0; line-height: 1.5; }
                .status-badge { display: inline-block; background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; padding: 6px 16px; border-radius: 50px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }
                .section-title { font-size: 10px; font-weight: 800; color: #cda052; text-transform: uppercase; letter-spacing: 2.5px; margin-bottom: 6px; }
                .guest-name { font-size: 20px; font-weight: 900; color: #0f3a20; margin: 0 0 10px; text-transform: uppercase; }
                .guest-detail { font-size: 12px; color: #64748b; margin: 3px 0; }
                .metadata-box { background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 14px; padding: 18px; margin: 20px 0 25px; }
                .meta-label { font-size: 9px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 1.5px; display: block; margin-bottom: 3px; }
                .meta-val { font-size: 13px; font-weight: 900; color: #0f3a20; text-transform: uppercase; }
                .table-invoice { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                .table-invoice th { font-size: 9px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; text-align: left; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
                .table-invoice td { padding: 12px 0; font-size: 12px; color: #334155; border-bottom: 1px solid #f1f5f9; }
                .total-row { font-size: 16px; font-weight: 900; color: #0f3a20; }
                .qr-card { text-align: center; background: #ffffff; border: 1px solid #cda052; border-radius: 16px; padding: 20px; }
                .qr-caption { font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 12px; line-height: 1.4; }
                .footer { text-align: center; font-size: 11px; color: #94a3b8; margin-top: 30px; border-top: 1px solid #f1f5f9; padding-top: 20px; }
            </style>
        </head>
        <body>
            <div class='voucher-card'>
                <table class='header-table'>
                    <tr>
                        <td style='vertical-align: top;'>
                            <h2 class='brand-title'>SUBRA RESIDENCY</h2>
                            <p class='brand-sub'>Stay Away from Home • Kumbakonam</p>
                            <p class='brand-addr'>
                                L.B.S Road, Near Railway Station, Kumbakonam, Tamil Nadu<br>
                                Ph: +91 73958 09991 | 73958 09992
                            </p>
                        </td>
                        <td style='vertical-align: top; text-align: right;'>
                            <span class='status-badge'>✓ Booking Confirmed</span>
                            <p style='font-size: 11px; color: #94a3b8; margin-top: 8px; font-weight: 700;'>Invoice Date: {$checkIn}</p>
                        </td>
                    </tr>
                </table>

                <table style='width: 100%; border-collapse: collapse;'>
                    <tr>
                        <!-- Left Column: Guest & Invoice Details -->
                        <td style='width: 65%; vertical-align: top; padding-right: 20px;'>
                            <div class='section-title'>Invoice Recipient</div>
                            <h3 class='guest-name'>{$toName}</h3>
                            <div class='guest-detail'>✉ {$toEmail}</div>
                            " . ($guestPhone ? "<div class='guest-detail'>📞 {$guestPhone}</div>" : "") . "
                            " . ($guestCountry ? "<div class='guest-detail'>🌐 {$guestCountry}</div>" : "") . "
                            " . ($guestAddress ? "<div class='guest-detail'>📍 {$guestAddress}</div>" : "") . "

                            <div class='metadata-box'>
                                <table style='width: 100%; border-collapse: collapse;'>
                                    <tr>
                                        <td style='width: 50%; padding-bottom: 12px;'>
                                            <span class='meta-label'>Booking Identifier</span>
                                            <span class='meta-val'>{$bookingId}</span>
                                        </td>
                                        <td style='width: 50%; padding-bottom: 12px;'>
                                            <span class='meta-label'>Assigned Sanctuary</span>
                                            <span class='meta-val'>" . strtoupper($roomName) . "</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span class='meta-label'>Check-In Arrival</span>
                                            <span class='meta-val' style='color: #334155; font-size: 12px;'>{$checkIn}</span>
                                        </td>
                                        <td>
                                            <span class='meta-label'>Check-Out Departure</span>
                                            <span class='meta-val' style='color: #334155; font-size: 12px;'>{$checkOut}</span>
                                        </td>
                                    </tr>
                                </table>
                            </div>

                            <div class='section-title'>Invoice Statement</div>
                            <table class='table-invoice'>
                                <thead>
                                    <tr>
                                        <th style='width: 50%;'>Description</th>
                                        <th style='text-align: center;'>Qty</th>
                                        <th style='text-align: right;'>Price</th>
                                        <th style='text-align: right;'>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <strong>" . strtoupper($roomName) . "</strong><br>
                                            <span style='font-size: 10px; color: #94a3b8;'>Accommodation staying for {$nights} Night(s)</span>
                                        </td>
                                        <td style='text-align: center;'>1</td>
                                        <td style='text-align: right;'>₹ {$nightlyRateFormatted}</td>
                                        <td style='text-align: right;'>₹ {$subtotalFormatted}</td>
                                    </tr>
                                    <tr>
                                        <td>Cleaning & Setup Service</td>
                                        <td style='text-align: center;'>1</td>
                                        <td style='text-align: right;'>₹ 500.00</td>
                                        <td style='text-align: right;'>₹ 500.00</td>
                                    </tr>
                                    <tr>
                                        <td>Hotel Service & GST</td>
                                        <td style='text-align: center;'>1</td>
                                        <td style='text-align: right;'>₹ 850.00</td>
                                        <td style='text-align: right;'>₹ 850.00</td>
                                    </tr>
                                    <tr>
                                        <td colspan='2'></td>
                                        <td style='text-align: right; font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase;'>Grand Total</td>
                                        <td style='text-align: right;' class='total-row'>₹ {$totalAmountFormatted}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>

                        <!-- Right Column: Reception QR Code Box -->
                        <td style='width: 35%; vertical-align: top; border-left: 1px solid #e2e8f0; padding-left: 20px;'>
                            <div class='section-title' style='text-align: center;'>Reception QR</div>
                            <div class='qr-card'>
                                <img src='{$qrImageUrl}' width='160' height='160' alt='Reception Check-in QR' style='display: block; margin: 0 auto; border-radius: 8px;'>
                                <p class='qr-caption'>Please present this QR code at hotel front desk for an instant check-in.</p>
                            </div>
                        </td>
                    </tr>
                </table>

                <div class='footer'>
                    <p style='margin: 0 0 5px;'>Subra Residency • L.B.S Road • Kumbakonam • Tamil Nadu</p>
                    <p style='margin: 0; color: #94a3b8;'>Need help? Call {$sitePhone} or reply to this email.</p>
                </div>
            </div>
        </body>
        </html>";

        $attachments = [];

        // 1. Generate & Attach PDF Invoice
        try {
            $pdfContent = InvoicePdfGenerator::generatePdf($bookingId, $toName, $toEmail, $checkIn, $checkOut, $amount, $roomName, 'Paid');
            if ($pdfContent) {
                $attachments[] = [
                    'name' => "SubraResidency-Invoice-{$bookingId}.pdf",
                    'content' => base64_encode($pdfContent)
                ];
            }
        } catch (Throwable $e) {
            error_log("[Mailer] PDF Invoice generation failed: " . $e->getMessage());
        }

        return self::sendViaBrevo($toEmail, $toName, "Your Subra Residency Tax Invoice & Confirmation - {$bookingId}", $htmlContent, $attachments);
    }

    public static function sendBookingCancellation($toEmail, $toName, $bookingId, $checkIn, $checkOut, $amount, $roomName = 'Luxury Sanctuary') {
        $sitePhone = self::getSitePhone();

        $htmlContent = "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='utf-8'>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1a202c; background-color: #f7fafc; margin: 0; padding: 20px; }
                .voucher { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-top: 8px solid #822727; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                .header { background: #822727; color: #ffffff; padding: 30px; text-align: center; }
                .header h1 { margin: 0; font-size: 28px; letter-spacing: 2px; color: #ffffff; }
                .header p { margin: 5px 0 0; color: #fed7d7; text-transform: uppercase; font-size: 12px; letter-spacing: 4px; font-weight: bold; }
                .body { padding: 40px; }
                .status-badge { display: inline-block; padding: 8px 16px; background: #fff5f5; color: #822727; border: 1px solid #feb2b2; border-radius: 9999px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 25px; }
                .label { color: #718096; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold; margin-bottom: 4px; display: block; }
                .value { font-size: 15px; font-weight: 600; color: #2d3748; }
                .refund-section { padding: 25px 40px; background: #f0fff4; border-top: 1px solid #c6f6d5; font-size: 13px; color: #22543d; }
                .footer { padding: 30px; text-align: center; color: #a0aec0; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class='voucher'>
                <div class='header'>
                    <h1>SUBRA RESIDENCY</h1>
                    <p>BOOKING CANCELLED</p>
                </div>
                <div class='body'>
                    <div class='status-badge'>Cancelled</div>
                    <p>Dear <strong>{$toName}</strong>, your booking at Subra Residency has been cancelled.</p>

                    <div style='margin-top: 30px;'>
                        <table style='width: 100%;'>
                            <tr>
                                <td style='width: 50%; vertical-align: top;'>
                                    <span class='label'>Booking Reference</span>
                                    <span class='value'>{$bookingId}</span>
                                </td>
                                <td style='width: 50%; vertical-align: top; text-align: right;'>
                                    <span class='label'>Room Category</span>
                                    <span class='value'>" . strtoupper($roomName) . "</span>
                                </td>
                            </tr>
                            <tr>
                                <td style='width: 50%; vertical-align: top; padding-top: 20px;'>
                                    <span class='label'>Check-in Date</span>
                                    <span class='value'>{$checkIn}</span>
                                </td>
                                <td style='width: 50%; vertical-align: top; text-align: right; padding-top: 20px;'>
                                    <span class='label'>Check-out Date</span>
                                    <span class='value'>{$checkOut}</span>
                                </td>
                            </tr>
                            <tr>
                                <td style='padding-top: 20px;'>
                                    <span class='label'>Amount Paid</span>
                                    <span class='value'>₹ " . number_format($amount, 2) . "</span>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>

                <div class='refund-section'>
                    <strong>Refund Status:</strong> If payment was made for this booking, the full amount will be refunded to your original payment method within <strong>2-3 business days</strong>.
                </div>

                <div class='footer'>
                    <p>Subra Residency • L.B.S Road • Kumbakonam • Tamil Nadu</p>
                    <p>Questions about this cancellation? Call {$sitePhone} or reply to this email.</p>
                </div>
            </div>
        </body>
        </html>";

        return self::sendViaBrevo($toEmail, $toName, "Booking Cancelled - {$bookingId}", $htmlContent);
    }

    private static function sendViaBrevo($toEmail, $toName, $subject, $htmlContent, $attachments = []) {
        $env = self::getEnvVars();
        $apiKey = $env['BREVO_API_KEY'] ?? '';
        $senderEmail = $env['BREVO_SENDER_EMAIL'] ?? 'af6402001@smtp-brevo.com';
        $senderName = $env['BREVO_SENDER_NAME'] ?? 'Subra Residency';

        $data = [
            'sender' => ['name' => $senderName, 'email' => $senderEmail],
            'to' => [['email' => $toEmail, 'name' => $toName]],
            'subject' => $subject,
            'htmlContent' => $htmlContent
        ];

        if (!empty($attachments)) {
            $data['attachment'] = $attachments;
        }

        $httpCode = 0;
        $response = '';

        // Attempt Brevo HTTP API
        if (!empty($apiKey)) {
            $jsonPayload = json_encode($data);

            if (function_exists('curl_init')) {
                $ch = curl_init('https://api.brevo.com/v3/smtp/email');
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_POST, true);
                curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonPayload);
                curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
                curl_setopt($ch, CURLOPT_TIMEOUT, 10);
                curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
                curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
                curl_setopt($ch, CURLOPT_HTTPHEADER, [
                    'api-key: ' . $apiKey,
                    'Content-Type: application/json',
                    'Accept: application/json'
                ]);

                $response = curl_exec($ch);
                $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                curl_close($ch);
            } else {
                $opts = [
                    'http' => [
                        'method'  => 'POST',
                        'header'  => "Content-Type: application/json\r\n" .
                                     "api-key: {$apiKey}\r\n" .
                                     "Accept: application/json\r\n",
                        'content' => $jsonPayload,
                        'timeout' => 10
                    ],
                    'ssl' => [
                        'verify_peer' => false,
                        'verify_peer_name' => false
                    ]
                ];
                $context  = stream_context_create($opts);
                $response = @file_get_contents('https://api.brevo.com/v3/smtp/email', false, $context);
                $httpCode = 500;
                if (isset($http_response_header) && is_array($http_response_header)) {
                    foreach ($http_response_header as $hdr) {
                        if (preg_match('/HTTP\/\d\.\d\s+(\d+)/', $hdr, $m)) {
                            $httpCode = intval($m[1]);
                        }
                    }
                }
            }

            if ($httpCode >= 200 && $httpCode < 300) {
                $logMsg = "[" . date('Y-m-d H:i:s') . "] [Mailer SUCCESS] Email with PDF Invoice sent via Brevo REST API to $toEmail ($subject)\n";
                file_put_contents(__DIR__ . '/../logs/payment.log', $logMsg, FILE_APPEND);
                return true;
            } else {
                $logMsg = "[" . date('Y-m-d H:i:s') . "] [Mailer WARN] Brevo REST API returned HTTP {$httpCode}: " . ($response ?: 'No response body') . ". Trying Brevo SMTP...\n";
                file_put_contents(__DIR__ . '/../logs/payment.log', $logMsg, FILE_APPEND);
            }
        }

        // Brevo Direct SMTP Fallback (handles xsmtpsib- credentials over ports 587, 465, 2525)
        $smtpPorts = [587, 465, 2525];
        foreach ($smtpPorts as $port) {
            $smtpSent = self::sendViaSmtp($toEmail, $toName, $subject, $htmlContent, $attachments, $port);
            if ($smtpSent) {
                $logMsg = "[" . date('Y-m-d H:i:s') . "] [Mailer SUCCESS] Email with PDF Invoice sent via Brevo SMTP (Port $port) to $toEmail ($subject)\n";
                file_put_contents(__DIR__ . '/../logs/payment.log', $logMsg, FILE_APPEND);
                return true;
            }
        }

        // Native PHP Mail Fallback
        $logMsg = "[" . date('Y-m-d H:i:s') . "] [Mailer] Attempting native PHP mail fallback for $toEmail...\n";
        file_put_contents(__DIR__ . '/../logs/payment.log', $logMsg, FILE_APPEND);

        $sent = self::sendViaNativeMail($toEmail, $toName, $subject, $htmlContent, $attachments);
        if ($sent) {
            $logMsg = "[" . date('Y-m-d H:i:s') . "] [Mailer SUCCESS] Native PHP mail fallback delivered to $toEmail\n";
            file_put_contents(__DIR__ . '/../logs/payment.log', $logMsg, FILE_APPEND);
            return true;
        } else {
            $logMsg = "[" . date('Y-m-d H:i:s') . "] [Mailer ERROR] All delivery methods (Brevo API, Brevo SMTP, PHP Mail) failed for $toEmail\n";
            file_put_contents(__DIR__ . '/../logs/payment.log', $logMsg, FILE_APPEND);
            return false;
        }
    }

    private static function sendViaSmtp($toEmail, $toName, $subject, $htmlContent, $attachments = [], $overridePort = null) {
        $env = self::getEnvVars();
        $smtpHost = $env['SMTP_HOST'] ?? 'smtp-relay.brevo.com';
        $smtpPort = $overridePort ? intval($overridePort) : intval($env['SMTP_PORT'] ?? 587);
        $smtpUser = $env['SMTP_USER'] ?? ($env['BREVO_LOGIN'] ?? 'af6402001@smtp-brevo.com');
        $smtpPass = $env['SMTP_PASS'] ?? ($env['BREVO_API_KEY'] ?? '');
        $senderEmail = $env['BREVO_SENDER_EMAIL'] ?? 'subraresidencykum@gmail.com';
        $senderName = $env['BREVO_SENDER_NAME'] ?? 'Subra Residency';

        if (empty($smtpPass)) return false;

        try {
            $isSsl = ($smtpPort == 465);
            $hostTarget = $isSsl ? ('ssl://' . $smtpHost) : $smtpHost;
            $socket = @fsockopen($hostTarget, $smtpPort, $errno, $errstr, 10);
            if (!$socket) return false;

            $read = function($sock) {
                $resp = '';
                while ($line = fgets($sock, 512)) {
                    $resp .= $line;
                    if (substr($line, 3, 1) == ' ') break;
                }
                return $resp;
            };

            $write = function($sock, $cmd) {
                fputs($sock, $cmd . "\r\n");
            };

            $read($socket);
            $write($socket, "EHLO " . gethostname());
            $read($socket);

            if (!$isSsl) {
                $write($socket, "STARTTLS");
                $starttlsResp = $read($socket);
                if (strpos($starttlsResp, '220') === false) {
                    fclose($socket);
                    return false;
                }
                @stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT | STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT);
                $write($socket, "EHLO " . gethostname());
                $read($socket);
            }

            $write($socket, "AUTH LOGIN");
            $read($socket);

            $write($socket, base64_encode($smtpUser));
            $read($socket);

            $write($socket, base64_encode($smtpPass));
            $authResp = $read($socket);
            file_put_contents(__DIR__ . '/../logs/payment.log', "[" . date('Y-m-d H:i:s') . "] [Mailer SMTP AUTH] " . trim($authResp) . "\n", FILE_APPEND);
            if (strpos($authResp, '235') === false) {
                fclose($socket);
                return false;
            }

            $write($socket, "MAIL FROM: <{$senderEmail}>");
            $mailFromResp = $read($socket);
            file_put_contents(__DIR__ . '/../logs/payment.log', "[" . date('Y-m-d H:i:s') . "] [Mailer SMTP MAIL FROM] " . trim($mailFromResp) . "\n", FILE_APPEND);

            $write($socket, "RCPT TO: <{$toEmail}>");
            $rcptResp = $read($socket);
            file_put_contents(__DIR__ . '/../logs/payment.log', "[" . date('Y-m-d H:i:s') . "] [Mailer SMTP RCPT TO] " . trim($rcptResp) . "\n", FILE_APPEND);

            $write($socket, "DATA");
            $read($socket);

            $boundary = "====_Subra_" . md5(uniqid(time()));
            $headers = "MIME-Version: 1.0\r\n";
            $headers .= "From: {$senderName} <{$senderEmail}>\r\n";
            $headers .= "To: {$toName} <{$toEmail}>\r\n";
            $headers .= "Subject: {$subject}\r\n";
            $headers .= "Content-Type: multipart/mixed; boundary=\"" . $boundary . "\"\r\n\r\n";

            $body = "--" . $boundary . "\r\n";
            $body .= "Content-Type: text/html; charset=UTF-8\r\n";
            $body .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
            $body .= $htmlContent . "\r\n\r\n";

            foreach ($attachments as $att) {
                $filename = $att['name'];
                $base64 = $att['content'];
                $mime = strpos($filename, '.pdf') !== false ? 'application/pdf' : 'image/png';

                $body .= "--" . $boundary . "\r\n";
                $body .= "Content-Type: {$mime}; name=\"" . $filename . "\"\r\n";
                $body .= "Content-Transfer-Encoding: base64\r\n";
                $body .= "Content-Disposition: attachment; filename=\"" . $filename . "\"\r\n\r\n";
                $body .= chunk_split($base64) . "\r\n";
            }
            $body .= "--" . $boundary . "--\r\n.";

            $write($socket, $headers . $body);
            $dataResp = $read($socket);

            $write($socket, "QUIT");
            fclose($socket);

            return (strpos($dataResp, '250') !== false);
        } catch (Throwable $e) {
            return false;
        }
    }

    private static function sendViaNativeMail($toEmail, $toName, $subject, $htmlContent, $attachments = []) {
        try {
            $boundary = "====_Subra_" . md5(uniqid(time()));
            $headers = "MIME-Version: 1.0\r\n";
            $headers .= "From: Subra Residency <stay@subraresidency.com>\r\n";
            $headers .= "Reply-To: stay@subraresidency.com\r\n";
            $headers .= "Content-Type: multipart/mixed; boundary=\"" . $boundary . "\"\r\n";

            $body = "--" . $boundary . "\r\n";
            $body .= "Content-Type: text/html; charset=UTF-8\r\n";
            $body .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
            $body .= $htmlContent . "\r\n\r\n";

            foreach ($attachments as $att) {
                $filename = $att['name'];
                $base64 = $att['content'];
                $mime = strpos($filename, '.pdf') !== false ? 'application/pdf' : 'image/png';
                
                $body .= "--" . $boundary . "\r\n";
                $body .= "Content-Type: {$mime}; name=\"" . $filename . "\"\r\n";
                $body .= "Content-Transfer-Encoding: base64\r\n";
                $body .= "Content-Disposition: attachment; filename=\"" . $filename . "\"\r\n\r\n";
                $body .= chunk_split($base64) . "\r\n";
            }
            $body .= "--" . $boundary . "--";

            return @mail($toEmail, $subject, $body, $headers);
        } catch (Throwable $e) {
            return false;
        }
    }
}
?>
