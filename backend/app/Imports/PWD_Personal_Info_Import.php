<?php

namespace App\Imports;

use App\Models\Personal_Info;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithStartRow;
use Illuminate\Support\Facades\Log;
class PWD_Personal_Info_Import implements ToModel, WithStartRow
{
    protected $sub_cat_id;
    public function __construct($sub_cat_id)
    {
        $this->sub_cat_id = $sub_cat_id;
    }
    public function startRow(): int
    {
        return 4;
    }

    public function model(array $row)
    { 
        Log::info('Imported Row:', $row);
        if (empty(array_filter($row))) {
            Log::info('Skipping empty row');
            return null;
        }
        $existingRecord = Personal_Info::where('name', $row[1])  
            ->orWhere('name', $row[1])  
            ->exists(); 

        if ($existingRecord) {
            return null;  
        }

        return new Personal_Info([
            'sub_cat_id' =>$this->sub_cat_id,
            'name' => $row[1],
            'barangay' => $row[2],
            'disability' => $row[3],
            'birthday' => $row[4],
            'sex' => $row[5],
            'id_number' => $row[6],
            'blood_type' => $row[7],
            'age' => $row[8],
        ]);
    }

}
