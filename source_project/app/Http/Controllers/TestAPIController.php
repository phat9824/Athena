<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TrangSuc;
use Illuminate\Support\Facades\Storage;


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

    public function upload(Request $request)
    {
        try {
            if (!$request->hasFile('image')) {
                return response()->json(['error' => 'No file uploaded'], 400);
            }

            $file = $request->file('image');

            // Kiểm tra file hợp lệ
            if (!$file->isValid()) {
                return response()->json(['error' => 'Invalid file upload'], 400);
            }

            // Lưu file vào thư mục "public/images"
            $path = $file->store('images', 'public');
            return response()->json([
                'message' => 'Image uploaded successfully',
                'path' => '/storage/' . $path,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'File upload failed: ' . $e->getMessage()], 500);
        }
    }
}
