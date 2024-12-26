<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use PDO;

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

    public static function createInvoiceFromCart($userId)
    {
        $pdo = DB::connection()->getPdo();
        try {
            $pdo->beginTransaction();

            $cart = GioHang::getCartByUserId($userId);
            if (!$cart) {
                throw new \Exception('Giỏ hàng không tồn tại');
            }

            $cartItems = ChiTietGH::getCartItemsByCartId($cart['ID_GIOHANG']);
            if (empty($cartItems)) {
                throw new \Exception('Giỏ hàng trống');
            }
            $cartItems = TrangSuc::applyBestDiscount($cartItems);

            $totalValue = array_reduce($cartItems, function ($sum, $item) {
                $discountedPrice = $item['GIANIEMYET'] * (1 - ($item['BEST_DISCOUNT'] ?? 0) / 100);
                return $sum + $discountedPrice * $item['SOLUONG'];
            }, 0);

            $sqlHoaDon = "INSERT INTO HOADON (ID_KHACHHANG, NGAYLAPHD, TRIGIAHD, TIENPHAITRA, TRANGTHAI) 
                          VALUES (:idKhachHang, NOW(), :triGiaHD, :tienPhaiTra, :trangThai)";
            $stmtHoaDon = $pdo->prepare($sqlHoaDon);
            $stmtHoaDon->execute([
                'idKhachHang' => $userId,
                'triGiaHD' => $totalValue,
                'tienPhaiTra' => $totalValue,
                'trangThai' => 0,
            ]);

            $invoiceId = $pdo->lastInsertId();

            $sqlChiTietHD = "INSERT INTO CHITIETHD (ID_HOADON, ID_TRANGSUC, SOLUONG, GIASP) 
                             VALUES (:idHoaDon, :idTrangSuc, :soLuong, :giaSP)";
            $stmtChiTietHD = $pdo->prepare($sqlChiTietHD);
            foreach ($cartItems as $item) {
                $stmtChiTietHD->execute([
                    'idHoaDon' => $invoiceId,
                    'idTrangSuc' => $item['ID_TRANGSUC'],
                    'soLuong' => $item['SOLUONG'],
                    'giaSP' => $item['GIANIEMYET'] * (1 - ($item['BEST_DISCOUNT'] ?? 0) / 100),
                ]);
            }

            ChiTietGH::deleteCartItemsByCartId($cart['ID_GIOHANG']);

            $pdo->commit();

            return self::getInvoiceById($invoiceId);
        } catch (\Exception $e) {
            $pdo->rollBack();
            throw $e;
        }
    }

    public static function getInvoiceById($invoiceId)
    {
        $pdo = DB::connection()->getPdo();
        $sql = "SELECT * FROM HOADON WHERE ID_HOADON = :idHoaDon";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['idHoaDon' => $invoiceId]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
