<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use PDO;
use Illuminate\Support\Facades\Log;

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
                    TRANGSUC.MADM,
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
    try {
        $pdo->beginTransaction();

        // Lấy danh sách sản phẩm hiện tại trong giỏ hàng
        $currentItems = self::getCurrentCartItems($cartId);
        // Lấy danh sách ID_TRANGSUC từ client
        $updatedItemIds = array_map(fn($item) => $item['ID_TRANGSUC'], $items);
        // Xóa các sản phẩm không nằm trong danh sách
        self::deleteMissingItems($pdo, $cartId, $currentItems, $updatedItemIds);
        // Cập nhật hoặc thêm mới các sản phẩm
        foreach ($items as $item) {
            self::updateCartItem($pdo, $cartId, $item);
        }

        $pdo->commit();
    } catch (\Exception $e) {
        $pdo->rollBack();
        Log::error('Error updating cart items', [
            'cartId' => $cartId,
            'items' => $items,
            'exception' => $e->getMessage(),
        ]);
        throw $e;
    }
    }    

    private static function getCurrentCartItems($cartId)
    {
        $pdo = self::getPDOConnection();
        try {
            $sql = "SELECT ID_TRANGSUC FROM CHITIETGH WHERE ID_GIOHANG = :cartId";
            $stmt = $pdo->prepare($sql);
            $stmt->execute(['cartId' => $cartId]);
            return $stmt->fetchAll(PDO::FETCH_COLUMN);
        } catch (\Exception $e) {
            Log::error('Error fetching current cart items', [
                'cartId' => $cartId,
                'exception' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    private static function deleteMissingItems($pdo, $cartId, $currentItems, $updatedItemIds)
    {
        try {
            $itemsToDelete = array_diff($currentItems, $updatedItemIds);
            if (!empty($itemsToDelete)) {
                $placeholders = implode(',', array_map(fn($key) => ":id$key", array_keys($itemsToDelete)));
                $sql = "DELETE FROM CHITIETGH WHERE ID_GIOHANG = :cartId AND ID_TRANGSUC IN ($placeholders)";
                $stmt = $pdo->prepare($sql);
    
                $params = ['cartId' => $cartId];
                foreach ($itemsToDelete as $key => $id) {
                    $params[":id$key"] = $id;
                }
                $stmt->execute($params);
            }
        } catch (\Exception $e) {
            Log::error('Error deleting missing items from cart', [
                'cartId' => $cartId,
                'currentItems' => $currentItems,
                'updatedItemIds' => $updatedItemIds,
                'exception' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    private static function updateCartItem($pdo, $cartId, $item)
    {
        try {
            if ($item['SOLUONG'] == 0) {
                $sql = "DELETE FROM CHITIETGH 
                        WHERE ID_GIOHANG = :cartId AND ID_TRANGSUC = :productId";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([
                    'cartId' => $cartId,
                    'productId' => $item['ID_TRANGSUC'],
                ]);
            } else {
                $sql = "UPDATE CHITIETGH 
                        SET SOLUONG = :quantity 
                        WHERE ID_GIOHANG = :cartId AND ID_TRANGSUC = :productId";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([
                    'cartId' => $cartId,
                    'productId' => $item['ID_TRANGSUC'],
                    'quantity' => $item['SOLUONG'],
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Error updating cart item', [
                'cartId' => $cartId,
                'item' => $item,
                'exception' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    public static function addOrUpdateCartItem($cartId, $productId, $quantity)
    {
        $pdo = self::getPDOConnection();

        try {
            // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
            $sqlCheck = "SELECT SOLUONG FROM CHITIETGH WHERE ID_GIOHANG = :cartId AND ID_TRANGSUC = :productId";
            $stmtCheck = $pdo->prepare($sqlCheck);
            $stmtCheck->execute([
                'cartId' => $cartId,
                'productId' => $productId,
            ]);
            $existingItem = $stmtCheck->fetch(PDO::FETCH_ASSOC);

            if ($existingItem) {
                // Nếu đã tồn tại, cập nhật số lượng
                $newQuantity = $existingItem['SOLUONG'] + $quantity;
                $sqlUpdate = "UPDATE CHITIETGH SET SOLUONG = :newQuantity WHERE ID_GIOHANG = :cartId AND ID_TRANGSUC = :productId";
                $stmtUpdate = $pdo->prepare($sqlUpdate);
                $stmtUpdate->execute([
                    'newQuantity' => $newQuantity,
                    'cartId' => $cartId,
                    'productId' => $productId,
                ]);
            } else {
                // Nếu chưa tồn tại, thêm sản phẩm mới
                $sqlInsert = "INSERT INTO CHITIETGH (ID_GIOHANG, ID_TRANGSUC, SOLUONG) VALUES (:cartId, :productId, :quantity)";
                $stmtInsert = $pdo->prepare($sqlInsert);
                $stmtInsert->execute([
                    'cartId' => $cartId,
                    'productId' => $productId,
                    'quantity' => $quantity,
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Error adding or updating cart item', [
                'cartId' => $cartId,
                'productId' => $productId,
                'quantity' => $quantity,
                'exception' => $e->getMessage(),
            ]);
            throw $e;
        }
    }


    public static function deleteCartItemsByCartId($cartId)
    {
        $pdo = DB::connection()->getPdo();
        $sql = "DELETE FROM CHITIETGH WHERE ID_GIOHANG = :cartId";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['cartId' => $cartId]);
    }
}
