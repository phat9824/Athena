<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TestAPIController;
use App\Http\Controllers\DanhMucController;
use App\Http\Controllers\TrangSucController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\OrderController;

// Test API
Route::get('/api/images', [TestAPIController::class, 'getAllImages']);
Route::post('/api/upload', [TestAPIController::class, 'upload']); 

// Các API không cần xác thực
Route::post('/api/register', [AuthController::class, 'register']);
Route::post('/api/login', [AuthController::class, 'login']);

// Các API cần xác thực người dùng trước khi truy cập
Route::middleware(['auth:api', 'check.role:1,2'])->group(function () {
    Route::get('/api/admin/dashboard', [TestAPIController::class, 'adminDashboard']);
    Route::get('/api/danhmucts', [DanhMucController::class, 'getDanhMuc']);
    Route::get('/api/trangsuc', [TrangSucController::class, 'getAllProducts']);
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
    Route::get('api/customer/history/', [OrderController::class, 'getOrderHistory']);
});