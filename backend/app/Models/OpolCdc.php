<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OpolCdc extends Model
{
    use HasFactory;
    protected $table = 'opol_cdc';

    protected $fillable = [
        'sub_cat_id',
        'first_name',
        'middle_name',
        'last_name',
        'birthday',
        'barangay',
        'M',
        'F',
        'months_old',
        '1_11_yrs_old',
        '2_11_yrs_old',
        '3_11_yrs_old',
        '4_11_yrs_old',
        '5_yrs_old',
        'pwd',
    ];

    public function sub_category(){
        return $this->belongsTo(Sub_Category::class);
    }
}
