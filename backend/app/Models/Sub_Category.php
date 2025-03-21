<?php

namespace App\Models;
use App\Models\Brgy_Sectors;
use App\Models\Personal_Info;
use App\Models\ChildrenCase;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sub_Category extends Model
{
    use HasFactory;
    protected $table = 'sub_category';
    protected $fillable = [
        'brgy_sector_id', 
        'sub_cat_name',  
        'age_range',  
        'description',  
    ];
 

    public function brgy_sectors()
    {
        return $this->belongsTo(Brgy_Sectors::class);
    }
    public function personal_info()
    {
        return $this->hasMany(Personal_Info::class);
    }
    public function opol_cdc(){
        return $this->hasMany(OpolCdc::class);
    }
    public function children_case()
    {
        return $this->hasMany(ChildrenCase::class);
    }
}
