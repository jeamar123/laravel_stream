<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Movie extends Model
{
  //
	protected $table = 'movies';
	protected $fillable = [
		'image', 
		'movie_thumbnail', 
		'name', 
		'year', 
		'categories', 
		'description', 
		'movie_link', 
		'torrent_link'
  ];
}
