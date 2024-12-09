<?php
// app/Http/Controllers/ProductController.php

namespace App\Http\Controllers;

use App\Models\TrangSuc; // Assuming TrangSuc model is defined
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Exception;

class ProductManagementController extends Controller
{
    // Get all products (not soft-deleted)
    public static function getAllProducts(Request $request)
    {
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
}
