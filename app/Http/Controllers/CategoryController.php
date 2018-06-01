<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use DateTime;
use Excel;
use App\Categories;

class CategoryController extends Controller
{
    /**
     * Show the profile for the given user.
     *
     * @param  int  $id
     * @return Response
     */

    public function __construct( ){
      
    }

    public function getAllCategories(){
      return Categories::orderBy('category_name', 'asc')->get();
    }

    public function getCategoryByID($id){
      $data = Categories::where('id', $id)->get();
      return $data[0];
    }

    public function addCategory( Request $request ){
      $data = array();

      $count = Categories::where('category_name', '=', $request->get('category_name'))->count();

      if($count > 0) {
          $data['status'] = false;
          $data['message'] = 'Category already exists.';

          return $data;
      }

      $create = Categories::create([
                  'category_name' => $request->get('category_name'),
              ]);

      if( $create ){
          $data['status'] = true;
          $data['message'] = 'Success.';
      } else {
          $data['status'] = false;
          $data['message'] = 'Failed.';
      }
      return $data;
    }

    public function updateCategory( Request $request ){
      $save_data = array(
        "category_name" => $request->get('category_name'),
      );

      $update_cat = Categories::where('id', '=', $request->get('id'))->update($save_data);
      $fetch_cat = Categories::where('id', '=', $request->get('id'))->get();

      if( $update_cat ){
          $data['status'] = true;
          $data['message'] = 'Success.';
          $data['movie'] = $fetch_movie[0];
      } else {
          $data['status'] = false;
          $data['message'] = 'Failed.';
      }

      return $data;
    }

    public function deleteCategory( $id ){
      $data = array();

      if(Categories::where('id', '=', $id)->delete()) {
        $data['status'] = TRUE;
        $data['message'] = 'Success.';
      } else {
        $data['status'] = False;
        $data['message'] = 'Failed.';
      }

      return $data;
    }
}