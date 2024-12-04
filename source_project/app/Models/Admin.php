<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class Admin extends Model
{
    protected $table = 'ADMIN';
    protected $primaryKey = 'ID';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = ['ID_CHINHANH', 'TENADMIN', 'SDT', 'DIACHI'];



}
