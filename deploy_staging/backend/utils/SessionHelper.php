<?php
// backend/utils/SessionHelper.php

class SessionHelper {
    public static function startSession() {
        if (session_status() === PHP_SESSION_NONE) {
            $isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') 
                    || (isset($_SERVER['SERVER_PORT']) && $_SERVER['SERVER_PORT'] == 443)
                    || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https');

            // 30 days lifetime
            $lifetime = 86400 * 30;

            // Session cookie parameters
            $cookieParams = [
                'lifetime' => $lifetime,
                'path' => '/',
                'domain' => '',
                'secure' => $isHttps,
                'httponly' => true,
                'samesite' => $isHttps ? 'None' : 'Lax'
            ];

            session_name('SUBRA_SESSION_ID');
            session_set_cookie_params($cookieParams);
            @session_start();
        }

        // Cryptographically secure unique guest cart identifier
        if (empty($_SESSION['subra_guest_cart_id'])) {
            try {
                $_SESSION['subra_guest_cart_id'] = bin2hex(random_bytes(32));
            } catch (Exception $e) {
                $_SESSION['subra_guest_cart_id'] = md5(uniqid(mt_rand(), true)) . md5(microtime());
            }
        }

        return $_SESSION['subra_guest_cart_id'];
    }

    /**
     * Resolves the verified session ID for cart isolation.
     * Never trusts raw frontend inputs; purely derived from server session.
     */
    public static function getValidatedSessionId() {
        return self::startSession();
    }

    /**
     * Resolves authenticated user ID if logged in (from session or Bearer token).
     */
    public static function getAuthenticatedUserId($db = null) {
        self::startSession();
        if (!empty($_SESSION['user_id'])) {
            return (int) $_SESSION['user_id'];
        }

        // Check for Bearer token in Authorization header
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
        if (preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            $token = trim($matches[1]);
            // If JWT token or session token
            $userId = self::verifyTokenAndGetUserId($token, $db);
            if ($userId) {
                $_SESSION['user_id'] = $userId;
                return $userId;
            }
        }

        return null;
    }

    private static function verifyTokenAndGetUserId($token, $db) {
        if (empty($token) || strlen($token) < 10) return null;
        
        // Basic JWT decode if available
        $parts = explode('.', $token);
        if (count($parts) === 3) {
            $payload = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $parts[1])), true);
            if (!empty($payload['user_id'])) {
                return (int) $payload['user_id'];
            }
            if (!empty($payload['id'])) {
                return (int) $payload['id'];
            }
        }
        return null;
    }
}

