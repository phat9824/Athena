<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class KhachHang extends Model
{
    protected $table = 'KHACHHANG';
    protected $primaryKey = 'ID';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = ['TENKH', 'SDT', 'DIACHI', 'LOAI', 'GIOITINH'];

}
