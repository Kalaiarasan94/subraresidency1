<?php
// backend/utils/Mailer.php

class Mailer {
    private static function getEnvVars() {
        return parse_ini_file(__DIR__ . '/../.env');
    }


    public static function sendBookingConfirmation($toEmail, $toName, $bookingId, $checkIn, $checkOut, $amount) {
        $url = 'https://api.brevo.com/v3/smtp/email';

        $htmlContent = "
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
                .header { background-color: #228B22; color: #fff; padding: 10px; text-align: center; border-radius: 5px 5px 0 0; }
                .content { padding: 20px; }
                .footer { text-align: center; font-size: 12px; color: #777; margin-top: 20px; }
                .details { background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0; }
                .details p { margin: 5px 0; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h2>Booking Confirmation</h2>
                </div>
                <div class='content'>
                    <p>Dear {$toName},</p>
                    <p>Thank you for choosing Subra Residency! Your booking has been successfully confirmed.</p>
                    
                    <div class='details'>
                        <p><strong>Booking ID:</strong> {$bookingId}</p>
                        <p><strong>Check-In:</strong> {$checkIn}</p>
                        <p><strong>Check-Out:</strong> {$checkOut}</p>
                        <p><strong>Total Amount:</strong> ₹" . number_format($amount, 2) . "</p>
                    </div>
                    
                    <p>If you have any questions or need to make changes to your reservation, please don't hesitate to contact us.</p>
                    <p>We look forward to hosting you!</p>
                    
                    <p>Best regards,<br>The Subra Residency Team</p>
                </div>
                <div class='footer'>
                    &copy; " . date('Y') . " Subra Residency. All rights reserved.
                </div>
            </div>
        </body>
        </html>";

        $env = self::getEnvVars();
        
        $data = [
            'sender' => [
                'name' => $env['BREVO_SENDER_NAME'],
                'email' => $env['BREVO_SENDER_EMAIL']
            ],
            'to' => [
                [
                    'email' => $toEmail,
                    'name' => $toName
                ]
            ],
            'subject' => "Booking Confirmed - $bookingId",
            'htmlContent' => $htmlContent
        ];

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'accept: application/json',
            'api-key: ' . $env['BREVO_API_KEY'],
            'content-type: application/json'
        ]);

        $response = curl_exec($ch);
        $err = curl_error($ch);
        curl_close($ch);

        if ($err) {
            error_log("Brevo Mailer Error: " . $err);
            return false;
        }

        $resDecoded = json_decode($response, true);
        if (isset($resDecoded['message'])) {
            error_log("Brevo API Error: " . $resDecoded['message']);
            return false;
        }

        return true;
    }
}
?>
