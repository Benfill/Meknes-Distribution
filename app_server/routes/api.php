<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ClientFileController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use App\Models\Client;
use App\Models\ClientFile;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
Route::middleware('auth:api')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // Admin Routes
    Route::group(['middleware' => ['role:admin']], function () {
        Route::prefix('users')->group(function () {
            Route::post('assignRole', [UserController::class, 'assignRoleToUser']);
        });
    });
    Route::prefix('products')->group(function () {
        Route::get('', [ProductController::class, 'index']);
        Route::post('', [ProductController::class, 'store']);
        Route::put('/{id}', [ProductController::class, 'update']);
        Route::delete('/{id}', [ProductController::class, 'destroy']);
    });

    Route::prefix('clients')->group(function () {
        Route::get('', [ClientController::class, 'index']);
        Route::post('', [ClientController::class, 'store']);
        Route::put('/{id}', [ClientController::class, 'update']);
        Route::delete('/{id}', [ClientController::class, 'destroy']);
    });

    Route::prefix('clientFiles')->group(function () {
        Route::get('', [ClientFileController::class, 'index']);
        Route::post('', [ClientFileController::class, 'store']);
        Route::put('/{id}', [ClientFileController::class, 'update']);
        Route::delete('/{id}', [ClientFileController::class, 'destroy']);
    });

});


// Auth
Route::post('login', [AuthController::class, 'login'])->name('login');
Route::post('register', [AuthController::class, 'register']);

