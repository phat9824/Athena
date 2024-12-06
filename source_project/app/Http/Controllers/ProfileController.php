<?php
namespace App\Http\Controllers;

use App\Models\KhachHang;
use Illuminate\Http\Request;
use App\Models\TaiKhoan;
use Illuminate\Support\Facades\DB;
use Exception;
use Illuminate\Support\Facades\Log;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function getProfile(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            //Log::error('Error: ' . $user);
            $profile = KhachHang::getProfileById($user->ID);
            //Log::error('Error: ' . json_encode($profile));
            $email = TaiKhoan::getEmailById($user->ID);
            //Log::error('Error: ' . json_encode($email));
            if (!$profile || !$email) {
                return response()->json(['message' => 'User not found'], 404);
            }

            return response()->json([
                "TENKH" => $profile["TENKH"],
                "SDT"=> $profile["SDT"],
                "DIACHI" => $profile["DIACHI"],
                "LOAI" => $profile["LOAI"],
                "GIOITINH" => $profile["GIOITINH"],
                "IMAGEURL"=> $profile["IMAGEURL"],
                "EMAIL" => $email["EMAIL"],
            ]);
        } catch (Exception $e) {
            Log::error('Get Profile Error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function updateProfile(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            if ($request->has('name')) {
                KhachHang::updateAttributeById($user->ID, 'TENKH', $request->input('name'));
            }
    
            if ($request->has('phone')) {
                KhachHang::updateAttributeById($user->ID, 'SDT', $request->input('phone'));
            }
    
            if ($request->has('address')) {
                KhachHang::updateAttributeById($user->ID, 'DIACHI', $request->input('address'));
            }

            if ($request->hasFile('avatar')) {
                $file = $request->file('avatar');
                $filename = 'Avatar_'. $user->ID .'.png';
                // Lưu vào storage/app/public/images
                $file->storeAs('images', $filename, 'public');
                $updateData['IMAGEURL'] = '/storage/images/' . $filename; 
            }

            // Lấy lại thông tin mới
            $newProfile = KhachHang::getProfileById($user->ID);
            $email = TaiKhoan::getEmailById($user->ID);

            return response()->json([
                "TENKH" => $newProfile["TENKH"],
                "SDT"=> $newProfile["SDT"],
                "DIACHI" => $newProfile["DIACHI"],
                "LOAI" => $newProfile["LOAI"],
                "GIOITINH" => $newProfile["GIOITINH"],
                "IMAGEURL"=> $newProfile["IMAGEURL"],
                "EMAIL" => $email["EMAIL"],
            ]);
        } catch (\Exception $e) {
            Log::error('Update Profile Error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
