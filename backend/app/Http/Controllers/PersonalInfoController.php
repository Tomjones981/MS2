<?php

namespace App\Http\Controllers;
use App\Models\OpolCdc;
use App\Models\Sub_Category;
use App\Models\OpolECCD;
use App\Models\ChildrenCase;
use App\Models\Personal_Info;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
class PersonalInfoController extends Controller
{
    public function getSubCategoryName($id)
    {
        $sub_category = Sub_Category::find($id);

        if (!$sub_category) {
            return response()->json(['message' => 'Sub category not found'], 404);
        }

        return response()->json([
            'id' => $sub_category->id,
            'sub_cat_name' => $sub_category->sub_cat_name,
            'age_range' => $sub_category->age_range,
            'description' => $sub_category->description
        ]);
    }
    // public function getPersonalInfoBySubCategory($personInfoId)
    // {
    //     $person_info = Personal_Info::where('sub_cat_id', $personInfoId)->get();
    //     return response()->json($person_info);
    // }

    // public function getPersonalInfoBySubCategory($personInfoId)
    // {
    //     $subCategory = Sub_Category::find($personInfoId);

    //     if (!$subCategory) {
    //         return response()->json(['message' => 'Sub-category not found'], 404);
    //     }

    //     if ($subCategory->sub_cat_name === 'ENROLLEES') {
    //         $data = OpolCdc::where('sub_cat_id', $personInfoId)->get();
    //     }elseif ($subCategory->sub_cat_name === 'ECCD') {
    //         $data = OpolECCD::where('sub_cat_id', $personInfoId)->get();
    //     }else {
    //         $data = Personal_Info::where('sub_cat_id', $personInfoId)->get();
    //     }

    //     return response()->json($data);
    // }

    public function getPersonalInfoBySubCategory($personInfoId)
    {
        $subCategory = Sub_Category::find($personInfoId);

        if (!$subCategory) {
            return response()->json(['message' => 'Sub-category not found'], 404);
        }

        if ($subCategory->sub_cat_name === 'ENROLLEES') {
            $data = OpolCdc::where('sub_cat_id', $personInfoId)->get();
        }elseif ($subCategory->sub_cat_name === 'ECCD') {
            $data = OpolECCD::where('sub_cat_id', $personInfoId)->get();
        }elseif ($subCategory->sub_cat_name === 'PWD') {
            $data = Personal_Info::where('sub_cat_id', $personInfoId)->get();
        }else {
            $data = ChildrenCase::where('sub_cat_id', $personInfoId)->get();
        }

        return response()->json($data);
    }


    public function createPersonalInfo(Request $request): JsonResponse
    {
        try {
            $data = $request->validate([
                'sub_cat_id' => 'required|exists:sub_category,id',
                'name' => 'required|string|max:255',
                'barangay' => 'required|string|max:255',
                'disability' => 'nullable|string|max:255',
                'birthday' => 'required|string|max:255',
                'sex' => 'required|string|in:M,F',
                'id_number' => 'required|string|max:255',
                'blood_type' => 'nullable|string|max:5',
                'age' => 'required|integer|min:0',
            ]);

            $personalInfo = Personal_Info::create($data);
            return response()->json(['message' => 'Personal info created successfully', 'data' => $personalInfo], 201);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }
    }


    public function updatePersonalInfo(Request $request, $id)
    {
        $request->validate([
            'sub_cat_id' => 'required|exists:sub_category,id',
            'name' => 'required|string|max:255',
            'barangay' => 'required|string|max:255',
            'disability' => 'nullable|string|max:255',
            'birthday' => 'nullable|string|max:255',
            'sex' => 'nullable|string|max:10',
            'id_number' => 'nullable|string|max:255',
            'blood_type' => 'nullable|string|max:5',
            'age' => 'nullable|integer|min:0',
        ]);

        $personalInfo = Personal_Info::findOrFail($id);
        $personalInfo->update($request->all());

        return response()->json([
            'message' => 'Personal info updated successfully',
            'data' => $personalInfo
        ]);
    } 
}
