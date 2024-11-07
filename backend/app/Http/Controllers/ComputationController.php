<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
class ComputationController extends Controller
{
    // public function getPartTimeFacultyPayroll(Request $request)
    // {
    //     $startDate = $request->input('start_date');
    //     $endDate = $request->input('end_date');

    //     if (!$startDate || !$endDate) {
    //         return response()->json(['message' => 'Invalid input. Please provide start and end dates.'], 400);
    //     }

    //     $facultyPayroll = DB::table('faculty_rates as fr')
    //         ->join('faculty as f', 'fr.faculty_id', '=', 'f.id')
    //         ->join('unit as u', 'fr.faculty_id', '=', 'u.faculty_id')  
    //         ->join('employment as e', 'fr.faculty_id', '=', 'e.faculty_id')
    //         ->leftJoin('attendance as a', function ($join) {
    //             $join->on('fr.faculty_id', '=', 'a.faculty_id');
    //         }) 
    //         ->where('e.employment_type', 'part_time')
    //         ->whereBetween(DB::raw("STR_TO_DATE(SUBSTRING_INDEX(a.date, ' ', 1), '%m/%d/%Y')"), [$startDate, $endDate])
    //         ->select(
    //             'fr.faculty_id',
    //             DB::raw('CONCAT(f.first_name, " ", f.last_name) as full_name'),
    //             'fr.rate_value',
    //             DB::raw("
    //             SUM(CASE WHEN DAYNAME(STR_TO_DATE(SUBSTRING_INDEX(a.date, ' ', 1), '%m/%d/%Y')) = 'Monday' THEN LEAST(
    //                 COALESCE(NULLIF(CAST(REPLACE(a.hours_worked, ' hrs', '') AS DECIMAL(5, 2)), ''), 0),
    //                 COALESCE(NULLIF(CAST(REPLACE(u.monday, ' hrs', '') AS DECIMAL(5, 2)), ''), 0)
    //             ) ELSE 0 END) AS total_monday,
    //             SUM(CASE WHEN DAYNAME(STR_TO_DATE(SUBSTRING_INDEX(a.date, ' ', 1), '%m/%d/%Y')) = 'Tuesday' THEN LEAST(
    //                 COALESCE(NULLIF(CAST(REPLACE(a.hours_worked, ' hrs', '') AS DECIMAL(5, 2)), ''), 0),
    //                 COALESCE(NULLIF(CAST(REPLACE(u.tuesday, ' hrs', '') AS DECIMAL(5, 2)), ''), 0)
    //             ) ELSE 0 END) AS total_tuesday,
    //             SUM(CASE WHEN DAYNAME(STR_TO_DATE(SUBSTRING_INDEX(a.date, ' ', 1), '%m/%d/%Y')) = 'Wednesday' THEN LEAST(
    //                 COALESCE(NULLIF(CAST(REPLACE(a.hours_worked, ' hrs', '') AS DECIMAL(5, 2)), ''), 0),
    //                 COALESCE(NULLIF(CAST(REPLACE(u.wednesday, ' hrs', '') AS DECIMAL(5, 2)), ''), 0)
    //             ) ELSE 0 END) AS total_wednesday,
    //             SUM(CASE WHEN DAYNAME(STR_TO_DATE(SUBSTRING_INDEX(a.date, ' ', 1), '%m/%d/%Y')) = 'Thursday' THEN LEAST(
    //                 COALESCE(NULLIF(CAST(REPLACE(a.hours_worked, ' hrs', '') AS DECIMAL(5, 2)), ''), 0),
    //                 COALESCE(NULLIF(CAST(REPLACE(u.thursday, ' hrs', '') AS DECIMAL(5, 2)), ''), 0)
    //             ) ELSE 0 END) AS total_thursday,
    //             SUM(CASE WHEN DAYNAME(STR_TO_DATE(SUBSTRING_INDEX(a.date, ' ', 1), '%m/%d/%Y')) = 'Friday' THEN LEAST(
    //                 COALESCE(NULLIF(CAST(REPLACE(a.hours_worked, ' hrs', '') AS DECIMAL(5, 2)), ''), 0),
    //                 COALESCE(NULLIF(CAST(REPLACE(u.friday, ' hrs', '') AS DECIMAL(5, 2)), ''), 0)
    //             ) ELSE 0 END) AS total_friday,
    //             SUM(CASE WHEN DAYNAME(STR_TO_DATE(SUBSTRING_INDEX(a.date, ' ', 1), '%m/%d/%Y')) = 'Saturday' THEN LEAST(
    //                 COALESCE(NULLIF(CAST(REPLACE(a.hours_worked, ' hrs', '') AS DECIMAL(5, 2)), ''), 0),
    //                 COALESCE(NULLIF(CAST(REPLACE(u.saturday, ' hrs', '') AS DECIMAL(5, 2)), ''), 0)
    //             ) ELSE 0 END) AS total_saturday
    //         ")
    //         ) 
    //         ->groupBy('fr.faculty_id', 'f.first_name', 'f.last_name', 'fr.rate_value')
    //         ->get();

