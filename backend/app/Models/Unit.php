<?php

namespace App\Models;
use App\Models\Faculty; 
use App\Models\TotalUnits; 
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Unit extends Model
{
    use HasFactory;
    protected $table = 'unit';
    protected $fillable =[
        'faculty_id',
        'subjects', 
        'teaching_units', 
        'monday', 
        'tuesday', 
        'wednesday', 
        'thursday', 
        'friday', 
        'saturday', 
    ];

    public function faculty()
    {
        return $this->belongsTo(Faculty::class);
    }
    public function total_units()
    {
        return $this->hasMany(TotalUnits::class);
    }
}
