<?php
// connect.php

// 1. การจัดการ Error Reporting
// ปิดการแสดงผลข้อผิดพลาด PHP บนหน้าจอใน Production Environment เพื่อป้องกันการเปิดเผยข้อมูลอ่อนไหว
// หากต้องการ Debugging ให้เปิดสองบรรทัดด้านล่างนี้
error_reporting(E_ALL);
ini_set('display_errors', 1); // <--- เปลี่ยนจาก 0 เป็น 1 เพื่อเปิดการแสดงผลข้อผิดพลาด

// 2. การจัดการ Session: ต้องเรียกใช้ session_start() เป็นสิ่งแรกสุดเสมอ
session_start();

// 3. ตั้งค่า Header สำหรับการตอบกลับ JSON และ CORS
header('Content-Type: application/json');
// อนุญาต CORS สำหรับการพัฒนา (ควรจำกัดโดเมนที่อนุญาตใน Production เพื่อความปลอดภัย)
header('Access-Control-Allow-Origin: *'); // ตัวอย่าง: 'https://your-domain.com'
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// จัดการ Preflight request สำหรับ CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200); // ตอบกลับ 200 OK สำหรับ OPTIONS request
    exit(0);
}

// 4. ล้าง Output Buffer: ป้องกันข้อผิดพลาด "Unexpected token <" ที่เกิดจาก HTML/text ที่ถูกส่งออกมาก่อน JSON
ob_clean();

// 5. กำหนดข้อมูลการเชื่อมต่อฐานข้อมูล
$host = 'sql113.infinityfree.com';
$db = 'if0_39718643_school_db'; // ชื่อฐานข้อมูล
$user = 'if0_39718643';    // ชื่อผู้ใช้ฐานข้อมูล (ควรเปลี่ยนใน Production)
$pass = 'tehwdHBKZKx';        // รหัสผ่านฐานข้อมูล (ควรตั้งค่าใน Production)

// 6. สร้างการเชื่อมต่อฐานข้อมูล MySQLi
$conn = new mysqli($host, $user, $pass);

// 7. ฟังก์ชันสำหรับส่ง JSON response
function sendJsonResponse($status, $message, $data = []) {
    // ตรวจสอบและล้าง Output Buffer ทั้งหมดอีกครั้งก่อนส่ง JSON Response
    while (ob_get_level() > 0) {
        ob_end_clean();
    }
    echo json_encode(['status' => $status, 'message' => $message, 'data' => $data]);
    exit();
}

// 8. ตรวจสอบการเชื่อมต่อฐานข้อมูล
if ($conn->connect_error) {
    sendJsonResponse('error', "การเชื่อมต่อฐานข้อมูลล้มเหลว: " . $conn->connect_error);
}

