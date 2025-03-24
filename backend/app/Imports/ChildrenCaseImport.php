<?php

namespace App\Imports;

use App\Models\ChildrenCase;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithStartRow;
use Illuminate\Support\Facades\Log;

class ChildrenCaseImport implements ToModel, WithStartRow
{
    protected $sub_cat_id;
    public function __construct($sub_cat_id)
    {
        $this->sub_cat_id = $sub_cat_id;
    }
    public function startRow(): int
    {
        return 2;
    }

    public function model(array $row)
    {
        Log::info('Imported Row:', $row);
        if (empty(array_filter($row))) {
            Log::info('Skipping empty row');
            return null;
        }
        $existingRecord = ChildrenCase::where('code_name', $row[1])
            ->orWhere('locations', $row[0])
            ->exists();

        if ($existingRecord) {
            return null;
        }

        return new ChildrenCase([
            'sub_cat_id' => $this->sub_cat_id,
            'locations' => $row[0] ?? '',
            'code_name' => $row[1] ?? '',
            'age' => $row[2] ?? '',
            'sex' => $row[3] ?? '',
            'religion' => $row[4] ?? '',
            'educational_attainment' => $row[5] ?? '',
            'educational_status' => $row[6] ?? '',
            'ethnic_affiliation' => $row[7] ?? '',
            'four_ps_beneficiary' => $row[8] ?? '',
            'case' => $row[9] ?? '',
            'case_status' => $row[10] ?? '',
            'perpetrator' => $row[11] ?? null,
            'interventions' => $row[12] ?? null,
            'children_case_type' => $row[13] ?? '',  
        ]);
    }
}
