<?php
$conn = new mysqli("localhost", "root", "", "task_manager");

// Kiểm tra kết nối
if ($conn->connect_error) {
    die("Kết nối thất bại: " . $conn->connect_error);
}

$action = $_REQUEST['action'] ?? '';

if ($action === "fetch") {
    $page = $_GET['page'] ?? 1;
    $limit = 5;
    $offset = ($page - 1) * $limit;

    $result = $conn->query("SELECT COUNT(*) AS total FROM tasks");
    $totalTasks = $result->fetch_assoc()['total'];
    $totalPages = ceil($totalTasks / $limit);

    $tasks = $conn->query("SELECT * FROM tasks LIMIT $limit OFFSET $offset")->fetch_all(MYSQLI_ASSOC);

    echo json_encode(['tasks' => $tasks, 'totalPages' => $totalPages]);
}

if ($action === "add") {
    $title = $_POST['title'];
    $description = $_POST['description'];
    $keyword = $_POST['keyword'];

    $conn->query("INSERT INTO tasks (user_id, title, description, keyword) VALUES (1, '$title', '$description', '$keyword')");
    echo "Công việc đã được thêm.";
}

if ($action === "delete") {
    $id = $_POST['id'];
    $conn->query("DELETE FROM tasks WHERE id = $id");
    echo "Công việc đã bị xóa.";
}

if ($action === "toggle") {
    $id = $_POST['id'];
    $status = $_POST['status'];
    $conn->query("UPDATE tasks SET status = '$status' WHERE id = $id");
    echo "Trạng thái công việc đã được cập nhật.";
}

if ($action === "search") {
    $keyword = $_GET['keyword'];
    $tasks = $conn->query("SELECT * FROM tasks WHERE title LIKE '%$keyword%'")->fetch_all(MYSQLI_ASSOC);
    echo json_encode($tasks);
}
?>
