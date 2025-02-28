<?php
namespace App\Imports;

use App\Models\LogBook;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Carbon\Carbon;

class LogBookImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        return new LogBook([
            'date'                     => Carbon::parse($row['date'])->format('Y-m-d'),  
            'client_name'              => $row['client_name'],  
            'age'                      => $row['age'],  
            'gender'                   => $row['gender'],  
            'address'                  => $row['address'],  
            'purpose'                  => $row['purpose'], 
            'beneficiary'              => $row['beneficiary'],  
            'hospital_or_institutional' => $row['hospital_or_institutional'],  
            'contact_number'           => $row['contact_number'],  
            'amount'                   => $row['amount'],  
        ]);
    }
}
