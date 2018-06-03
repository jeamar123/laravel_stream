<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use DateTime;

use App\User;

class UserController extends Controller
{
  /**
   * Show the profile for the given user.
   *
   * @param  int  $id
   * @return Response
   */
  public function getUsers( )
  {
    return User::orderBy('name', 'asc')->get();
  }

  public function getUserByID( $id )
  {
    $data = User::where('id', $id)->get();
    return $data;
  }

}