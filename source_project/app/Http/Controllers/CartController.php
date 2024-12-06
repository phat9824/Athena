<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;
use App\Models\GioHang;
use App\Models\ChiTietGH;

class CartController extends Controller
{
    public function getCart(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            $userId = $user->ID;
            $cart = GioHang::getCartByUserId($userId);
            
            if (!$cart) {
                return response()->json([], 200);
            }

            $cartItems = ChiTietGH::getCartItemsByCartId($cart['ID_GIOHANG']);
            return response()->json($cartItems, 200);
        } catch (\Exception $e) {
            Log::error('Get Cart Error: ' . $e->getMessage());
            return response()->json(['message' => 'Đã xảy ra lỗi khi lấy giỏ hàng'], 500);
        }
    }
}

