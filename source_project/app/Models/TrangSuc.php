<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use PDO;

class TrangSuc extends Model
{
    protected $table = 'TRANGSUC';
    protected $primaryKey = 'ID';
    public $incrementing = true;

    public $timestamps = false;

    protected $fillable = ['MADM', 'TENTS', 'GIANIEMYET', 'SLTK', 'MOTA', 'IMAGEURL', 'DELETED_AT'];

    // Eloquent ORM ----------------------------------------------------------------

    /***
    Lấy tất cả trang sức
    $includeDeleted     false   :Không lấy các trang sức tạm ẩn
                        true    :Lấy cả các trang sức bị ẩn
     */
    static public function getAllTrangSuc($includeDeleted = false)
    {
        if ($includeDeleted) {
            return self::all();
        }
        return self::whereNull('DELETED_AT')->get();
    }

    // PDO --------------------------------------------------------------------------
    private static function getPDOConnection()
    {
        $connection = DB::connection()->getPdo();
        return $connection;
    }

    // Lấy tất cả sản phẩm
    public static function getAllProducts()
    {
        $pdo = TrangSuc::getPDOConnection();
        $sql = "SELECT * FROM TRANGSUC WHERE DELETED_AT IS NULL";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    // Lấy các sản phẩm với phân trang
    public static function getPaginatedProducts($offset, $limit)
    {
        $pdo = self::getPDOConnection();
        $sql = "SELECT * FROM TRANGSUC WHERE DELETED_AT IS NULL LIMIT :offset, :limit";
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':offset', (int)$offset, PDO::PARAM_INT);
        $stmt->bindValue(':limit', (int)$limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Lấy các sản phẩm với filers và search cùng với phân trang
    public static function filterProducts($filters = [], $search = '', $offset = 0, $limit = 10, $sort = 'asc')
    {
        $pdo = self::getPDOConnection();
        $params = [];
        $baseSql = "FROM TRANGSUC WHERE DELETED_AT IS NULL";

        // Lọc theo danh mục
        if (!empty($filters['category'])) {
            $baseSql .= " AND MADM = :category";
            $params[':category'] = $filters['category'];
        }

        // Lọc theo giá tối thiểu
        if (!empty($filters['priceMin'])) {
            $baseSql .= " AND GIANIEMYET >= :priceMin";
            $params[':priceMin'] = $filters['priceMin'];
        }

        // Lọc theo giá tối đa
        if (!empty($filters['priceMax'])) {
            $baseSql .= " AND GIANIEMYET <= :priceMax";
            $params[':priceMax'] = $filters['priceMax'];
        }

        // Tìm kiếm theo tên sản phẩm
        if (!empty($search)) {
            $baseSql .= " AND TENTS LIKE :search";
            $params[':search'] = "%$search%";
        }

        // Lấy tổng số sản phẩm
        $countSql = "SELECT COUNT(*) AS total " . $baseSql;
        $countStmt = $pdo->prepare($countSql);
        foreach ($params as $key => $value) {
            $countStmt->bindValue($key, $value);
        }
        $countStmt->execute();
        $total = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];

        // Lấy danh sách sản phẩm với phân trang và sắp xếp
        $productSql = "SELECT * " . $baseSql . " ORDER BY GIANIEMYET " . ($sort === 'desc' ? 'DESC' : 'ASC') . " LIMIT :offset, :limit";
        $params[':offset'] = $offset;
        $params[':limit'] = $limit;

        $productStmt = $pdo->prepare($productSql);
        foreach ($params as $key => $value) {
            $productStmt->bindValue($key, $value, is_int($value) ? PDO::PARAM_INT : PDO::PARAM_STR);
        }
        $productStmt->execute();
        $products = $productStmt->fetchAll(PDO::FETCH_ASSOC);

        return [
            'total' => $total,
            'products' => $products,
        ];
    }

    public static function applyBestDiscount($products)
    {
        $pdo = self::getPDOConnection();

        foreach ($products as &$product) {
            $productId = $product['ID'] ?? $product['ID_TRANGSUC'] ?? null;
            $categoryId = $product['MADM'];

            // Lấy phần trăm khuyến mãi từ KM_TRANGSUC
            $queryProductDiscount = "SELECT MAX(PHANTRAM) AS max_discount 
                                    FROM KHUYENMAI 
                                    JOIN KM_TRANGSUC ON KHUYENMAI.ID = KM_TRANGSUC.ID_KHUYENMAI 
                                    WHERE KM_TRANGSUC.ID_TRANGSUC = :productId 
                                    AND NOW() BETWEEN NGAYBD AND NGAYKT";
            $stmtProduct = $pdo->prepare($queryProductDiscount);
            $stmtProduct->bindValue(':productId', $productId, PDO::PARAM_INT);
            $stmtProduct->execute();
            $productDiscount = $stmtProduct->fetch(PDO::FETCH_ASSOC)['max_discount'];

            // Lấy phần trăm khuyến mãi từ KM_DANHMUC
            $queryCategoryDiscount = "SELECT MAX(PHANTRAM) AS max_discount 
                                    FROM KHUYENMAI 
                                    JOIN KM_DANHMUC ON KHUYENMAI.ID = KM_DANHMUC.ID_KHUYENMAI 
                                    WHERE KM_DANHMUC.MADM = :categoryId 
                                        AND NOW() BETWEEN NGAYBD AND NGAYKT";
            $stmtCategory = $pdo->prepare($queryCategoryDiscount);
            $stmtCategory->bindValue(':categoryId', $categoryId, PDO::PARAM_STR);
            $stmtCategory->execute();
            $categoryDiscount = $stmtCategory->fetch(PDO::FETCH_ASSOC)['max_discount'];

            // Lấy khuyến mãi cao nhất
            $bestDiscount = max($productDiscount, $categoryDiscount);
            $product['BEST_DISCOUNT'] = $bestDiscount ?: 0;
            $product['DISCOUNTED_PRICE'] = $product['GIANIEMYET'] * (1 - $product['BEST_DISCOUNT'] / 100);
        }

        return $products;
    }

    // Tìm và phân trang với khuyến mãi
    public static function filterProducts2($filters = [], $search = '', $offset = 0, $limit = 10, $sort = 'asc', $sortBy = 'price')
    {
        $pdo = self::getPDOConnection();
        $params = [];
        $baseSql = "FROM TRANGSUC 
                    LEFT JOIN (
                        SELECT KM_TRANGSUC.ID_TRANGSUC, MAX(PHANTRAM) AS BEST_DISCOUNT
                        FROM KHUYENMAI
                        JOIN KM_TRANGSUC ON KHUYENMAI.ID = KM_TRANGSUC.ID_KHUYENMAI
                        WHERE NOW() BETWEEN NGAYBD AND NGAYKT
                        GROUP BY KM_TRANGSUC.ID_TRANGSUC
                    ) AS KM1 ON TRANGSUC.ID = KM1.ID_TRANGSUC
                    LEFT JOIN (
                        SELECT MADM, MAX(PHANTRAM) AS CATEGORY_DISCOUNT
                        FROM KHUYENMAI
                        JOIN KM_DANHMUC ON KHUYENMAI.ID = KM_DANHMUC.ID_KHUYENMAI
                        WHERE NOW() BETWEEN NGAYBD AND NGAYKT
                        GROUP BY MADM
                    ) AS KM2 ON TRANGSUC.MADM = KM2.MADM";

        $baseSql .= " WHERE DELETED_AT IS NULL";

        // Lọc theo danh mục
        if (!empty($filters['category'])) {
            $baseSql .= " AND TRANGSUC.MADM = :category";
            $params[':category'] = $filters['category'];
        }

        // Lọc theo giá tối thiểu sau khi giảm
        if (!empty($filters['priceMin'])) {
            $baseSql .= " AND (GIANIEMYET * (1 - COALESCE(GREATEST(KM1.BEST_DISCOUNT, KM2.CATEGORY_DISCOUNT) / 100, 0))) >= :priceMin";
            $params[':priceMin'] = $filters['priceMin'];
        }

        // Lọc theo giá tối đa sau khi giảm
        if (!empty($filters['priceMax'])) {
            $baseSql .= " AND (GIANIEMYET * (1 - COALESCE(GREATEST(KM1.BEST_DISCOUNT, KM2.CATEGORY_DISCOUNT) / 100, 0))) <= :priceMax";
            $params[':priceMax'] = $filters['priceMax'];
        }

        // Tìm kiếm theo tên sản phẩm
        if (!empty($search)) {
            $baseSql .= " AND TENTS LIKE :search";
            $params[':search'] = "%$search%";
        }

        // Sắp xếp
        $sortColumn = match ($sortBy) {
            'discount' => "COALESCE(GREATEST(KM1.BEST_DISCOUNT, KM2.CATEGORY_DISCOUNT), 0)",
            'price' => "GIANIEMYET * (1 - COALESCE(GREATEST(KM1.BEST_DISCOUNT, KM2.CATEGORY_DISCOUNT) / 100, 0))",
            default => "GIANIEMYET",
        };

        // Tính tổng số sản phẩm
        $countSql = "SELECT COUNT(*) AS total " . $baseSql;
        $countStmt = $pdo->prepare($countSql);
        foreach ($params as $key => $value) {
            $countStmt->bindValue($key, $value);
        }
        $countStmt->execute();
        $total = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];

        // Lấy danh sách sản phẩm với phân trang và sắp xếp
        $productSql = "SELECT TRANGSUC.*, 
                            COALESCE(GREATEST(KM1.BEST_DISCOUNT, KM2.CATEGORY_DISCOUNT), 0) AS BEST_DISCOUNT,
                            (GIANIEMYET * (1 - COALESCE(GREATEST(KM1.BEST_DISCOUNT, KM2.CATEGORY_DISCOUNT) / 100, 0))) AS DISCOUNTED_PRICE 
                    " . $baseSql . " 
                    ORDER BY $sortColumn " . ($sort === 'desc' ? 'DESC' : 'ASC') . " 
                    LIMIT :offset, :limit";
        $params[':offset'] = $offset;
        $params[':limit'] = $limit;

        $productStmt = $pdo->prepare($productSql);
        foreach ($params as $key => $value) {
            $productStmt->bindValue($key, $value, is_int($value) ? PDO::PARAM_INT : PDO::PARAM_STR);
        }
        $productStmt->execute();
        $products = $productStmt->fetchAll(PDO::FETCH_ASSOC);

        return [
            'total' => $total,
            'products' => $products,
        ];
    }


