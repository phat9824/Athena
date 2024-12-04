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
    public function createDanhMuc(Request $request)
    {
        $request->validate([
            'TENDM' => 'required|string|max:255',
        ]);

        $danhMuc = new DanhMuc();
        $danhMuc->TENDM = $request->TENDM;
        $danhMuc->save();

        return response()->json(['message' => 'Danh mục được thêm thành công!'], 201);
    }


    public function updateDanhMuc(Request $request, $id)
    {
        // Tìm danh mục theo mã danh mục (MADM)
        $danhMuc = DanhMuc::findOrFail($id);

        // Cập nhật tên danh mục
        $danhMuc->update([
            'TENDM' => $request->TENDM, // Chỉ cập nhật tên danh mục
        ]);

        return response()->json(['message' => 'Danh mục được cập nhật thành công!', 'danhMuc' => $danhMuc]);
    }
}
