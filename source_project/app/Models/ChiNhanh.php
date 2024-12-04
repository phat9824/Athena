<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChiNhanh extends Model
{
    protected $table = 'CHINHANH';
    protected $primaryKey = 'ID';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = ['TENCN', 'DIACHI', 'DELETED_AT'];
}
