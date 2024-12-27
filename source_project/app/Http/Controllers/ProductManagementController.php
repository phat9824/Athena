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
        try {
            $page = $request->query('page', 1);
            $perPage = $request->query('perPage', 10);

            $filters = [
                'category' => $request->query('category', ''),
                'priceMin' => $request->query('priceMin', ''),
                'priceMax' => $request->query('priceMax', ''),
            ];
            $search = $request->query('search', '');
            $sort = $request->query('sort', 'asc');
            $sortBy = $request->query('sortBy', 'price');

            $offset = ($page - 1) * $perPage;

            //$result = TrangSuc::filterProducts($filters, $search, $offset, $perPage, $sort);
            $result = TrangSuc::filterProducts2($filters, $search, $offset, $perPage, $sort, $sortBy);
            $products = $result['products'];
            $total = $result['total'];

            $products = TrangSuc::applyBestDiscount($products);

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
    public static function updateProduct($id, Request $request)
    {
        try {
            // Validate dữ liệu
            $data = $request->validate([
                'MADM'       => 'required|string',
                'TENTS'      => 'required|string',
                'GIANIEMYET' => 'required|numeric',
                'SLTK'       => 'required|integer',
                'deleted'    => 'required|boolean'
            ]);

            // Tìm sản phẩm
            $product = TrangSuc::findProductById($id);
            if (!$product) {
                return response()->json(['message' => 'Sản phẩm không tồn tại'], 404);
            }

            // Chuẩn bị dữ liệu cập nhật
            $updateData = [
                'MADM'       => $data['MADM'],
                'TENTS'      => $data['TENTS'],
                'GIANIEMYET' => $data['GIANIEMYET'],
                'SLTK'       => $data['SLTK']
            ];

            // Xử lý DELETED_AT
            if ($data['deleted'] === true) {
                $updateData['DELETED_AT'] = date('Y-m-d H:i:s'); // Set DELETED_AT là thời điểm hiện tại
            } else {
                $updateData['DELETED_AT'] = null; // Set DELETED_AT = null để khôi phục
            }

            // Gọi hàm cập nhật trong model
            $res = TrangSuc::updateProductById($id, $updateData);

            if ($res) {
                return response()->json(['message' => 'Cập nhật sản phẩm thành công!'], 200);
            } else {
                return response()->json(['error' => 'Không thể cập nhật sản phẩm'], 500);
            }
        } catch (Exception $e) {
            Log::error('Error: ' . $e->getMessage());
            return response()->json(['error' => 'Đã xảy ra lỗi: ' . $e->getMessage()], 500);
        }
    }

    public static function getProductDetails($id)
    {
        try {
            $product = TrangSuc::findProductById($id);

            if (!$product) {
                return response()->json(['error' => 'Sản phẩm không tồn tại!'], 404);
            }

            $productsWithDiscount = TrangSuc::applyBestDiscount([$product]);
            $productWithDiscount = $productsWithDiscount[0];

            return response()->json($productWithDiscount);
        } catch (Exception $e) {
            Log::error('Error fetching product details: ' . $e->getMessage());
            return response()->json(['error' => 'Something went wrong: ' . $e->getMessage()], 500);
        }
    }

    public function getRandomProducts($excludeId)
    {
        try {
            $randomProducts = TrangSuc::findRandomProducts($excludeId);

            $randomProducts = TrangSuc::applyBestDiscount($randomProducts);

            return response()->json($randomProducts);
        } catch (Exception $e) {
            Log::error('Error fetching random products: ' . $e->getMessage());
            return response()->json(['error' => 'Something went wrong: ' . $e->getMessage()], 500);
        }
    }
}