    // Đếm tổng số sản phẩm
    public static function countAllProducts()
    {
        $pdo = self::getPDOConnection();
        $sql = "SELECT COUNT(*) AS total FROM TRANGSUC WHERE DELETED_AT IS NULL";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return (int)$result['total'];
    }

    // Tìm theo ID
    public static function findProductById($id)
    {
        $pdo = self::getPDOConnection();
        $sql = "SELECT * FROM TRANGSUC WHERE ID = :id AND DELETED_AT IS NULL";
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch();
    }

    public static function prepareImageUrl($imageName)
    {
        return '/storage/images/' . $imageName;
    }

    // Thêm sản phảm mới
    public static function createProduct($data)
    {
        $pdo = self::getPDOConnection(); // Lấy kết nối PDO
        $sql = "INSERT INTO TRANGSUC (MADM, TENTS, GIANIEMYET, SLTK, MOTA, IMAGEURL) 
            VALUES (:MADM, :TENTS, :GIANIEMYET, :SLTK, :MOTA, :IMAGEURL)";

        $stmt = $pdo->prepare($sql);

        $stmt->bindValue(':MADM', $data['MADM'], PDO::PARAM_STR);
        $stmt->bindValue(':TENTS', $data['TENTS'], PDO::PARAM_STR);
        $stmt->bindValue(':GIANIEMYET', $data['GIANIEMYET'], PDO::PARAM_INT);
        $stmt->bindValue(':SLTK', $data['SLTK'], PDO::PARAM_INT);
        $stmt->bindValue(':MOTA', $data['MOTA'], PDO::PARAM_STR);
        $stmt->bindValue(':IMAGEURL', $data['IMAGEURL'], PDO::PARAM_STR);

        if ($stmt->execute()) {
            return true;
        }

        throw new \Exception("Không thể thêm sản phẩm.");
    }

