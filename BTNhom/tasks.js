// Lấy danh sách công việc
function fetchTasks(page = 1) {
    $.ajax({
        url: "tasks.php",
        method: "GET",
        data: { action: "fetch", page },
        success: function (response) {
            const data = JSON.parse(response);
            renderTasks(data.tasks);
            renderPagination(data.totalPages, page);
        }
    });
}

// Hiển thị danh sách công việc
function renderTasks(tasks) {
    const taskList = $("#taskList");
    taskList.empty();
    tasks.forEach(task => {
        taskList.append(`
            <div>
                <h3>${task.title}</h3>
                <p>${task.description}</p>
                <p>Trạng thái: ${task.status}</p>
                <button onclick="deleteTask(${task.id})">Xóa</button>
                <button onclick="toggleStatus(${task.id}, '${task.status}')">
                    ${task.status === "pending" ? "Hoàn thành" : "Chưa hoàn thành"}
                </button>
            </div>
        `);
    });
}

// Hiển thị phân trang
function renderPagination(totalPages, currentPage) {
    const pagination = $("#pagination");
    pagination.empty();
    for (let i = 1; i <= totalPages; i++) {
        pagination.append(`
            <button onclick="fetchTasks(${i})" ${i === currentPage ? "disabled" : ""}>
                ${i}
            </button>
        `);
    }
}

// Thêm công việc mới
$("#addTaskForm").on("submit", function (e) {
    e.preventDefault();
    const title = $("#title").val();
    const description = $("#description").val();
    const keyword = $("#keyword").val();

    $.ajax({
        url: "tasks.php",
        method: "POST",
        data: { action: "add", title, description, keyword },
        success: function () {
            fetchTasks();
            $("#addTaskForm")[0].reset();
        }
    });
});

// Xóa công việc
function deleteTask(id) {
    $.ajax({
        url: "tasks.php",
        method: "POST",
        data: { action: "delete", id },
        success: function () {
            fetchTasks();
        }
    });
}

// Đánh dấu công việc đã hoàn thành hoặc chưa
function toggleStatus(id, currentStatus) {
    const newStatus = currentStatus === "pending" ? "completed" : "pending";
    $.ajax({
        url: "tasks.php",
        method: "POST",
        data: { action: "toggle", id, status: newStatus },
        success: function () {
            fetchTasks();
        }
    });
}

// Tìm kiếm công việc
function searchTasks() {
    const keyword = $("#search").val();
    $.ajax({
        url: "tasks.php",
        method: "GET",
        data: { action: "search", keyword },
        success: function (response) {
            const tasks = JSON.parse(response);
            renderTasks(tasks);
        }
    });
}

// Tải danh sách công việc khi mở trang
fetchTasks();
