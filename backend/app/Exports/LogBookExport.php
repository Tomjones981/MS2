<?php

namespace App\Exports;

use App\Models\LogBook;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class LogBookExport implements FromCollection, WithHeadings
{
    public function collection()
    {
        return LogBook::select(
            'date', 
            'client_name', 
            'age', 
            'gender', 
            'address', 
            'purpose', 
            'beneficiary', 
            'hospital_or_institutional', 
            'contact_number', 
            'amount'
        )->get();
    }

    public function headings(): array
    {
        return [
            'Date', 
            'Client Name', 
            'Age', 
            'Gender', 
            'Address', 
            'Purpose', 
            'Beneficiary', 
            'hospital_or_institutional', 
            'Contact Number', 
            'Amount'
        ];
    }
}
