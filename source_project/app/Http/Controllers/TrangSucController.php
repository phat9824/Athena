<?php
// app/Http/Controllers/ProductController.php

namespace App\Http\Controllers;

use App\Models\TrangSuc; // Assuming TrangSuc model is defined
use Illuminate\Http\Request;
use Exception;

class TrangSucController extends Controller
{
    // Get all products (not soft-deleted)
    public static function getAllProducts(Request $request)
    {
        try {

            // Fetch products from the model
            $products = (new TrangSuc())->getAllProducts();

            return response()->json($products);
        } catch (Exception $e) {
            // Catch any exceptions and return a 500 error
            return response()->json(['error' => 'Something went wrong: ' . $e->getMessage()], 500);
        }
    }

    // Get product by ID
    public static function getProductById($id, Request $request)
    {
        try {
            $product = (new TrangSuc())->findProductById($id);
            
            if (!$product) {
                return response()->json(['message' => 'Product not found'], 404);
            }

            return response()->json($product);
        } catch (Exception $e) {
            // Catch any exceptions and return a 500 error
            return response()->json(['error' => 'Something went wrong: ' . $e->getMessage()], 500);
        }
    }
}
