<?php

namespace App\Http\Controllers;
use App\Models\Sub_Category;
use App\Models\Brgy_Sectors;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class SubCategoryController extends Controller
{
    public function getAllSubCategory()
    {
        return Sub_Category::all();
    }
    public function getSectorsSubCategory($id)
    {
        $sector = Brgy_Sectors::find($id);

        if (!$sector) {
            return response()->json(['message' => 'Sector not found'], 404);
        }

        return response()->json(['sector_name' => $sector->sector_name]);
    }
    public function getSubCategoryBySectors($subCatId)
    {
        $sub_cat = Sub_Category::where('brgy_sector_id', $subCatId)->get();
        return response()->json($sub_cat);
    } 

    public function createSubCategory(Request $request)
    {
        $request->validate([
            'brgy_sector_id' => 'required|exists:brgy_sectors,id',
            'sub_cat_name' => 'required|string|max:255|unique:sub_category,sub_cat_name',
            'age_range' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
        ], [
            'sub_cat_name.unique' => 'Sub-category name already exists.'
        ]);

        $subCategory = Sub_Category::create([
            'brgy_sector_id' => $request->brgy_sector_id,
            'sub_cat_name' => $request->sub_cat_name,
            'age_range' => $request->age_range,
            'description' => $request->description
        ]);

        return response()->json([
            'message' => 'Sub-category Created Successfully!',
            'subCategory' => $subCategory,
        ], 201);
    }


    

}
