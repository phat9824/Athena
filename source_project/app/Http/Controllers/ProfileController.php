<?php
namespace App\Http\Controllers;

use App\Models\KhachHang;
use App\Models\Admin;
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

    public function getCustomerandAccount()
    {
        try {
            $pdo = DB::connection()->getPdo();

            $sql = "SELECT 
                        TAIKHOAN.ID,
                        TAIKHOAN.EMAIL,
                        TAIKHOAN.ROLE,
                        TAIKHOAN.TINHTRANG,
                        KHACHHANG.TENKH,
                        KHACHHANG.SDT,
                        KHACHHANG.DIACHI,
                        KHACHHANG.LOAI,
                        KHACHHANG.GIOITINH,
                        KHACHHANG.IMAGEURL
                    FROM TAIKHOAN
                    JOIN KHACHHANG ON TAIKHOAN.ID = KHACHHANG.ID
                    WHERE TAIKHOAN.ROLE = 0
                      AND TAIKHOAN.DELETED_AT IS NULL";

            $stmt = $pdo->prepare($sql);
            $stmt->execute();
            $customers = $stmt->fetchAll(\PDO::FETCH_ASSOC);

            return response()->json($customers);
        } catch (Exception $e) {
            Log::error('Lỗi khi lấy dữ liệu khách hàng và tài khoản: ' . $e->getMessage());
            return response()->json(['error' => 'Có lỗi xảy ra: ' . $e->getMessage()], 500);
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
                KhachHang::updateAttributeById($user->ID, 'IMAGEURL', $updateData['IMAGEURL']);
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

    public function getAdminProfile(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            $profile = Admin::find($user->ID);
            $email = TaiKhoan::getEmailById($user->ID);

            if (!$profile || !$email) {
                return response()->json(['message' => 'Admin not found'], 404);
            }

            return response()->json([
                "TENADMIN" => $profile->TENADMIN,
                "SDT" => $profile->SDT,
                "DIACHI" => $profile->DIACHI,
                "EMAIL" => $email['EMAIL'],
                "IMAGEURL" => $profile->IMAGEURL,
            ]);
        } catch (Exception $e) {
            Log::error('Get Admin Profile Error: ' . $e->getMessage());
            return response()->json(['error' => 'Unable to fetch admin profile'], 500);
        }
    }

    public function updateAdminProfile(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            $admin = Admin::find($user->ID);
            if (!$admin) {
                return response()->json(['message' => 'Admin not found'], 404);
            }

            if ($request->has('TENADMIN')) {
                $admin->TENADMIN = $request->input('TENADMIN');
            }

            if ($request->has('SDT')) {
                $admin->SDT = $request->input('SDT');
            }

            if ($request->has('DIACHI')) {
                $admin->DIACHI = $request->input('DIACHI');
            }

            if ($request->hasFile('avatar')) {
                $file = $request->file('avatar');
                $filename = 'Admin_Avatar_' . $user->ID . '.png';
                $path = $file->storeAs('images/admin', $filename, 'public');
                $admin->IMAGEURL = '/storage/' . $path;
            }

            $admin->save();

            $email = TaiKhoan::getEmailById($user->ID);

            return response()->json([
                "TENADMIN" => $admin->TENADMIN,
                "SDT" => $admin->SDT,
                "DIACHI" => $admin->DIACHI,
                "EMAIL" => $email['EMAIL'],
                "IMAGEURL" => $admin->IMAGEURL,
            ]);
        } catch (Exception $e) {
            Log::error('Update Admin Profile Error: ' . $e->getMessage());
            return response()->json(['error' => 'Unable to update admin profile'], 500);
        }
    }
}
