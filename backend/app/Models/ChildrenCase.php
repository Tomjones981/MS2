<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Sub_Category;

class ChildrenCase extends Model
{
    use HasFactory;
    protected $table = 'children_case';
    protected $fillable = [
        'sub_cat_id',
        'locations',
        'code_name',
        'age',
        'sex',
        'religion',
        'educational_attainment',
        'educational_status',
        'ethnic_affiliation',
        'four_ps_beneficiary',
        'case',
        'case_status',
        'perpetrator',
        'interventions',
        'children_case_type',
    ];

    public function sub_category()
    {
        return $this->belongsTo(Sub_Category::class);
    }
}
