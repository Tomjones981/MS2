<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hospital_Bill extends Model
{
    use HasFactory;
    protected $table = 'logbook_hospital_bill';

    protected $fillable = [
        'date',
        'name',
        'age',
        'address',
        'beneficiary_name',
        'hospital_name',
        'amount',
    ];
}
