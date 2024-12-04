<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChiTietHD extends Model
{
    protected $table = 'CHITIETHD';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = ['ID_TRANGSUC', 'ID_HOADON', 'SOLUONG', 'GIASP'];
}
