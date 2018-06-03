<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use DateTime;

use App\User;

class AuthController extends Controller
{
  /**
   * Show the profile for the given user.
   *
   * @param  int  $id
   * @return Response
   */
  public function login( Request $request ){
    $data = array();

    $count = User::where('email', '=', $request->get('email'))
                ->where('password', '=', md5($request->get('password')) )->count();

    if($count > 0) {
      $fetch = User::where('email', '=', $request->get('email'))->get();
      $request->session()->put( "active" , $fetch[0]->email);
      $request->session()->put( "active_data" , $fetch[0]);

      $data['status'] = true;
      $data['message'] = 'Success.';
    }else{
      $data['status'] = false;
      $data['message'] = 'Account does not exist.';
    }

    return $data;
  }

  public function register( Request $request ){
    $data = array();

    $count = User::where('email', '=', $request->get('email'))->count();

    if($count > 0) {
      $data['status'] = false;
      $data['message'] = 'Email already taken.';
      return $data;
    }

    $create = User::create([
                'name' => $request->get('name'),
                'email' => $request->get('email'),
                'password' => md5($request->get('password')),
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

  public function get_session(Request $request){
    $data = array();
    $data['user'] = $request->session()->get('active_data');
    return $data;
  }

  public function checkSessionStatus(Request $request){
    $data = array();

    if ($request->session()->has('active')) {
      $data['isActive'] = true;
    }else{
      $data['isActive'] = false;
    }
      
    return $data;
  }

  public function logout(Request $request){
    $data = $request->session()->flush();
    return $data;
  }
}