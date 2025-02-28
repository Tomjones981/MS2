<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model; 
class LogBook extends Model
{
    use HasFactory;
    protected $table = 'log_book';
    protected $fillable = [
        'date', 
        'client_name', 
        'age', 
        'gender', 
        'address', 
        'purpose', 
        'beneficiary', 
        'hospital_or_institutional', 
        'contact_number', 
        'amount',  
    ];
 
}
