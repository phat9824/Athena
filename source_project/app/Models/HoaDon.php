<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class HoaDon extends Model
{
    protected $table = 'HOADON';
    protected $primaryKey = 'ID_HOADON';
    public $incrementing = true;
    public $timestamps = false;

    protected $fillable = ['ID_KHACHHANG', 'NGAYLAPHD', 'TRIGIAHD', 'TIENPHAITRA', 'TRANGTHAI', 'DELETED_AT'];

    private static function getPDOConnection()
    {
        return DB::connection()->getPdo();
    }

    public static function getAllByIDKhachHang($idKhachHang)
    {
        $connection = self::getPDOConnection();

        try {
            $sql = "SELECT * FROM HOADON WHERE ID_KHACHHANG = :idkh AND DELETED_AT IS NULL ORDER BY NGAYLAPHD DESC";
            $stmt = $connection->prepare($sql);
            $stmt->execute(['idkh' => $idKhachHang]);
            $hoadons = $stmt->fetchAll(\PDO::FETCH_ASSOC);
            foreach ($hoadons as &$hd) {
                $sqlCT = "SELECT ct.*, ts.TENTS, ts.IMAGEURL FROM CHITIETHD ct 
                          LEFT JOIN TRANGSUC ts ON ct.ID_TRANGSUC = ts.ID 
                          WHERE ct.ID_HOADON = :idhd";
                $stmtCT = $connection->prepare($sqlCT);
                $stmtCT->execute(['idhd' => $hd['ID_HOADON']]);
                $hd['chi_tiet'] = $stmtCT->fetchAll(\PDO::FETCH_ASSOC);
            }
            return $hoadons;
        } catch (\Exception $e) {
            Log::error('Error fetching order history: ' . $e->getMessage());
            return [];
        }
    }
}
