<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use App\Models\ChildrenCase;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\DB;
use App\Exports\ChildrenCaseExport;
use App\Imports\ChildrenCaseImport;

class ChildrenCaseController extends Controller
{
    public function createCICL(Request $request): JsonResponse
    {
        try {
            $data = $request->validate([
                'sub_cat_id' => 'required|exists:sub_category,id',
                'locations' => 'required|string|max:255',
                'code_name' => 'nullable|string|max:255',
                'age' => 'nullable|string|max:255',
                'sex' => 'nullable|string|max:255',
                'religion' => 'nullable|string|max:255',
                'educational_attainment' => 'nullable|string|max:255',
                'educational_status' => 'nullable|string|max:255',
                'ethnic_affiliation' => 'nullable|string|max:255',
                'four_ps_beneficiary' => 'nullable|string|max:255',
                'case' => 'nullable|string|max:255',
                'case_status' => 'nullable|string|max:255',
                'perpetrator' => 'nullable|string|max:255',
                'interventions' => 'nullable|string|max:255',
                'children_case_type' => 'nullable|string|max:255',
            ]);

            $cicl = ChildrenCase::create($data);
            return response()->json(['message' => 'CICL info created successfully', 'data' => $cicl], 201);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }
    }
    public function fetchCICLData()
    {
        return response()->json(ChildrenCase::all());
    }


    public function fetchCICLSex()
    {
        try {
            $sexes = ChildrenCase::distinct()->pluck('sex');
            return response()->json($sexes);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch CICL sex'], 500);
        }
    }
    public function fetchCICLLocations()
    {
        try {
            $sexes = ChildrenCase::distinct()->pluck('locations');
            return response()->json($sexes);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch CICL locations'], 500);
        }
    }
    public function fetchCICLAge()
    {
        try {
            $sexes = ChildrenCase::distinct()->pluck('age');
            return response()->json($sexes);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch CICL age'], 500);
        }
    }



    public function updateCICLInfo(Request $request, $id)
    {
        $request->validate([
            'sub_cat_id' => 'required|exists:sub_category,id',
            'locations' => 'required|string|max:255',
            'code_name' => 'nullable|string|max:255',
            'age' => 'nullable|string|max:255',
            'sex' => 'nullable|string|max:255',
            'religion' => 'nullable|string|max:255',
            'educational_attainment' => 'nullable|string|max:255',
            'educational_status' => 'nullable|string|max:255',
            'ethnic_affiliation' => 'nullable|string|max:255',
            'four_ps_beneficiary' => 'nullable|string|max:255',
            'case' => 'nullable|string|max:255',
            'case_status' => 'nullable|string|max:255',
            'perpetrator' => 'nullable|string|max:255',
            'interventions' => 'nullable|string|max:255',
            'children_case_type' => 'nullable|string|max:255',
        ]);

        $childrenCase = ChildrenCase::findOrFail($id);
        $childrenCase->update($request->all());

        return response()->json([
            'message' => 'Children Case info updated successfully',
            'data' => $childrenCase
        ]);
    }

    public function exportChildrenCase()
    {
        return Excel::download(new ChildrenCaseExport, 'Children_Cases_Info.xlsx');
    }
    public function importChildrenCase(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,csv',
            'sub_cat_id' => 'required|exists:sub_category,id',
        ]);

        try {
            $subCatId = $request->input('sub_cat_id');
            Excel::import(new ChildrenCaseImport($subCatId), $request->file('file'));

            return response()->json(['message' => 'Data imported successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error importing data: ' . $e->getMessage()], 500);
        }
    }

    public function getCasesByYear($year, Request $request)
    {
        $caseType = $request->input('children_case_type');

        $cases = ChildrenCase::select('locations', \DB::raw('COUNT(code_name) AS total_code_names'))
            ->join('sub_category', 'children_case.sub_cat_id', '=', 'sub_category.id')
            ->join('brgy_sectors', 'sub_category.brgy_sector_id', '=', 'brgy_sectors.id')
            ->join('years', 'brgy_sectors.year_id', '=', 'years.id')
            ->whereNotNull('children_case.code_name')
            ->where('children_case.code_name', '<>', '')
            ->where('years.year_date', $year);

        if (!empty($caseType)) {
            $cases->where('children_case.children_case_type', $caseType);
        }

        $cases = $cases->groupBy('children_case.locations')
            ->get();

        return response()->json($cases);
    }


    public function getAgeDistribution($year, Request $request)
    {
        $caseType = $request->input('children_case_type'); // Get the case type from request

        $cases = ChildrenCase::select('age', \DB::raw('COUNT(age) AS total_ages'))
            ->join('sub_category', 'children_case.sub_cat_id', '=', 'sub_category.id')
            ->join('brgy_sectors', 'sub_category.brgy_sector_id', '=', 'brgy_sectors.id')
            ->join('years', 'brgy_sectors.year_id', '=', 'years.id')
            ->whereNotNull('children_case.age')
            ->where('children_case.age', '<>', '')
            ->where('years.year_date', $year);

        if (!empty($caseType)) {
            $cases->where('children_case.children_case_type', $caseType);
        }

        $cases = $cases->groupBy('children_case.age')
            ->orderByRaw('CAST(age AS UNSIGNED) ASC')
            ->limit(25)
            ->get();

        return response()->json($cases);
    }

    public function getGenderGraph($year, Request $request)
    {
        $caseType = $request->input('children_case_type');

        $cases = ChildrenCase::select('children_case.sex', \DB::raw('COUNT(sex) AS total_sex'))
            ->join('sub_category', 'children_case.sub_cat_id', '=', 'sub_category.id')
            ->join('brgy_sectors', 'sub_category.brgy_sector_id', '=', 'brgy_sectors.id')
            ->join('years', 'brgy_sectors.year_id', '=', 'years.id')
            ->whereNotNull('children_case.sex')
            ->where('children_case.sex', '<>', '')
            ->where('years.year_date', $year);

        if (!empty($caseType)) {
            $cases->where('children_case.children_case_type', $caseType);
        }

        $cases = $cases->groupBy('children_case.sex')
            ->orderBy('children_case.sex', 'asc')
            ->get();

        return response()->json($cases);
    }






    // public function fetchCICLLocations()
    // {
    //     $cacheKey = 'cicl_unique_locations';

    //     $locations = Cache::get($cacheKey);

    //     if (!$locations) {
    //         $locations = ChildrenCase::select('locations')
    //             ->distinct()
    //             ->get();

    //         Cache::put($cacheKey, $locations, now()->addDay());
    //     }

    //     return response()->json($locations);
    // } 


    // public function fetchCICLAge()
    // {
    //     $cacheKey = 'cicl_unique_age';

    //     $locations = Cache::get($cacheKey);

    //     if (!$locations) {
    //         $locations = ChildrenCase::select('age')
    //             ->distinct()
    //             ->get();

    //         Cache::put($cacheKey, $locations, now()->addDay());
    //     }

    //     return response()->json($locations);
    // }

    // public function createICCLInfo(Request $request): JsonResponse
    // {
    //     try {
    //         $data = $request->validate([
    //             'sub_cat_id' => 'required|exists:sub_category,id',
    //             'code_name' => 'required|string|max:255', 
    //             'age' => 'required|string|max:255', 
    //             'case_description' => 'required|string|max:255', 
    //         ]);

    //         $iccl = ChildrenCase::create($data);
    //         return response()->json(['message' => 'ICCL info created successfully', 'data' => $iccl], 201);
    //     } catch (ValidationException $e) {
    //         return response()->json(['errors' => $e->errors()], 422);
    //     }
    // } 
}
