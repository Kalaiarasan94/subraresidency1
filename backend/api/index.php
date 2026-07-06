<?php
// backend/api/index.php
$log_file = __DIR__ . '/../logs/payment.log';
if (!file_exists(dirname($log_file))) mkdir(dirname($log_file), 0777, true);
error_log("[" . date('Y-m-d H:i:s') . "] INDEX.PHP REACHED\n", 3, $log_file);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Global error handler for debugging 500 errors
set_error_handler(function($errno, $errstr, $errfile, $errline) {
    $msg = "Error [$errno] $errstr in $errfile on line $errline";
    $log_file = __DIR__ . '/../logs/payment.log';
    if (!file_exists(dirname($log_file))) mkdir(dirname($log_file), 0777, true);
    error_log("[" . date('Y-m-d H:i:s') . "] " . $msg . "\n", 3, $log_file);
});

register_shutdown_function(function() {
    $error = error_get_last();
    if ($error !== NULL && $error['type'] === E_ERROR) {
        $msg = "Fatal Error: {$error['message']} in {$error['file']} on line {$error['line']}";
        $log_file = __DIR__ . '/../logs/payment.log';
        error_log("[" . date('Y-m-d H:i:s') . "] " . $msg . "\n", 3, $log_file);
    }
});

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

    // Determine the request path
    $request_uri = $_SERVER['REQUEST_URI'];
    $script_name = $_SERVER['SCRIPT_NAME']; // e.g. /subraresidency1/backend/api/index.php
    
    // The path we care about is what comes after index.php
    $path = str_replace($script_name, '', $request_uri);
    // Remove query string
    $path = parse_url($path, PHP_URL_PATH);
    
    // Log request
    $log_file = __DIR__ . '/../logs/payment.log';
    error_log("[" . date('Y-m-d H:i:s') . "] REQUEST: " . $_SERVER['REQUEST_METHOD'] . " " . $request_uri . " (Path: $path)\n", 3, $log_file);

    $parts = explode('/', trim($path, '/'));


$resource = $parts[0] ?? '';
$action = $parts[1] ?? '';

switch ($resource) {
    case 'rooms':
        include_once __DIR__ . '/../controllers/RoomController.php';
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
        } elseif ($action == 'updateDetails') {
            $controller->updateRoomDetails();
        } elseif ($action == 'availabilityList') {
            include_once __DIR__ . '/admin/rooms/availability_list.php';
        } elseif ($action == 'availabilityBooking') {
            include_once __DIR__ . '/admin/rooms/availability_booking.php';
        } elseif ($action == 'availabilityUpdate') {
            include_once __DIR__ . '/admin/rooms/availability_update.php';
        }
        break;

    case 'admin':
        // further nested: /admin/bookings/list
        $sub = $parts[1] ?? '';
        $subAction = $parts[2] ?? '';
        if ($sub === 'bookings') {
            if ($subAction === 'list') {
                include_once __DIR__ . '/admin/bookings/list.php';
            }
        }
        break;

    case 'bookings':
        include_once __DIR__ . '/../controllers/BookingController.php';
        $controller = new BookingController();
        if ($action == 'create') {
            $controller->create();
        } elseif ($action == 'view') {
            include_once __DIR__ . '/admin/rooms/booking_view.php';
        } elseif ($action == 'qrScan') {
            include_once __DIR__ . '/bookings/qr_scan.php';
        }
        break;

        case 'payments':
            // payments/createOrder -> create Razorpay order for a booking
            if ($action == 'createOrder') {
                include_once __DIR__ . '/payments/create_order.php';
            } elseif ($action == 'verify') {
                include_once __DIR__ . '/payments/verify.php';
            }
            break;

    case 'auth':
        include_once __DIR__ . '/../controllers/AuthController.php';
        $controller = new AuthController();
        if ($action == 'admin' || $action == 'reception' || $action == 'receptionist') {
            $controller->login($action);
        }
        break;

    case 'receptionist':
        if ($action == 'notifications') {
            include_once __DIR__ . '/receptionist/notifications.php';
        } elseif ($action == 'markRead') {
            include_once __DIR__ . '/receptionist/mark_read.php';
        }
        break;

    case 'dashboard':
        include_once __DIR__ . '/../controllers/DashboardController.php';
        $controller = new DashboardController();
        if ($action == 'admin') {
            $controller->getAdminStats();
        } elseif ($action == 'receptionist') {
            $controller->getReceptionistStats();
        }
        break;

    case 'management':
        include_once __DIR__ . '/../controllers/ManagementController.php';
        $controller = new ManagementController();
        if ($action == 'guests') {
            $controller->getGuestDirectory();
        } elseif ($action == 'settlements') {
            $controller->getSettlements();
        } elseif ($action == 'logs') {
            $controller->getStayLogs();
        }
        break;

    case 'settings':
        include_once __DIR__ . '/../controllers/SettingsController.php';
        $controller = new SettingsController();
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $controller->getAllSettings();
        } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $controller->updateSettings();
        }
        break;

    default:
        http_response_code(404);
        echo json_encode(array("message" => "Endpoint not found. Path: " . $path));
        break;
}
?>
