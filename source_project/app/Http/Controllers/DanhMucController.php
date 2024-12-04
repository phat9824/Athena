<?php

namespace App\Http\Controllers;

use App\Models\DanhMuc;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class DanhMucController extends Controller
{
    // Lấy danh sách danh mục
    public function getDanhMuc()
    {
        try {
            $danhMucs = DanhMuc::getAllDanhMuc();
            return response()->json($danhMucs);
        } catch (\Exception $e) {
            Log::error('Get categories error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // Tạo mới danh mục
    public function createDanhMuc(Request $request)
    {
        $request->validate([
            'TENDM' => 'required|string|max:255',
        ]);

        try {
            DanhMuc::createDanhMuc($request->TENDM);
            return response()->json(['message' => 'Danh mục được thêm thành công!'], 201);
        } catch (\Exception $e) {
            Log::error('Create categories error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // Cập nhật danh mục
    public function updateDanhMuc(Request $request, $id)
    {
        $request->validate([
            'TENDM' => 'required|string|max:255',
        ]);

        try {
            DanhMuc::updateDanhMuc($id, $request->TENDM);
            return response()->json(['message' => 'Danh mục được cập nhật thành công!']);
        } catch (\Exception $e) {
            Log::error('Update categories error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
