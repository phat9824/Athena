<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GioHang extends Model
{
    protected $table = 'GIOHANG';
    protected $primaryKey = 'ID_GIOHANG';
    public $incrementing = true;
    public $timestamps = false;

    protected $fillable = ['ID_KHACHHANG'];
}
