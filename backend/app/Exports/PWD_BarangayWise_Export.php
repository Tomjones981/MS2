<?php

namespace App\Exports;

use App\Models\Personal_Info;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use App\Exports\PWD_BarangayPersonSheet_Export;
class PWD_BarangayWise_Export implements WithMultipleSheets
{
    use Exportable;

    public function sheets(): array
    {
        $sheets = [];
        $barangays = Personal_Info::select('barangay')->distinct()->pluck('barangay');

        foreach ($barangays as $barangay) {
            $sheets[$barangay] = new PWD_BarangayPersonSheet_Export($barangay);
        }

        return $sheets;
    }
}
