<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DanhMuc extends Model
{
    protected $table = 'DANHMUCTS'; // Tên bảng trong cơ sở dữ liệu
    protected $primaryKey = 'MADM'; // Khóa chính là MADM
    public $incrementing = false;  // Không sử dụng auto-increment cho khóa chính
    protected $keyType = 'string'; // Kiểu dữ liệu khóa chính là chuỗi
    public $timestamps = false;   // Không sử dụng timestamps (created_at, updated_at)

    // Chỉ cho phép thêm/sửa tên danh mục
    protected $fillable = ['TENDM'];

    // Sự kiện để tạo mã danh mục tự động
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            // Lấy mã cuối cùng trong bảng
            $lastDanhMuc = self::latest('MADM')->first();

            // Sinh mã mới
            $lastMADM = $lastDanhMuc ? $lastDanhMuc->MADM : 'DM00';
            $newMADM = 'DM' . str_pad((int)substr($lastMADM, 2) + 1, 2, '0', STR_PAD_LEFT);

            // Gán giá trị cho MADM
            $model->MADM = $newMADM;
        });
    }
    
}
