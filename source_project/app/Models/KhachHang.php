<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;
use PDO;
use Illuminate\Support\Facades\DB;

class KhachHang extends Model
{
    protected $table = 'KHACHHANG';
    protected $primaryKey = 'ID';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = ['TENKH', 'SDT', 'DIACHI', 'LOAI', 'GIOITINH', 'IMAGEURL'];

    private static function getPDOConnection()
    {
        return DB::connection()->getPdo();
    }

    public static function getProfileById($userId)
    {
        $pdo = self::getPDOConnection();
        $stmt = $pdo->prepare("SELECT * FROM KHACHHANG WHERE ID = :id");
        $stmt->execute(['id' => $userId]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
