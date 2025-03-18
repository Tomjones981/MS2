<?php

namespace App\Http\Controllers;

use App\Models\LogBook;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\LogBookExport;
use App\Imports\LogBookImport;
use Illuminate\Support\Facades\DB;
class LogBookController extends Controller
{
    public function createLogBook(Request $request)
    {
        $validatedData = $request->validate([
            'date' => 'required|date',
            'client_name' => 'required|string|max:255',
            'age' => 'nullable|string|max:255',
            'gender' => 'required|string|in:male,female,other',
            'address' => 'nullable|string|max:255',
            'purpose' => 'required|string|in:educational,cash_assistance,medical_assistance,burial_assistance',
            'beneficiary' => 'required|string|in:himself,herself,parent',
            'hospital_or_institutional' => 'required|string|in:cash_assistance,dswd,polimedic,ace,sabal,maria_reyna',
            'contact_number' => 'nullable|string|max:20',
            'amount' => 'nullable|numeric|min:0'
        ]);

        $logBook = LogBook::create($validatedData);

        return response()->json([
            'message' => 'Logbook entry created successfully',
            'logbook' => $logBook
        ], 201);
    }
    public function fetchLogBookData()
    {
        return response()->json(LogBook::all());
    }

    public function updateLogBook(Request $request, $id)
    {
        $validatedData = $request->validate([
            'date' => 'required|date',
            'client_name' => 'required|string|max:255',
            'age' => 'nullable|string|max:255',
            'gender' => 'required|string|in:male,female,other',
            'address' => 'nullable|string|max:255',
            'purpose' => 'required|string|in:educational,cash_assistance,medical_assistance,burial_assistance',
            'beneficiary' => 'required|string|in:himself,herself,parent',
            'hospital_or_institutional' => 'required|string|in:cash_assistance,dswd,polimedic,ace,sabal,maria_reyna',
            'contact_number' => 'nullable|string|max:20',
            'amount' => 'nullable|numeric|min:0'
        ]);

        $logBook = LogBook::find($id);

        if (!$logBook) {
            return response()->json([
                'message' => 'Logbook entry not found'
            ], 404);
        }

        $logBook->update($validatedData);

        return response()->json([
            'message' => 'Logbook entry updated successfully',
            'logbook' => $logBook
        ], 200);
    }
    public function export()
    {
        return Excel::download(new LogBookExport, 'logbook.xlsx');
    }
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,csv',
        ]);

        try {
            Excel::import(new LogBookImport, $request->file('file'));

            return response()->json(['message' => 'Data imported successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error importing data: ' . $e->getMessage()], 500);
        }
    }
    public function getTotalAmountOverAll(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $purposes = ['cash_assistance', 'educational', 'medical_assistance', 'burial_assistance'];

        $totalAmounts = DB::table('log_book')
            ->whereBetween('date', [$request->start_date, $request->end_date])
            ->whereIn('purpose', $purposes)
            ->selectRaw("
            SUM(CASE WHEN purpose = 'cash_assistance' THEN CAST(REPLACE(amount, ',', '') AS DECIMAL(10,2)) ELSE 0 END) as cash_assistance_total,
            SUM(CASE WHEN purpose = 'educational' THEN CAST(REPLACE(amount, ',', '') AS DECIMAL(10,2)) ELSE 0 END) as educational_total,
            SUM(CASE WHEN purpose = 'medical_assistance' THEN CAST(REPLACE(amount, ',', '') AS DECIMAL(10,2)) ELSE 0 END) as medical_assistance_total,
            SUM(CASE WHEN purpose = 'burial_assistance' THEN CAST(REPLACE(amount, ',', '') AS DECIMAL(10,2)) ELSE 0 END) as burial_assistance_total,
            SUM(CAST(REPLACE(amount, ',', '') AS DECIMAL(10,2))) as total_overall
        ")
            ->first();

        return response()->json([
            'cash_assistance' => $totalAmounts->cash_assistance_total,
            'educational' => $totalAmounts->educational_total,
            'medical_assistance' => $totalAmounts->medical_assistance_total,
            'burial_assistance' => $totalAmounts->burial_assistance_total,
            'total_overall' => $totalAmounts->total_overall
        ]);
    }


    // public function getTotalAmountCashAssisstance(Request $request)
    // {
    //     $request->validate([
    //         'start_date' => 'required|date',
    //         'end_date' => 'required|date|after_or_equal:start_date',
    //     ]);

    //     $totalAmount = DB::table('log_book')
    //         ->where('purpose', 'cash_assistance')
    //         ->whereBetween('date', [$request->start_date, $request->end_date])
    //         ->sum(DB::raw("CAST(REPLACE(amount, ',', '') AS DECIMAL(10,2))"));

    //     return response()->json(['total_amount' => $totalAmount]);
    // }






    // public function export()
    // {
    //     $logBooks = LogBook::all();

    //     $csvFileName = "logbook_records.xlsx";
    //     $headers = [
    //         "Content-type" => "text/xlsx",
    //         "Content-Disposition" => "attachment; filename=$csvFileName",
    //         "Pragma" => "no-cache",
    //         "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
    //         "Expires" => "0"
    //     ];

    //     $callback = function () use ($logBooks) {
    //         $file = fopen("php://output", "w");
    //         fputcsv($file, ["Date", "Client Name", "Age", "Gender", "Address", "Purpose", "Beneficiary", "Institution", "Contact Number", "Amount"]);

    //         foreach ($logBooks as $log) {
    //             fputcsv($file, [
    //                 $log->date,
    //                 $log->client_name,
    //                 $log->age,
    //                 $log->gender,
    //                 $log->address,
    //                 $log->purpose,
    //                 $log->beneficiary,
    //                 $log->hospital_or_institutional,
    //                 $log->contact_number,
    //                 $log->amount,
    //             ]);
    //         }
    //         fclose($file);
    //     };

    //     return response()->stream($callback, 200, $headers);
    // }



}
