<?php

namespace App\Models;

use App\Models\GeneratedPayroll; 
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdjustmentPayroll extends Model
{
    use HasFactory;
    protected $table = 'adjustment_payroll';
    protected $fillable =[
        'generated_payroll_id',  
        'adjustment',  
        'adjusted_netpay',  
    ];

    public function generated_payroll()
    {
        return $this->belongsTo(GeneratedPayroll::class);
    }
}
