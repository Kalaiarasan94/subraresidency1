<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$env_path = __DIR__ . '/backend/.env';
echo "Checking env file at: " . $env_path . "\n";
echo "File exists: " . (file_exists($env_path) ? 'Yes' : 'No') . "\n";

$env = parse_ini_file($env_path);
if ($env === false) {
    echo "parse_ini_file returned FALSE!\n";
} else {
    echo "parse_ini_file succeeded! Loaded keys:\n";
    print_r($env);
}
?>
