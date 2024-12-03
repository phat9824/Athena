<?php

namespace App\Http\Controllers;

use App\Models\DanhMuc;
use Illuminate\Http\Request;

class DanhMucController extends Controller
{
    // Lấy danh sách danh mục
    public function getDanhMuc()
    {
        return response()->json(DanhMuc::all());
    }
}   
