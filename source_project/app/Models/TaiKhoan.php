<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Auth\Authenticatable;
use Illuminate\Support\Facades\Log;

class TaiKhoan extends Model implements AuthenticatableContract, JWTSubject
{
    use Authenticatable;

    protected $table = 'taikhoan'; // mapping với bảng TAIKHOAN
    protected $primaryKey = 'id';
    public $timestamps = false; // tắt các cột quản lý thời gian do laravel tự tạo
    protected $fillable = ['email', 'password', 'role', 'tinhtrang', 'deleted_at']; // Các cột được phép thao tác (thêm, sửa)



    // JWT --------------------------------------------------------------------------------------------------------------
    // Trả về ID
    public function getJWTIdentifier()
    {
        Log::info('JWT Identifier:', ['id' => $this->getKey()]);
        return (string)$this->getKey();
    }

    // Trả về payload tùy chỉnh JWT.
    public function getJWTCustomClaims()
    {
        return [
            'email' => $this->email,
            'role' => $this->role,
            'tinhtrang' => $this->tinhtrang,
        ];
    }

    // Eloquent ORM --------------------------------------------------------------------------------------------------------------
    
    /**
     * Lấy thông tin người dùng qua email.
     * @param string $email
     * @return TaiKhoan|null
     */
    public static function getUserByEmail($email)
    {
        return self::where('email', $email)->first();
    }

    /**
     * Kiểm tra xem email đã tồn tại trong hệ thống chưa.
     * @param string $email
     * @return bool
     */
    public static function emailExists($email)
    {
        return self::where('email', $email)->exists();
    }

    /**
     * Tạo tài khoản mới.
     * @param array $data
     * @return TaiKhoan
     */
    public static function createUser(array $data)
    {
        return self::create($data);
    }

    /**
     * Kiểm tra trạng thái tài khoản.
     * @param string $email
     * @return bool
     */
    public static function isAccountLocked($email)
    {
        $user = self::getUserByEmail($email);
        return $user && $user->tinhtrang === 0;
    }

    // PDO --------------------------------------------------------------------------------------------------------------
}
