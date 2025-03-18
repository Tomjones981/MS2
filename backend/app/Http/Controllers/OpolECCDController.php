<?php

namespace App\Http\Controllers;

use App\Imports\OpolECCD_Import;
use App\Models\OpolECCD;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Validation\ValidationException;

class OpolECCDController extends Controller
{
    public function importECCD(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,csv',
            'sub_cat_id' => 'required|exists:sub_category,id',
        ]);

        try {
            $subCatId = $request->input('sub_cat_id');
            Excel::import(new OpolECCD_Import($subCatId), $request->file('file'));

            return response()->json(['message' => 'Data imported successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error importing data: ' . $e->getMessage()], 500);
        }
    }
    public function createOPOLECCD(Request $request): JsonResponse
    {
        try {
            $data = $request->validate([
                'sub_cat_id' => 'required|exists:sub_category,id',
                'children_name' => 'required|string|max:255',
                'age' => 'nullable|string|max:255',
                'sex' => 'nullable|string|max:255',
                'yes' => 'nullable|string|max:255',
                'no' => 'nullable|string|max:255',
                'school_name' => 'nullable|string|max:255',
                'barangay' => 'nullable|string|max:255',
                'school_address' => 'nullable|string|max:255',
                'remarks' => 'nullable|string|max:255',
            ]);

            $opoleccd = OpolECCD::create($data);
            return response()->json(['message' => 'Opol ECCD info created successfully', 'data' => $opoleccd], 201);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }
    }

    // public function updateECCD(Request $request, $id)
    // {
    //     $request->validate([
    //         'sub_cat_id' => 'required|exists:sub_category,id',
    //         'children_name' => 'required|string|max:255',
    //         'age' => 'required|string|max:255',
    //         'sex' => 'nullable|string|max:255',
    //         'yes' => 'nullable|string|max:255',
    //         'no' => 'nullable|string|max:10',
    //         'school_name' => 'nullable|string|max:255',
    //         'barangay' => 'nullable|string|max:255',
    //         'school_address' => 'nullable|string|max:255',
    //         'remarks' => 'nullable|string|max:255',
    //     ]);

    //     $eccdInfo = OpolECCD::findOrFail($id);
    //     $eccdInfo->update($request->all());

    //     return response()->json([
    //         'message' => 'ECCD info updated successfully',
    //         'data' => $eccdInfo
    //     ]);
    // }
    public function updateECCD(Request $request, $id)
    {
        $validatedData = $request->validate([
            'sub_cat_id' => 'required|exists:sub_category,id',
            'children_name' => 'required|string|max:255',
            'age' => 'required|string|max:255',
            'sex' => 'nullable|string|max:255',
            'yes' => 'nullable|string|max:255',
            'no' => 'nullable|string|max:10',
            'school_name' => 'nullable|string|max:255',
            'barangay' => 'nullable|string|max:255',
            'school_address' => 'nullable|string|max:255',
            'remarks' => 'nullable|string|max:255',
        ]);

        $opolEccd = OpolECCD::find($id);

        if (!$opolEccd) {
            return response()->json([
                'message' => 'Opol ECCD entry not found'
            ], 404);
        }

        $opolEccd->update($validatedData);

        return response()->json([
            'message' => 'OPOL ECCD entry updated successfully',
            'opolEccd' => $opolEccd
        ], 200);
    }
}
