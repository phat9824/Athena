<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class TrangSuc extends Model
{
    protected $table = 'trangsuc';
    protected $primaryKey = 'ID';
    public $timestamps = false;

    protected $fillable = [
        'ID',
        'MADM',
        'TENTS',
        'GIANIEMYET',
        'SLTK',
        'MOTA',
        'IMAGEURL',
        'DELETED_AT',
    ];
}