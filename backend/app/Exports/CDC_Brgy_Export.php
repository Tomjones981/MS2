<?php

namespace App\Exports;

use App\Models\OpolCdc;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use App\Exports\CdcExport;


class CDC_Brgy_Export implements WithMultipleSheets
{
    use Exportable;

    protected $subCatId;

    public function __construct($subCatId)
    {
        $this->subCatId = $subCatId;
    }

    public function sheets(): array
    {
        $sheets = [];
        $barangays = OpolCdc::where('sub_cat_id', $this->subCatId)
                            ->select('barangay')
                            ->distinct()
                            ->pluck('barangay');

        foreach ($barangays as $barangay) {
            $sheets[$barangay] = new CdcExport($barangay, $this->subCatId);
        }

        return $sheets;
    }
}
