<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;


// Chỉ để test xem API có hoạt động không

class TestAPIController extends Controller
{
    public function test()
    {
        return response()->json([
            'message' => 'API hoạt động bình thường!',
        ]);
    }
}
