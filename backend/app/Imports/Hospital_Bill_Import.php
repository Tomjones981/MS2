<?php 
namespace App\Imports;

use App\Models\Hospital_Bill;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Carbon\Carbon;

class Hospital_Bill_Import implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        return new Hospital_Bill([
            'date'                     => Carbon::parse($row['date'])->format('Y-m-d'),  
            'name'                     => $row['name'],  
            'age'                      => $row['age'],   
            'address'                  => $row['address'],   
            'beneficiary_name'         => $row['beneficiary_name'],  
            'hospital_name'            => $row['hospital_name'],   
            'amount'                   => $row['amount'],  
        ]);
    }
}
