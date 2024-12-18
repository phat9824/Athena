<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class ThongKeController extends Controller
{
    public function getStatistics(Request $request)
{
    // Lấy ngày bắt đầu, ngày kết thúc và danh mục từ tham số yêu cầu
    $startDate = $request->input('startDate');
    $endDate = $request->input('endDate');
    $categoryId = $request->input('categoryId');  // Lấy ID danh mục nếu có

    if (!$startDate || !$endDate) {
        return response()->json(['error' => 'Ngày bắt đầu và ngày kết thúc là bắt buộc'], 400);
    }

    try {
        // 1. Biểu đồ tròn: Số lượng bán ra của từng loại sản phẩm trong danh mục cụ thể hoặc tất cả sản phẩm
        $productSales = DB::select("
            SELECT t.TENTS, SUM(c.SOLUONG) AS total_quantity
            FROM CHITIETHD c
            JOIN TRANGSUC t ON c.ID_TRANGSUC = t.ID
            JOIN HOADON h ON c.ID_HOADON = h.ID_HOADON
            WHERE h.NGAYLAPHD BETWEEN ? AND ?
            AND (? IS NULL OR t.MADM = ?)
            GROUP BY t.TENTS
        ", [$startDate, $endDate, $categoryId, $categoryId]);

        // 2. Biểu đồ cột: Số lượng sản phẩm bán ra mỗi ngày trong khoảng thời gian đã chọn
        $dailySales = DB::select("
            SELECT h.NGAYLAPHD, SUM(c.SOLUONG) AS total_quantity
            FROM CHITIETHD c
            JOIN HOADON h ON c.ID_HOADON = h.ID_HOADON
            JOIN TRANGSUC t ON c.ID_TRANGSUC = t.ID
            WHERE h.NGAYLAPHD BETWEEN ? AND ?
            AND (? IS NULL OR t.MADM = ?)
            GROUP BY h.NGAYLAPHD
            ORDER BY h.NGAYLAPHD
        ", [$startDate, $endDate, $categoryId, $categoryId]);

        // 3. Tổng doanh thu và số sản phẩm bán ra trong khoảng thời gian đã chọn và theo danh mục
        $totals = DB::select("
            SELECT SUM(h.TRIGIAHD) AS total_revenue, SUM(c.SOLUONG) AS total_quantity
            FROM CHITIETHD c
            JOIN HOADON h ON c.ID_HOADON = h.ID_HOADON
            JOIN TRANGSUC t ON c.ID_TRANGSUC = t.ID
            WHERE h.NGAYLAPHD BETWEEN ? AND ? 
            AND (? IS NULL OR t.MADM = ?)
        ", [$startDate, $endDate, $categoryId, $categoryId]);

        // 4. Lấy Top 3 sản phẩm bán ra nhiều nhất (số lượng và tên sản phẩm, kèm theo ảnh sản phẩm)
        $topProducts = DB::select("
            SELECT t.TENTS, SUM(c.SOLUONG) AS total_quantity, t.IMAGEURL
            FROM CHITIETHD c
            JOIN TRANGSUC t ON c.ID_TRANGSUC = t.ID
            JOIN HOADON h ON c.ID_HOADON = h.ID_HOADON
            WHERE h.NGAYLAPHD BETWEEN ? AND ?
            AND (? IS NULL OR t.MADM = ?)
            GROUP BY t.TENTS, t.IMAGEURL
            ORDER BY total_quantity DESC
            LIMIT 3
        ", [$startDate, $endDate, $categoryId, $categoryId]);

        return response()->json([
            'productSales' => $productSales,
            'dailySales' => $dailySales,
            'totals' => $totals,
            'topProducts' => $topProducts,  // Trả về top 3 sản phẩm bán chạy
        ]);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Lỗi khi lấy thống kê: ' . $e->getMessage()], 500);
    }
}

}
