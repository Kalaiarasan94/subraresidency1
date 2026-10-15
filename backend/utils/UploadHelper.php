<?php
// backend/utils/UploadHelper.php

class UploadHelper
{
    /**
     * Resolves the permanent root uploads directory (outside backend/).
     * This protects uploads from being lost when the backend/ folder is replaced or redeployed.
     */
    public static function getUploadDir($subfolder = '')
    {
        $sub = trim($subfolder, '/');
        
        // Root uploads directory (parent of backend/)
        $rootDir = dirname(dirname(__DIR__)) . '/uploads';
        if (!file_exists($rootDir)) {
            @mkdir($rootDir, 0777, true);
        }

        $target = $rootDir . ($sub ? '/' . $sub : '');
        if (!file_exists($target)) {
            @mkdir($target, 0777, true);
        }

        // Also ensure backend/uploads exists for local dev server fallback
        $backendDir = dirname(__DIR__) . '/uploads' . ($sub ? '/' . $sub : '');
        if (!file_exists($backendDir)) {
            @mkdir($backendDir, 0777, true);
        }

        return rtrim($target, '/') . '/';
    }

    /**
     * Copies the saved file to both root uploads/ and backend/uploads/ so that
     * both Hostinger root web paths and built-in PHP dev servers can access it.
     */
    public static function mirrorUpload($filename, $subfolder = '')
    {
        $sub = trim($subfolder, '/');
        $rootDir = dirname(dirname(__DIR__)) . '/uploads' . ($sub ? '/' . $sub : '');
        $backendDir = dirname(__DIR__) . '/uploads' . ($sub ? '/' . $sub : '');

        $rootPath = rtrim($rootDir, '/') . '/' . $filename;
        $backendPath = rtrim($backendDir, '/') . '/' . $filename;

        if (file_exists($rootPath) && !file_exists($backendPath)) {
            if (!file_exists($backendDir)) @mkdir($backendDir, 0777, true);
            @copy($rootPath, $backendPath);
        } elseif (file_exists($backendPath) && !file_exists($rootPath)) {
            if (!file_exists($rootDir)) @mkdir($rootDir, 0777, true);
            @copy($backendPath, $rootPath);
        }
    }
}
