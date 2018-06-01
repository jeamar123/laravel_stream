<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Movie extends Model
{
  //
	protected $table = 'movies';
	protected $fillable = [
		'image','name', 'year', 'categories', 'description', 'link_1', 'link_2', 'link_3',
  ];
}
