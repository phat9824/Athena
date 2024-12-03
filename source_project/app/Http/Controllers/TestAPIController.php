<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TrangSuc;

// Chỉ để test xem API có hoạt động không

class TestAPIController extends Controller
{
    public function test()
    {
        return response()->json([
            'message' => 'API hoạt động bình thường!',
        ]);
    }

    public function getAllImages()
    {
        $images = TrangSuc::select('ID', 'TENTS', 'IMAGEURL')->get();
        return response()->json($images);
    }
}
