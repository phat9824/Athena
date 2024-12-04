<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KhuyenMai extends Model
{
    protected $table = 'KHUYENMAI';
    protected $primaryKey = 'ID';
    public $incrementing = true;

    public $timestamps = false;

    protected $fillable = ['MAKM', 'TENKM', 'NGAYBD', 'NGAYKT', 'PHANTRAM'];
}
