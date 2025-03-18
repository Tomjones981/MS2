<?php

namespace App\Exports;

use App\Models\Hospital_Bill;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class HospitalBillExport implements FromCollection, WithHeadings
{
    public function collection()
    {
        return Hospital_Bill::select(
            'date',
            'name',
            'age',
            'address',
            'beneficiary_name',
            'hospital_name',
            'amount',
        )->get();
    }

    public function headings(): array
    {
        return [
            'Date',
            'Name',
            'Age', 
            'Address', 
            'Beneficiary Name',
            'Hospital Name', 
            'Amount'
        ];
    }
}
