<?php

namespace App\Models; 
use App\Models\Unit;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TotalUnits extends Model
{
    use HasFactory;
    protected $table = 'total_units';
    protected $fillable =[
        'unit_id',
        'month_year',
        'total_hours',  
    ];
    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }

    public function getFormattedMonthYearAttribute()
    {
        return \Carbon\Carbon::parse($this->month_year)->format('F Y');
    }
}
