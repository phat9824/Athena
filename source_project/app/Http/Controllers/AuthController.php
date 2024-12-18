<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TaiKhoan;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function register(Request $request)
    {   
        /* 
        Validate dữ liệu ở mức cấu trúc
            required: bắt buộc có
            email: kiểm tra định dạng là email
            min: độ dài tối thiểu
            max: độ dài tối đa
        Hàm fails trả về true nếu validate thất bại
        */
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|max:100',
            'password' => 'required|min:6|max:256',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 400);
        }

        // $sessionCookie = $request->cookie('laravel_session');
        // Log::info('Cookie laravel_session:', ['value' => $sessionCookie]); // Chỉ để log dữ liệu hỗ trợ việc debug

        // Validate dữ liệu ở mức business logic
        $existingAccount = TaiKhoan::where('email', $request->email)->first();
        if ($existingAccount) {
            if ($existingAccount->tinhtrang === 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tài khoản đã bị khóa, vui lòng liên hệ quản trị viên.',
                ], 403);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Tài khoản đã tồn tại. Vui lòng sử dụng email khác.',
                ], 409);
            }
        }
        
        try {
            $userData = [
                'EMAIL' => $request->email,
                'PASSWORD' => Hash::make($request->password),
                'ROLE' => 0,
                'TINHTRANG' => 1
            ];
            
            $taiKhoan = TaiKhoan::createUser($userData);

            $token = auth('api')->login($taiKhoan);

            return response()->json([
                'success' => true,
                'message' => 'Đăng ký thành công!',
                'token' => $token
            ], 201);
        } catch (\Exception $e) {
            Log::error('Registration Error: ' . $e->getMessage()); // Log các exception error
            return response()->json([
                'success' => false,
                'message' => 'Đăng ký thất bại!',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function login(Request $request)
    {
        // Validate dữ liệu
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|max:100',
            'password' => 'required|min:6|max:256',
        ]);

        // Kiểm tra tài khoản
        $taiKhoan = TaiKhoan::getUserByEmail($request->email);

        if (!$taiKhoan) {
            return response()->json([
                'success' => false,
                'message' => 'Tài khoản không tồn tại.'
            ], 404);
        }

        if ($taiKhoan->TINHTRANG === 0) {
            return response()->json([
                'success' => false,
                'message' => 'Tài khoản đã bị khóa, vui lòng liên hệ quản trị viên.'
            ], 403);
        }

        // Log::info('Login Attempt:', [
        //     's' => $taiKhoan->ID,
        //     'plain_password' => $request->password,
        //     'hashed_password' => $taiKhoan->PASSWORD,
        // ]);

        if (!Hash::check($request->password, $taiKhoan->PASSWORD)) {
            return response()->json([
                'success' => false,
                'message' => 'Sai mật khẩu, vui lòng thử lại.'
            ], 401);
        }

        // Tạo JWT token
        try {
            //Log::info('Login User:', ['user' => $taiKhoan]);
            $token = auth('api')->login($taiKhoan);
            //Log::info('JWT', ['value' => $token]);

            $cookie = cookie(
                name: 'token',
                value: $token,
                minutes: JWTAuth::factory()->getTTL(),
                path: '/',
                domain: null,
                secure: true,
                httpOnly: true,             // Không truy cập đc bằng JS phía client
                raw: false,
                sameSite: 'Lax'             // Cho phép cross-site
            );

            return response()->json([
                'success' => true,
                'message' => 'Đăng nhập thành công!',
                'data' => [
                    'role' => $taiKhoan->ROLE,
                    'id' => $taiKhoan->ID,
                ],
            ], 200)->cookie($cookie);
        } catch (\Exception $e) {
            Log::error('Login Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Đăng nhập thất bại, vui lòng thử lại.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
