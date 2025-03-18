<?php

namespace App\Imports;

use App\Models\OpolECCD;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithStartRow;
use Illuminate\Support\Facades\Log;

class OpolECCD_Import implements ToModel, WithStartRow
{
    protected $sub_cat_id;

    public function __construct($sub_cat_id)
    {
        $this->sub_cat_id = $sub_cat_id;
    }

    public function startRow(): int
    {
        return 11; // Ensure this is correct for your file structure
    }

    public function model(array $row)
    {
        Log::info('Imported Row:', $row);

        // Debugging: Check if $row has enough columns
        if (count($row) < 9) {
            Log::warning('Skipping row due to insufficient columns', $row);
            return null;
        }

        // Skip empty rows
        if (empty(array_filter($row))) {
            Log::info('Skipping empty row');
            return null;
        }

        // Check if record already exists
        $existingRecord = OpolECCD::where('children_name', $row[1])->exists();
        if ($existingRecord) {
            Log::info("Skipping duplicate entry for: " . $row[1]);
            return null;
        }

        return new OpolECCD([
            'sub_cat_id'      => $this->sub_cat_id,
            'children_name'   => trim($row[1] ?? ''),  
          //   'age'             => isset($row[2]) ? (int) $row[2] : null,  
            'age'             => trim($row[3] ?? ''),  
            'sex'             => trim($row[4] ?? ''),  
            'yes'             => trim($row[5] ?? ''), 
            'no'              => trim($row[6] ?? ''), 
            'school_name'     => trim($row[7] ?? ''), 
            'barangay'     => trim($row[9] ?? ''), 
            'school_address'  => trim($row[10] ?? ''), 
            'remarks'         => trim($row[12] ?? ''), 
        ]);
    }
}
