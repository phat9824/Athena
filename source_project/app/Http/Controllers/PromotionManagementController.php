<?php

namespace App\Http\Controllers;

use App\Models\KhuyenMai; // Assuming KhuyenMai model is defined
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str; // Thêm dòng này để sử dụng Str
use Exception;

class PromotionManagementController extends Controller
{
    /**
     * Lấy tất cả khuyến mãi (bao gồm cả đã hết hạn).
     */
    public function getAllKhuyenMai()
    {
        try {
            $khuyenMai = KhuyenMai::getAllKhuyenMai();
            return response()->json($khuyenMai);
        } catch (Exception $e) {
            Log::error('Error: ' . $e->getMessage());
            return response()->json(['error' => 'Something went wrong: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Lấy khuyến mãi theo phân trang.
     */
    public function getPaginatedKhuyenMai(Request $request)
    {
        try {
            $page = $request->query('page', 1);
            $perPage = $request->query('perPage', 10);
            $includeExpired = $request->query('includeExpired', false);

            $offset = ($page - 1) * $perPage;
            $result = KhuyenMai::getPaginatedKhuyenMai($offset, $perPage, $includeExpired);
            $total = KhuyenMai::countKhuyenMai($includeExpired);

            return response()->json([
                'data' => $result,
                'currentPage' => (int)$page,
                'perPage' => (int)$perPage,
                'total' => $total,
                'totalPages' => ceil($total / $perPage),
            ]);
        } catch (Exception $e) {
            Log::error('Error: ' . $e->getMessage());
            return response()->json(['error' => 'Something went wrong: ' . $e->getMessage()], 500);
        }
    }
    /**
     * Tạo mới một khuyến mãi.
     */
    public function createKhuyenMai(Request $request)
    {
        try {
            // Validate dữ liệu đầu vào
            $data = $request->validate([
                'MAKM' => 'nullable|string|max:9', // Cho phép MAKM là null và giới hạn tối đa 9 ký tự
                'TENKM' => 'required|string|max:255',
                'NGAYBD' => 'required|date',
                'NGAYKT' => 'required|date|after_or_equal:NGAYBD',
                'PHANTRAM' => 'required|numeric|min:0|max:100',
            ]);

            // Tự động tạo mã khuyến mãi không trùng
            if (empty($data['MAKM'])) {
                $data['MAKM'] = $this->generateUniqueCode();
            }

            // Tạo khuyến mãi
            KhuyenMai::createKhuyenMai($data);

            return response()->json(['message' => 'Khuyến mãi đã được tạo thành công!'], 201);
        } catch (Exception $e) {
            Log::error('Error: ' . $e->getMessage());
            return response()->json(['error' => 'Đã xảy ra lỗi: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Tạo mã khuyến mãi random không trùng lặp
     */
    private function generateUniqueCode()
    {
        do {
            $code = strtoupper(Str::random(9)); // Tạo mã ngẫu nhiên 9 ký tự in hoa
        } while ($this->isCodeExists($code)); // Kiểm tra mã đã tồn tại

        return $code;
    }

    /**
     * Kiểm tra mã khuyến mãi đã tồn tại hay chưa
     */
    private function isCodeExists($code)
    {
        return KhuyenMai::checkCodeExists($code); // Gọi phương thức công khai từ model
    }

    public function updateKhuyenMai($id, Request $request)
    {
        try {
            // Validate dữ liệu đầu vào
            $data = $request->validate([
                'NGAYBD' => 'required|date',
                'NGAYKT' => 'required|date|after_or_equal:NGAYBD',
                'PHANTRAM' => 'required|numeric|min:0|max:100',
            ]);

            // Tìm khuyến mãi
            $promo = KhuyenMai::findKhuyenMaiById($id);
            if (!$promo) {
                return response()->json(['message' => 'Không tìm thấy khuyến mãi'], 404);
            }

            // Cập nhật khuyến mãi
            KhuyenMai::updateKhuyenMai($id, $data);

            return response()->json(['message' => 'Cập nhật khuyến mãi thành công!'], 200);
        } catch (Exception $e) {
            Log::error('Error: ' . $e->getMessage());
            return response()->json(['error' => 'Đã xảy ra lỗi: ' . $e->getMessage()], 500);
        }
    }
}