    // Cập nhật sản phẩm theo ID
    public static function updateProductById($id, $data)
    {
        $pdo = self::getPDOConnection();

        $sql = "UPDATE TRANGSUC SET 
                GIANIEMYET = :GIANIEMYET, 
                SLTK = :SLTK,
                DELETED_AT = :DELETED_AT
            WHERE ID = :id";

        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':GIANIEMYET', $data['GIANIEMYET'], PDO::PARAM_INT);
        $stmt->bindValue(':SLTK', $data['SLTK'], PDO::PARAM_INT);
        // Nếu DELETED_AT null thì bindParam là PDO::PARAM_NULL
        if ($data['DELETED_AT'] === null) {
            $stmt->bindValue(':DELETED_AT', null, PDO::PARAM_NULL);
        } else {
            $stmt->bindValue(':DELETED_AT', $data['DELETED_AT'], PDO::PARAM_STR);
        }
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);

        return $stmt->execute();
    }

    // --------------------------------------------------------------------------
    // Chưa đụng tới không xài
    // Cập nhật theo ID
    function updateProduct($id, $data)
    {
        $pdo = $this->getPDOConnection();
        $sql = "UPDATE TRANGSUC SET 
                    MADM = :MADM, 
                    TENTS = :TENTS, 
                    GIANIEMYET = :GIANIEMYET, 
                    SLTK = :SLTK, 
                    MOTA = :MOTA, 
                    IMAGEURL = :IMAGEURL 
                WHERE ID = :id AND DELETED_AT IS NULL";
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':MADM', $data['MADM'], PDO::PARAM_STR);
        $stmt->bindValue(':TENTS', $data['TENTS'], PDO::PARAM_STR);
        $stmt->bindValue(':GIANIEMYET', $data['GIANIEMYET'], PDO::PARAM_INT);
        $stmt->bindValue(':SLTK', $data['SLTK'], PDO::PARAM_INT);
        $stmt->bindValue(':MOTA', $data['MOTA'], PDO::PARAM_STR);
        $stmt->bindValue(':IMAGEURL', $data['IMAGEURL'], PDO::PARAM_STR);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }

    // Tạm ẩn sản phẩm
    function softDeleteProduct($id)
    {
        $pdo = $this->getPDOConnection();
        $sql = "UPDATE TRANGSUC SET DELETED_AT = NOW() WHERE ID = :id AND DELETED_AT IS NULL";

        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);

        return $stmt->execute();
    }

    // Lây các sản phẩm theo danh mục
    function getProductsByCategory($categoryId)
    {
        $pdo = $this->getPDOConnection();
        $sql = "SELECT * FROM TRANGSUC WHERE MADM = :MADM AND DELETED_AT IS NULL";

        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':MADM', $categoryId, PDO::PARAM_STR);
        $stmt->execute();

        return $stmt->fetchAll();
    }

    // Lấy sản phẩm ngẫu nhiên
    public static function findRandomProducts($excludeId, $limit = 20)
    {
        $pdo = self::getPDOConnection();
        $sql = "
            SELECT * 
            FROM TRANGSUC 
            WHERE ID != :excludeId AND DELETED_AT IS NULL 
            ORDER BY RAND() 
            LIMIT :limit
        ";
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':excludeId', $excludeId, PDO::PARAM_INT);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

}