    //     if ($facultyPayroll->isEmpty()) {
    //         return response()->json(['message' => 'No payroll records found for the selected faculties.'], 404);
    //     }

    //     $response = $facultyPayroll->map(function ($faculty) {
    //         return [
    //             'faculty_id' => $faculty->faculty_id,
    //             'full_name' => $faculty->full_name,
    //             'rate_value' => $faculty->rate_value,
    //             'total_monday' => $faculty->total_monday,
    //             'total_tuesday' => $faculty->total_tuesday,
    //             'total_wednesday' => $faculty->total_wednesday,
    //             'total_thursday' => $faculty->total_thursday,
    //             'total_friday' => $faculty->total_friday,
    //             'total_saturday' => $faculty->total_saturday,
    //             'total_late' => '00:00:00',
    //         ];
    //     });

    //     return response()->json($response);
    // }


    // public function getPTRegularPayroll(Request $request)
    // {
    //     $startDate = $request->input('start_date');
    //     $endDate = $request->input('end_date');

    //     if (!$startDate || !$endDate) {
    //         return response()->json(['message' => 'Invalid input. Please provide start and end dates.'], 400);
    //     }

    //     $facultyPayroll = DB::table('faculty_rates as fr')
    //         ->join('faculty as f', 'fr.faculty_id', '=', 'f.id')
    //         ->join('unit as u', 'fr.faculty_id', '=', 'u.faculty_id') // Corrected alias
    //         ->join('employment as e', 'fr.faculty_id', '=', 'e.faculty_id')
    //         ->leftJoin('attendance as a', function ($join) {
    //             $join->on('fr.faculty_id', '=', 'a.faculty_id');
    //         })
    //         ->where('e.employment_type', 'part_time_regular') 
    //         ->whereBetween(DB::raw("STR_TO_DATE(SUBSTRING_INDEX(a.date, ' ', 1), '%m/%d/%Y')"), [$startDate, $endDate])
    //         ->select(
    //             'fr.faculty_id',
    //             DB::raw('CONCAT(f.first_name, " ", f.last_name) as full_name'),
    //             'fr.rate_value',
    //             DB::raw("
    //             SUM(CASE WHEN DAYNAME(STR_TO_DATE(SUBSTRING_INDEX(a.date, ' ', 1), '%m/%d/%Y')) = 'Monday' THEN LEAST(
    //                 COALESCE(NULLIF(CAST(REPLACE(a.hours_worked, ' hrs', '') AS DECIMAL(5, 2)), ''), 0),
    //                 COALESCE(NULLIF(CAST(REPLACE(u.monday, ' hrs', '') AS DECIMAL(5, 2)), ''), 0)
    //             ) ELSE 0 END) AS total_monday,
    //             SUM(CASE WHEN DAYNAME(STR_TO_DATE(SUBSTRING_INDEX(a.date, ' ', 1), '%m/%d/%Y')) = 'Tuesday' THEN LEAST(
    //                 COALESCE(NULLIF(CAST(REPLACE(a.hours_worked, ' hrs', '') AS DECIMAL(5, 2)), ''), 0),
    //                 COALESCE(NULLIF(CAST(REPLACE(u.tuesday, ' hrs', '') AS DECIMAL(5, 2)), ''), 0)
    //             ) ELSE 0 END) AS total_tuesday,
    //             SUM(CASE WHEN DAYNAME(STR_TO_DATE(SUBSTRING_INDEX(a.date, ' ', 1), '%m/%d/%Y')) = 'Wednesday' THEN LEAST(
    //                 COALESCE(NULLIF(CAST(REPLACE(a.hours_worked, ' hrs', '') AS DECIMAL(5, 2)), ''), 0),
    //                 COALESCE(NULLIF(CAST(REPLACE(u.wednesday, ' hrs', '') AS DECIMAL(5, 2)), ''), 0)
    //             ) ELSE 0 END) AS total_wednesday,
    //             SUM(CASE WHEN DAYNAME(STR_TO_DATE(SUBSTRING_INDEX(a.date, ' ', 1), '%m/%d/%Y')) = 'Thursday' THEN LEAST(
    //                 COALESCE(NULLIF(CAST(REPLACE(a.hours_worked, ' hrs', '') AS DECIMAL(5, 2)), ''), 0),
    //                 COALESCE(NULLIF(CAST(REPLACE(u.thursday, ' hrs', '') AS DECIMAL(5, 2)), ''), 0)
    //             ) ELSE 0 END) AS total_thursday,
    //             SUM(CASE WHEN DAYNAME(STR_TO_DATE(SUBSTRING_INDEX(a.date, ' ', 1), '%m/%d/%Y')) = 'Friday' THEN LEAST(
    //                 COALESCE(NULLIF(CAST(REPLACE(a.hours_worked, ' hrs', '') AS DECIMAL(5, 2)), ''), 0),
    //                 COALESCE(NULLIF(CAST(REPLACE(u.friday, ' hrs', '') AS DECIMAL(5, 2)), ''), 0)
    //             ) ELSE 0 END) AS total_friday,
    //             SUM(CASE WHEN DAYNAME(STR_TO_DATE(SUBSTRING_INDEX(a.date, ' ', 1), '%m/%d/%Y')) = 'Saturday' THEN LEAST(
    //                 COALESCE(NULLIF(CAST(REPLACE(a.hours_worked, ' hrs', '') AS DECIMAL(5, 2)), ''), 0),
    //                 COALESCE(NULLIF(CAST(REPLACE(u.saturday, ' hrs', '') AS DECIMAL(5, 2)), ''), 0)
    //             ) ELSE 0 END) AS total_saturday
    //         ")
    //         )
    //         ->groupBy('fr.faculty_id', 'f.first_name', 'f.last_name', 'fr.rate_value')
    //         ->get();

