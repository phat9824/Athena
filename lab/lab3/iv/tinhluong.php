<!DOCTYPE html>
<html>
<head>
    <title>Tính Lương</title>
    <style>
        body {
            background-color: white;
            font-family: Arial, sans-serif;
        }
        form {
            width: 400px;
            margin: 50px auto;
            padding: 20px;
            background-color: orange;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        td {
            padding: 10px;
            vertical-align: middle;
        }
        td:first-child {
            text-align: right;
            font-weight: bold;
            width: 150px;
        }
        input[type="text"], input[type="number"] {
            width: 200px;
            padding: 5px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
        input[type="checkbox"] {
            margin-left: 5px;
        }
        input[type="submit"] {
            width: 100%;
            padding: 10px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        input[type="submit"]:hover {
            background-color: #45a049;
        }
        .result-form {
            margin: 20px auto;
            width: 400px;
            padding: 20px;
            background-color: #f9f9f9;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
    </style>
</head>
<body>
    <form method="GET" action="">
        <table>
            <tr>
                <td><label for="ma">Mã nhân viên</label></td>
                <td><input type="text" name="ma" id="ma" value="<?php echo $_GET['ma'] ?? ''; ?>" required></td>
            </tr>
            <tr>
                <td><label for="ten">Tên nhân viên</label></td>
                <td><input type="text" name="ten" id="ten" value="<?php echo $_GET['ten'] ?? ''; ?>" required></td>
            </tr>
            <tr>
                <td><label for="songay">Số ngày làm việc</label></td>
                <td><input type="number" name="songay" id="songay" value="<?php echo $_GET['songay'] ?? ''; ?>" required></td>
            </tr>
            <tr>
                <td><label for="luongngay">Lương ngày</label></td>
                <td><input type="number" name="luongngay" id="luongngay" value="<?php echo $_GET['luongngay'] ?? ''; ?>" required></td>
            </tr>
            <tr>
                <td><label for="ql">Nhân viên quản lý</label></td>
                <td><input type="checkbox" name="ql" id="ql" <?php echo isset($_GET['ql']) ? 'checked' : ''; ?>></td>
            </tr>
            <tr>
                <td colspan="1">
                    <input type="submit" name="tinhluong" value="Lương tháng">
                </td>
            </tr>
        </table>
    </form>

    <?php
    if (isset($_GET['tinhluong'])) {
        // Import các lớp
        include 'nhanvien.php';

        // Lấy dữ liệu từ form
        $ma = $_GET['ma'];
        $ten = $_GET['ten'];
        $soNgay = (int)$_GET['songay'];
        $luongNgay = (int)$_GET['luongngay'];
        $isQL = isset($_GET['ql']); // Kiểm tra trạng thái checkbox

        // Khởi tạo đối tượng
        if ($isQL) {
            $nhanvien = new nhanvienQL(); // Nhân viên quản lý
        } else {
            $nhanvien = new nhanvien(); // Nhân viên thường
        }

        // Gọi các phương thức
        $nhanvien->Gan($ma, $ten, $soNgay, $luongNgay);
        $luongThang = $nhanvien->TinhLuong();

        // Xuất lại form với kết quả
        echo "<form>";
        echo "<table>";
        echo "<tr><td>Mã nhân viên:</td><td class='output-value'>{$ma}</td></tr>";
        echo "<tr><td>Tên nhân viên:</td><td class='output-value'>{$ten}</td></tr>";
        echo "<tr><td>Số ngày làm việc:</td><td class='output-value'>{$soNgay}</td></tr>";
        echo "<tr><td>Lương ngày:</td><td class='output-value'>{$luongNgay}</td></tr>";
        echo "<tr><td>Nhân viên quản lý:</td><td class='output-value'>" . ($isQL ? "Có" : "Không") . "</td></tr>";
        echo "<tr><td>Lương tháng:</td><td class='output-value'>{$luongThang} VNĐ</td></tr>";
        echo "</table>";
        echo "</form>";
    }
    ?>
</body>
</html>
