<?php

namespace App\Http\Controllers;

use App\Models\GeneratedPayroll;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Http\Request;

class GeneratedPayrollController extends Controller
{
    // public function saveGeneratedFullTimePayroll(Request $request)
    // {
    //     $validatedData = $request->validate([
    //         'faculty_id' => 'required|exists:faculty,id',
    //         'date_from' => 'required|date',
    //         'date_to' => 'required|date',
    //         'hours_or_days' => 'required|string',
    //         'gross_amount' => 'required|numeric',
    //         'late' => 'required|string',
    //         'tax' => 'required|numeric',
    //         'netpay' => 'required|numeric',
    //         'payroll_type' => 'required|string|in:ft_payroll,pt_payroll,el_payroll,ptr_payroll,ph_payroll',
    //     ]);

    //     GeneratedPayroll::create($validatedData);

    //     return response()->json(['message' => 'Payroll data saved successfully.'], 201);
    // }


    public function saveGeneratedFullTimePayroll(Request $request)
    {
        $payrollData = $request->input('payroll_data');

        if (is_null($payrollData) || !is_array($payrollData)) {
            return response()->json(['error' => 'Invalid payroll data provided.'], 400);
        }

        $currentTimestamp = Carbon::now();
        foreach ($payrollData as &$data) {
            $data['created_at'] = $currentTimestamp;
            $data['updated_at'] = $currentTimestamp;
        }

        try {
            DB::table('generated_payroll')->insert($payrollData);  
            return response()->json(['message' => 'Payroll records saved successfully.'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function checkExistingPayroll(Request $request)
    {
        $dateFrom = $request->input('date_from');
        $dateTo = $request->input('date_to');
        $payrollType = $request->input('payroll_type');

        $existingPayrolls = DB::table('generated_payroll')
            ->where('date_from', $dateFrom)
            ->where('date_to', $dateTo)
            ->where('payroll_type', $payrollType)
            ->get(['faculty_id']);

        return response()->json($existingPayrolls);
    }


    // public function getPayrollHistory(Request $request)
    // {
    //     $dateFrom = $request->input('date_from');
    //     $dateTo = $request->input('date_to');
    //     $payrollType = $request->input('payroll_type', 'ft_payroll');

    //     $data = DB::table('faculty AS f')
    //         ->join('department AS d', 'f.department_id', '=', 'd.id')
    //         ->leftJoin('faculty_rates AS fr', 'f.id', '=', 'fr.faculty_id')
    //         ->leftJoin('generated_payroll AS gp', 'f.id', '=', 'gp.faculty_id')
    //         ->where('gp.payroll_type', 'ft_payroll')
    //         ->whereBetween('gp.date_from', [$dateFrom, $dateTo])
    //         ->select(
    //             'f.id AS faculty_id',
    //             'f.first_name',
    //             'f.last_name',
    //             'fr.rate_type',
    //             'fr.rate_value',
    //             'gp.date_from',
    //             'gp.date_to',
    //             'gp.hours_or_days',
    //             'gp.gross_amount',
    //             'gp.late',
    //             'gp.tax',
    //             'gp.netpay',
    //             'gp.payroll_type'
    //         )
    //         ->get();

    //     return response()->json($data);
    // }



    public function getPayrollFullTimeHistory(Request $request)
    {
        $dateFrom = $request->input('date_from');
        $dateTo = $request->input('date_to');

        $data = DB::table('faculty AS f')
            ->join('department AS d', 'f.department_id', '=', 'd.id')
            ->leftJoin('faculty_rates AS fr', 'f.id', '=', 'fr.faculty_id')
            ->leftJoin('generated_payroll AS gp', 'f.id', '=', 'gp.faculty_id')
            ->where('gp.payroll_type', 'ft_payroll')
            ->where('gp.date_from', '>=', $dateFrom)
            ->where('gp.date_to', '<=', $dateTo)
            ->select(
                'f.id AS faculty_id',
                DB::raw('CONCAT(f.last_name, " ", f.first_name) AS full_name'),
                'fr.rate_type',
                'fr.rate_value',
                'gp.date_from',
                'gp.date_to',
                'gp.hours_or_days',
                'gp.gross_amount',
                'gp.late',
                'gp.tax',
                'gp.netpay',
                'gp.payroll_type',
                DB::raw('CASE 
                WHEN fr.rate_value = 150 THEN 15000 
                WHEN fr.rate_value = 170 THEN 17000 
                WHEN fr.rate_value = 250 THEN 20000 
                WHEN fr.rate_value = 350 THEN 25000 
                ELSE 0 
            END AS monthly_rate')
            )
            ->orderBy('full_name', 'ASC')
            ->get();

        return response()->json($data);
    }
    public function getPayrollPartTimeHistory(Request $request)
    {
        $dateFrom = $request->input('date_from');
        $dateTo = $request->input('date_to');

        $data = DB::table('faculty AS f')
            ->join('department AS d', 'f.department_id', '=', 'd.id')
            ->leftJoin('faculty_rates AS fr', 'f.id', '=', 'fr.faculty_id')
            ->leftJoin('generated_payroll AS gp', 'f.id', '=', 'gp.faculty_id')
            ->where('gp.payroll_type', 'pt_payroll')
            ->where('gp.date_from', '>=', $dateFrom)
            ->where('gp.date_to', '<=', $dateTo)
            ->select(
                'f.id AS faculty_id',
                DB::raw('CONCAT(f.last_name, " ", f.first_name) AS full_name'),
                'fr.rate_type',
                'fr.rate_value',
                'gp.date_from',
                'gp.date_to',
                'gp.hours_or_days',
                'gp.gross_amount',
                'gp.late',
                'gp.tax',
                'gp.netpay',
                'gp.payroll_type',
                DB::raw('CASE 
                WHEN fr.rate_value = 150 THEN 15000 
                WHEN fr.rate_value = 170 THEN 17000 
                WHEN fr.rate_value = 250 THEN 20000 
                WHEN fr.rate_value = 350 THEN 25000 
                ELSE 0 
            END AS monthly_rate')
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
            ->where('gp.payroll_type', 'ptr_payroll')
            ->where('gp.date_from', '>=', $dateFrom)
            ->where('gp.date_to', '<=', $dateTo)
            ->select(
                'f.id AS faculty_id',
                DB::raw('CONCAT(f.last_name, " ", f.first_name) AS full_name'),
                'fr.rate_type',
                'fr.rate_value',
                'gp.date_from',
                'gp.date_to',
                'gp.hours_or_days',
                'gp.gross_amount',
                'gp.late',
                'gp.tax',
                'gp.netpay',
                'gp.payroll_type',
                DB::raw('CASE 
                WHEN fr.rate_value = 150 THEN 15000 
                WHEN fr.rate_value = 170 THEN 17000 
                WHEN fr.rate_value = 250 THEN 20000 
                WHEN fr.rate_value = 350 THEN 25000 
                ELSE 0 
            END AS monthly_rate')
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
            ->where('gp.payroll_type', 'ph_payroll')
            ->where('gp.date_from', '>=', $dateFrom)
            ->where('gp.date_to', '<=', $dateTo)
            ->select(
                'f.id AS faculty_id',
                DB::raw('CONCAT(f.last_name, " ", f.first_name) AS full_name'),
                'fr.rate_type',
                'fr.rate_value',
                'gp.date_from',
                'gp.date_to',
                'gp.hours_or_days',
                'gp.gross_amount',
                'gp.late',
                'gp.tax',
                'gp.netpay',
                'gp.payroll_type',
                DB::raw('CASE 
                WHEN fr.rate_value = 150 THEN 15000 
                WHEN fr.rate_value = 170 THEN 17000 
                WHEN fr.rate_value = 250 THEN 20000 
                WHEN fr.rate_value = 350 THEN 25000 
                ELSE 0 
            END AS monthly_rate')
            )
            ->orderBy('full_name', 'ASC')
            ->get();

        return response()->json($data);
    }



}
