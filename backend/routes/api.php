<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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

Route::group([

    'middleware' => 'api',
    'prefix' => 'auth',
    'namespace' => 'App\Http\Controllers'

], function ($router) {

    // Messages

    Route::get('chats', 'MessagesController@getUnreadedShow');
    Route::get('users', 'MessagesController@getUsersToChat');
    Route::get('name', 'MessagesController@getAuthUserName');

    Route::post('messages', 'MessagesController@getMessages');
    Route::post('send', 'MessagesController@sendMessage');
    Route::post('delete', 'MessagesController@deleteMessage');

    Route::put('edit', 'MessagesController@editMessage');

    //Authentication

    Route::post('register', 'AuthController@register');
    Route::post('login', 'AuthController@login');
    Route::post('logout', 'AuthController@logout');
    Route::post('refresh', 'AuthController@refresh');
    Route::post('me', 'AuthController@me');

});
