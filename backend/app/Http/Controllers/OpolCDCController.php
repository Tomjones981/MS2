<?php

namespace App\Http\Controllers;

use App\Models\OpolCdc;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\OpolCDCImport;
use App\Exports\CDC_Brgy_Export;
use Illuminate\Validation\ValidationException;

class OpolCDCController extends Controller
{
    public function index()
    {
        $opolCdcData = OpolCdc::all();
        return response()->json($opolCdcData);
    }

    public function createOPOLCDC(Request $request): JsonResponse
    {
        try {
            $data = $request->validate([
                'sub_cat_id' => 'required|exists:sub_category,id',
                'first_name' => 'required|string|max:255',
                'middle_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'birthday' => 'required|string|max:255',
                'barangay' => 'required|string|max:255',
                'M' => 'nullable|string|max:255',
                'F' => 'nullable|string|max:255',
                'months_old' => 'nullable|string|max:255',
                '1_11_yrs_old' => 'nullable|string|max:255',
                '2_11_yrs_old' => 'nullable|string|max:255',
                '3_11_yrs_old' => 'nullable|string|max:255',
                '4_11_yrs_old' => 'nullable|string|max:255',
                '5_yrs_old' => 'nullable|string|max:255',
                'pwd' => 'nullable|string|max:255',
            ]);

            $opolcdc = OpolCdc::create($data);
            return response()->json(['message' => 'Opol CDC info created successfully', 'data' => $opolcdc], 201);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }
    }
    public function importOPOLCDC(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,csv',
            'sub_cat_id' => 'required|exists:sub_category,id',
        ]);

        try {
            $subCatId = $request->input('sub_cat_id');
            Excel::import(new OpolCDCImport($subCatId), $request->file('file'));

            return response()->json(['message' => 'Data imported successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error importing data: ' . $e->getMessage()], 500);
        }
    }
    public function exportCDC($subCatId)
    {
        return Excel::download(new CDC_Brgy_Export($subCatId), 'OPOL_CDC.xlsx');
    }

    public function getCDCEnrolleesTotals()
    {
        $data = DB::table('opol_cdc')
            ->selectRaw("
                barangay, 
                COUNT(*) AS total_records,
                SUM(CASE WHEN M IS NOT NULL AND M != '' THEN 1 ELSE 0 END) AS male_count,
                SUM(CASE WHEN F IS NOT NULL AND F != '' THEN 1 ELSE 0 END) AS female_count,
                SUM(CASE WHEN months_old IS NOT NULL AND months_old != '' THEN 1 ELSE 0 END) AS months_old_count,
                SUM(CASE WHEN `1_11_yrs_old` IS NOT NULL AND `1_11_yrs_old` != '' THEN 1 ELSE 0 END) AS One_Yrs_Old,
                SUM(CASE WHEN `2_11_yrs_old` IS NOT NULL AND `2_11_yrs_old` != '' THEN 1 ELSE 0 END) AS Two_Yrs_Old,
                SUM(CASE WHEN `3_11_yrs_old` IS NOT NULL AND `3_11_yrs_old` != '' THEN 1 ELSE 0 END) AS Three_Yrs_Old,
                SUM(CASE WHEN `4_11_yrs_old` IS NOT NULL AND `4_11_yrs_old` != '' THEN 1 ELSE 0 END) AS Four_Yrs_Old,
                SUM(CASE WHEN `5_yrs_old` IS NOT NULL AND `5_yrs_old` != '' THEN 1 ELSE 0 END) AS Five_Yrs_Old,
                SUM(CASE WHEN pwd IS NOT NULL AND pwd != '' THEN 1 ELSE 0 END) AS pwd_count
            ")
            ->whereNotNull('barangay')
            ->groupBy('barangay')
            ->orderByDesc('total_records')
            ->get();

        return response()->json($data);
    }



}