    //     if ($facultyPayroll->isEmpty()) {
    //         return response()->json(['message' => 'No payroll records found for the selected faculties.'], 404);
    //     }

    //     $response = $facultyPayroll->map(function ($faculty) {
    //         return [
    //             'faculty_id' => $faculty->faculty_id,
    //             'full_name' => $faculty->full_name,
    //             'rate_value' => $faculty->rate_value,
    //             'total_monday' => $faculty->total_monday,
    //             'total_tuesday' => $faculty->total_tuesday,
    //             'total_wednesday' => $faculty->total_wednesday,
    //             'total_thursday' => $faculty->total_thursday,
    //             'total_friday' => $faculty->total_friday,
    //             'total_saturday' => $faculty->total_saturday,
    //         ];
    //     });

    //     return response()->json($response);
    // } 

    public function getPartTimeFacultyPayroll(Request $request)
    { 
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
 
        if (!$startDate || !$endDate) {
            return response()->json(['message' => 'Invalid input. Please provide start and end dates.'], 400);
        }
 
        try {
            $startDate = \Carbon\Carbon::parse($startDate)->format('Y-m-d');
            $endDate = \Carbon\Carbon::parse($endDate)->format('Y-m-d');
        } catch (\Exception $e) {
            return response()->json(['message' => 'Invalid date format. Please use a valid date format.'], 400);
        }

        $facultyPayroll = DB::table('faculty_rates as fr')
            ->join('faculty as f', 'fr.faculty_id', '=', 'f.id')
            ->join('unit as u', 'fr.faculty_id', '=', 'u.faculty_id')
            ->join('employment as e', function ($join) {
                $join->on('fr.faculty_id', '=', 'e.faculty_id')
                     ->where('e.employment_type', 'part_time');
            })
            ->leftJoin('attendance as a', 'fr.faculty_id', '=', 'a.faculty_id')
            ->leftJoin('schedule as s', function ($join) {
                $join->on('a.faculty_id', '=', 's.faculty_id')
                     ->whereRaw('STR_TO_DATE(SUBSTRING_INDEX(a.date, " ", 1), "%m/%d/%Y") BETWEEN s.date_from AND s.date_to');
            })
            ->whereRaw('STR_TO_DATE(SUBSTRING_INDEX(a.date, " ", 1), "%m/%d/%Y") BETWEEN ? AND ?', [$startDate, $endDate])
            ->select(
                'fr.faculty_id',
                DB::raw('CONCAT(f.first_name, " ", f.last_name) AS full_name'),
                'fr.rate_value',
 
                DB::raw('SUM(CASE WHEN DAYNAME(STR_TO_DATE(SUBSTRING_INDEX(a.date, " ", 1), "%m/%d/%Y")) = "Monday" THEN LEAST(COALESCE(NULLIF(CAST(REPLACE(a.hours_worked, " hrs", "") AS DECIMAL(5, 2)), 0)), COALESCE(NULLIF(CAST(REPLACE(u.monday, " hrs", "") AS DECIMAL(5, 2)), 0))) ELSE 0 END) AS total_monday'),
                DB::raw('SUM(CASE WHEN DAYNAME(STR_TO_DATE(SUBSTRING_INDEX(a.date, " ", 1), "%m/%d/%Y")) = "Tuesday" THEN LEAST(COALESCE(NULLIF(CAST(REPLACE(a.hours_worked, " hrs", "") AS DECIMAL(5, 2)), 0)), COALESCE(NULLIF(CAST(REPLACE(u.tuesday, " hrs", "") AS DECIMAL(5, 2)), 0))) ELSE 0 END) AS total_tuesday'),
                DB::raw('SUM(CASE WHEN DAYNAME(STR_TO_DATE(SUBSTRING_INDEX(a.date, " ", 1), "%m/%d/%Y")) = "Wednesday" THEN LEAST(COALESCE(NULLIF(CAST(REPLACE(a.hours_worked, " hrs", "") AS DECIMAL(5, 2)), 0)), COALESCE(NULLIF(CAST(REPLACE(u.wednesday, " hrs", "") AS DECIMAL(5, 2)), 0))) ELSE 0 END) AS total_wednesday'),
                DB::raw('SUM(CASE WHEN DAYNAME(STR_TO_DATE(SUBSTRING_INDEX(a.date, " ", 1), "%m/%d/%Y")) = "Thursday" THEN LEAST(COALESCE(NULLIF(CAST(REPLACE(a.hours_worked, " hrs", "") AS DECIMAL(5, 2)), 0)), COALESCE(NULLIF(CAST(REPLACE(u.thursday, " hrs", "") AS DECIMAL(5, 2)), 0))) ELSE 0 END) AS total_thursday'),
                DB::raw('SUM(CASE WHEN DAYNAME(STR_TO_DATE(SUBSTRING_INDEX(a.date, " ", 1), "%m/%d/%Y")) = "Friday" THEN LEAST(COALESCE(NULLIF(CAST(REPLACE(a.hours_worked, " hrs", "") AS DECIMAL(5, 2)), 0)), COALESCE(NULLIF(CAST(REPLACE(u.friday, " hrs", "") AS DECIMAL(5, 2)), 0))) ELSE 0 END) AS total_friday'),
                DB::raw('SUM(CASE WHEN DAYNAME(STR_TO_DATE(SUBSTRING_INDEX(a.date, " ", 1), "%m/%d/%Y")) = "Saturday" THEN LEAST(COALESCE(NULLIF(CAST(REPLACE(a.hours_worked, " hrs", "") AS DECIMAL(5, 2)), 0)), COALESCE(NULLIF(CAST(REPLACE(u.saturday, " hrs", "") AS DECIMAL(5, 2)), 0))) ELSE 0 END) AS total_saturday'),
 
                DB::raw('SEC_TO_TIME(SUM(CASE WHEN STR_TO_DATE(a.time_in, "%h:%i %p") > s.time_start THEN TIMESTAMPDIFF(SECOND, s.time_start, STR_TO_DATE(a.time_in, "%h:%i %p")) ELSE 0 END)) AS total_late_time')
            )
            ->groupBy('fr.faculty_id', 'f.first_name', 'f.last_name', 'fr.rate_value')
            ->get();

        if ($facultyPayroll->isEmpty()) {
            return response()->json(['message' => 'No payroll records found for the selected faculties.'], 404);
        }
 
        $response = $facultyPayroll->map(function ($faculty) {
            return [
                'faculty_id' => $faculty->faculty_id,
                'full_name' => $faculty->full_name,
                'rate_value' => $faculty->rate_value,
                'total_monday' => $faculty->total_monday,
                'total_tuesday' => $faculty->total_tuesday,
                'total_wednesday' => $faculty->total_wednesday,
                'total_thursday' => $faculty->total_thursday,
                'total_friday' => $faculty->total_friday,
                'total_saturday' => $faculty->total_saturday,
                'total_late_time' => $faculty->total_late_time,
            ];
        });

        return response()->json($response);
    }
    
