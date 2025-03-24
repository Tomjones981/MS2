<?php

namespace App\Exports;

use App\Models\ChildrenCase;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class ChildrenCaseExport implements FromCollection, WithHeadings
{
    public function collection()
    {
        return ChildrenCase::select(
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
        )->get();
    }

    public function headings(): array
    {
        return [
            'Locations', 
            'Code Name', 
            'Age', 
            'Sex', 
            'Religion', 
            'Education Attainment', 
            'Educational Status', 
            'Ethnic Affiliation',
            '4ps Beneficiary',
            'Case', 
            'Case Status',  
            'Perpetrator',  
            'Interventions',  
            'CChildren Case Type',
        ];
    }
}
