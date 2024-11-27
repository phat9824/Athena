<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TaiKhoan;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {   
        /* 
        Validate dữ liệu
            required: bắt buộc có
            email: kiểm tra định dạng là email
            unique:taikhoan,email : kiểm tra email có trong bảng taikhoan cột email hay không
            min: độ dài tối thiểu
            max: độ dài tối đa
        Hàm fails trả về true nếu validate thất bại
        */
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|unique:taikhoan,email|max:100',
            'password' => 'required|min:6|max:256',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 400);
        }

        try {
            $taiKhoan = TaiKhoan::create([
                'email' => $request->email,
                'password' => Hash::make($request->password), // Hàm hash mặc định là Bcrypt
                'role' => 0,
                'tinhtrang' => 1
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Đăng ký thành công!',
                'data' => $taiKhoan
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Đăng ký thất bại!',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
