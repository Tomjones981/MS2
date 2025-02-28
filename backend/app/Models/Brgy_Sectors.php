<?php

namespace App\Models;
use App\Models\Year;
use App\Models\Sub_Category;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Brgy_Sectors extends Model
{
    use HasFactory;
    protected $table = 'brgy_sectors';
    protected $fillable = [
        'year_id', 
        'sector_name',  
    ];
 

    public function year()
    {
        return $this->belongsTo(Year::class);
    }

    public function sub_category()
    {
        return $this->hasMany(Sub_Category::class);
    }
}
