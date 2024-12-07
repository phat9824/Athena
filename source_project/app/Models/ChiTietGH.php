<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use PDO;

class ChiTietGH extends Model
{
    protected $table = 'CHITIETGH';
    public $incrementing = false;
    public $timestamps = false;
    protected $fillable = ['ID_TRANGSUC', 'ID_GIOHANG', 'SOLUONG'];

    private static function getPDOConnection()
    {
        return DB::connection()->getPdo();
    }

    public static function getCartItemsByCartId($cartId)
    {
        $pdo = self::getPDOConnection();
        $sql = "SELECT 
                    TRANGSUC.ID AS ID_TRANGSUC, 
                    TRANGSUC.TENTS, 
                    TRANGSUC.GIANIEMYET, 
                    TRANGSUC.IMAGEURL, 
                    CHITIETGH.SOLUONG
                FROM CHITIETGH
                JOIN TRANGSUC ON CHITIETGH.ID_TRANGSUC = TRANGSUC.ID
                WHERE CHITIETGH.ID_GIOHANG = :cartId
                  AND TRANGSUC.DELETED_AT IS NULL";

        $stmt = $pdo->prepare($sql);
        $stmt->execute(['cartId' => $cartId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function updateCartItems($cartId, $items)
    {
        $pdo = self::getPDOConnection();
        $pdo->beginTransaction();

        try {
            foreach ($items as $item) {
                $sql = "UPDATE CHITIETGH SET SOLUONG = :quantity 
                        WHERE ID_GIOHANG = :cartId AND ID_TRANGSUC = :productId";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([
                    'quantity' => $item['SOLUONG'],
                    'cartId' => $cartId,
                    'productId' => $item['ID_TRANGSUC'],
                ]);
            }
            $pdo->commit();
        } catch (\Exception $e) {
            $pdo->rollBack();
            throw $e;
        }
    }
}
