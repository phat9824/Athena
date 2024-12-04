<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HoaDon extends Model
{
    protected $table = 'HOADON';
    protected $primaryKey = 'ID_HOADON';
    public $incrementing = true;
    public $timestamps = false;

    protected $fillable = ['ID_KHACHHANG', 'NGAYLAPHD', 'TRIGIAHD', 'TIENPHAITRA', 'TRANGTHAI', 'DELETED_AT'];
}
