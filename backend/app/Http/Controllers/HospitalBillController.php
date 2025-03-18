<?php

namespace App\Http\Controllers;

use App\Models\Hospital_Bill;
use App\Exports\HospitalBillExport;
use App\Imports\Hospital_Bill_Import;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class HospitalBillController extends Controller
{
    public function createHospitalInfo(Request $request)
    {
        $validatedData = $request->validate([
            'date' => 'required|date',
            'name' => 'required|string|max:255',
            'age' => 'nullable|string|max:255',
            'address' => 'required|string|max:255',
            'beneficiary_name' => 'required|string|max:255',
            'hospital_name' => 'required|string|max:255',
            'amount' => 'required|string|max:255',
        ]);

        $logbook = Hospital_Bill::create($validatedData);

        return response()->json([
            'message' => 'Hospital Entry Created Successfully',
            'logbook' => $logbook
        ], 201);
    }

    public function fetchHospitalBillData()
    {
        return response()->json(Hospital_Bill::all());
    }

    public function updateHospitalBill(Request $request, $id)
    {
        $validatedData = $request->validate([
            'date' => 'required|date',
            'name' => 'required|string|max:255',
            'age' => 'nullable|string|max:255',
            'address' => 'required|string|max:255',
            'beneficiary_name' => 'required|string|max:255',
            'hospital_name' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0'
        ]);

        $logBookHospital = Hospital_Bill::find($id);

        if (!$logBookHospital) {
            return response()->json([
                'message' => 'Logbook Hosptial entry not found'
            ], 404);
        }

        $logBookHospital->update($validatedData);

        return response()->json([
            'message' => 'Logbook Hosptial entry updated successfully',
            'logBookHospital' => $logBookHospital
        ], 200);
    }

    public function exportHospitalBillInfo()
    {
        return Excel::download(new HospitalBillExport, 'hospital_bill.xlsx');
    }

    public function importHospitalBillInfo(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,csv',
        ]);

        try {
            Excel::import(new Hospital_Bill_Import, $request->file('file'));

            return response()->json(['message' => 'Data imported successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error importing data: ' . $e->getMessage()], 500);
        }
    }

    public function getTotalAmountHospitalBill(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $totalAmount = DB::table('logbook_hospital_bill')
            ->whereBetween('date', [$request->start_date, $request->end_date])
            ->sum(DB::raw("CAST(REPLACE(amount, ',', '') AS DECIMAL(10,2))"));

        return response()->json(['total_amount' => $totalAmount]);
    }


    // public function fetchLogBookData()
    // {
    //     return response()->json(LogBook::all());
    // }
}
