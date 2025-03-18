<?php

namespace App\Imports;

use App\Models\OpolCdc;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithStartRow;
use Illuminate\Support\Facades\Log;
use PhpOffice\PhpSpreadsheet\Shared\Date;
class OpolCDCImport implements ToModel, WithStartRow
{
    protected $sub_cat_id;
    public function __construct($sub_cat_id)
    {
        $this->sub_cat_id = $sub_cat_id;
    }
    public function startRow(): int
    {
        return 7;
    }

    public function model(array $row)
    {
        Log::info('Imported Row:', $row);
        if (empty(array_filter($row))) {
            Log::info('Skipping empty row');
            return null;
        }
        $existingRecord = OpolCdc::where('last_name', $row[2])
            ->orWhere('first_name', $row[3])
            ->exists();

        if ($existingRecord) {
            return null;
        }

        return new OpolCdc([
            'sub_cat_id' => $this->sub_cat_id,
            'last_name' => $row[2] ?? '',
            'first_name' => $row[3] ?? '',
            'middle_name' => $row[4] ?? null, 
            'birthday'    => is_numeric($row[5]) ? Date::excelToDateTimeObject($row[5])->format('Y-m-d') : $row[5],
            'barangay' => $row[6] ?? '',
            'M' => $row[7] ?? null,
            'F' => $row[8] ?? null,  
            'months_old' => $row[9] ?? null,
            '1_11_yrs_old' => $row[10] ?? null,
            '2_11_yrs_old' => $row[11] ?? null,
            '3_11_yrs_old' => $row[12] ?? null,
            '4_11_yrs_old' => $row[13] ?? null,
            '5_yrs_old' => $row[14] ?? null,
            'pwd' => $row[15] ?? '',
        ]);
    }
}
