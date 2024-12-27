<?php

namespace App\Http\Controllers;

use App\Models\KhuyenMai;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
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
            $sortField = $request->query('sortField', 'NGAYBD'); 
            $sortOrder = $request->query('sortOrder', 'asc');

            $offset = ($page - 1) * $perPage;

            $allowedSortFields = ['NGAYBD', 'NGAYKT', 'PHANTRAM'];
            if (!in_array($sortField, $allowedSortFields)) {
                return response()->json(['error' => 'Trường sắp xếp không hợp lệ'], 400);
            }

            $result = KhuyenMai::getPaginatedKhuyenMai($offset, $perPage, $includeExpired, $sortField, $sortOrder);
            
            $total = KhuyenMai::countKhuyenMai($includeExpired);

            // Format dữ liệu để dễ hiển thị trên frontend
            foreach ($result as &$promo) {
                $promo['scopeType'] = !empty($promo['categoryNames']) ? 'category' : 'product';
                $promo['selectedScope'] = $promo['scopeType'] === 'category'
                    ? explode(',', $promo['categoryNames'])
                    : explode(',', $promo['productNames']);
            }

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
        DB::beginTransaction();
        try {
            $data = $request->validate([
                'MAKM'          => 'nullable|string|max:9',
                'TENKM'         => 'required|string|max:255',
                'NGAYBD'        => 'required|date',
                'NGAYKT'        => 'required|date|after_or_equal:NGAYBD',
                'PHANTRAM'      => 'required|numeric|min:0|max:100',
                'scopeType'     => 'required|string|in:category,product',
                'selectedScope' => 'required|array',
                'selectedScope.*' => 'string',
            ]);

            // Tự động tạo mã khuyến mãi duy nhất
            if (empty($data['MAKM'])) {
                $data['MAKM'] = $this->generateUniqueCode();
            }

            if ($data['scopeType'] === 'category') {
                $data['categoryIds'] = $data['selectedScope'];
            } elseif ($data['scopeType'] === 'product') {
                $data['productIds'] = $data['selectedScope'];
            }

            $newId = KhuyenMai::createKhuyenMai($data);

            // Lưu phạm vi áp dụng (nếu có)
            if (!empty($data['categoryIds'])) {
                KhuyenMai::attachCategories($newId, $data['categoryIds']);
            }
            if (!empty($data['productIds'])) {
                KhuyenMai::attachProducts($newId, $data['productIds']);
            }

            DB::commit();
            return response()->json(['message' => 'Khuyến mãi đã được tạo thành công!'], 201);
        } catch (Exception $e) {
            DB::rollBack();
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
        DB::beginTransaction();
        try {
            $data = $request->only(['NGAYBD', 'NGAYKT', 'PHANTRAM']);
            Log::error('Error: ' . $id);
            $promo = KhuyenMai::findKhuyenMaiById($id);
            $promo = KhuyenMai::findKhuyenMaiById($id);
            if (!$promo) {
                return response()->json(['message' => 'Không tìm thấy khuyến mãi'], 404);
            }

            $filteredData = array_filter($data, function ($value) {
                return !is_null($value);
            });
            if (!empty($filteredData)) {
                KhuyenMai::updateKhuyenMai($id, $filteredData);
            }

            // // Xoá phạm vi cũ
            // KhuyenMai::detachAllCategories($id);
            // KhuyenMai::detachAllProducts($id);
            // // Lưu phạm vi mới

            // if ($data['scopeType'] === 'category') {
            //     KhuyenMai::attachCategories($id, $data['selectedScope']);
            // } elseif ($data['scopeType'] === 'product') {
            //     KhuyenMai::attachProducts($id, $data['selectedScope']);
            // }

            DB::commit();
            return response()->json(['message' => 'Cập nhật khuyến mãi thành công!'], 200);
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Error: ' . $e->getMessage());
            return response()->json(['error' => 'Đã xảy ra lỗi: ' . $e->getMessage()], 500);
        }
    }
}