    public function getPTRegularPayroll(Request $request)
    { 
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
 
        if (!$startDate || !$endDate) {
            return response()->json(['message' => 'Invalid input. Please provide start and end dates.'], 400);
        }
 
        try {
            $startDate = \Carbon\Carbon::parse($startDate)->format('Y-m-d');
            $endDate = \Carbon\Carbon::parse($endDate)->format('Y-m-d');
        } catch (\Exception $e) {
            return response()->json(['message' => 'Invalid date format. Please use a valid date format.'], 400);
        }

        $facultyPayroll = DB::table('faculty_rates as fr')
            ->join('faculty as f', 'fr.faculty_id', '=', 'f.id')
            ->join('unit as u', 'fr.faculty_id', '=', 'u.faculty_id')
            ->join('employment as e', function ($join) {
                $join->on('fr.faculty_id', '=', 'e.faculty_id')
                     ->where('e.employment_type', 'part_time_regular');
            })
            ->leftJoin('attendance as a', 'fr.faculty_id', '=', 'a.faculty_id')
            ->leftJoin('schedule as s', function ($join) {
                $join->on('a.faculty_id', '=', 's.faculty_id')
                     ->whereRaw('STR_TO_DATE(SUBSTRING_INDEX(a.date, " ", 1), "%m/%d/%Y") BETWEEN s.date_from AND s.date_to');
            })
            ->whereRaw('STR_TO_DATE(SUBSTRING_INDEX(a.date, " ", 1), "%m/%d/%Y") BETWEEN ? AND ?', [$startDate, $endDate])
            ->select(
                'fr.faculty_id',
                DB::raw('CONCAT(f.first_name, " ", f.last_name) AS full_name'),
                'fr.rate_value',
 
                DB::raw('SUM(CASE WHEN DAYNAME(STR_TO_DATE(SUBSTRING_INDEX(a.date, " ", 1), "%m/%d/%Y")) = "Monday" THEN LEAST(COALESCE(NULLIF(CAST(REPLACE(a.hours_worked, " hrs", "") AS DECIMAL(5, 2)), 0)), COALESCE(NULLIF(CAST(REPLACE(u.monday, " hrs", "") AS DECIMAL(5, 2)), 0))) ELSE 0 END) AS total_monday'),
                DB::raw('SUM(CASE WHEN DAYNAME(STR_TO_DATE(SUBSTRING_INDEX(a.date, " ", 1), "%m/%d/%Y")) = "Tuesday" THEN LEAST(COALESCE(NULLIF(CAST(REPLACE(a.hours_worked, " hrs", "") AS DECIMAL(5, 2)), 0)), COALESCE(NULLIF(CAST(REPLACE(u.tuesday, " hrs", "") AS DECIMAL(5, 2)), 0))) ELSE 0 END) AS total_tuesday'),
                DB::raw('SUM(CASE WHEN DAYNAME(STR_TO_DATE(SUBSTRING_INDEX(a.date, " ", 1), "%m/%d/%Y")) = "Wednesday" THEN LEAST(COALESCE(NULLIF(CAST(REPLACE(a.hours_worked, " hrs", "") AS DECIMAL(5, 2)), 0)), COALESCE(NULLIF(CAST(REPLACE(u.wednesday, " hrs", "") AS DECIMAL(5, 2)), 0))) ELSE 0 END) AS total_wednesday'),
                DB::raw('SUM(CASE WHEN DAYNAME(STR_TO_DATE(SUBSTRING_INDEX(a.date, " ", 1), "%m/%d/%Y")) = "Thursday" THEN LEAST(COALESCE(NULLIF(CAST(REPLACE(a.hours_worked, " hrs", "") AS DECIMAL(5, 2)), 0)), COALESCE(NULLIF(CAST(REPLACE(u.thursday, " hrs", "") AS DECIMAL(5, 2)), 0))) ELSE 0 END) AS total_thursday'),
                DB::raw('SUM(CASE WHEN DAYNAME(STR_TO_DATE(SUBSTRING_INDEX(a.date, " ", 1), "%m/%d/%Y")) = "Friday" THEN LEAST(COALESCE(NULLIF(CAST(REPLACE(a.hours_worked, " hrs", "") AS DECIMAL(5, 2)), 0)), COALESCE(NULLIF(CAST(REPLACE(u.friday, " hrs", "") AS DECIMAL(5, 2)), 0))) ELSE 0 END) AS total_friday'),
                DB::raw('SUM(CASE WHEN DAYNAME(STR_TO_DATE(SUBSTRING_INDEX(a.date, " ", 1), "%m/%d/%Y")) = "Saturday" THEN LEAST(COALESCE(NULLIF(CAST(REPLACE(a.hours_worked, " hrs", "") AS DECIMAL(5, 2)), 0)), COALESCE(NULLIF(CAST(REPLACE(u.saturday, " hrs", "") AS DECIMAL(5, 2)), 0))) ELSE 0 END) AS total_saturday'),
 
                DB::raw('SEC_TO_TIME(SUM(CASE WHEN STR_TO_DATE(a.time_in, "%h:%i %p") > s.time_start THEN TIMESTAMPDIFF(SECOND, s.time_start, STR_TO_DATE(a.time_in, "%h:%i %p")) ELSE 0 END)) AS total_late_time')
            )
            ->groupBy('fr.faculty_id', 'f.first_name', 'f.last_name', 'fr.rate_value')
            ->get();

        if ($facultyPayroll->isEmpty()) {
            return response()->json(['message' => 'No payroll records found for the selected faculties.'], 404);
        }
 
        $response = $facultyPayroll->map(function ($faculty) {
            return [
                'faculty_id' => $faculty->faculty_id,
                'full_name' => $faculty->full_name,
                'rate_value' => $faculty->rate_value,
                'total_monday' => $faculty->total_monday,
                'total_tuesday' => $faculty->total_tuesday,
                'total_wednesday' => $faculty->total_wednesday,
                'total_thursday' => $faculty->total_thursday,
                'total_friday' => $faculty->total_friday,
                'total_saturday' => $faculty->total_saturday,
                'total_late_time' => $faculty->total_late_time,
            ];
        });

        return response()->json($response);
    }
    


}
