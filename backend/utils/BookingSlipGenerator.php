<?php
// backend/utils/BookingSlipGenerator.php
// Renders a booking slip as a PNG image using GD (no external dependencies).

class BookingSlipGenerator {

    public static function generate($bookingId, $guestName, $checkIn, $checkOut, $amount, $roomName, $paymentStatus = 'Payment Successful', $appUrl = 'http://localhost/subraresidency1') {
        $width = 900;
        $height = 640;

        $img = imagecreatetruecolor($width, $height);

        $white      = imagecolorallocate($img, 255, 255, 255);
        $darkGreen  = imagecolorallocate($img, 15, 58, 32);
        $gold       = imagecolorallocate($img, 205, 160, 82);
        $textDark   = imagecolorallocate($img, 45, 55, 72);
        $textGray   = imagecolorallocate($img, 113, 128, 150);
        $lineGray   = imagecolorallocate($img, 226, 232, 240);
        $successFg  = imagecolorallocate($img, 34, 84, 61);
        $successBg  = imagecolorallocate($img, 240, 255, 244);

        imagefill($img, 0, 0, $white);

        // Header band
        imagefilledrectangle($img, 0, 0, $width, 110, $darkGreen);
        self::centeredText($img, 'SUBRA RESIDENCY', $width, 28, 5, $white);
        self::centeredText($img, 'BOOKING SLIP', $width, 68, 3, $gold);

        // Payment status badge
        $badgeText = strtoupper($paymentStatus);
        $badgeWidth = (strlen($badgeText) * imagefontwidth(5)) + 30;
        imagefilledrectangle($img, 60, 140, 60 + $badgeWidth, 172, $successBg);
        imagestring($img, 5, 75, 148, $badgeText, $successFg);

        // Detail rows
        $y = 210;
        $rows = [
            ['Booking Reference', $bookingId],
            ['Guest Name', $guestName],
            ['Room Category', $roomName],
            ['Check-in Date', $checkIn],
            ['Check-out Date', $checkOut],
            ['Total Amount Paid', 'Rs. ' . number_format((float)$amount, 2)],
        ];

        foreach ($rows as $row) {
            [$label, $value] = $row;
            imagestring($img, 2, 60, $y, strtoupper($label), $textGray);
            imagestring($img, 5, 60, $y + 16, (string)$value, $textDark);
            imageline($img, 60, $y + 44, $width - 60, $y + 44, $lineGray);
            $y += 62;
        }

        // QR code linking to the guest self check-in confirmation page
        $confirmUrl = rtrim($appUrl, '/') . '/checkin-confirm/' . $bookingId;
        $qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' . urlencode($confirmUrl);
        $qrData = self::fetchUrl($qrUrl);
        if ($qrData !== false) {
            if (strlen($qrData) > 4 && (substr($qrData, 1, 3) === 'PNG' || substr($qrData, 6, 4) === 'JFIF' || substr($qrData, 0, 4) === "\x89PNG")) {
                $qrImg = @imagecreatefromstring($qrData);
                if ($qrImg !== false) {
                    imagecopy($img, $qrImg, $width - 210, $height - 210, 0, 0, 150, 150);
                    imagedestroy($qrImg);
                }
            }
        }

        imagestring($img, 2, 60, $height - 50, 'Digitally generated booking slip. Please present at the front desk for check-in.', $textGray);

        ob_start();
        imagepng($img);
        $pngData = ob_get_clean();
        imagedestroy($img);

        return $pngData;
    }

    private static function fetchUrl($url) {
        if (!function_exists('curl_init')) return false;
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 5);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        $data = curl_exec($ch);
        curl_close($ch);
        return $data !== false && $data !== '' ? $data : false;
    }

    private static function centeredText($img, $text, $width, $y, $font, $color) {
        $textWidth = strlen($text) * imagefontwidth($font);
        $x = (int)(($width - $textWidth) / 2);
        imagestring($img, $font, $x, $y, $text, $color);
    }
}
