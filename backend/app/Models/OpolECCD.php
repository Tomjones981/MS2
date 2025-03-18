<?php

namespace App\Models;
use App\Models\Sub_Category;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OpolECCD extends Model
{
    use HasFactory;
    protected $table = 'opol_eccd';
    protected $fillable =
    [
        'sub_cat_id',
        'children_name',
        'age',
        'sex',
        'yes',
        'no',
        'school_name',
        'barangay',
        'school_address',
        'remarks',
    ];

    public function sub_category()
    {
        return $this->belongsTo(Sub_Category::class);
    }
}
