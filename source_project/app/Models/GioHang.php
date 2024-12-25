<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use PDO;

class GioHang extends Model
{
    protected $table = 'GIOHANG';
    protected $primaryKey = 'ID_GIOHANG';
    public $incrementing = true;
    public $timestamps = false;

    protected $fillable = ['ID_KHACHHANG'];

    private static function getPDOConnection()
    {
        $connection = DB::connection()->getPdo();
        return $connection;
    }

    public static function getCartByUserId($userId)
    {
        $pdo = self::getPDOConnection();
        $sql = "SELECT * FROM GIOHANG WHERE ID_KHACHHANG = :userId";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['userId' => $userId]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public static function createCartForUser($userId)
    {
        $pdo = self::getPDOConnection();
        $sql = "INSERT INTO GIOHANG (ID_KHACHHANG) VALUES (:userId)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['userId' => $userId]);
        return $pdo->lastInsertId();
    }

}
