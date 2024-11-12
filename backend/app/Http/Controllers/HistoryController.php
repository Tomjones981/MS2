<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HistoryController extends Controller
{
    public function getPayrollPartTimeHistory(Request $request)
    {
        $dateFrom = $request->input('date_from');
        $dateTo = $request->input('date_to');

        $data = DB::table('faculty AS f')
            ->join('department AS d', 'f.department_id', '=', 'd.id')
            ->leftJoin('faculty_rates AS fr', 'f.id', '=', 'fr.faculty_id')
            ->leftJoin('generated_payroll AS gp', 'f.id', '=', 'gp.faculty_id')
            ->leftJoin('adjustment_payroll AS ap', 'gp.id', '=', 'ap.generated_payroll_id')
            ->where('gp.payroll_type', 'pt_payroll')
            ->where('gp.date_from', '>=', $dateFrom)
            ->where('gp.date_to', '<=', $dateTo)
            ->select(
                'gp.id',
                'f.id AS faculty_id',
                DB::raw('CONCAT(f.last_name, " ", f.first_name) AS full_name'),
                'fr.rate_type',
                'fr.rate_value',
                'gp.date_from',
                'gp.date_to',
                'gp.hours_or_days',
                'gp.gross_amount',
                DB::raw('DATE_FORMAT(gp.late, "%H:%i") AS late'),
                'gp.tax',
                'gp.netpay',
                'gp.payroll_type',
                'ap.adjustment',
                'ap.adjusted_netpay',
                DB::raw('CASE 
                WHEN fr.rate_value = 150 THEN 15000 
                WHEN fr.rate_value = 170 THEN 17000 
                WHEN fr.rate_value = 250 THEN 20000 
                WHEN fr.rate_value = 350 THEN 25000 
                ELSE 0 
            END AS monthly_rate'),
                DB::raw('
                CASE 
                    WHEN gp.late IS NULL OR gp.late = "" THEN 0
                    ELSE (TIME_TO_SEC(gp.late) / 60) * fr.rate_value / 60 
                END AS late_amount
            ')
            )
            ->orderBy('full_name', 'ASC')
            ->get();

        return response()->json($data);
    }

    public function getPayrollFullTimeHistory(Request $request)
    {
        $dateFrom = $request->input('date_from');
        $dateTo = $request->input('date_to');

        $data = DB::table('faculty AS f')
            ->join('department AS d', 'f.department_id', '=', 'd.id')
            ->leftJoin('faculty_rates AS fr', 'f.id', '=', 'fr.faculty_id')
            ->leftJoin('generated_payroll AS gp', 'f.id', '=', 'gp.faculty_id')
            ->leftJoin('adjustment_payroll AS ap', 'gp.id', '=', 'ap.generated_payroll_id')
            ->where('gp.payroll_type', 'ft_payroll')
            ->where('gp.date_from', '>=', $dateFrom)
            ->where('gp.date_to', '<=', $dateTo)
            ->select(
                'gp.id',
                'f.id AS faculty_id',
                DB::raw('CONCAT(f.last_name, " ", f.first_name) AS full_name'),
                'fr.rate_type',
                'fr.rate_value',
                'gp.date_from',
                'gp.date_to',
                'gp.hours_or_days',
                'gp.gross_amount',
                DB::raw('DATE_FORMAT(gp.late, "%H:%i") AS late'),
                'gp.tax',
                'gp.netpay',
                'gp.payroll_type',
                'ap.adjustment',
                'ap.adjusted_netpay',
                DB::raw('CASE 
                WHEN fr.rate_value = 150 THEN 15000 
                WHEN fr.rate_value = 170 THEN 17000 
                WHEN fr.rate_value = 250 THEN 20000 
                WHEN fr.rate_value = 350 THEN 25000 
                ELSE 0 
            END AS monthly_rate'),
                DB::raw('
                CASE 
                    WHEN gp.late IS NULL OR gp.late = "" THEN 0
                    ELSE (TIME_TO_SEC(gp.late) / 60) * fr.rate_value / 60 
                END AS late_amount
            ')
            )
            ->orderBy('full_name', 'ASC')
            ->get();

        return response()->json($data);
    }
    public function getPayrollPartTimeRegularHistory(Request $request)
    {
        $dateFrom = $request->input('date_from');
        $dateTo = $request->input('date_to');

        $data = DB::table('faculty AS f')
            ->join('department AS d', 'f.department_id', '=', 'd.id')
            ->leftJoin('faculty_rates AS fr', 'f.id', '=', 'fr.faculty_id')
            ->leftJoin('generated_payroll AS gp', 'f.id', '=', 'gp.faculty_id')
            ->leftJoin('adjustment_payroll AS ap', 'gp.id', '=', 'ap.generated_payroll_id')
            ->where('gp.payroll_type', 'ptr_payroll')
            ->where('gp.date_from', '>=', $dateFrom)
            ->where('gp.date_to', '<=', $dateTo)
            ->select(
                'gp.id',
                'f.id AS faculty_id',
                DB::raw('CONCAT(f.last_name, " ", f.first_name) AS full_name'),
                'fr.rate_type',
                'fr.rate_value',
                'gp.date_from',
                'gp.date_to',
                'gp.hours_or_days',
                'gp.gross_amount',
                DB::raw('DATE_FORMAT(gp.late, "%H:%i") AS late'),
                'gp.tax',
                'gp.netpay',
                'gp.payroll_type',
                'ap.adjustment',
                'ap.adjusted_netpay',
                DB::raw('CASE 
                WHEN fr.rate_value = 150 THEN 15000 
                WHEN fr.rate_value = 170 THEN 17000 
                WHEN fr.rate_value = 250 THEN 20000 
                WHEN fr.rate_value = 350 THEN 25000 
                ELSE 0 
            END AS monthly_rate'),
                DB::raw('
                CASE 
                    WHEN gp.late IS NULL OR gp.late = "" THEN 0
                    ELSE (TIME_TO_SEC(gp.late) / 60) * fr.rate_value / 60 
                END AS late_amount
            ')
            )
            ->orderBy('full_name', 'ASC')
            ->get();

        return response()->json($data);
    }

    public function getPayrollProgramHeadsHistory(Request $request)
    {
        $dateFrom = $request->input('date_from');
        $dateTo = $request->input('date_to');

        $data = DB::table('faculty AS f')
            ->join('department AS d', 'f.department_id', '=', 'd.id')
            ->leftJoin('faculty_rates AS fr', 'f.id', '=', 'fr.faculty_id')
            ->leftJoin('generated_payroll AS gp', 'f.id', '=', 'gp.faculty_id')
            ->leftJoin('adjustment_payroll AS ap', 'gp.id', '=', 'ap.generated_payroll_id')
            ->where('gp.payroll_type', 'ph_payroll')
            ->where('gp.date_from', '>=', $dateFrom)
            ->where('gp.date_to', '<=', $dateTo)
            ->select(
                'gp.id',
                'f.id AS faculty_id',
                DB::raw('CONCAT(f.last_name, " ", f.first_name) AS full_name'),
                'fr.rate_type',
                'fr.rate_value',
                'gp.date_from',
                'gp.date_to',
                'gp.hours_or_days',
                'gp.gross_amount',
                DB::raw('DATE_FORMAT(gp.late, "%H:%i") AS late'),
                'gp.tax',
                'gp.netpay',
                'gp.payroll_type',
                'ap.adjustment',
                'ap.adjusted_netpay',
                DB::raw('CASE 
                WHEN f.faculty_type = "department_head" AND fr.rate_type = "doctor" THEN 30000
                WHEN f.faculty_type = "department_head" AND fr.rate_value = 275 THEN 30000
                WHEN fr.rate_value = 150 THEN 15000 
                WHEN fr.rate_value = 170 THEN 17000 
                WHEN fr.rate_value = 250 THEN 20000 
                WHEN fr.rate_value = 350 THEN 25000 
                ELSE 0 
            END AS monthly_rate'),
                DB::raw('
                CASE 
                    WHEN gp.late IS NULL OR gp.late = "" THEN 0
                    ELSE (TIME_TO_SEC(gp.late) / 60) * fr.rate_value / 60 
                END AS late_amount
            ')
            )
            ->orderBy('full_name', 'ASC')
            ->get();

        return response()->json($data);
    }




    public function getDateRangesForMonth(Request $request)
    {
        $month = $request->input('month'); // Format: YYYY-MM

        $data = DB::table('generated_payroll')
            ->where('payroll_type', 'pt_payroll')
            ->where(function ($query) use ($month) {
                $query->whereRaw("DATE_FORMAT(date_from, '%Y-%m') = ?", [$month])
                    ->orWhereRaw("DATE_FORMAT(date_to, '%Y-%m') = ?", [$month]);
            })
            ->select('date_from', 'date_to')
            ->distinct() // Ensures unique date ranges
            ->orderBy('date_from')
            ->get();

        return response()->json($data);
    }

}
