<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChiTietKM extends Model
{
    protected $table = 'CHITIETKM';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = ['ID_KHUYENMAI', 'ID_TRANGSUC'];
}
