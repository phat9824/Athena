<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TestAPIController;
use App\Http\Controllers\DanhMucController;
use App\Http\Controllers\TrangSucController;

Route::get('/api/images', [TestAPIController::class, 'getAllImages']);

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
});