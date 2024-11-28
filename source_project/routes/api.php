<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ApiController;

Route::post('/api/register', [AuthController::class, 'register']);
Route::get('/api/test', [ApiController::class, 'test']);