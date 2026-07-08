<?php
// backend/test_mail.php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include_once __DIR__ . '/utils/Mailer.php';

echo "Sending test confirmation email via Brevo...\n";
$res = Mailer::sendBookingConfirmation(
    'af6402001@smtp-brevo.com',
    'Test Guest',
    'HBKTEST12345',
    '2026-07-08',
    '2026-07-10',
    3500.00,
    'Luxury Suite Category'
);

if ($res) {
    echo "SUCCESS: Email sent successfully!\n";
} else {
    echo "FAILURE: Email failed to send. Check logs/payment.log for details.\n";
}

// Print last 5 lines of payment.log
if (file_exists(__DIR__ . '/logs/payment.log')) {
    echo "\nLast lines of logs/payment.log:\n";
    $lines = file(__DIR__ . '/logs/payment.log');
    $last_lines = array_slice($lines, -5);
    echo implode("", $last_lines);
}
?>
