<?php

namespace App\Http\Controllers;
use App\Models\Faculty;
use App\Models\Unit;
use App\Models\TotalUnits;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UnitController extends Controller
{
    public function getFacultiesAndUnits()
    {
        $facultiesWithUnits = DB::table('faculty')
            ->join('unit', 'faculty.id', '=', 'unit.faculty_id')
            ->join('faculty_rates', 'faculty.id', '=', 'faculty_rates.faculty_id')
            ->leftJoin('department', 'faculty.department_id', '=', 'department.id')
            ->leftJoin('employment', 'faculty.id', '=', 'employment.faculty_id')
            ->leftJoin('contact_details', 'faculty.id', '=', 'contact_details.faculty_id')
            ->where('employment.status' ,'=', value: 'active')
            ->select(
                'unit.id as unit_id',
                'faculty.id as faculty_id',
                DB::raw("CONCAT(faculty.last_name, ' ', (faculty.first_name), ' ',COALESCE(faculty.middle_name, '')) AS full_name"),
                'faculty.first_name',
                'faculty.middle_name',
                'faculty.last_name',
                'faculty_rates.rate_type AS designation',
                'department.department_name AS department',
                'employment.employment_type AS employment_type',
                'employment.status',
                'contact_details.email',
                'unit.subjects',
                'unit.teaching_units',
                'unit.monday',
                'unit.tuesday',
                'unit.wednesday',
                'unit.thursday',
                'unit.friday',
                'unit.saturday'
            )
            ->orderBy('faculty.last_name', 'ASC')
            ->get();

        return response()->json($facultiesWithUnits, 200);
    }

    public function storeUnit(Request $request)
    {
        $request->validate([
            'data' => 'required|array',
            'data.*.unit_id' => 'required|exists:unit,id',
            'data.*.month_year' => 'required|date',
            'data.*.total_hours' => 'required|integer',
        ]);

        $totalUnits = [];
        foreach ($request->data as $item) {
            $totalUnits[] = TotalUnits::updateOrCreate(
                [
                    'unit_id' => $item['unit_id'],
                    'month_year' => $item['month_year'],
                ],
                [
                    'total_hours' => $item['total_hours'],
                ]
            );
        }

        return response()->json([
            'message' => 'Total units saved successfully.',
            'data' => $totalUnits,
        ]);
    }

    public function getTotalUnits(Request $request)
    {
        $request->validate([
            'month_year' => 'required|date_format:Y-m-d',
        ]);

        $monthYear = $request->month_year;

        $totalUnits = TotalUnits::where('month_year', $monthYear)->get();

        return response()->json($totalUnits);
    }
}
