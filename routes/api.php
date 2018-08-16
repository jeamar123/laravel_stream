<?php


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

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});


Route::post('/login', 'AuthController@login');
Route::post('/signup', 'AuthController@register');
Route::get('/check_session', 'AuthController@checkSessionStatus');
Route::get('/get_session', 'AuthController@get_session');
Route::get('/logout', 'AuthController@logout');

Route::get('/', 'HomeController@getHomeView');

Route::get('/admin', 'AdminController@getAdminView');
Route::get('/get_movies', 'MovieController@getAllMovies');
Route::get('/get_movies/{id}', 'MovieController@getMovieByID');
Route::post('/add_movie', 'MovieController@addMovie');
Route::post('/upload_movie', 'MovieController@uploadMovieByExcel');
Route::post('/replace_movie_image', 'MovieController@uploadMovieImage');
Route::post('/update_movie', 'MovieController@updateMovie');
Route::get('/delete_movie/{id}', 'MovieController@deleteMovie');


Route::get('/get_categories', 'CategoryController@getAllCategories');
Route::get('/get_categories/{id}', 'CategoryController@getCategoryByID');
Route::post('/add_category', 'CategoryController@addCategory');
Route::post('/update_category', 'CategoryController@updateCategory');
Route::get('/delete_category/{id}', 'CategoryController@deleteCategory');


