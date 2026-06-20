<?php
// backend/api/index.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

    // Determine the request path using PATH_INFO if available (for built‑in PHP server)
    $path = '';
    if (isset($_SERVER['PATH_INFO'])) {
        $path = $_SERVER['PATH_INFO'];
    } else {
        // Fallback: strip base_path from REQUEST_URI
        $request_uri = $_SERVER['REQUEST_URI'];
        $base_path = '/api/index.php';
        $path = str_replace($base_path, '', $request_uri);
    }
    // Clean and split the path
    $path = parse_url($path, PHP_URL_PATH);
    $parts = explode('/', trim($path, '/'));


$resource = $parts[0] ?? '';
$action = $parts[1] ?? '';

switch ($resource) {
    case 'rooms':
        include_once '../controllers/RoomController.php';
        $controller = new RoomController();
        if ($action == 'categories') {
            $controller->getCategories();
        } elseif ($action == 'list') {
            $controller->getAllRooms();
        } elseif ($action == 'create') {
            $controller->create();
        } elseif ($action == 'createCategory') {
            $controller->createCategory();
        } elseif ($action == 'details') {
            $id = $_GET['id'] ?? null;
            $controller->getRoomById($id);
        } elseif ($action == 'updateStatus') {
            $controller->updateStatus();
        } elseif ($action == 'availabilityList') {
            include_once __DIR__ . '/admin/rooms/availability_list.php';
        } elseif ($action == 'availabilityBooking') {
            include_once __DIR__ . '/admin/rooms/availability_booking.php';
        } elseif ($action == 'availabilityUpdate') {
            include_once __DIR__ . '/admin/rooms/availability_update.php';
        }
        break;

    case 'bookings':
        include_once '../controllers/BookingController.php';
        $controller = new BookingController();
        if ($action == 'create') {
            $controller->create();
        }
        break;

    case 'auth':
        include_once '../controllers/AuthController.php';
        $controller = new AuthController();
        if ($action == 'admin' || $action == 'reception') {
            $controller->login($action);
        }
        break;

    case 'dashboard':
        include_once '../controllers/DashboardController.php';
        $controller = new DashboardController();
        if ($action == 'admin') {
            $controller->getAdminStats();
        }
        break;

    default:
        http_response_code(404);
        echo json_encode(array("message" => "Endpoint not found. Path: " . $path));
        break;
}
?>
