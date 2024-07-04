<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ClientFileController;
use App\Http\Controllers\EmailController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\StatsController;
use App\Http\Controllers\SubCategoryController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\UserController;
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


    Route::group(['middleware' => ['role:admin']], function () {
        Route::prefix('users')->group(function () {
            Route::post('assignRole', [UserController::class, 'assignRoleToUser']);
        });
    });

    Route::prefix('suppliers')->group(function () {
        Route::get('', [SupplierController::class, 'index']);
        Route::post('', [SupplierController::class, 'store']);
        Route::put('/{id}', [SupplierController::class, 'update']);
        Route::put('/softDelete/{id}', [SupplierController::class, 'softDelete']);
        Route::delete('/{id}', [SupplierController::class, 'destroy']);
    });

    Route::prefix('products')->group(function () {
        Route::get('', [ProductController::class, 'index']);
        Route::post('', [ProductController::class, 'store']);
        Route::put('/{id}', [ProductController::class, 'update']);
        Route::put('/softDelete/{id}', [ProductController::class, 'softDelete']);
        Route::delete('/{id}', [ProductController::class, 'destroy']);
    });

    Route::prefix('clients')->group(function () {
        Route::get('', [ClientController::class, 'index']);
        Route::post('', [ClientController::class, 'store']);
        Route::put('/{id}', [ClientController::class, 'update']);
        Route::put('/softDelete/{id}', [ClientController::class, 'softDelete']);
        Route::delete('/{id}', [ClientController::class, 'destroy']);
    });

    Route::prefix('clientFiles')->group(function () {
        Route::get('', [ClientFileController::class, 'index']);
        Route::post('', [ClientFileController::class, 'store']);
        Route::put('/{id}', [ClientFileController::class, 'update']);
        Route::put('/softDelete/{id}', [ClientFileController::class, 'softDelete']);
        Route::delete('/{id}', [ClientFileController::class, 'delete']);
        Route::get('/download/files', [ClientFileController::class, 'filesDownload']);
        Route::get('/download/file/{ClientFileId}/{fileId}', [ClientFileController::class, 'fileDownload']);
        Route::get('/download/{id}', [ClientFileController::class, 'download']);
        Route::post('/upload', [ClientFileController::class, 'upload']);
        Route::post('/file/rename', [ClientFileController::class, 'rename']);
        Route::delete('/file/delete', [ClientFileController::class, 'deleteFile']);
    });


    Route::prefix('users')->group(function () {
        Route::get('', [UserController::class, 'index']);
        Route::post('', [UserController::class, 'store']);
        Route::put('/{id}', [UserController::class, 'update']);
        Route::put('/softDelete/{id}', [UserController::class, 'softDelete']);
        Route::delete('/{id}', [UserController::class, 'destroy']);
        Route::post('/picture', [UserController::class, 'createUserPicture']);
    });

    Route::prefix('categories')->group(function () {
        Route::get('', [CategoryController::class, 'index']);
        Route::post('', [CategoryController::class, 'store']);
        Route::put('/{id}', [CategoryController::class, 'update']);
        Route::delete('/{id}', [CategoryController::class, 'destroy']);
    });

    Route::prefix('subCategories')->group(function () {
        Route::get('', [SubCategoryController::class, 'index']);
        Route::post('', [SubCategoryController::class, 'store']);
        Route::put('/{id}', [SubCategoryController::class, 'update']);
        Route::delete('/{id}', [SubCategoryController::class, 'destroy']);
    });

    Route::prefix('stats')->group(function () {
        Route::get('', [StatsController::class, 'index']);
        Route::get('/search/{id}', [StatsController::class, 'searchStats']);
        Route::get('/communes', [StatsController::class, 'getCommunes']);
        Route::get('/groups', [StatsController::class, 'trendingGroup']);
        Route::get('/trending', [StatsController::class, 'getTrendingCommune']);
        Route::get('/productsStats', [StatsController::class, 'getProductsStats']);
    });

    Route::prefix('mails')->group(function () {
        Route::get('/', [EmailController::class, 'index']);
        Route::post('/', [EmailController::class, 'sendMail']);
        Route::post('/delete', [EmailController::class, 'destroy']);
    });

});


// Auth
Route::post('login', [AuthController::class, 'login'])->name('login');
Route::post('isConnected', [AuthController::class, 'isConnected']);
