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
    public function getAllTrangSuc($includeDeleted = false)
    {
        if ($includeDeleted) {
            return self::all();
        }
        return self::whereNull('DELETED_AT')->get();
    }

    // PDO --------------------------------------------------------------------------
    private function getPDOConnection()
    {
        $connection = DB::connection()->getPdo();
        return $connection;
    }

    // Lấy tất cả sản phẩm
    function getAllProducts()
    {
        $pdo = $this->getPDOConnection();
        $sql = "SELECT * FROM TRANGSUC WHERE DELETED_AT IS NULL";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    // Tìm theo ID
    function findProductById($id)
    {
        $pdo = $this->getPDOConnection();
        $sql = "SELECT * FROM TRANGSUC WHERE ID = :id AND DELETED_AT IS NULL";
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch();
    }

    // Thêm sản phảm mới
    function createProduct($data)
    {
        $pdo = $this->getPDOConnection();
        $sql = "INSERT INTO TRANGSUC (MADM, TENTS, GIANIEMYET, SLTK, MOTA, IMAGEURL) 
                VALUES (:MADM, :TENTS, :GIANIEMYET, :SLTK, :MOTA, :IMAGEURL)";
        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':MADM', $data['MADM'], PDO::PARAM_STR);
        $stmt->bindValue(':TENTS', $data['TENTS'], PDO::PARAM_STR);
        $stmt->bindValue(':GIANIEMYET', $data['GIANIEMYET'], PDO::PARAM_INT);
        $stmt->bindValue(':SLTK', $data['SLTK'], PDO::PARAM_INT);
        $stmt->bindValue(':MOTA', $data['MOTA'], PDO::PARAM_STR);
        $stmt->bindValue(':IMAGEURL', $data['IMAGEURL'], PDO::PARAM_STR);
        return $stmt->execute();
    }

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
}
