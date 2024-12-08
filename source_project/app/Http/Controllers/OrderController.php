<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;
use App\Models\GioHang;
use App\Models\ChiTietGH;
use App\Models\HoaDon;

class OrderController extends Controller
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

    public function updateCart(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            $userId = $user->ID;
            $cart = GioHang::getCartByUserId($userId);
            if (!$cart) {
                return response()->json(['message' => 'Giỏ hàng không tồn tại'], 404);
            }

            $items = $request->input('items');
            if (empty($items)) {
                return response()->json(['message' => 'Dữ liệu không hợp lệ'], 400);
            }

            ChiTietGH::updateCartItems($cart['ID_GIOHANG'], $items);

            $cartItems = ChiTietGH::getCartItemsByCartId($cart['ID_GIOHANG']);
            return response()->json($cartItems, 200);
        } catch (\Exception $e) {
            Log::error('Update Cart Error: ' . $e->getMessage(), ['exception' => $e]);
            return response()->json(['message' => 'Đã xảy ra lỗi khi cập nhật giỏ hàng'], 500);
        }
    }

    public function getOrderHistory(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            $idKhachHang = $user->ID;
            $hoadonData = HoaDon::getAllByIDKhachHang($idKhachHang);
            return response()->json($hoadonData);
        } catch (\Exception $e) {
            Log::error('Error' . $e->getMessage());
            return response()->json(['message' => 'Lỗi server'], 500);
        }
    }
}

