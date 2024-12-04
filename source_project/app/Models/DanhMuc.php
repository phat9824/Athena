<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class DanhMuc extends Model
{
    protected $table = 'DANHMUCTS'; // Tên bảng trong cơ sở dữ liệu
    protected $primaryKey = 'MADM'; // Khóa chính là MADM
    public $incrementing = false;  // Không sử dụng auto-increment cho khóa chính
    protected $keyType = 'string'; // Kiểu dữ liệu khóa chính là chuỗi
    public $timestamps = false;   // Không sử dụng timestamps (created_at, updated_at)

    // Chỉ cho phép thêm/sửa tên danh mục
    protected $fillable = ['TENDM'];

    // Eloquent ORM --------------------------------------------------------------------------------------------------------------

    public static function getAllDanhMuc()
    {
        return self::all();
    }

    public static function createDanhMuc($tenDM)
    {
        $danhMuc = new self();
        $danhMuc->TENDM = $tenDM;
        $danhMuc->save();
    }

    public static function updateDanhMuc($id, $tenDM)
    {
        $danhMuc = self::findOrFail($id);
        $danhMuc->update(['TENDM' => $tenDM]);
    }

    // PDO --------------------------------------------------------------------------------------------------------------
    
    public static function getAllDanhMucPDO()
    {
        $sql = "SELECT * FROM DANHMUCTS";
        return DB::select($sql);
    }

    public static function createDanhMucPDO($tenDM)
    {
        $lastDanhMuc = DB::table('DANHMUCTS')->orderBy('MADM', 'desc')->first();
        $lastMADM = $lastDanhMuc ? $lastDanhMuc->MADM : 'DM00';
        $newMADM = 'DM' . str_pad((int)substr($lastMADM, 2) + 1, 2, '0', STR_PAD_LEFT);
        $sql = "INSERT INTO DANHMUCTS (MADM, TENDM) VALUES (:MADM, :TENDM)";
        DB::insert($sql, ['MADM' => $newMADM, 'TENDM' => $tenDM]);
    }

    public static function updateDanhMucPDO($id, $tenDM)
    {
        $sql = "UPDATE DANHMUCTS SET TENDM = :TENDM WHERE MADM = :MADM";
        DB::update($sql, ['TENDM' => $tenDM, 'MADM' => $id]);
    }

    // Sự kiện để tạo mã danh mục tự động
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            // Lấy mã cuối cùng trong bảng
            $lastDanhMuc = self::orderByRaw("CAST(SUBSTRING(MADM, 3) AS UNSIGNED) DESC")->first();

            // Sinh mã mới
            $lastMADM = $lastDanhMuc ? $lastDanhMuc->MADM : 'DM00';
            $newMADM = 'DM' . str_pad((int)substr($lastMADM, 2) + 1, 2, '0', STR_PAD_LEFT);

            // Gán giá trị cho MADM
            $model->MADM = $newMADM;
        });
    }
    
}
