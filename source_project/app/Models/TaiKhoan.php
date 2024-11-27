<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TaiKhoan extends Model
{
    protected $table = 'taikhoan'; // mapping với bảng TAIKHOAN
    protected $primaryKey = 'id';
    public $timestamps = false; // tắt các cột quản lý thời gian do laravel tự tạo
    protected $fillable = ['email', 'password', 'role', 'tinhtrang', 'deleted_at']; // Các cột được phép thao tác (thêm, sửa)


    public static function getUserByEmail($email)
    {
        return self::where('email', $email)->first();
    }
}
