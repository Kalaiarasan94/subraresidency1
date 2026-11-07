<?php
// backend/utils/CorsHelper.php

class CorsHelper {
    public static function handle() {
        $allowedOrigins = [
            'https://subraresidency.com',
            'https://www.subraresidency.com',
            'http://localhost:5173',
            'http://localhost:3000',
            'http://localhost:8080',
            'http://127.0.0.1:5173',
            'http://127.0.0.1:3000',
            'http://127.0.0.1:8080'
        ];

        // Also merge ALLOWED_ORIGINS and APP_URL from .env
        $env = @parse_ini_file(__DIR__ . '/../.env');
        if (!empty($env['ALLOWED_ORIGINS'])) {
            $extra = array_map('trim', explode(',', $env['ALLOWED_ORIGINS']));
            $allowedOrigins = array_unique(array_merge($allowedOrigins, $extra));
        }
        if (!empty($env['APP_URL'])) {
            $appUrl = trim($env['APP_URL']);
            if (!in_array($appUrl, $allowedOrigins)) {
                $allowedOrigins[] = $appUrl;
            }
        }

        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        
        if (!empty($origin)) {
            $isLocal = preg_match('/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/', $origin);
            if (in_array($origin, $allowedOrigins) || $isLocal) {
                header("Access-Control-Allow-Origin: " . $origin);
                header("Access-Control-Allow-Credentials: true");
            } else {
                header("Access-Control-Allow-Origin: " . $origin);
                header("Access-Control-Allow-Credentials: true");
            }
        } else {
            header("Access-Control-Allow-Origin: *");
        }

        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, Cache-Control, cache-control, Pragma, Expires, X-Cart-Session, *");
        header("Cache-Control: no-cache, no-store, must-revalidate");
        header("Pragma: no-cache");
        header("Expires: 0");

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit();
        }
    }
}

