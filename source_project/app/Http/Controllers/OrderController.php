<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;
use App\Models\GioHang;
use App\Models\ChiTietGH;
use App\Models\HoaDon;
use App\Models\ChiTietHD;
use App\Models\TrangSuc;

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
            $cartItems = TrangSuc::applyBestDiscount($cartItems);
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
            $cartItems = TrangSuc::applyBestDiscount($cartItems);
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

            return response()->json([
                'orders' => $hoadonData,
            ]);
        } catch (\Exception $e) {
            Log::error('Error' . $e->getMessage());
            return response()->json(['message' => 'Lỗi server'], 500);
        }
    }

    public function checkout(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            $userId = $user->ID;

            $hoaDon = HoaDon::createInvoiceFromCart($userId);
            
            return response()->json(['message' => 'Thanh toán thành công', 'hoaDon' => $hoaDon], 200);
        } catch (\Exception $e) {
            Log::error('Checkout Error: ' . $e->getMessage(), ['exception' => $e]);
            return response()->json(['message' => 'Đã xảy ra lỗi khi thanh toán'], 500);
        }
    }

    public function addToCart(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            $userId = $user->ID;
            $cart = GioHang::getCartByUserId($userId);

            if (!$cart) {
                $cartId = GioHang::createCartForUser($userId);
                $cart = ['ID_GIOHANG' => $cartId];
            }

            $productId = $request->input('ID_TRANGSUC');
            $quantity = $request->input('SOLUONG', 1);
            ChiTietGH::addOrUpdateCartItem($cart['ID_GIOHANG'], $productId, $quantity);

            return response()->json(['message' => 'Sản phẩm đã được thêm vào giỏ hàng'], 200);
        } catch (\Exception $e) {
            Log::error('Error adding product to cart', [
                'exception' => $e->getMessage(),
            ]);
            return response()->json(['message' => 'Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng'], 500);
        }
    }


}

