<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TSChiNhanh extends Model
{
    protected $table = 'TS_CHINHANH';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = ['ID_TRANGSUC', 'ID_CHINHANH', 'SLTONKHO'];
}
