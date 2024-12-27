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
    public static function getPaginatedKhuyenMai($offset, $limit, $includeExpired = false, $sortField = 'NGAYBD', $sortOrder = 'asc')
    {
        $pdo = self::getPDOConnection();
        $params = [];
        $sql = "
                SELECT 
                    km.*,
                    GROUP_CONCAT(DISTINCT dm.TENDM) AS categoryNames,
                    GROUP_CONCAT(DISTINCT ts.TENTS) AS productNames
                FROM KHUYENMAI km
                LEFT JOIN KM_DANHMUC kmdm ON km.ID = kmdm.ID_KHUYENMAI
                LEFT JOIN DANHMUCTS dm ON kmdm.MADM = dm.MADM
                LEFT JOIN KM_TRANGSUC kmts ON km.ID = kmts.ID_KHUYENMAI
                LEFT JOIN TRANGSUC ts ON kmts.ID_TRANGSUC = ts.ID
                ";

        if (!$includeExpired) {
            $sql .= " WHERE km.NGAYKT >= CURDATE()";
        }

        $sql .= " GROUP BY km.ID, km.MAKM, km.TENKM, km.NGAYBD, km.NGAYKT, km.PHANTRAM";
        $sql .= " ORDER BY $sortField $sortOrder";
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

        if (!$stmt->execute()) {
            throw new \Exception("Không thể tạo khuyến mãi.");
        }

        // Lấy ID vừa insert
        $lastInsertId = $pdo->lastInsertId();
        return $lastInsertId;
    }

    // Hàm gắn danh mục cho khuyến mãi
    public static function attachCategories($khuyenMaiId, array $categoryIds)
    {
        $pdo = self::getPDOConnection();
        $sql = "INSERT INTO KM_DANHMUC (ID_KHUYENMAI, MADM) VALUES (:kmId, :madm)";

        $stmt = $pdo->prepare($sql);
        foreach ($categoryIds as $cat) {
            $stmt->bindValue(':kmId', $khuyenMaiId, PDO::PARAM_INT);
            $stmt->bindValue(':madm', $cat, PDO::PARAM_STR);
            $stmt->execute();
        }
    }

    // Hàm gắn sản phẩm cho khuyến mãi
    public static function attachProducts($khuyenMaiId, array $productIds)
    {
        $pdo = self::getPDOConnection();
        $sql = "INSERT INTO KM_TRANGSUC (ID_KHUYENMAI, ID_TRANGSUC) VALUES (:kmId, :tsId)";

        $stmt = $pdo->prepare($sql);
        foreach ($productIds as $prod) {
            $stmt->bindValue(':kmId', $khuyenMaiId, PDO::PARAM_INT);
            $stmt->bindValue(':tsId', $prod, PDO::PARAM_INT);
            $stmt->execute();
        }
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

    // Xoá phạm vi cũ trước khi ghi nhận phạm vi mới
    public static function detachAllCategories($khuyenMaiId)
    {
        $pdo = self::getPDOConnection();
        $sql = "DELETE FROM KM_DANHMUC WHERE ID_KHUYENMAI = :kmId";
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':kmId', $khuyenMaiId, PDO::PARAM_INT);
        $stmt->execute();
    }

    public static function detachAllProducts($khuyenMaiId)
    {
        $pdo = self::getPDOConnection();
        $sql = "DELETE FROM KM_TRANGSUC WHERE ID_KHUYENMAI = :kmId";
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':kmId', $khuyenMaiId, PDO::PARAM_INT);
        $stmt->execute();
    }
}
