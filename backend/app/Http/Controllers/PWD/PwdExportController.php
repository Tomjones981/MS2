<?php

namespace App\Http\Controllers\PWD;
use App\Exports\PWD_BarangayWise_Export;
use Maatwebsite\Excel\Facades\Excel;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PwdExportController extends Controller
{
    public function exportBarangayPWDPersonalInfo($subCatId){
        return Excel::download(new PWD_BarangayWise_Export($subCatId), 'PWD_Personal_Info.xlsx');
    }
}
