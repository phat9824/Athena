<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash; // Để sử dụng Hash::make
use PDO;
use Exception;

class EmployeeManagerController extends Controller
{
    public function getEmployees(Request $request)
    {
        try {
            $pdo = DB::connection()->getPdo();

            $sql = "SELECT 
                        TAIKHOAN.ID,
                        TAIKHOAN.EMAIL,
                        TAIKHOAN.ROLE,
                        TAIKHOAN.TINHTRANG,
                        ADMIN.TENADMIN,
                        ADMIN.SDT,
                        ADMIN.DIACHI,
                        ADMIN.IMAGEURL
                    FROM TAIKHOAN
                    JOIN ADMIN ON TAIKHOAN.ID = ADMIN.ID
                    WHERE TAIKHOAN.ROLE = 2
                      AND TAIKHOAN.DELETED_AT IS NULL";

            $stmt = $pdo->prepare($sql);
            $stmt->execute();
            $employees = $stmt->fetchAll(\PDO::FETCH_ASSOC);

            return response()->json($employees);
        } catch (Exception $e) {
            Log::error('Error in getEmployees: ' . $e->getMessage());
            return response()->json(['error' => 'Có lỗi xảy ra: ' . $e->getMessage()], 500);
        }
    }

    public function createEmployee(Request $request)
    {
        try {
            // Validate dữ liệu gửi lên
            $data = $request->validate([
                'EMAIL' => 'required|email|max:255',
                'PASSWORD' => 'required|string|min:6',
                'TENADMIN' => 'required|string|max:100',
                'SDT' => 'nullable|string|max:15',
                'DIACHI' => 'nullable|string|max:200',
            ]);

            $pdo = DB::connection()->getPdo();

            // Kiểm tra email đã tồn tại chưa
            $checkEmailSql = "SELECT COUNT(*) as cnt FROM TAIKHOAN WHERE EMAIL = :EMAIL";
            $checkStmt = $pdo->prepare($checkEmailSql);
            $checkStmt->execute([':EMAIL' => $data['EMAIL']]);
            $count = $checkStmt->fetch(\PDO::FETCH_ASSOC)['cnt'];

            if ($count > 0) {
                return response()->json(['error' => 'Email đã tồn tại trong hệ thống!'], 400);
            }

            $hashedPassword = Hash::make($data['PASSWORD']); // Hash mật khẩu

            $pdo->beginTransaction();

            // Chèn vào TAIKHOAN
            $sqlTaiKhoan = "INSERT INTO TAIKHOAN (EMAIL, PASSWORD, ROLE, TINHTRANG) VALUES (:EMAIL, :PASSWORD, :ROLE, :TINHTRANG)";
            $stmt1 = $pdo->prepare($sqlTaiKhoan);
            $stmt1->bindValue(':EMAIL', $data['EMAIL']);
            $stmt1->bindValue(':PASSWORD', $hashedPassword);
            $stmt1->bindValue(':ROLE', 2, \PDO::PARAM_INT); // Role = 2 (admin)
            $stmt1->bindValue(':TINHTRANG', 1, \PDO::PARAM_INT); // Tình trạng = 1 (hoạt động)
            $stmt1->execute();

            // Lấy ID vừa insert
            $adminId = $pdo->lastInsertId();

            // Chèn vào ADMIN
            $sqlAdmin = "INSERT INTO ADMIN (ID, TENADMIN, SDT, DIACHI) VALUES (:ID, :TENADMIN, :SDT, :DIACHI)";
            $stmt2 = $pdo->prepare($sqlAdmin);
            $stmt2->bindValue(':ID', $adminId, \PDO::PARAM_INT);
            $stmt2->bindValue(':TENADMIN', $data['TENADMIN']);
            $stmt2->bindValue(':SDT', $data['SDT']);
            $stmt2->bindValue(':DIACHI', $data['DIACHI']);
            $stmt2->execute();

            $pdo->commit();

            return response()->json(['message' => 'Thêm nhân viên thành công!'], 201);
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Error in createEmployee: ' . $e->getMessage());
            return response()->json(['error' => 'Có lỗi xảy ra: ' . $e->getMessage()], 500);
        }
    }
    public function updateEmployeeInfo(Request $request)
    {
        try {
            $data = $request->validate([
                'ID' => 'required|integer',
                'TENADMIN' => 'required|string|max:100',
                'SDT' => 'nullable|string|max:15',
                'DIACHI' => 'nullable|string|max:200',
            ]);

            $pdo = DB::connection()->getPdo();
            // Cập nhật bảng ADMIN
            $sql = "UPDATE ADMIN SET TENADMIN = :TENADMIN, SDT = :SDT, DIACHI = :DIACHI WHERE ID = :ID";
            $stmt = $pdo->prepare($sql);
            $stmt->bindValue(':TENADMIN', $data['TENADMIN']);
            $stmt->bindValue(':SDT', $data['SDT']);
            $stmt->bindValue(':DIACHI', $data['DIACHI']);
            $stmt->bindValue(':ID', $data['ID'], PDO::PARAM_INT);
            $stmt->execute();

            return response()->json(['message' => 'Cập nhật thông tin thành công!']);
        } catch (Exception $e) {
            Log::error('Error in updateEmployeeInfo: ' . $e->getMessage());
            return response()->json(['error' => 'Có lỗi xảy ra: ' . $e->getMessage()], 500);
        }
    }

    public function updateEmployeePassword(Request $request)
    {
        try {
            // Chỉ validate email và mật khẩu mới
            $data = $request->validate([
                'EMAIL'        => 'required|email|max:255',
                'NEW_PASSWORD' => 'required|string|min:6',
            ]);

            $pdo = DB::connection()->getPdo();

            // Kiểm tra email có tồn tại trong bảng TAIKHOAN hay không
            $sqlCheck = "SELECT ID FROM TAIKHOAN WHERE EMAIL = :EMAIL";
            $stmtCheck = $pdo->prepare($sqlCheck);
            $stmtCheck->execute([':EMAIL' => $data['EMAIL']]);
            $user = $stmtCheck->fetch(PDO::FETCH_ASSOC);

            if (!$user) {
                return response()->json(['error' => 'Email không tồn tại'], 404);
            }

            // Tạo hash cho mật khẩu mới
            $newHashed = Hash::make($data['NEW_PASSWORD']);

            // Cập nhật mật khẩu
            $sqlUpdate = "UPDATE TAIKHOAN SET PASSWORD = :PASSWORD WHERE ID = :ID";
            $stmtUpdate = $pdo->prepare($sqlUpdate);
            $stmtUpdate->bindValue(':PASSWORD', $newHashed);
            $stmtUpdate->bindValue(':ID', $user['ID'], PDO::PARAM_INT);
            $stmtUpdate->execute();

            return response()->json(['message' => 'Cập nhật mật khẩu thành công!']);
        } catch (Exception $e) {
            Log::error('Error in updateEmployeePassword: ' . $e->getMessage());
            return response()->json(['error' => 'Có lỗi xảy ra: ' . $e->getMessage()], 500);
        }
    }
}
