<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class SanPhamBanChayController extends Controller
{
    public function getTopProduct(Request $request)
    {
        try {
            // Lấy tất cả danh mục và tên danh mục từ bảng DANHMUCTS
            $categoryNames = DB::table('DANHMUCTS')->pluck('TENDM', 'MADM'); // Trả về một mảng với MADM là key và TENDM là value
            
            // Lấy danh sách các danh mục (MADM) trong bảng TRANGSUC
            $categories = DB::table('TRANGSUC')
                            ->select('MADM')
                            ->distinct()
                            ->get();
            
            $topProducts = [];

            // Duyệt qua các danh mục và lấy top 3 sản phẩm bán chạy nhất cho từng danh mục
            foreach ($categories as $category) {
                $categoryId = $category->MADM;

                // Lấy tên danh mục từ mảng đã lấy
                $categoryName = $categoryNames[$categoryId] ?? 'Không rõ'; // Nếu không có tên danh mục, trả về "Không rõ"

                // Truy vấn lấy top 3 sản phẩm bán chạy nhất trong danh mục 
                $products = DB::select("
                    SELECT t.ID, t.TENTS, t.IMAGEURL, t.GIANIEMYET, SUM(c.SOLUONG) AS total_quantity
                    FROM CHITIETHD c
                    JOIN TRANGSUC t ON c.ID_TRANGSUC = t.ID
                    JOIN HOADON h ON c.ID_HOADON = h.ID_HOADON
                    WHERE t.MADM = ?
                    GROUP BY t.ID, t.TENTS, t.IMAGEURL, t.GIANIEMYET
                    ORDER BY total_quantity DESC
                    LIMIT 3
                ", [$categoryId]);

                // Thêm danh mục và sản phẩm vào mảng
                $topProducts[] = [
                    'categoryId' => $categoryId,
                    'categoryName' => $categoryName, // Sử dụng tên danh mục đã lấy
                    'products' => $products
                ];
            }

            return response()->json([
                'topProducts' => $topProducts
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Lỗi khi lấy top 3: ' . $e->getMessage()], 500);
        }
    }
}
