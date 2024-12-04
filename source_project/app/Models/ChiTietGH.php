<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChiTietGH extends Model
{
    protected $table = 'CHITIETGH';
    public $incrementing = false;
    public $timestamps = false;
    protected $fillable = ['ID_TRANGSUC', 'ID_GIOHANG', 'SOLUONG'];
}
