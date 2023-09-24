<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group(['prefix' => 'users', 'middleware' => 'CORS'], function ($router) {
    // Pubbliche
    Route::post('/register', [UserController::class, 'register'])->name('register.user');
    Route::post('/login', [UserController::class, 'login'])->name('login.user');
    Route::get('/count', [UserController::class,'countUsers'])->name('count.user');

    // Protette
    Route::post('/logout', [UserController::class, 'logout'])->name('logout.user');
    Route::get('/view-profile', [UserController::class, 'viewProfile'])->name('profile.user');

    // Protette
    Route::post('/room', [RoomController::class, 'create']);
    Route::post('/room/close', [RoomController::class, 'close']);
    Route::post('/room/join', [RoomController::class,'join']);
    Route::get('/room/streamer/{room}', [RoomController::class,'streamerInfo']);

    // Pubbliche
    Route::get('/room/roomsActive', [RoomController::class,'roomsActive']);  
    Route::get('/room/roomsByGame', [RoomController::class,'roomsByGame']);     
    
});























