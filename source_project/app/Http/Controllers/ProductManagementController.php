<?php
// app/Http/Controllers/ProductController.php

namespace App\Http\Controllers;

use App\Models\TrangSuc; // Assuming TrangSuc model is defined
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Exception;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductManagementController extends Controller
{
    // Get all products (not soft-deleted)
    public static function getAllProducts(Request $request)
    {
        // Lấy danh sách sản phẩm
        try {
            $products = TrangSuc::getAllProducts();

            return response()->json($products);
        } catch (Exception $e) {
            Log::error('Error: ' . $e->getMessage());
            return response()->json(['error' => 'Something went wrong: ' . $e->getMessage()], 500);
        }
    }

    public static function getPaginatedProducts(Request $request)
    {
        // Lấy danh sách sản phẩm phân trang
        try {
            $page = $request->query('page', 1);
            $perPage = $request->query('perPage', 10);
            $filters = $request->query('filters', []); // Bộ lọc
            $search = $request->query('search', ''); // Từ khóa tìm kiếm

            $offset = ($page - 1) * $perPage;

            $result = TrangSuc::filterProducts($filters, $search, $offset, $perPage);
            $products = $result['products'];
            $total = $result['total'];
            return response()->json([
                'data' => $products,
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


    public static function getProductById($id, Request $request)
    {
        // Lấy thông tin sản phẩm theo ID
        try {
            $product = TrangSuc::findProductById($id);

            if (!$product) {
                return response()->json(['message' => 'Product not found'], 404);
            }

            return response()->json($product);
        } catch (Exception $e) {
            Log::error('Error: ' . $e->getMessage());
            return response()->json(['error' => 'Something went wrong: ' . $e->getMessage()], 500);
        }
    }

    public static function createProduct(Request $request)
    {
        try {
            // Validate dữ liệu đầu vào
            $data = $request->validate([
                'MADM' => 'required|string',
                'TENTS' => 'required|string',
                'GIANIEMYET' => 'required|numeric',
                'SLTK' => 'required|integer',
                'MOTA' => 'nullable|string',
                'image' => 'nullable|file|mimes:jpeg,jpg,png|max:2048', // File ảnh
            ]);

            // Xử lý ảnh
            $lastProduct = TrangSuc::where('MADM', $data['MADM'])->latest('ID')->first();
            $nextNumber = $lastProduct ? intval(Str::afterLast($lastProduct->IMAGEURL, '_')) + 1 : 1;
            $filename = $data['MADM'] . '_' . $nextNumber . '.' . $request->file('image')->getClientOriginalExtension();
            $path = $request->file('image')->storeAs('images', $filename, 'public'); // Lưu ảnh vào thư mục storage
            $data['IMAGEURL'] = TrangSuc::prepareImageUrl($filename); // Chuẩn bị đường dẫn ảnh

            // Gọi model để thêm sản phẩm
            TrangSuc::createProduct($data);

            return response()->json(['message' => 'Thêm sản phẩm thành công!'], 201);
        } catch (Exception $e) {
            Log::error('Error: ' . $e->getMessage());
            return response()->json(['error' => 'Đã xảy ra lỗi: ' . $e->getMessage()], 500);
        }
    }
}
