<?php
namespace App\Http\Controllers;

use App\Models\KhachHang;
use Illuminate\Http\Request;
use App\Models\TaiKhoan;
use Illuminate\Support\Facades\DB;
use Exception;
use Illuminate\Support\Facades\Log;
use Tymon\JWTAuth\Facades\JWTAuth;

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
            $userId = $user = JWTAuth::parseToken()->authenticate();
            $data = $request->all();
            if ($request->hasFile('avatar')) {
                $file = $request->file('avatar');
                $path = $file->store('avatars', 'public');
                $data['avatar'] = $path;
            }

            TaiKhoan::updateProfileById($userId, $data);

            return response()->json(['message' => 'Profile updated successfully']);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
