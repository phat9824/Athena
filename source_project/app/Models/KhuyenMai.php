<?php

namespace App\Models;

use Illuminate\Support\Facades\DB;
use PDO;

class KhuyenMai
{
    protected static function getPDOConnection()
    {
        return DB::connection()->getPdo();
    }

    // PDO --------------------------------------------------------------------------

    /**
     * Lấy tất cả khuyến mãi (bao gồm cả những khuyến mãi đã hết hạn).
     */
    public static function getAllKhuyenMai()
    {
        $pdo = self::getPDOConnection();
        $sql = "SELECT * FROM KHUYENMAI";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Lấy khuyến mãi còn hiệu lực.
     */
    public static function getActiveKhuyenMai()
    {
        $pdo = self::getPDOConnection();
        $sql = "SELECT * FROM KHUYENMAI WHERE NGAYKT >= CURDATE()";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Lấy khuyến mãi với phân trang.
     */
    public static function getPaginatedKhuyenMai($offset, $limit, $includeExpired = false)
    {
        $pdo = self::getPDOConnection();
        $params = [];
        $sql = "SELECT * FROM KHUYENMAI";
        if (!$includeExpired) {
            $sql .= " WHERE NGAYKT >= CURDATE()";
        }
        $sql .= " LIMIT :offset, :limit";

        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':offset', (int)$offset, PDO::PARAM_INT);
        $stmt->bindValue(':limit', (int)$limit, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Lấy tổng số khuyến mãi (bao gồm hoặc không bao gồm hết hạn).
     */
    public static function countKhuyenMai($includeExpired = false)
    {
        $pdo = self::getPDOConnection();
        $sql = "SELECT COUNT(*) AS total FROM KHUYENMAI";
        if (!$includeExpired) {
            $sql .= " WHERE NGAYKT >= CURDATE()";
        }

        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        return (int)$result['total'];
    }

    /**
     * Tìm khuyến mãi theo ID.
     */
    public static function findKhuyenMaiById($id)
    {
        $pdo = self::getPDOConnection();
        $sql = "SELECT * FROM KHUYENMAI WHERE ID = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Tìm kiếm khuyến mãi theo tên.
     */
    public static function searchKhuyenMai($keyword)
    {
        $pdo = self::getPDOConnection();
        $sql = "SELECT * FROM KHUYENMAI WHERE TENKM LIKE :keyword";
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':keyword', "%$keyword%", PDO::PARAM_STR);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Kiểm tra mã khuyến mãi đã tồn tại hay chưa
     */
    public static function checkCodeExists($code)
    {
        $pdo = self::getPDOConnection(); // Lấy kết nối PDO
        $sql = "SELECT COUNT(*) AS count FROM KHUYENMAI WHERE MAKM = :MAKM";
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':MAKM', $code, PDO::PARAM_STR);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        return (int)$result['count'] > 0; // Trả về true nếu mã đã tồn tại
    }

    /**
     * Tạo mới khuyến mãi.
     */
    public static function createKhuyenMai($data)
    {
        $pdo = self::getPDOConnection();
        $sql = "INSERT INTO KHUYENMAI (MAKM, TENKM, NGAYBD, NGAYKT, PHANTRAM) 
                VALUES (:MAKM, :TENKM, :NGAYBD, :NGAYKT, :PHANTRAM)";

        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':MAKM', $data['MAKM'], PDO::PARAM_STR);
        $stmt->bindValue(':TENKM', $data['TENKM'], PDO::PARAM_STR);
        $stmt->bindValue(':NGAYBD', $data['NGAYBD'], PDO::PARAM_STR);
        $stmt->bindValue(':NGAYKT', $data['NGAYKT'], PDO::PARAM_STR);
        $stmt->bindValue(':PHANTRAM', $data['PHANTRAM'], PDO::PARAM_INT);

        if ($stmt->execute()) {
            return true;
        }

        throw new \Exception("Không thể tạo khuyến mãi.");
    }

    public static function updateKhuyenMai($id, $data)
    {
        $pdo = self::getPDOConnection();
        $sql = "UPDATE KHUYENMAI SET NGAYBD = :NGAYBD, NGAYKT = :NGAYKT, PHANTRAM = :PHANTRAM WHERE ID = :id";

        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':NGAYBD', $data['NGAYBD'], PDO::PARAM_STR);
        $stmt->bindValue(':NGAYKT', $data['NGAYKT'], PDO::PARAM_STR);
        $stmt->bindValue(':PHANTRAM', $data['PHANTRAM'], PDO::PARAM_INT);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);

        if (!$stmt->execute()) {
            throw new \Exception("Không thể cập nhật khuyến mãi.");
        }
    }
}
