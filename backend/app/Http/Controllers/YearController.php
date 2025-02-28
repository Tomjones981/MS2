<?php

namespace App\Http\Controllers;
use App\Models\Year;
use Illuminate\Http\Request;

class YearController extends Controller
{
    public function createYear(Request $request)
    {
        $request->validate([
            'year_date' => 'required|digits:4|integer|min:1900|max:2100',  
        ]);

        $existingYear = Year::where('year_date', $request->input('year_date'))->first();
        if ($existingYear) {
            return response()->json([
                'message' => 'This Year has already been created',
            ], 409);
        }

        $year = new Year();
        $year->year_date = $request->input('year_date');
        $year->save();

        return response()->json([
            'message' => 'Year Created Successfully!',
            'year' => $year,
        ], 201);

    }
    public function getAllYears(){
        return Year::all();
    }
    public function getYearDate($id)
    { 
        $year = Year::find($id);

        if (!$year) {
            return response()->json(['message' => 'Year not found'], 404);
        }
 
        return response()->json(['year_date' => $year->year_date]);
    }
}
