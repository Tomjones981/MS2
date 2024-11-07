<?php

namespace App\Models;

use App\Models\Faculty; 
use App\Models\AdjustmentPayroll; 
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GeneratedPayroll extends Model
{
    use HasFactory;
    protected $table = 'generated_payroll';
    protected $fillable =[
        'faculty_id', 
        'date_from', 
        'date_to', 
        'hours_or_days', 
        'gross_amount', 
        'late', 
        'tax', 
        'netpay', 
        'payroll_type', 
    ];

    public function faculty()
    {
        return $this->belongsTo(Faculty::class);
    }
    public function adjustment_payroll()
    {
        return $this->hasMany(AdjustmentPayroll::class);
    }
}