// 9. สร้างฐานข้อมูลหากยังไม่มี (เหมาะสำหรับ Initial Setup เท่านั้น ไม่ควรทำทุกครั้งใน Production)
$sql_create_db = "CREATE DATABASE IF NOT EXISTS $db";
if ($conn->query($sql_create_db) === TRUE) {
    // เลือกใช้ฐานข้อมูลที่สร้างหรือมีอยู่แล้ว
    $conn->select_db($db);

    // SQL สำหรับสร้างตาราง
    $tables = [
        "CREATE TABLE IF NOT EXISTS `admins` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `username` VARCHAR(255) NOT NULL UNIQUE,
            `password` VARCHAR(255) NOT NULL
        )",
        "CREATE TABLE IF NOT EXISTS `students` (
            `student_id` VARCHAR(50) PRIMARY KEY,
            `first_name` VARCHAR(255) NOT NULL,
            `last_name` VARCHAR(255) NOT NULL,
            `class` VARCHAR(50) NOT NULL,
            `room_number` INT NOT NULL
        )",
        "CREATE TABLE IF NOT EXISTS `activities` (
            `activity_id` INT AUTO_INCREMENT PRIMARY KEY,
            `image_url` VARCHAR(255) NULL,
            `activity_name` VARCHAR(255) NOT NULL,
            `description` TEXT,
            `access_code` VARCHAR(255) NOT NULL UNIQUE
        )",
        "CREATE TABLE IF NOT EXISTS `quizzes` (
            `quiz_id` INT AUTO_INCREMENT PRIMARY KEY,
            `activity_id` INT NOT NULL,
            `question` TEXT NOT NULL,
            `option_a` TEXT NOT NULL,
            `option_b` TEXT NOT NULL,
            `option_c` TEXT NOT NULL,
            `option_d` TEXT NOT NULL,
            `correct_answer` CHAR(1) NOT NULL,
            `score_per_question` INT NOT NULL DEFAULT 1,
            FOREIGN KEY (`activity_id`) REFERENCES `activities`(`activity_id`) ON DELETE CASCADE
        )",
        "CREATE TABLE IF NOT EXISTS `student_activity_logs` (
            `log_id` INT AUTO_INCREMENT PRIMARY KEY,
            `student_id` VARCHAR(50) NOT NULL,
            `activity_id` INT NOT NULL,
            `score` INT DEFAULT 0,
            `is_completed` BOOLEAN DEFAULT FALSE,
            `timestamp` DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (`student_id`) REFERENCES `students`(`student_id`) ON DELETE CASCADE,
            FOREIGN KEY (`activity_id`) REFERENCES `activities`(`activity_id`) ON DELETE CASCADE,
            UNIQUE (`student_id`, `activity_id`) -- นักเรียนทำแต่ละกิจกรรมได้เพียงครั้งเดียว (หรืออัพเดทคะแนน)
        )",
        "CREATE TABLE IF NOT EXISTS `certificates` (
            `certificate_id` INT AUTO_INCREMENT PRIMARY KEY,
            `template_image_url` VARCHAR(255) NOT NULL,
            `start_number` INT NOT NULL,
            `end_number` INT NOT NULL,
            UNIQUE (`template_image_url`)
        )",
        "CREATE TABLE IF NOT EXISTS `issued_certificates` (
            `issued_id` INT AUTO_INCREMENT PRIMARY KEY,
            `student_id` VARCHAR(50) NOT NULL UNIQUE, -- นักเรียน 1 คนได้รับ 1 เกียรติบัตร
            `certificate_id` INT NOT NULL,
            `certificate_number` INT UNIQUE, -- เลขที่เกียรติบัตรต้องไม่ซ้ำกัน
            `issue_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (`student_id`) REFERENCES `students`(`student_id`) ON DELETE CASCADE,
            FOREIGN KEY (`certificate_id`) REFERENCES `certificates`(`certificate_id`) ON DELETE CASCADE
        )"
    ];

    foreach ($tables as $table_sql) {
        if ($conn->query($table_sql) === FALSE) {
            error_log("Error creating table: " . $conn->error);
        }
    }

    // ตรวจสอบและเพิ่มข้อมูล Admin เริ่มต้น (sk123 / sk123) หากยังไม่มี
    $stmt_check_admin = $conn->prepare("SELECT COUNT(*) FROM `admins` WHERE username = 'sk123'");
    $stmt_check_admin->execute();
    $stmt_check_admin->bind_result($count);
    $stmt_check_admin->fetch();
    $stmt_check_admin->close();

    if ($count == 0) {
        $hashed_password = password_hash('sk123', PASSWORD_DEFAULT);
        $stmt_insert_admin = $conn->prepare("INSERT INTO `admins` (username, password) VALUES ('sk123', ?)");
        $stmt_insert_admin->bind_param("s", $hashed_password);
        if ($stmt_insert_admin->execute()) {
            error_log("Default admin user 'sk123' added.");
        } else {
            error_log("Error adding default admin: " . $stmt_insert_admin->error);
        }
        $stmt_insert_admin->close();
    }

} else {
    sendJsonResponse('error', "ข้อผิดพลาดในการสร้างฐานข้อมูล: " . $conn->error);
}

/**
 * Helper function for handling file uploads.
 * @param string $input_name The name of the file input field (e.g., 'image_file').
 * @param string $upload_dir The directory where the file should be uploaded (relative to connect.php).
 * @param array $allowed_types Allowed MIME types (e.g., ['image/jpeg', 'image/png']).
 * @param int $max_size Maximum allowed file size in bytes.
 * @return string|false The path to the uploaded file relative to the web root, or false on failure.
 */
function handleFileUpload($input_name, $upload_dir, $allowed_types, $max_size) {
    if (!isset($_FILES[$input_name]) || $_FILES[$input_name]['error'] !== UPLOAD_ERR_OK) {
        error_log("File upload error for input {$input_name}: " . ($_FILES[$input_name]['error'] ?? 'No file uploaded or unknown error'));
        return false;
    }

    $file = $_FILES[$input_name];
    $file_tmp_name = $file['tmp_name'];
    $file_name = basename($file['name']);
    $file_type = $file['type'];
    $file_size = $file['size'];

    // Validate file type
    if (!in_array($file_type, $allowed_types)) {
        error_log("Invalid file type uploaded: {$file_type}");
        return false;
    }

    // Validate file size
    if ($file_size > $max_size) {
        error_log("File too large: {$file_size} bytes, max allowed {$max_size} bytes");
        return false;
    }

    // Create upload directory if it doesn't exist
    if (!is_dir($upload_dir)) {
        // ใช้ 0755 หรือ 0775 ใน Production เพื่อความปลอดภัยที่สูงขึ้น
        if (!mkdir($upload_dir, 0777, true)) {
            error_log("Failed to create upload directory: {$upload_dir}");
            return false;
        }
    }

    // Generate a unique file name to prevent overwrites
    $extension = pathinfo($file_name, PATHINFO_EXTENSION);
    $new_file_name = uniqid('img_') . '.' . $extension;
    $destination = $upload_dir . $new_file_name;

    if (move_uploaded_file($file_tmp_name, $destination)) {
        return $destination;
    } else {
        error_log("Failed to move uploaded file from {$file_tmp_name} to {$destination}");
        return false;
    }
}

/**
 * Attempts to issue a certificate to a single student if they meet the criteria.
 * This function handles all eligibility checks and the issuance process.
 *
 * @param mysqli $conn The database connection object.
 * @param string $student_id The student ID to check and issue certificate for.
 * @return array An associative array with 'status' (issued, skipped, error) and 'message'.
 */
function issueCertificateForStudent($conn, $student_id) {
    // 1. Check if certificate template exists
    $stmt_cert_templates = $conn->prepare("SELECT certificate_id, template_image_url, start_number, end_number FROM `certificates` ORDER BY certificate_id ASC LIMIT 1");
    if (!$stmt_cert_templates) {
        return ['status' => 'error', 'message' => 'Failed to prepare statement for certificate templates: ' . $conn->error];
    }
    $stmt_cert_templates->execute();
    $result_templates = $stmt_cert_templates->get_result();
    $certificate_template = $result_templates->fetch_assoc();
    $stmt_cert_templates->close();

    if (!$certificate_template) {
        return ['status' => 'skipped', 'message' => 'ยังไม่มีเทมเพลตเกียรติบัตรในระบบ'];
    }

    $certificate_id = $certificate_template['certificate_id'];
    $start_number = $certificate_template['start_number'];
    $end_number = $certificate_template['end_number'];

    // 2. Check if student already has an issued certificate
    $stmt_check_issued = $conn->prepare("SELECT certificate_number FROM `issued_certificates` WHERE student_id = ?"); // Changed to fetch certificate_number
    if (!$stmt_check_issued) {
        return ['status' => 'error', 'message' => 'Failed to prepare statement for checking issued certificates: ' . $conn->error];
    }
    $stmt_check_issued->bind_param("s", $student_id);
    $stmt_check_issued->execute();
    $result_check_issued = $stmt_check_issued->get_result();
    if ($result_check_issued->num_rows > 0) {
        $row = $result_check_issued->fetch_assoc();
        return ['status' => 'issued', 'message' => 'นักเรียนได้รับเกียรติบัตรแล้ว', 'certificate_number' => $row['certificate_number']]; // Return existing cert number
    }
    $stmt_check_issued->close();

    // 3. Get all activities that have quizzes (only these count towards certificate eligibility)
    $activity_ids_with_quizzes = [];
    $total_possible_score_per_activity = [];
    $stmt_activity_quiz_check = $conn->prepare("SELECT activity_id, SUM(score_per_question) as total_score FROM quizzes GROUP BY activity_id");
    if (!$stmt_activity_quiz_check) {
        return ['status' => 'error', 'message' => 'Failed to prepare statement for activities with quizzes: ' . $conn->error];
    }
    $stmt_activity_quiz_check->execute();
    $result_activity_quiz_check = $stmt_activity_quiz_check->get_result();
    while ($row = $result_activity_quiz_check->fetch_assoc()) {
        $activity_ids_with_quizzes[] = $row['activity_id'];
        $total_possible_score_per_activity[$row['activity_id']] = $row['total_score'];
    }
    $stmt_activity_quiz_check->close();

    // If there are no activities with quizzes, no certificate can be issued based on quiz completion
    if (empty($activity_ids_with_quizzes)) {
        return ['status' => 'skipped', 'message' => 'ยังไม่มีกิจกรรมที่มีแบบทดสอบในระบบ'];
    }

    // 4. Check student's activity logs for completion and scores for relevant activities
    $stmt_student_logs = $conn->prepare("
        SELECT sal.activity_id, sal.score, sal.is_completed
        FROM `student_activity_logs` sal
        WHERE sal.student_id = ? AND sal.activity_id IN (" . implode(',', array_fill(0, count($activity_ids_with_quizzes), '?')) . ")
    ");
    if (!$stmt_student_logs) {
        return ['status' => 'error', 'message' => 'Failed to prepare statement for student logs: ' . $conn->error];
    }

    $types = str_repeat('i', count($activity_ids_with_quizzes));
    $bind_params = array_merge([$student_id], $activity_ids_with_quizzes);
    // Reference variables for bind_param
    $refs = [];
    foreach($bind_params as $key => $value) {
        $refs[$key] = &$bind_params[$key];
    }
    call_user_func_array([$stmt_student_logs, 'bind_param'], array_merge(['s' . $types], $refs)); // 's' for student_id


    $stmt_student_logs->execute();
    $result_student_logs = $stmt_student_logs->get_result();

    $student_total_score = 0;
    $student_overall_possible_score = 0;
    $completed_quizzed_activities_by_student = [];

    while ($row = $result_student_logs->fetch_assoc()) {
        if ($row['is_completed']) {
            $completed_quizzed_activities_by_student[] = $row['activity_id'];
            $student_total_score += $row['score'];
        }
    }
    $stmt_student_logs->close();

    // Sum up the total possible score for ALL quizzes the student needs to complete
    foreach ($activity_ids_with_quizzes as $activity_id) {
        $student_overall_possible_score += $total_possible_score_per_activity[$activity_id] ?? 0;
    }

    // 5. Determine if the student passed all criteria
    // Check if ALL activities that have quizzes are completed by the student
    $all_quizzed_activities_completed = (count($completed_quizzed_activities_by_student) === count($activity_ids_with_quizzes));

    $passed_criteria = false;
    if ($all_quizzed_activities_completed && count($activity_ids_with_quizzes) > 0) {
        // Calculate overall percentage only if there are quizzes and all are completed
        $overall_percentage = ($student_overall_possible_score > 0) ? ($student_total_score / $student_overall_possible_score) * 100 : 0;
        if ($overall_percentage >= 70) {
            $passed_criteria = true;
        } else {
            return ['status' => 'skipped', 'message' => 'คะแนนเฉลี่ยรวมไม่ถึง 70%'];
        }
    } else if (count($activity_ids_with_quizzes) == 0) {
        // If there are no quizzes defined, all students are eligible
        $passed_criteria = true;
    } else {
        return ['status' => 'skipped', 'message' => 'ยังทำกิจกรรมที่มีแบบทดสอบไม่ครบทุกกิจกรรม'];
    }


    if ($passed_criteria) {
        // 6. Find an unused certificate number within the defined range
        $next_certificate_number = $start_number;
        $used_numbers = [];
        $stmt_used_certs = $conn->prepare("SELECT certificate_number FROM `issued_certificates` WHERE certificate_id = ?");
        if (!$stmt_used_certs) {
            return ['status' => 'error', 'message' => 'Failed to prepare statement for used certificate numbers: ' . $conn->error];
        }
        $stmt_used_certs->bind_param("i", $certificate_id);
        $stmt_used_certs->execute();
        $result_used_certs = $stmt_used_certs->get_result();
        while ($row = $result_used_certs->fetch_assoc()) {
            $used_numbers[$row['certificate_number']] = true;
        }
        $stmt_used_certs->close();

        while ($next_certificate_number <= $end_number && isset($used_numbers[$next_certificate_number])) {
            $next_certificate_number++;
        }

        if ($next_certificate_number > $end_number) {
            return ['status' => 'skipped', 'message' => 'ไม่มีเลขที่เกียรติบัตรว่างสำหรับเทมเพลตปัจจุบัน'];
        }

        // 7. Issue the certificate
        $stmt_issue_cert = $conn->prepare("INSERT INTO `issued_certificates` (student_id, certificate_id, certificate_number) VALUES (?, ?, ?)");
        if (!$stmt_issue_cert) {
            return ['status' => 'error', 'message' => 'Failed to prepare statement for issuing certificate: ' . $conn->error];
        }
        $stmt_issue_cert->bind_param("sii", $student_id, $certificate_id, $next_certificate_number);
        if ($stmt_issue_cert->execute()) {
            return ['status' => 'issued', 'message' => 'ออกเกียรติบัตรสำเร็จ', 'certificate_number' => $next_certificate_number]; // Return new cert number
        } else {
            return ['status' => 'error', 'message' => 'ข้อผิดพลาดในการออกเกียรติบัตร: ' . $stmt_issue_cert->error];
        }
        $stmt_issue_cert->close();
    } else {
        return ['status' => 'skipped', 'message' => 'ไม่ผ่านเกณฑ์การรับเกียรติบัตร'];
    }
}


// 10. รับค่าจาก request method
$method = $_SERVER['REQUEST_METHOD'];
// ตรวจสอบ Content-Type เพื่อแยกแยะระหว่าง application/json และ multipart/form-data
// สำหรับ multipart/form-data (เช่น การอัปโหลดไฟล์) ข้อมูลจะอยู่ใน $_POST และ $_FILES
if ($method === 'POST' && (strpos($_SERVER['CONTENT_TYPE'], 'multipart/form-data') !== false || strpos($_SERVER['CONTENT_TYPE'], 'application/x-www-form-urlencoded') !== false)) {
    $request = $_POST;
} else {
    // สำหรับ application/json และ methods อื่นๆ (PUT, DELETE)
    $request = json_decode(file_get_contents('php://input'), true);
}


// 11. Routing ตาม action parameter
$action = isset($_GET['action']) ? $_GET['action'] : '';

switch ($action) {
    case 'admin_login':
        if ($method == 'POST') {
            $username = $request['username'] ?? '';
            $password = $request['password'] ?? '';

            $stmt = $conn->prepare("SELECT id, password FROM `admins` WHERE username = ?");
            $stmt->bind_param("s", $username);
            $stmt->execute();
            $stmt->store_result();
            $stmt->bind_result($id, $hashed_password);

            if ($stmt->num_rows > 0 && $stmt->fetch() && password_verify($password, $hashed_password)) {
                $_SESSION['admin_logged_in'] = true;
                $_SESSION['admin_id'] = $id;
                sendJsonResponse('success', 'เข้าสู่ระบบผู้ดูแลระบบสำเร็จ');
            } else {
                sendJsonResponse('error', 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
            }
            $stmt->close();
        } else {
            sendJsonResponse('error', 'เมธอดไม่ถูกต้อง', ['method' => $method]);
        }
        break;

    case 'admin_logout':
        if ($method == 'POST') {
            session_unset();   // ลบตัวแปร Session ทั้งหมด
            session_destroy(); // ทำลาย Session
            sendJsonResponse('success', 'ออกจากระบบผู้ดูแลระบบสำเร็จ');
        } else {
            sendJsonResponse('error', 'เมธอดไม่ถูกต้อง', ['method' => $method]);
        }
        break;

    case 'check_admin_session':
        if ($method == 'GET') {
            if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
                sendJsonResponse('success', 'มีเซสชันผู้ดูแลระบบ');
            } else {
                sendJsonResponse('error', 'ไม่มีเซสชันผู้ดูแลระบบ');
            }
        } else {
            sendJsonResponse('error', 'เมธอดไม่ถูกต้อง', ['method' => $method]);
        }
        break;

    case 'student_login':
        if ($method == 'POST') {
            $student_id = $request['student_id'] ?? '';
            $stmt = $conn->prepare("SELECT student_id, first_name, last_name, class, room_number FROM `students` WHERE student_id = ?");
            $stmt->bind_param("s", $student_id);
            $stmt->execute();
            $result = $stmt->get_result();
            if ($result->num_rows > 0) {
                $student_data = $result->fetch_assoc();
                // Store student data in session for student dashboard
                $_SESSION['student_logged_in'] = true;
                $_SESSION['student_id'] = $student_data['student_id'];
                sendJsonResponse('success', 'เข้าสู่ระบบนักเรียนสำเร็จ', $student_data);
            } else {
                sendJsonResponse('error', 'ไม่พบเลขประจำตัวนักเรียนนี้');
            }
            $stmt->close();
        } else {
            sendJsonResponse('error', 'เมธอดไม่ถูกต้อง', ['method' => $method]);
        }
        break;

    case 'student_logout': // เพิ่มการจัดการ Student Logout
        if ($method == 'POST') {
            // ลบเฉพาะตัวแกร Session ที่เกี่ยวข้องกับนักเรียน
            unset($_SESSION['student_logged_in']);
            unset($_SESSION['student_id']);
            sendJsonResponse('success', 'ออกจากระบบนักเรียนสำเร็จ');
        } else {
            sendJsonResponse('error', 'เมธอดไม่ถูกต้อง', ['method' => $method]);
        }
        break;

    case 'get_student_session':
        if ($method == 'GET') {
            if (isset($_SESSION['student_logged_in']) && $_SESSION['student_logged_in'] === true && isset($_SESSION['student_id'])) {
                $student_id = $_SESSION['student_id'];
                $stmt = $conn->prepare("SELECT student_id, first_name, last_name, class, room_number FROM `students` WHERE student_id = ?");
                $stmt->bind_param("s", $student_id);
                $stmt->execute();
                $result = $stmt->get_result();
                if ($result->num_rows > 0) {
                    sendJsonResponse('success', 'ดึงข้อมูลนักเรียนจากเซสชันสำเร็จ', $result->fetch_assoc());
                } else {
                    sendJsonResponse('error', 'ไม่พบข้อมูลนักเรียน');
                }
                $stmt->close();
            } else {
                sendJsonResponse('error', 'ไม่มีเซสชันนักเรียน');
            }
        } else {
            sendJsonResponse('error', 'เมธอดไม่ถูกต้อง', ['method' => $method]);
        }
        break;

    case 'get_students':
        if ($method == 'GET') {
            if (!(isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true)) {
                sendJsonResponse('error', 'ไม่อนุญาต: ต้องเป็นผู้ดูแลระบบเท่านั้น');
            }

            $filter_class = $_GET['class'] ?? '';
            $filter_room = $_GET['room'] ?? ''; 
            $page = max(1, (int)($_GET['page'] ?? 1));
            $limit = max(1, (int)($_GET['limit'] ?? 10)); // Default limit to 10 if not provided
            $offset = ($page - 1) * $limit;

            $sql_conditions = "WHERE 1=1";
            $params = [];
            $types = "";

            if (!empty($filter_class)) {
                if (!empty($filter_room) && is_numeric($filter_room)) {
                    $full_class_name = $filter_class . '/' . $filter_room;
                    $sql_conditions .= " AND class = ?";
                    $params[] = $full_class_name;
                    $types .= "s";
                } else {
                    $sql_conditions .= " AND class LIKE ?";
                    $params[] = $filter_class . '%';
                    $types .= "s";
                }
            }

            // Get total records for pagination
            $stmt_count = $conn->prepare("SELECT COUNT(*) AS total FROM `students` " . $sql_conditions);
            if (!$stmt_count) {
                sendJsonResponse('error', 'Failed to prepare count statement: ' . $conn->error);
            }
            if (!empty($params)) {
                $stmt_count->bind_param($types, ...$params);
            }
            $stmt_count->execute();
            $result_count = $stmt_count->get_result();
            $total_records = $result_count->fetch_assoc()['total'];
            $stmt_count->close();

            $total_pages = ceil($total_records / $limit);

            // Get actual student data with pagination
            $sql = "SELECT student_id, first_name, last_name, class, room_number FROM `students` " . $sql_conditions . " ORDER BY class ASC, room_number ASC, student_id ASC LIMIT ? OFFSET ?";
            $stmt = $conn->prepare($sql);
            if (!$stmt) {
                sendJsonResponse('error', 'Failed to prepare student data statement: ' . $conn->error);
            }

            // Bind parameters for conditions + limit + offset
            if (!empty($params)) {
                $params[] = $limit;
                $params[] = $offset;
                $types .= "ii";
                $stmt->bind_param($types, ...$params);
            } else {
                $stmt->bind_param("ii", $limit, $offset);
            }
            
            $stmt->execute();
            $result = $stmt->get_result();
            $students = [];
            while ($row = $result->fetch_assoc()) {
                $students[] = $row;
            }
            $stmt->close();

            sendJsonResponse('success', 'ดึงข้อมูลนักเรียนสำเร็จ', [
                'students' => $students,
                'total_records' => $total_records,
                'current_page' => $page,
                'total_pages' => $total_pages
            ]);
        } else {
            sendJsonResponse('error', 'เมธอดไม่ถูกต้อง', ['method' => $method]);
        }
        break;
    
    case 'get_unique_classes': // เพิ่ม action ใหม่เพื่อดึงชั้นเรียนที่ไม่ซ้ำกัน
        if ($method == 'GET') {
            if (!(isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true)) {
                sendJsonResponse('error', 'ไม่อนุญาต: ต้องเป็นผู้ดูแลระบบเท่านั้น');
            }
            // เนื่องจากชั้นเรียนตอนนี้เก็บเป็น "มัธยมศึกษาปีที่ X/Y" เราอาจจะต้องดึงเฉพาะส่วน "มัธยมศึกษาปีที่ X" ออกมา
            // หรืออาจจะให้ frontend จัดการ dropdwon "ชั้น" เป็น fixed value เหมือนเดิม แล้ว backend กรองตาม LIKE
            // ตามที่คุยกันก่อนหน้านี้ fixedClasses ใน frontend ใช้ค่า "มัธยมศึกษาปีที่ X" อยู่แล้ว
            $stmt = $conn->prepare("SELECT DISTINCT SUBSTRING_INDEX(class, '/', 1) as base_class FROM `students` ORDER BY base_class ASC");
            $stmt->execute();
            $result = $stmt->get_result();
            $classes = [];
            while ($row = $result->fetch_assoc()) {
                if (!in_array($row['base_class'], $classes)) { // Ensure unique base classes
                    $classes[] = $row['base_class'];
                }
            }
            sendJsonResponse('success', 'ดึงข้อมูลชั้นเรียนสำเร็จ', $classes);
            $stmt->close();
        } else {
            sendJsonResponse('error', 'เมธอดไม่ถูกต้อง', ['method' => $method]);
        }
        break;

    case 'get_rooms_by_class': // เพิ่ม action ใหม่เพื่อดึงห้องเรียนตามชั้นที่เลือก
        if ($method == 'GET') {
            if (!(isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true)) {
                sendJsonResponse('error', 'ไม่อนุญาต: ต้องเป็นผู้ดูแลระบบเท่านั้น');
            }
            $selected_base_class = $_GET['class'] ?? ''; // This will be "มัธยมศึกษาปีที่ 5"
            if (empty($selected_base_class)) {
                sendJsonResponse('error', 'ต้องระบุชั้นเรียน');
            }
            // ดึงเฉพาะเลขห้องท้ายสุด (e.g., '1', '2') จากคอลัมน์ 'class' ที่เป็น 'มัธยมศึกษาปีที่ X/Y'
            $stmt = $conn->prepare("SELECT DISTINCT SUBSTRING_INDEX(class, '/', -1) as room_num FROM `students` WHERE class LIKE ? ORDER BY room_num ASC");
            $like_param = $selected_base_class . '%';
            $stmt->bind_param("s", $like_param);
            $stmt->execute();
            $result = $stmt->get_result();
            $rooms = [];
            while ($row = $result->fetch_assoc()) {
                // Ensure it's a numeric room and not the full class name if no '/' was found
                if (is_numeric($row['room_num']) && !in_array((int)$row['room_num'], $rooms)) {
                     $rooms[] = (int)$row['room_num'];
                }
            }
            sort($rooms); // Sort numeric rooms
            sendJsonResponse('success', 'ดึงข้อมูลห้องเรียนสำเร็จ', $rooms);
            $stmt->close();
        } else {
            sendJsonResponse('error', 'เมธอดไม่ถูกต้อง', ['method' => $method]);
        }
        break;


    case 'add_student':
        if ($method == 'POST') {
            if (!(isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true)) {
                sendJsonResponse('error', 'ไม่อนุญาต: ต้องเป็นผู้ดูแลระบบเท่านั้น');
            }
            $student_id = $request['student_id'] ?? '';
            $first_name = $request['first_name'] ?? '';
            $last_name = $request['last_name'] ?? '';
            $class = $request['class'] ?? ''; // This will be "มัธยมศึกษาปีที่ 5/2"
            $room_number = $request['room_number'] ?? 0; // This is 'เลขที่'

            $stmt_check = $conn->prepare("SELECT COUNT(*) FROM `students` WHERE student_id = ?");
            $stmt_check->bind_param("s", $student_id);
            $stmt_check->execute();
            $stmt_check->bind_result($count);
            $stmt_check->fetch();
            $stmt_check->close();

            if ($count > 0) {
                sendJsonResponse('error', 'เลขประจำตัวนักเรียนนี้มีอยู่ในระบบแล้ว');
            } else {
                $stmt = $conn->prepare("INSERT INTO `students` (student_id, first_name, last_name, class, room_number) VALUES (?, ?, ?, ?, ?)");
                $stmt->bind_param("ssssi", $student_id, $first_name, $last_name, $class, $room_number);
                if ($stmt->execute()) {
                    sendJsonResponse('success', 'เพิ่มนักเรียนสำเร็จ');
                } else {
                    sendJsonResponse('error', 'ข้อผิดพลาดในการเพิ่มนักเรียน: ' . $stmt->error);
                }
                $stmt->close();
            }
        } else {
            sendJsonResponse('error', 'เมธอดไม่ถูกต้อง', ['method' => $method]);
        }
        break;

    case 'update_student':
        if ($method == 'PUT') {
            if (!(isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true)) {
                sendJsonResponse('error', 'ไม่อนุญาต: ต้องเป็นผู้ดูแลระบบเท่านั้น');
            }
            $student_id = $request['student_id'] ?? '';
            $first_name = $request['first_name'] ?? '';
            $last_name = $request['last_name'] ?? '';
            $class = $request['class'] ?? ''; // This will be "มัธยมศึกษาปีที่ 5/2"
            $room_number = $request['room_number'] ?? 0; // This is 'เลขที่'

            $stmt = $conn->prepare("UPDATE `students` SET first_name = ?, last_name = ?, class = ?, room_number = ? WHERE student_id = ?");
            $stmt->bind_param("sssis", $first_name, $last_name, $class, $room_number, $student_id);
            if ($stmt->execute()) {
                sendJsonResponse('success', 'อัปเดตข้อมูลนักเรียนสำเร็จ');
            } else {
                sendJsonResponse('error', 'ข้อผิดพลาดในการอัปเดตข้อมูลนักเรียน: ' . $stmt->error);
            }
            $stmt->close();
        } else {
            sendJsonResponse('error', 'เมธอดไม่ถูกต้อง', ['method' => $method]);
        }
        break;

    case 'delete_student':
        if ($method == 'DELETE') {
            if (!(isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true)) {
                sendJsonResponse('error', 'ไม่อนุญาต: ต้องเป็นผู้ดูแลระบบเท่านั้น');
            }
            $student_id = $_GET['student_id'] ?? '';
            $stmt = $conn->prepare("DELETE FROM `students` WHERE student_id = ?");
            $stmt->bind_param("s", $student_id);
            if ($stmt->execute()) {
                sendJsonResponse('success', 'ลบนักเรียนสำเร็จ');
            } else {
                sendJsonResponse('error', 'ข้อผิดพลาดในการลบนักเรียน: ' . $stmt->error);
            }
            $stmt->close();
        } else {
            sendJsonResponse('error', 'เมธอดไม่ถูกต้อง', ['method' => $method]);
        }
        break;

    case 'upload_students_excel':
        if ($method == 'POST') {
            if (!(isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true)) {
                sendJsonResponse('error', 'ไม่อนุญาต: ต้องเป็นผู้ดูแลระบบเท่านั้น');
            }
            $excel_data = $request['students_data'] ?? [];
            $inserted_count = 0;
            $failed_count = 0;
            $errors = [];

            // ใช้ ON DUPLICATE KEY UPDATE เพื่ออัปเดตข้อมูลหาก Student ID มีอยู่แล้ว
            $stmt = $conn->prepare("INSERT INTO `students` (student_id, first_name, last_name, class, room_number) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE first_name=VALUES(first_name), last_name=VALUES(last_name), class=VALUES(class), room_number=VALUES(room_number)");
            
            foreach ($excel_data as $row) {
                $student_id = $row['student_id'] ?? '';
                $first_name = $row['first_name'] ?? '';
                $last_name = $row['last_name'] ?? '';
                $class = $row['class'] ?? ''; // This is "มัธยมศึกษาปีที่ 5/2"
                $room_number = $row['room_number'] ?? 0; // This is 'เลขที่'

                if (empty($student_id) || empty($first_name) || empty($class)) {
                    $failed_count++;
                    $errors[] = "ข้อมูลไม่สมบูรณ์สำหรับแถว: " . json_encode($row);
                    continue;
                }

                $stmt->bind_param("ssssi", $student_id, $first_name, $last_name, $class, $room_number);
                if ($stmt->execute()) {
                    $inserted_count++;
                } else {
                    $failed_count++;
                    $errors[] = "ข้อผิดพลาดในการแทรก/อัปเดตนักเรียน " . $student_id . ": " . $stmt->error;
                }
            }
            $stmt->close();

            if ($inserted_count > 0 || $failed_count > 0) {
                sendJsonResponse('success', "นำเข้าข้อมูลสำเร็จ: {$inserted_count} รายการ, ข้อผิดพลาด: {$failed_count} รายการ", ['errors' => $errors]);
            } else {
                sendJsonResponse('error', 'ไม่พบข้อมูลในไฟล์ Excel หรือไฟล์ไม่ถูกต้อง');
            }

        } else {
            sendJsonResponse('error', 'เมธอดไม่ถูกต้อง', ['method' => $method]);
        }
        break;

    case 'get_activities':
        if ($method == 'GET') {
            $stmt = $conn->prepare("SELECT activity_id, image_url, activity_name, description, access_code FROM `activities` ORDER BY activity_id ASC");
            $stmt->execute();
            $result = $stmt->get_result();
            $activities = [];
            while ($row = $result->fetch_assoc()) {
                $activities[] = $row;
            }
            sendJsonResponse('success', 'ดึงข้อมูลกิจกรรมสำเร็จ', $activities);
            $stmt->close();
        } else {
            sendJsonResponse('error', 'เมธอดไม่ถูกต้อง', ['method' => $method]);
        }
        break;

    case 'add_activity':
        if ($method == 'POST') {
            if (!(isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true)) {
                sendJsonResponse('error', 'ไม่อนุญาต: ต้องเป็นผู้ดูแลระบบเท่านั้น');
            }
            $activity_name = $request['activity_name'] ?? '';
            $description = $request['description'] ?? '';
            $access_code = $request['access_code'] ?? '';
            $image_url = null;

            if (isset($_FILES['image_file']) && $_FILES['image_file']['error'] === UPLOAD_ERR_OK) {
                $upload_dir = 'uploads/activities/';
                $allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
                $max_size = 5 * 1024 * 1024;

                $uploaded_path = handleFileUpload('image_file', $upload_dir, $allowed_types, $max_size);
                if ($uploaded_path) {
                    $image_url = $uploaded_path;
                } else {
                    if ($_FILES['image_file']['error'] !== UPLOAD_ERR_OK) {
                        sendJsonResponse('error', 'ข้อผิดพลาดในการอัปโหลดไฟล์: ' . $_FILES['image_file']['error']);
                    } else if (!in_array($_FILES['image_file']['type'], $allowed_types)) {
                        sendJsonResponse('error', 'ประเภทไฟล์รูปภาพไม่ถูกต้อง. รองรับเฉพาะ JPG, PNG, GIF');
                    } else if ($_FILES['image_file']['size'] > $max_size) {
                        sendJsonResponse('error', 'ขนาดไฟล์รูปภาพใหญ่เกินไป (สูงสุด 5 MB)');
                    } else {
                         sendJsonResponse('error', 'ไม่สามารถอัปโหลดรูปภาพได้');
                    }
                }
            }

            if (!$activity_name || !$description || !$access_code) {
                sendJsonResponse('error', 'กรุณากรอกข้อมูลกิจกรรมให้ครบถ้วน');
            }

            $stmt_check = $conn->prepare("SELECT COUNT(*) FROM `activities` WHERE access_code = ?");
            $stmt_check->bind_param("s", $access_code);
            $stmt_check->execute();
            $stmt_check->bind_result($count);
            $stmt_check->fetch();
            $stmt_check->close();

            if ($count > 0) {
                sendJsonResponse('error', 'รหัสยืนยันการเข้าฐานนี้มีอยู่ในระบบแล้ว');
            } else {
                $stmt = $conn->prepare("INSERT INTO `activities` (image_url, activity_name, description, access_code) VALUES (?, ?, ?, ?)");
                $stmt->bind_param("ssss", $image_url, $activity_name, $description, $access_code);
                if ($stmt->execute()) {
                    sendJsonResponse('success', 'เพิ่มฐานกิจกรรมสำเร็จ');
                } else {
                    sendJsonResponse('error', 'ข้อผิดพลาดในการเพิ่มฐานกิจกรรม: ' . $stmt->error);
                }
                $stmt->close();
            }
        } else {
            sendJsonResponse('error', 'เมธอดไม่ถูกต้อง', ['method' => $method]);
        }
        break;

    case 'update_activity':
        if ($method == 'POST') { // เปลี่ยนเป็น POST เพื่อรองรับ FormData ที่มีไฟล์
            if (!(isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true)) {
                sendJsonResponse('error', 'ไม่อนุญาต: ต้องเป็นผู้ดูแลระบบเท่านั้น');
            }
            $activity_id = $request['activity_id'] ?? 0;
            $activity_name = $request['activity_name'] ?? '';
            $description = $request['description'] ?? '';
            $access_code = $request['access_code'] ?? '';
            $current_image_url = $request['current_image_url'] ?? null;

            $image_url_to_save = $current_image_url;

            if (isset($_FILES['image_file']) && $_FILES['image_file']['error'] === UPLOAD_ERR_OK) {
                $upload_dir = 'uploads/activities/';
                $allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
                $max_size = 5 * 1024 * 1024;

                $uploaded_path = handleFileUpload('image_file', $upload_dir, $allowed_types, $max_size);
                if ($uploaded_path) {
                    $image_url_to_save = $uploaded_path;
                    // ลบรูปภาพเก่าถ้ามีและไม่ใช่ placeholder
                    if ($current_image_url && strpos($current_image_url, 'placehold.co') === false && file_exists($current_image_url)) {
                        unlink($current_image_url);
                    }
                } else {
                    if ($_FILES['image_file']['error'] !== UPLOAD_ERR_OK) {
                        sendJsonResponse('error', 'ข้อผิดพลาดในการอัปโหลดไฟล์ใหม่: ' . $_FILES['image_file']['error']);
                    } else if (!in_array($_FILES['image_file']['type'], $allowed_types)) {
                        sendJsonResponse('error', 'ประเภทไฟล์รูปภาพใหม่ไม่ถูกต้อง. รองรับเฉพาะ JPG, PNG, GIF');
                    } else if ($_FILES['image_file']['size'] > $max_size) {
                        sendJsonResponse('error', 'ขนาดไฟล์รูปภาพใหม่ใหญ่เกินไป (สูงสุด 5 MB)');
                    } else {
                         sendJsonResponse('error', 'ไม่สามารถอัปโหลดรูปภาพใหม่ได้');
                    }
                }
            }

            if (!$activity_name || !$description || !$access_code) {
                sendJsonResponse('error', 'กรุณากรอกข้อมูลกิจกรรมให้ครบถ้วน');
            }

            $stmt_check = $conn->prepare("SELECT COUNT(*) FROM `activities` WHERE access_code = ? AND activity_id != ?");
            $stmt_check->bind_param("si", $access_code, $activity_id);
            $stmt_check->execute();
            $stmt_check->bind_result($count);
            $stmt_check->fetch();
            $stmt_check->close();

            if ($count > 0) {
                sendJsonResponse('error', 'รหัสยืนยันการเข้าฐานนี้มีอยู่ในระบบแล้วสำหรับกิจกรรมอื่น');
            } else {
                $stmt = $conn->prepare("UPDATE `activities` SET image_url = ?, activity_name = ?, description = ?, access_code = ? WHERE activity_id = ?");
                $stmt->bind_param("ssssi", $image_url_to_save, $activity_name, $description, $access_code, $activity_id);
                if ($stmt->execute()) {
                    sendJsonResponse('success', 'อัปเดตฐานกิจกรรมสำเร็จ');
                } else {
                    sendJsonResponse('error', 'ข้อผิดพลาดในการอัปเดตฐานกิจกรรม: ' . $stmt->error);
                }
                $stmt->close();
            }
        } else {
            sendJsonResponse('error', 'เมธอดไม่ถูกต้อง', ['method' => $method]);
        }
        break;

    case 'delete_activity':
        if ($method == 'DELETE') {
            if (!(isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true)) {
                sendJsonResponse('error', 'ไม่อนุญาต: ต้องเป็นผู้ดูแลระบบเท่านั้น');
            }
            $activity_id = $_GET['activity_id'] ?? 0;

            $stmt_get_image = $conn->prepare("SELECT image_url FROM `activities` WHERE activity_id = ?");
            $stmt_get_image->bind_param("i", $activity_id);
            $stmt_get_image->execute();
            $stmt_get_image->bind_result($image_to_delete);
            $stmt_get_image->fetch();
            $stmt_get_image->close();

            $stmt = $conn->prepare("DELETE FROM `activities` WHERE activity_id = ?");
            $stmt->bind_param("i", $activity_id);
            if ($stmt->execute()) {
                if ($image_to_delete && strpos($image_to_delete, 'placehold.co') === false && file_exists($image_to_delete)) {
                    unlink($image_to_delete);
                }
                sendJsonResponse('success', 'ลบฐานกิจกรรมสำเร็จ');
            } else {
                sendJsonResponse('error', 'ข้อผิดพลาดในการลบฐานกิจกรรม: ' . $stmt->error);
            }
            $stmt->close();
        } else {
            sendJsonResponse('error', 'เมธอดไม่ถูกต้อง', ['method' => $method]);
        }
        break;

    case 'get_quizzes':
        if ($method == 'GET') {
            $activity_id = $_GET['activity_id'] ?? null;
            $sql = "SELECT quiz_id, activity_id, question, option_a, option_b, option_c, option_d, correct_answer, score_per_question FROM `quizzes`";
            $params = [];
            $types = "";

            if ($activity_id !== null && is_numeric($activity_id)) {
                $sql .= " WHERE activity_id = ?";
                $params[] = (int)$activity_id;
                $types .= "i";
            }
            $sql .= " ORDER BY quiz_id ASC";

            $stmt = $conn->prepare($sql);
            if (!empty($params)) {
                $stmt->bind_param($types, ...$params);
            }
            $stmt->execute();
            $result = $stmt->get_result();
            $quizzes = [];
            while ($row = $result->fetch_assoc()) {
                $quizzes[] = $row;
            }
            sendJsonResponse('success', 'ดึงข้อมูลแบบทดสอบสำเร็จ', $quizzes);
            $stmt->close();
        } else {
            sendJsonResponse('error', 'เมธอดไม่ถูกต้อง', ['method' => $method]);
        }
        break;

    case 'add_quiz':
        if ($method == 'POST') {
            if (!(isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true)) {
                sendJsonResponse('error', 'ไม่อนุญาต: ต้องเป็นผู้ดูแลระบบเท่านั้น');
            }
            $activity_id = $request['activity_id'] ?? 0;
            $question = $request['question'] ?? '';
            $option_a = $request['option_a'] ?? '';
            $option_b = $request['option_b'] ?? '';
            $option_c = $request['option_c'] ?? '';
            $option_d = $request['option_d'] ?? '';
            $correct_answer = strtoupper($request['correct_answer'] ?? '');
            $score_per_question = $request['score_per_question'] ?? 1;

            if (!in_array($correct_answer, ['A', 'B', 'C', 'D'])) {
                sendJsonResponse('error', 'เฉลยต้องเป็น A, B, C หรือ D');
            }

            $stmt = $conn->prepare("INSERT INTO `quizzes` (activity_id, question, option_a, option_b, option_c, option_d, correct_answer, score_per_question) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("issssssi", $activity_id, $question, $option_a, $option_b, $option_c, $option_d, $correct_answer, $score_per_question);
            if ($stmt->execute()) {
                sendJsonResponse('success', 'เพิ่มแบบทดสอบสำเร็จ');
            } else {
                sendJsonResponse('error', 'ข้อผิดพลาดในการเพิ่มแบบทดสอบ: ' . $stmt->error);
            }
            $stmt->close();
        } else {
            sendJsonResponse('error', 'เมธอดไม่ถูกต้อง', ['method' => $method]);
        }
        break;

    case 'update_quiz':
        if ($method == 'PUT') {
            if (!(isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true)) {
                sendJsonResponse('error', 'ไม่อนุญาต: ต้องเป็นผู้ดูแลระบบเท่านั้น');
            }
            $quiz_id = $request['quiz_id'] ?? 0;
            $activity_id = $request['activity_id'] ?? 0;
            $question = $request['question'] ?? '';
            $option_a = $request['option_a'] ?? '';
            $option_b = $request['option_b'] ?? '';
            $option_c = $request['option_c'] ?? '';
            $option_d = $request['option_d'] ?? '';
            $correct_answer = strtoupper($request['correct_answer'] ?? '');
            $score_per_question = $request['score_per_question'] ?? 1;

            if (!in_array($correct_answer, ['A', 'B', 'C', 'D'])) {
                sendJsonResponse('error', 'เฉลยต้องเป็น A, B, C หรือ D');
            }

            $stmt = $conn->prepare("UPDATE `quizzes` SET activity_id = ?, question = ?, option_a = ?, option_b = ?, option_c = ?, option_d = ?, correct_answer = ?, score_per_question = ? WHERE quiz_id = ?");
            $stmt->bind_param("issssssii", $activity_id, $question, $option_a, $option_b, $option_c, $option_d, $correct_answer, $score_per_question, $quiz_id);
            if ($stmt->execute()) {
                sendJsonResponse('success', 'อัปเดตแบบทดสอบสำเร็จ');
            } else {
                sendJsonResponse('error', 'ข้อผิดพลาดในการอัปเดตแบบทดสอบ: ' . $stmt->error);
            }
            $stmt->close();
        } else {
            sendJsonResponse('error', 'เมธอดไม่ถูกต้อง', ['method' => $method]);
        }
        break;

    case 'delete_quiz':
        if ($method == 'DELETE') {
            if (!(isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true)) {
                sendJsonResponse('error', 'ไม่อนุญาต: ต้องเป็นผู้ดูแลระบบเท่านั้น');
            }
            $quiz_id = $_GET['quiz_id'] ?? 0;
            $stmt = $conn->prepare("DELETE FROM `quizzes` WHERE quiz_id = ?");
            $stmt->bind_param("i", $quiz_id);
            if ($stmt->execute()) {
                sendJsonResponse('success', 'ลบแบบทดสอบสำเร็จ');
            } else {
                sendJsonResponse('error', 'ข้อผิดพลาดในการลบแบบทดสอบ: ' . $stmt->error);
            }
            $stmt->close();
        } else {
            sendJsonResponse('error', 'เมธอดไม่ถูกต้อง', ['method' => $method]);
        }
        break;

    case 'submit_quiz':
        if ($method == 'POST') {
            if (!(isset($_SESSION['student_logged_in']) && $_SESSION['student_logged_in'] === true)) {
                sendJsonResponse('error', 'ไม่อนุญาต: ต้องเข้าสู่ระบบนักเรียนก่อน');
            }
            $student_id = $_SESSION['student_id'];
            $activity_id = $request['activity_id'] ?? 0;
            $answers = $request['answers'] ?? [];

            $total_score = 0;
            $total_possible_score = 0;

            $stmt_get_quizzes = $conn->prepare("SELECT quiz_id, correct_answer, score_per_question FROM `quizzes` WHERE activity_id = ?");
            if (!$stmt_get_quizzes) {
                sendJsonResponse('error', 'Failed to prepare statement for getting quizzes: ' . $conn->error);
            }
            $stmt_get_quizzes->bind_param("i", $activity_id);
            $stmt_get_quizzes->execute();
            $result_quizzes = $stmt_get_quizzes->get_result();
            $correct_answers_map = [];
            while ($row = $result_quizzes->fetch_assoc()) {
                $correct_answers_map[$row['quiz_id']] = ['correct_answer' => $row['correct_answer'], 'score_per_question' => $row['score_per_question']];
                $total_possible_score += $row['score_per_question'];
            }
            $stmt_get_quizzes->close();

            foreach ($answers as $answer) {
                $quiz_id = $answer['quiz_id'];
                $selected_option = $answer['selected_option'];

                if (isset($correct_answers_map[$quiz_id])) {
                    if ($correct_answers_map[$quiz_id]['correct_answer'] === $selected_option) {
                        $total_score += $correct_answers_map[$quiz_id]['score_per_question'];
                    }
                }
            }
            
            // Start transaction for quiz submission and potential certificate generation
            $conn->begin_transaction();
            try {
                $stmt_log = $conn->prepare("INSERT INTO `student_activity_logs` (student_id, activity_id, score, is_completed) VALUES (?, ?, ?, TRUE) ON DUPLICATE KEY UPDATE score = ?, is_completed = TRUE, timestamp = CURRENT_TIMESTAMP()");
                if (!$stmt_log) {
                    throw new Exception('Failed to prepare statement for student activity log: ' . $conn->error);
                }
                $stmt_log->bind_param("siii", $student_id, $activity_id, $total_score, $total_score);
                if (!$stmt_log->execute()) {
                    throw new Exception('ข้อผิดพลาดในการบันทึกคะแนน: ' . $stmt_log->error);
                }
                $stmt_log->close();

                // After successfully logging the quiz score, attempt to issue certificate automatically
                $cert_result = issueCertificateForStudent($conn, $student_id);

                $conn->commit();

                $message = 'ส่งแบบทดสอบสำเร็จ';
                if ($cert_result['status'] === 'issued') {
                    $message .= ' และเกียรติบัตรของคุณถูกสร้างขึ้นแล้ว! 🥳';
                } else if ($cert_result['status'] === 'skipped') {
                    $message .= '. ' . $cert_result['message'];
                } else if ($cert_result['status'] === 'error') {
                    $message .= '. แต่มีข้อผิดพลาดในการสร้างเกียรติบัตรอัตโนมัติ: ' . $cert_result['message'];
                }

                sendJsonResponse('success', $message, ['score' => $total_score, 'total_possible_score' => $total_possible_score, 'certificate_generation_status' => $cert_result]);

            } catch (Exception $e) {
                $conn->rollback();
                sendJsonResponse('error', $e->getMessage());
            }

        } else {
            sendJsonResponse('error', 'เมธอดไม่ถูกต้อง', ['method' => $method]);
        }
        break;

    case 'get_student_activity_status':
        if ($method == 'GET') {
            if (!(isset($_SESSION['student_logged_in']) && $_SESSION['student_logged_in'] === true)) {
                sendJsonResponse('error', 'ไม่อนุญาต: ต้องเข้าสู่ระบบนักเรียนก่อน');
            }
            $student_id = $_SESSION['student_id'];

            $stmt = $conn->prepare("
                SELECT 
                    a.activity_id,
                    a.activity_name,
                    IFNULL(sal.is_completed, FALSE) as is_completed,
                    IFNULL(sal.score, 0) as score,
                    -- Subquery to get sum of score_per_question for quizzes in this activity
                    (SELECT SUM(score_per_question) FROM quizzes WHERE activity_id = a.activity_id) as total_possible_score_for_activity
                FROM activities a
                LEFT JOIN student_activity_logs sal ON a.activity_id = sal.activity_id AND sal.student_id = ?
                ORDER BY a.activity_id ASC
            ");
            if (!$stmt) {
                sendJsonResponse('error', 'Failed to prepare statement for student activity status: ' . $conn->error);
            }
            $stmt->bind_param("s", $student_id);
            $stmt->execute();
            $result = $stmt->get_result();
            $status = [];
            while ($row = $result->fetch_assoc()) {
                $status[] = $row;
            }
            sendJsonResponse('success', 'ดึงสถานะกิจกรรมของนักเรียนสำเร็จ', $status);
            $stmt->close();
        } else {
            sendJsonResponse('error', 'เมธอดไม่ถูกต้อง', ['method' => $method]);
        }
        break;

    case 'verify_access_code':
        if ($method == 'POST') {
            if (!(isset($_SESSION['student_logged_in']) && $_SESSION['student_logged_in'] === true)) {
                sendJsonResponse('error', 'ไม่อนุญาต: ต้องเข้าสู่ระบบนักเรียนก่อน');
            }
            $activity_id = $request['activity_id'] ?? 0;
            $access_code = $request['access_code'] ?? '';

            $stmt = $conn->prepare("SELECT COUNT(*) FROM `activities` WHERE activity_id = ? AND access_code = ?");
            $stmt->bind_param("is", $activity_id, $access_code);
            $stmt->execute();
            $stmt->bind_result($count);
            $stmt->fetch();
            $stmt->close();

            if ($count > 0) {
                sendJsonResponse('success', 'รหัสยืนยันถูกต้อง');
            } else {
                sendJsonResponse('error', 'รหัสยืนยันไม่ถูกต้อง');
            }
        } else {
            sendJsonResponse('error', 'เมธอดไม่ถูกต้อง', ['method' => $method]);
        }
        break;

    case 'get_certificate_templates':
        if ($method == 'GET') {
            if (!(isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true)) {
                sendJsonResponse('error', 'ไม่อนุญาต: ต้องเป็นผู้ดูแลระบบเท่านั้น');
            }
            $stmt = $conn->prepare("SELECT certificate_id, template_image_url, start_number, end_number FROM `certificates` ORDER BY certificate_id ASC");
            $stmt->execute();
            $result = $stmt->get_result();
            $templates = [];
            while ($row = $result->fetch_assoc()) {
                $templates[] = $row;
            }
            sendJsonResponse('success', 'ดึงข้อมูลเทมเพลตเกียรติบัตรสำเร็จ', $templates);
            $stmt->close();
        } else {
            sendJsonResponse('error', 'เมธอดไม่ถูกต้อง', ['method' => $method]);
        }
        break;

    case 'add_certificate_template':
        if ($method == 'POST') {
            if (!(isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true)) {
                sendJsonResponse('error', 'ไม่อนุญาต: ต้องเป็นผู้ดูแลระบบเท่านั้น');
            }
            
            $start_number = $request['start_number'] ?? 0;
            $end_number = $request['end_number'] ?? 0;
            $template_image_url = null;

            if ($start_number <= 0 || $end_number <= 0 || $start_number > $end_number) {
                sendJsonResponse('error', 'ช่วงเลขที่เกียรติบัตรไม่ถูกต้อง');
            }
            
            // ตรวจสอบว่ามีไฟล์ถูกอัปโหลดหรือไม่
            if (!isset($_FILES['template_image_file']) || $_FILES['template_image_file']['error'] != UPLOAD_ERR_OK) {
                 sendJsonResponse('error', 'ต้องเลือกไฟล์รูปภาพเทมเพลต');
            }

            // Handle image upload
            $upload_dir = 'uploads/certificates/';
            $allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
            $max_size = 5 * 1024 * 1024; // 5 MB

            $uploaded_path = handleFileUpload('template_image_file', $upload_dir, $allowed_types, $max_size);
            if ($uploaded_path) {
                $template_image_url = $uploaded_path;
            } else {
                sendJsonResponse('error', 'ไม่สามารถอัปโหลดรูปภาพเทมเพลตได้');
            }

            // ตรวจสอบการทับซ้อนของช่วงเลขที่
            $stmt_overlap = $conn->prepare("SELECT COUNT(*) FROM `certificates` WHERE (? BETWEEN start_number AND end_number) OR (? BETWEEN start_number AND end_number) OR (start_number BETWEEN ? AND ?) OR (end_number BETWEEN ? AND ?)");
            $stmt_overlap->bind_param("iiiiii", $start_number, $end_number, $start_number, $end_number, $start_number, $end_number);
            $stmt_overlap->execute();
            $stmt_overlap->bind_result($overlap_count);
            $stmt_overlap->fetch();
            $stmt_overlap->close();

            if ($overlap_count > 0) {
                // ถ้าทับซ้อน ให้ลบไฟล์ที่อัปโหลดไปแล้วออก
                if ($template_image_url && file_exists($template_image_url)) {
                    unlink($template_image_url);
                }
                sendJsonResponse('error', 'ช่วงเลขที่เกียรติบัตรนี้ทับซ้อนกับเทมเพลตอื่น');
            }

            $stmt = $conn->prepare("INSERT INTO `certificates` (template_image_url, start_number, end_number) VALUES (?, ?, ?)");
            $stmt->bind_param("sii", $template_image_url, $start_number, $end_number);

            if ($stmt->execute()) {
                sendJsonResponse('success', 'เพิ่มเทมเพลตเกียรติบัตรสำเร็จ', ['certificate_id' => $conn->insert_id, 'template_image_url' => $template_image_url]);
            } else {
                // หากบันทึก DB ไม่สำเร็จ ให้ลบไฟล์ที่อัปโหลดออก
                if ($template_image_url && file_exists($template_image_url)) {
                    unlink($template_image_url);
                }
                sendJsonResponse('error', 'ข้อผิดพลาดในการเพิ่มเทมเพลตเกียรติบัตร: ' . $stmt->error);
            }
            $stmt->close();
        } else {
            sendJsonResponse('error', 'เมธอดไม่ถูกต้อง', ['method' => $method]);
        }
        break;

    case 'update_certificate_template':
        if ($method == 'POST') { // เปลี่ยนเป็น POST เพื่อรองรับ FormData ที่มีไฟล์
            if (!(isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true)) {
                sendJsonResponse('error', 'ไม่อนุญาต: ต้องเป็นผู้ดูแลระบบเท่านั้น');
            }
            $certificate_id = $request['certificate_id'] ?? 0;
            $start_number = $request['start_number'] ?? 0;
            $end_number = $request['end_number'] ?? 0;
            $current_image_url = $request['current_image_url'] ?? null; // URL รูปภาพปัจจุบันที่ส่งมาจาก frontend

            $image_url_to_save = $current_image_url;

            if ($start_number <= 0 || $end_number <= 0 || $start_number > $end_number) {
                sendJsonResponse('error', 'ช่วงเลขที่เกียรติบัตรไม่ถูกต้อง');
            }
            
            // Handle new image upload
            if (isset($_FILES['template_image_file']) && $_FILES['template_image_file']['error'] === UPLOAD_ERR_OK) {
                $upload_dir = 'uploads/certificates/';
                $allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
                $max_size = 5 * 1024 * 1024;

                $uploaded_path = handleFileUpload('template_image_file', $upload_dir, $allowed_types, $max_size);
                if ($uploaded_path) {
                    $image_url_to_save = $uploaded_path;
                    // ลบรูปภาพเก่าถ้ามีและไม่ใช่ placeholder
                    if ($current_image_url && strpos($current_image_url, 'placehold.co') === false && file_exists($current_image_url)) {
                        unlink($current_image_url);
                    }
                } else {
                    sendJsonResponse('error', 'ไม่สามารถอัปโหลดรูปภาพใหม่ได้');
                }
            } else if (empty($image_url_to_save)) {
                 sendJsonResponse('error', 'ต้องมีรูปภาพเทมเพลตสำหรับเกียรติบัตร');
            }

            // ตรวจสอบการทับซ้อนของช่วงเลขที่ (ยกเว้น ID ปัจจุบัน)
            $stmt_overlap = $conn->prepare("SELECT COUNT(*) FROM `certificates` WHERE certificate_id != ? AND ((? BETWEEN start_number AND end_number) OR (? BETWEEN start_number AND end_number) OR (start_number BETWEEN ? AND ?) OR (end_number BETWEEN ? AND ?))");
            $stmt_overlap->bind_param("iiiiiii", $certificate_id, $start_number, $end_number, $start_number, $end_number, $start_number, $end_number);
            $stmt_overlap->execute();
            $stmt_overlap->bind_result($overlap_count);
            $stmt_overlap->fetch();
            $stmt_overlap->close();

            if ($overlap_count > 0) {
                sendJsonResponse('error', 'ช่วงเลขที่เกียรติบัตรนี้ทับซ้อนกับเทมเพลตอื่น');
            }

            $stmt = $conn->prepare("UPDATE `certificates` SET template_image_url = ?, start_number = ?, end_number = ? WHERE certificate_id = ?");
            $stmt->bind_param("siii", $image_url_to_save, $start_number, $end_number, $certificate_id);
            if ($stmt->execute()) {
                sendJsonResponse('success', 'อัปเดตเทมเพลตเกียรติบัตรสำเร็จ');
            } else {
                sendJsonResponse('error', 'ข้อผิดพลาดในการอัปเดตเทมเพลตเกียรติบัตร: ' . $stmt->error);
            }
            $stmt->close();
        } else {
            sendJsonResponse('error', 'เมธอดไม่ถูกต้อง', ['method' => $method]);
        }
        break;

    case 'delete_certificate_template':
        if ($method == 'DELETE') {
            if (!(isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true)) {
                sendJsonResponse('error', 'ไม่อนุญาต: ต้องเป็นผู้ดูแลระบบเท่านั้น');
            }
            $certificate_id = $_GET['certificate_id'] ?? 0;
            
            // ดึง URL รูปภาพก่อนลบ
            $stmt_get_image = $conn->prepare("SELECT template_image_url FROM `certificates` WHERE certificate_id = ?");
            $stmt_get_image->bind_param("i", $certificate_id);
            $stmt_get_image->execute();
            $stmt_get_image->bind_result($image_to_delete);
            $stmt_get_image->fetch();
            $stmt_get_image->close();

            $stmt = $conn->prepare("DELETE FROM `certificates` WHERE certificate_id = ?");
            $stmt->bind_param("i", $certificate_id);
            if ($stmt->execute()) {
                // ลบไฟล์รูปภาพ
                if ($image_to_delete && file_exists($image_to_delete)) {
                    unlink($image_to_delete);
                }
                sendJsonResponse('success', 'ลบเทมเพลตเกียรติบัตรสำเร็จ');
            } else {
                sendJsonResponse('error', 'ข้อผิดพลาดในการลบเทมเพลตเกียรติบัตร: ' . $stmt->error);
            }
            $stmt->close();
        } else {
            sendJsonResponse('error', 'เมธอดไม่ถูกต้อง', ['method' => $method]);
        }
        break;

    case 'generate_issued_certificates':
        if ($method == 'POST') {
            if (!(isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true)) {
                sendJsonResponse('error', 'ไม่อนุญาต: ต้องเป็นผู้ดูแลระบบเท่านั้น');
            }

            $conn->begin_transaction();

            try {
                $stmt_students = $conn->prepare("SELECT student_id, first_name, last_name FROM `students`"); // Get name for error messages
                if (!$stmt_students) {
                    throw new Exception('Failed to prepare statement for fetching all students: ' . $conn->error);
                }
                $stmt_students->execute();
                $result_students = $stmt_students->get_result();
                $all_students_data = [];
                while ($row = $result_students->fetch_assoc()) {
                    $all_students_data[] = $row;
                }
                $stmt_students->close();

                if (empty($all_students_data)) {
                    $conn->rollback();
                    sendJsonResponse('error', 'ยังไม่มีนักเรียนในระบบ');
                }

                $issued_count = 0;
                $skipped_count = 0;
                $errors = [];

                foreach ($all_students_data as $student) {
                    $cert_result = issueCertificateForStudent($conn, $student['student_id']);
                    if ($cert_result['status'] === 'issued') {
                        $issued_count++;
                    } else {
                        $skipped_count++;
                        if ($cert_result['status'] === 'error') {
                            $errors[] = "นักเรียน {$student['first_name']} {$student['last_name']} ({$student['student_id']}): " . $cert_result['message'];
                        }
                    }
                }

                $conn->commit();
                sendJsonResponse('success', "ดำเนินการออกเกียรติบัตรสำเร็จ: {$issued_count} คน, ข้าม: {$skipped_count} คน", ['errors' => $errors]);

            } catch (Exception $e) {
                $conn->rollback();
                sendJsonResponse('error', 'ข้อผิดพลาดในการออกเกียรติบัตร: ' . $e->getMessage());
            }

        } else {
            sendJsonResponse('error', 'เมธอดไม่ถูกต้อง', ['method' => $method]);
        }
        break;

    case 'get_issued_certificates': // For Admin only
        if ($method == 'GET') {
            // Allow both admin and students to access this for their own certificate
            // Admin can filter, student can only see their own
            $is_admin = (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true);
            $is_student = (isset($_SESSION['student_logged_in']) && $_SESSION['student_logged_in'] === true && isset($_SESSION['student_id']));

            if (!$is_admin && !$is_student) {
                sendJsonResponse('error', 'ไม่อนุญาต: ต้องเป็นผู้ดูแลระบบหรือนักเรียนที่เข้าสู่ระบบเท่านั้น');
            }

            $filter_class = $_GET['class'] ?? '';
            $filter_room = $_GET['room'] ?? ''; 
            $student_id_param = $_GET['student_id'] ?? ''; // For specific student fetch

            $page = max(1, (int)($_GET['page'] ?? 1));
            $limit = max(1, (int)($_GET['limit'] ?? 10)); // Default limit to 10 if not provided
            $offset = ($page - 1) * $limit;


            $sql_conditions = "WHERE 1=1";
            $params = [];
            $types = "";

            if (!empty($filter_class) && $is_admin) { // Only admin can use class filter
                 if (!empty($filter_room) && is_numeric($filter_room)) {
                    $full_class_name = $filter_class . '/' . $filter_room;
                    $sql_conditions .= " AND s.class = ?";
                    $params[] = $full_class_name;
                    $types .= "s";
                } else {
                    $sql_conditions .= " AND s.class LIKE ?";
                    $params[] = $filter_class . '%';
                    $types .= "s";
                }
            }
            
            if (!empty($student_id_param)) { // If specific student ID is provided (e.g., from `issueCertificateForStudent` call)
                $sql_conditions .= " AND s.student_id = ?";
                $params[] = $student_id_param;
                $types .= "s";
            } else if ($is_student) { // If student is logged in, restrict to their ID
                $sql_conditions .= " AND s.student_id = ?";
                $params[] = $_SESSION['student_id'];
                $types .= "s";
            }
            
            // Get total records for pagination
            $stmt_count = $conn->prepare("SELECT COUNT(*) AS total
                FROM students s
                LEFT JOIN issued_certificates ic ON s.student_id = ic.student_id
                LEFT JOIN certificates c ON ic.certificate_id = c.certificate_id
                " . $sql_conditions
            );
            if (!$stmt_count) {
                sendJsonResponse('error', 'Failed to prepare count statement: ' . $conn->error);
            }
            if (!empty($params)) {
                $stmt_count->bind_param($types, ...$params);
            }
            $stmt_count->execute();
            $result_count = $stmt_count->get_result();
            $total_records = $result_count->fetch_assoc()['total'];
            $stmt_count->close();

            $total_pages = ceil($total_records / $limit);

            $sql = "
                SELECT
                    s.student_id, s.first_name, s.last_name, s.class, s.room_number,
                    ic.certificate_number,
                    c.template_image_url
                FROM students s
                LEFT JOIN issued_certificates ic ON s.student_id = ic.student_id
                LEFT JOIN certificates c ON ic.certificate_id = c.certificate_id
                " . $sql_conditions . "
                ORDER BY s.class ASC, s.room_number ASC, s.student_id ASC
                LIMIT ? OFFSET ?
            ";
            
            $stmt = $conn->prepare($sql);
            if (!$stmt) {
                sendJsonResponse('error', 'Failed to prepare issued certificates statement: ' . $conn->error);
            }

            // Bind parameters for conditions + limit + offset
            if (!empty($params)) {
                $params[] = $limit;
                $params[] = $offset;
                $types .= "ii";
                $stmt->bind_param($types, ...$params);
            } else {
                $stmt->bind_param("ii", $limit, $offset);
            }

            $stmt->execute();
            $result = $stmt->get_result();
            $issued_certs_data = [];
            while ($row = $result->fetch_assoc()) {
                $issued_certs_data[] = $row;
            }
            $stmt->close();
            
            sendJsonResponse('success', 'ดึงข้อมูลเกียรติบัตรที่ออกให้สำเร็จ', [
                'certificates' => $issued_certs_data,
                'total_records' => $total_records,
                'current_page' => $page,
                'total_pages' => $total_pages
            ]);
        } else {
            sendJsonResponse('error', 'เมธอดไม่ถูกต้อง', ['method' => $method]);
        }
        break;

    case 'get_student_certificate_details': // New action for student to get their own certificate
        if ($method == 'GET') {
            if (!(isset($_SESSION['student_logged_in']) && $_SESSION['student_logged_in'] === true && isset($_SESSION['student_id']))) {
                sendJsonResponse('error', 'ไม่อนุญาต: ต้องเข้าสู่ระบบนักเรียนก่อน');
            }
            $student_id = $_SESSION['student_id'];

            $sql = "
                SELECT
                    s.student_id, s.first_name, s.last_name, s.class, s.room_number,
                    ic.certificate_number,
                    c.template_image_url
                FROM students s
                JOIN issued_certificates ic ON s.student_id = ic.student_id
                JOIN certificates c ON ic.certificate_id = c.certificate_id
                WHERE s.student_id = ?
            ";
            
            $stmt = $conn->prepare($sql);
            if (!$stmt) {
                sendJsonResponse('error', 'Failed to prepare statement for student certificate details: ' . $conn->error);
            }
            $stmt->bind_param("s", $student_id);
            $stmt->execute();
            $result = $stmt->get_result();
            $student_cert_data = null;
            if ($result->num_rows > 0) {
                $student_cert_data = $result->fetch_assoc();
            }
            sendJsonResponse('success', 'ดึงข้อมูลเกียรติบัตรส่วนตัวสำเร็จ', $student_cert_data);
            $stmt->close();
        } else {
            sendJsonResponse('error', 'เมธอดไม่ถูกต้อง', ['method' => $method]);
        }
        break;

    case 'get_dashboard_summary':
        if ($method == 'GET') {
            if (!(isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true)) {
                sendJsonResponse('error', 'ไม่อนุญาต: ต้องเป็นผู้ดูแลระบบเท่านั้น');
            }

            $summary = [];

            $stmt = $conn->prepare("SELECT COUNT(*) FROM `students`");
            if (!$stmt) { sendJsonResponse('error', 'Failed to prepare statement (total_students): ' . $conn->error); }
            $stmt->execute();
            $stmt->bind_result($summary['total_students']);
            $stmt->fetch();
            $stmt->close();

            $stmt = $conn->prepare("SELECT COUNT(*) FROM `activities`");
            if (!$stmt) { sendJsonResponse('error', 'Failed to prepare statement (total_activities): ' . $conn->error); }
            $stmt->execute();
            $stmt->bind_result($summary['total_activities']);
            $stmt->fetch();
            $stmt->close();

            $stmt = $conn->prepare("SELECT COUNT(DISTINCT student_id) FROM `issued_certificates`");
            if (!$stmt) { sendJsonResponse('error', 'Failed to prepare statement (students_passed_70): ' . $conn->error); }
            $stmt->execute();
            $stmt->bind_result($summary['students_passed_70']);
            $stmt->fetch();
            $stmt->close();

            $stmt = $conn->prepare("SELECT COUNT(DISTINCT student_id) FROM `student_activity_logs` WHERE is_completed = TRUE");
            if (!$stmt) { sendJsonResponse('error', 'Failed to prepare statement (participating_students): ' . $conn->error); }
            $stmt->execute();
            $stmt->bind_result($participating_students);
            $stmt->fetch();
            $stmt->close();

            $summary['participation_percentage'] = ($summary['total_students'] > 0) ? round(($participating_students / $summary['total_students']) * 100, 2) : 0;

            sendJsonResponse('success', 'ดึงข้อมูลสรุปแดชบอร์ดสำเร็จ', $summary);
        } else {
            sendJsonResponse('error', 'เมธอดไม่ถูกต้อง', ['method' => $method]);
        }
        break;
    case 'get_eligible_students_for_room_certificate': // New action
        if ($method == 'GET') {
            if (!(isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true)) {
                sendJsonResponse('error', 'ไม่อนุญาต: ต้องเป็นผู้ดูแลระบบเท่านั้น');
            }

            $filter_class = $_GET['class'] ?? '';
            $filter_room = $_GET['room'] ?? '';

            if (empty($filter_class) || empty($filter_room) || !is_numeric($filter_room)) {
                sendJsonResponse('error', 'กรุณาระบุชั้นและห้องให้ถูกต้อง');
            }

            $full_class_name = $filter_class . '/' . $filter_room;
            
            // Step 1: Get all quizzes and their total possible scores
            $all_activities_with_quizzes = [];
            $total_possible_score_per_activity = [];
            $stmt_all_quizzes = $conn->prepare("SELECT activity_id, SUM(score_per_question) as total_score FROM quizzes GROUP BY activity_id");
            if (!$stmt_all_quizzes) {
                sendJsonResponse('error', 'Failed to prepare statement for all quizzes: ' . $conn->error);
            }
            $stmt_all_quizzes->execute();
            $result_all_quizzes = $stmt_all_quizzes->get_result();
            while($row = $result_all_quizzes->fetch_assoc()) {
                $all_activities_with_quizzes[] = $row['activity_id'];
                $total_possible_score_per_activity[$row['activity_id']] = $row['total_score'];
            }
            $stmt_all_quizzes->close();

            // If no quizzes defined, no students are eligible for this type of certificate
            if (empty($all_activities_with_quizzes)) {
                sendJsonResponse('success', 'ไม่พบกิจกรรมที่มีแบบทดสอบในระบบ', []);
            }

            // Step 2: Get all students in the selected class/room and their activity logs
            // Also fetch existing certificate_number if available
            $sql = "
                SELECT
                    s.student_id, s.first_name, s.last_name, s.class, s.room_number,
                    sal.activity_id, sal.score, sal.is_completed,
                    ic.certificate_number
                FROM students s
                LEFT JOIN student_activity_logs sal ON s.student_id = sal.student_id
                LEFT JOIN issued_certificates ic ON s.student_id = ic.student_id
                WHERE s.class = ?
                ORDER BY s.room_number ASC, s.first_name ASC
            ";
            
            $stmt = $conn->prepare($sql);
            if (!$stmt) {
                sendJsonResponse('error', 'Failed to prepare statement for students and logs: ' . $conn->error);
            }
            $stmt->bind_param("s", $full_class_name);
            $stmt->execute();
            $result = $stmt->get_result();
            
            $students_raw_data = [];
            while ($row = $result->fetch_assoc()) {
                if (!isset($students_raw_data[$row['student_id']])) {
                    $students_raw_data[$row['student_id']]['info'] = [
                        'student_id' => $row['student_id'],
                        'first_name' => $row['first_name'],
                        'last_name' => $row['last_name'],
                        'class' => $row['class'],
                        'room_number' => $row['room_number'],
                        'certificate_number' => $row['certificate_number'] // Fetch existing certificate number
                    ];
                    $students_raw_data[$row['student_id']]['logs'] = [];
                }
                if ($row['activity_id'] !== null) { // Only add log if it exists
                    $students_raw_data[$row['student_id']]['logs'][$row['activity_id']] = [
                        'score' => $row['score'],
                        'is_completed' => $row['is_completed']
                    ];
                }
            }
            $stmt->close();

            $eligible_students = [];

            // Step 3: Evaluate each student's eligibility
            foreach ($students_raw_data as $student_id_key => $data) {
                $student_info = $data['info'];
                $student_logs = $data['logs'] ?? [];

                $student_passed_all_criteria = true;
                $student_total_earned_score = 0;
                $student_total_required_score = 0;

                // Iterate through all activities that have quizzes
                foreach ($all_activities_with_quizzes as $required_activity_id) {
                    $student_total_required_score += $total_possible_score_per_activity[$required_activity_id];

                    if (!isset($student_logs[$required_activity_id]) || !$student_logs[$required_activity_id]['is_completed']) {
                        // Student has not completed this required quizzed activity
                        $student_passed_all_criteria = false;
                        break; // No need to check further for this student
                    } else {
                        // Activity is completed, add score and check individual activity percentage
                        $activity_score = $student_logs[$required_activity_id]['score'];
                        $activity_possible_score = $total_possible_score_per_activity[$required_activity_id];

                        if ($activity_possible_score > 0) {
                            if (($activity_score / $activity_possible_score) * 100 < 70) {
                                $student_passed_all_criteria = false;
                                break; // Failed 70% for this activity
                            }
                        }
                        // Add to overall earned score only if passed this activity's threshold
                        $student_total_earned_score += $activity_score;
                    }
                }

                // If all individual activities passed (and were completed), check overall average
                if ($student_passed_all_criteria) {
                    if ($student_total_required_score > 0) {
                        $overall_percentage = ($student_total_earned_score / $student_total_required_score) * 100;
                        if ($overall_percentage < 70) {
                            $student_passed_all_criteria = false;
                        }
                    } else if (count($all_activities_with_quizzes) > 0) {
                        // This case means there are quizzes but their total score_per_question is 0
                        // This might indicate an issue with quiz setup, but if all were "completed" with 0 score,
                        // and overall_possible_score is 0, it should be considered passed if there are quizzes.
                        // However, if there are NO quizzes at all (handled at the top) or if there are quizzes
                        // but they have zero total possible score, the 70% rule becomes ambiguous.
                        // For robustness, if total_required_score is 0 for activities with quizzes, treat as not passing,
                        // unless there are truly no quizzes defined in the system.
                        if ($student_total_earned_score == 0 && count($all_activities_with_quizzes) > 0) {
                             $student_passed_all_criteria = false; // Cannot achieve 70% if max score is 0 and there are quizzes
                        }
                    }
                }

                if ($student_passed_all_criteria) {
                    $eligible_students[] = $student_info;
                }
            }
            sendJsonResponse('success', 'ดึงข้อมูลนักเรียนที่ผ่านเกณฑ์สำเร็จ', $eligible_students);

        } else {
            sendJsonResponse('error', 'เมธอดไม่ถูกต้อง', ['method' => $method]);
        }
        break;

    default:
        sendJsonResponse('error', 'ไม่มีการดำเนินการที่ระบุ');
        break;
}

$conn->close();
?>

