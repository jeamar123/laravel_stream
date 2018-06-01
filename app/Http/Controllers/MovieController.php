<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use DateTime;
use Excel;
use App\Movie;

class MovieController extends Controller
{
    /**
     * Show the profile for the given user.
     *
     * @param  int  $id
     * @return Response
     */

    public function __construct( ){
      \Cloudinary::config(array(
          "cloud_name" => "dwl3yrtx8",
          "api_key" => "922394114834959",
          "api_secret" => "86jWexq6wG12b1lxTo9E2pwuL6w"
      ));
    }

    public function getAllMovies(){
      return Movie::orderBy('created_at', 'asc')->get();
    }

    public function getMovieByID($id){
      $data = Movie::where('id', $id)->get();
      return $data[0];
    }

    public function addMovie( Request $request ){
      $data = array();

      $count = Movie::where('name', '=', $request->get('name'))->count();

      if($count > 0) {
          $data['status'] = false;
          $data['message'] = 'Movie name already exists.';

          return $data;
      }

      $create = Movie::create([
                  'name' => $request->get('name'),
                  'year' => $request->get('year'),
                  'categories' => $request->get('categories'),
                  'description' => $request->get('description'),
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

    public function updateMovie( Request $request ){
      $save_data = array(
        "name" => $request->get('name'),
        "year" => $request->get('year'),
        "link_1" => $request->get('link_1'),
        "link_2" => $request->get('link_2'),
        "link_3" => $request->get('link_3'),
        "categories" => $request->get('categories'),
      );

      $update_movie = Movie::where('id', '=', $request->get('id'))->update($save_data);
      $fetch_movie = Movie::where('id', '=', $request->get('id'))->get();

      if( $update_movie ){
          $data['status'] = true;
          $data['message'] = 'Success.';
          $data['movie'] = $fetch_movie[0];
      } else {
          $data['status'] = false;
          $data['message'] = 'Failed.';
      }

      return $data;
    }

    public function uploadMovieByExcel(){
      $input = Input::all();

      $rules = array(
        'file' => 'required|mimes:xlsx,xls,xlsm|max:200000'
      );

      if(Input::hasFile('file'))
      {
        $validator = \Validator::make( Input::all() , $rules);

        if($validator->passes()){
          $file = Input::file('file');
          $temp_file = time().$file->getClientOriginalName();
          $file->move('excel_upload', $temp_file);
          $data_array = Excel::load(public_path()."/excel_upload/".$temp_file)->ignoreEmpty(true)->get();
          $movie_arr = [];
          $headerRow = $data_array->first()->keys();

          $name = false;

          foreach ($headerRow as $key => $row) {
            if($row == "name") {
              $name = true;
            } 
          }

          if(!$name) {
            return array(
              'status'  => FALSE,
              'message' => 'Excel is invalid format. Please download the recommended file for uploading movies.'
            );
          }

          foreach ($data_array as $key => $value) {
            if( 
              ($value->name == null && $value->year == null && $value->category == null && $value->description != null) ||
              ($value->name == null && $value->year == null && $value->category != null && $value->description == null) ||
              ($value->name == null && $value->year != null && $value->category == null && $value->description == null) ||
              ($value->name != null && $value->year == null && $value->category == null && $value->description == null) 
            ){
              return array('status' => FALSE, 'message' => 'Some rows have empty data.');
            }
            if($value->name != null && $value->year != null && $value->category != null && $value->description != null) {
              $checkCount = Movie::where("name",$value->name)->count();
              if( $checkCount > 0 ) {
                return array(
                  'status'  => FALSE,
                  'message' => 'Movie with the name "' . $value->name . '" is already taken.'
                );
              }else{
                array_push($movie_arr, $value);
              }
            }
          }

          if(sizeof($movie_arr) == 0) {
            return array('status' => FALSE, 'message' => 'Excel File data is empty.');
          }

          foreach ($movie_arr as $key => $data) {
            $cat_list = array(
              0        => 'Action',
              1        => 'Comedy',
              2        => 'Romance',
              3        => 'Sci-Fi',
            );

            $cat_index = array_search($data->category, $cat_list); 
            $categories = "";

            for ($i=0; $i < count($cat_list); $i++) { 
              if( $i == $cat_index ){
                if($i==0){
                  $categories = $categories . "true";
                }else{
                  $categories = $categories . ",true";
                }
              }else{
                if($i==0){
                  $categories = $categories . "false";
                }else{
                  $categories = $categories . ",false";
                }
              }
              var_dump($categories);
            }


            $temp_data = array(
              'image'             => $data->image,
              'name'              => $data->name,
              'year'              => $data->year,
              'categories'        => "[" . $categories . "]",
              'description'       => $data->description,
            );

            $insert_movie = Movie::create($temp_data);
          }

          return array(
            'status'  => TRUE,
            'message' => 'Success.'
          );
        } else {
          return array(
            'status'  => FALSE,
            'message' => 'Invalid File.'
          );
        }
      }
    }

    public function uploadMovieImage( Request $request ){
      $data = array();
      // validate file
      if($request->hasFile('file')) {
        $rules = array(
          'file' => 'required | mimes:jpeg,jpg,png',
        );

        $validator = \Validator::make($request->all(), $rules);

        if($validator->fails()) {
          return array('status' => FALSE, 'message' => 'Invalid file.');
        }

        $file = $request->file('file');

        $image = \Cloudinary\Uploader::upload($file->getPathName());

        if( $request->get('current_img') != null ){

        }

        $result = Movie::where('id', '=', $request->get('movie_id'))->update(['image' => $image['secure_url']]);

        if($result) {
          $data['status'] = true;
          $data['message'] = "Success.";
          $data['img'] = $image['secure_url'];
        } else {
          $data['status'] = false;
          $data['message'] = "Failed updating image.";
        }
      } else {
        $data['status'] = false;
        $data['message'] = "No file selected.";
      }

      return $data;
    }

    public function deleteMovie( $id ){
      $data = array();

      if(Movie::where('id', '=', $id)->delete()) {
        $data['status'] = TRUE;
        $data['message'] = 'Success.';
      } else {
        $data['status'] = False;
        $data['message'] = 'Failed.';
      }

      return $data;
    }
}