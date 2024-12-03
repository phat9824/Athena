<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DanhMuc extends Model
{
    protected $table = 'DANHMUCTS'; // Tên bảng trong cơ sở dữ liệu
    protected $primaryKey = 'MADM'; // Khóa chính là MADM
    public $incrementing = false;  // Khóa chính không tự tăng
    protected $keyType = 'string'; // Kiểu dữ liệu của khóa chính là chuỗi
    public $timestamps = false;   // Không sử dụng cột timestamps (created_at, updated_at)

    protected $fillable = ['MADM', 'TENDM']; // Các cột được phép thêm/sửa
}
