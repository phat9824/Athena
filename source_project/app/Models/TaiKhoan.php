<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Auth\Authenticatable;
use Illuminate\Support\Facades\Log;
use PDO;
use Illuminate\Support\Facades\DB;

class TaiKhoan extends Model implements AuthenticatableContract, JWTSubject
{
    use Authenticatable;

    protected $table = 'taikhoan'; // mapping với bảng TAIKHOAN
    protected $primaryKey = 'ID';
    public $timestamps = false; // tắt các cột quản lý thời gian do laravel tự tạo
    protected $fillable = ['EMAIL', 'PASSWORD', 'ROLE', 'TINHTRANG', 'DELETE_AT']; // Các cột được phép thao tác (thêm, sửa)
    protected $hidden = ['PASSWORD'];


    // JWT --------------------------------------------------------------------------------------------------------------
    // Trả về ID
    public function getJWTIdentifier()
    {
        Log::info('JWT Identifier:', ['id' => (string)$this->getKey()]);
        return (string)$this->getKey();
    }

    // Trả về payload tùy chỉnh JWT.
    public function getJWTCustomClaims()
    {
        return [
            'email' => $this->EMAIL,
            'role' => $this->ROLE,
            'tinhtrang' => $this->TINHTRANG,
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
    private static function getPDOConnection()
    {
        return DB::connection()->getPdo();
    }

    public static function getEmailById($id){
        $pdo = self::getPDOConnection();
        $stmt = $pdo->prepare("SELECT EMAIL FROM TAIKHOAN WHERE ID = :id");
        $stmt->execute(['id' => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
