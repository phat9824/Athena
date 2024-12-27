<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TestAPIController;
use App\Http\Controllers\DanhMucController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductManagementController;
use App\Http\Controllers\PromotionManagementController;
use App\Http\Controllers\EmployeeManagerController;
use App\Http\Controllers\ThongKeController;
use App\Http\Controllers\InvoiceManagerController;
use App\Http\Controllers\SanPhamBanChayController;

// Test API
Route::get('/api/images', [TestAPIController::class, 'getAllImages']);
Route::post('/api/upload', [TestAPIController::class, 'upload']);

// Các API không cần xác thực
Route::post('/api/register', [AuthController::class, 'register']);
Route::post('/api/login', [AuthController::class, 'login']);
Route::get('/api/trangsuc', [ProductManagementController::class, 'getPaginatedProducts']);
Route::get('/api/trangsuc/{id}', [ProductManagementController::class, 'getProductDetails']);
Route::get('/api/trangsuc/random/{excludeId}', [ProductManagementController::class, 'getRandomProducts']);
Route::get('/api/danhmucts', [DanhMucController::class, 'getDanhMuc']);
Route::get('/api/thongke', [ThongKeController::class, 'getStatistics']);
Route::get('/api/top-products', [SanPhamBanChayController::class, 'getTopProduct']);

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

    Route::get('/api/admin/view-customer', [ProfileController::class, 'getCustomerandAccount']);

    Route::get('/api/admin/orders', [OrderController::class, 'getOrders']);
    Route::get('/api/admin/orders/{orderId}', [OrderController::class, 'getOrderDetails']);
    Route::put('/api/admin/orders/{orderId}/status', [OrderController::class, 'updateOrderStatus']);
});

Route::middleware(['auth:api', 'check.role:1'])->group(function () {
    Route::post('/api/danhmucts/create', [DanhMucController::class, 'createDanhMuc']);
    Route::put('/api/danhmucts/update/{id}', [DanhMucController::class, 'updateDanhMuc']);

    // quản lý nhân viên
    Route::get('/api/admin/employees', [EmployeeManagerController::class, 'getEmployees']);
    Route::post('/api/admin/employees/create', [EmployeeManagerController::class, 'createEmployee']);

    Route::post('/api/admin/employees/update-info', [EmployeeManagerController::class, 'updateEmployeeInfo']);
    Route::post('/api/admin/employees/update-password', [EmployeeManagerController::class, 'updateEmployeePassword']);
});

Route::middleware(['auth:api', 'check.role:0'])->group(function () {
    Route::post('api/customer/orders/{orderId}/mark-received', [OrderController::class, 'markOrderAsReceived']);
    Route::get('api/customer/profile', [ProfileController::class, 'getProfile']);
    Route::post('api/customer/profile/update', [ProfileController::class, 'updateProfile']);
    Route::get('api/customer/cart', [OrderController::class, 'getCart']);
    Route::post('api/customer/cart/update', [OrderController::class, 'updateCart']);
    Route::post('/api/customer/cart/checkout', [OrderController::class, 'checkout']);
    Route::post('/api/customer/cart/add', [OrderController::class, 'addToCart']);
    Route::get('api/customer/history/', [OrderController::class, 'getOrderHistory']);
});
