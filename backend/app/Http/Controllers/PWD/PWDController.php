<?php

namespace App\Http\Controllers\PWD;

use App\Http\Controllers\Controller;
use App\Models\Personal_Info;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\PWD_Personal_Info_Import;
class PWDController extends Controller
{
    public function importPWDPersonalInfo(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,csv',
            'sub_cat_id' => 'required|exists:sub_category,id',
        ]);

        try {
            $subCatId = $request->input('sub_cat_id');
            Excel::import(new PWD_Personal_Info_Import($subCatId), $request->file('file'));

            return response()->json(['message' => 'Data imported successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error importing data: ' . $e->getMessage()], 500);
        }
    }

    public function getPWDBarangayCounts()
    {
        // List of barangays
        $barangays = [
            'AWANG',
            'BAGOCBOC',
            'BONBON',
            'BARRA',
            'CAUYONAN',
            'IGPIT',
            'L-BONBON',
            'LIMONDA',
            'MALANANG',
            'NANGCAON',
            'PATAG',
            'POBLACION',
            'TINGALAN',
            'TABOC'
        ];

        $counts = Personal_Info::whereIn('barangay', $barangays)
            ->select('barangay', DB::raw('COUNT(*) as count'))
            ->groupBy('barangay')
            ->get();

        $totalCount = $counts->sum('count');

        return response()->json([
            'barangay_counts' => $counts,
            'total_count' => $totalCount
        ]);
    }

    public function getBarangayDetails($barangay)
    {
        $data = Personal_Info::select(
            DB::raw("
            CASE 
                WHEN age BETWEEN 0 AND 5 THEN '0-5'
                WHEN age BETWEEN 6 AND 12 THEN '6-12'
                WHEN age BETWEEN 13 AND 17 THEN '13-17'
                WHEN age BETWEEN 18 AND 24 THEN '18-24'
                WHEN age BETWEEN 25 AND 29 THEN '25-29'
                WHEN age BETWEEN 30 AND 59 THEN '30-59'
                WHEN age >= 60 THEN '60 above'
            END AS age_group
        "),
            DB::raw("SUM(CASE WHEN sex = 'M' THEN 1 ELSE 0 END) AS male_count"),
            DB::raw("SUM(CASE WHEN sex = 'F' THEN 1 ELSE 0 END) AS female_count"),
            DB::raw("COUNT(*) AS total_count")
        )
            ->where('barangay', $barangay)
            ->groupBy('age_group')
            ->orderByRaw("
        CASE 
            WHEN age_group = '0-5' THEN 1
            WHEN age_group = '6-12' THEN 2
            WHEN age_group = '13-17' THEN 3
            WHEN age_group = '18-24' THEN 4
            WHEN age_group = '25-29' THEN 5
            WHEN age_group = '30-59' THEN 6
            WHEN age_group = '60 above' THEN 7
        END
    ")
            ->get();

        return response()->json($data);
    }

    
}
