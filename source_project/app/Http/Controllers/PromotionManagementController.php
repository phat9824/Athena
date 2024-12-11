<?php

namespace App\Http\Controllers;

use App\Models\KhuyenMai; // Assuming KhuyenMai model is defined
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
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
}
