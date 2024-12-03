<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TestAPIController;


Route::get('/api/images', [TestAPIController::class, 'getAllImages']);

// Các API không cần xác thực
Route::post('/api/register', [AuthController::class, 'register']);
Route::post('/api/login', [AuthController::class, 'login']);

// Các API cần xác thực người dùng trước khi truy cập
Route::middleware('auth:api')->group(function () {
    Route::middleware('check.role:1,2')->group(function () {
        Route::get('/api/admin/dashboard', [TestAPIController::class, 'adminDashboard']);
    });

    Route::middleware('check.role:1')->group(function () {
        
    });

    Route::middleware('check.role:0')->group(function () {
        
    });
});



use App\Http\Controllers\DanhMucController;

// API lấy danh mục
Route::get('/api/danhmucts', [DanhMucController::class, 'getDanhMuc']);
Route::post('/api/danhmucts/create', [DanhMucController::class, 'createDanhMuc']); // API tạo danh mục mới
Route::put('/api/danhmucts/update/{id}', [DanhMucController::class, 'updateDanhMuc']); // API sửa danh mục








