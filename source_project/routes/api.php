<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TestAPIController;
use App\Http\Controllers\DanhMucController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductManagementController;
use App\Http\Controllers\PromotionManagementController;
use App\Http\Controllers\ThongKeController;

// Test API
Route::get('/api/images', [TestAPIController::class, 'getAllImages']);
Route::post('/api/upload', [TestAPIController::class, 'upload']); 

// Các API không cần xác thực
Route::post('/api/register', [AuthController::class, 'register']);
Route::post('/api/login', [AuthController::class, 'login']);
Route::get('/api/trangsuc', [ProductManagementController::class, 'getPaginatedProducts']);
Route::get('/api/danhmucts', [DanhMucController::class, 'getDanhMuc']);
Route::get('/api/thongke', [ThongKeController::class, 'getStatistics']);

// Các API cần xác thực người dùng trước khi truy cập
Route::middleware(['auth:api', 'check.role:1,2'])->group(function () {
    Route::get('/api/admin/dashboard', [TestAPIController::class, 'adminDashboard']);
    Route::get('/api/admin/danhmucts', [DanhMucController::class, 'getDanhMuc']);
    Route::get('/api/admin/trangsuc', [ProductManagementController::class, 'getPaginatedProducts']);
    Route::post('/api/admin/trangsuc/create', [ProductManagementController::class, 'createProduct']);

    // Route để lấy tất cả khuyến mãi
    //Route::get('/api/admin/khuyenmai', [PromotionManagementController::class, 'getAllKhuyenMai']);
    Route::get('/api/admin/khuyenmai', [PromotionManagementController::class, 'getPaginatedKhuyenMai']);
    Route::post('/api/admin/khuyenmai/create', [PromotionManagementController::class, 'createKhuyenMai']);

    // Route để cập nhập sản phẩm
    Route::post('/api/admin/trangsuc/update/{id}', [ProductManagementController::class, 'updateProduct']);
    Route::post('/api/admin/khuyenmai/update/{id}', [PromotionManagementController::class, 'updateKhuyenMai']);
});

Route::middleware(['auth:api', 'check.role:1'])->group(function () {
    Route::post('/api/danhmucts/create', [DanhMucController::class, 'createDanhMuc']);
    Route::put('/api/danhmucts/update/{id}', [DanhMucController::class, 'updateDanhMuc']);
});

Route::middleware(['auth:api', 'check.role:0'])->group(function () {
    Route::get('api/customer/profile', [ProfileController::class, 'getProfile']);
    Route::post('api/customer/profile/update', [ProfileController::class, 'updateProfile']);
    Route::get('api/customer/cart', [OrderController::class, 'getCart']);
    Route::post('api/customer/cart/update', [OrderController::class, 'updateCart']);
    Route::post('/api/customer/cart/checkout', [OrderController::class, 'checkout']);
    Route::get('api/customer/history/', [OrderController::class, 'getOrderHistory']);
});