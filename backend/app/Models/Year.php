<?php

namespace App\Models;
use App\Models\Brgy_Sectors;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Year extends Model
{
    use HasFactory;
    protected $table = 'years';
    protected $fillable = [
        'year_date', 
    ];

    public function brgy_sectors()
    {
        return $this->hasMany(Brgy_Sectors::class);
    }
}
