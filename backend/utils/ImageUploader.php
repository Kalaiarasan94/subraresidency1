<?php
// backend/utils/ImageUploader.php
// Saves an uploaded image file to disk as WebP, regardless of the source format.

class ImageUploader {

    public static function saveAsWebp($uploadedFile, $destDir, $prefix = 'img') {
        if (!is_dir($destDir)) {
            mkdir($destDir, 0777, true);
        }

        $tmpPath = $uploadedFile['tmp_name'];
        $mime = mime_content_type($tmpPath);

        switch ($mime) {
            case 'image/jpeg':
                $image = @imagecreatefromjpeg($tmpPath);
                break;
            case 'image/png':
                $image = @imagecreatefrompng($tmpPath);
                break;
            case 'image/gif':
                $image = @imagecreatefromgif($tmpPath);
                break;
            case 'image/webp':
                $image = @imagecreatefromwebp($tmpPath);
                break;
            default:
                return false;
        }

        if (!$image) {
            return false;
        }

        // Preserve transparency for PNG/GIF sources
        imagepalettetotruecolor($image);
        imagealphablending($image, true);
        imagesavealpha($image, true);

        $filename = $prefix . '_' . time() . '_' . rand(1000, 9999) . '.webp';
        $dest = rtrim($destDir, '/') . '/' . $filename;

        $saved = imagewebp($image, $dest, 85);
        imagedestroy($image);

        return $saved ? $filename : false;
    }
}
