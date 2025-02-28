<?php

namespace App\Exports;

use App\Models\Personal_Info;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;

class PWD_BarangayPersonSheet_Export implements FromCollection, WithHeadings, WithTitle, WithMapping, WithEvents
{
    protected $barangay;
    private $rowNumber = -1;  // Start from 0 so first row is 1

    public function __construct($barangay)
    {
        $this->barangay = $barangay;
    }

    public function collection()
    {
        return Personal_Info::where('barangay', $this->barangay)
            ->select('name', 'barangay', 'disability', 'birthday', 'sex', 'id_number', 'blood_type', 'age')
            ->get();
    }

    public function headings(): array
    {
        return [
            ['1'], // First empty row
            [' '], // Title row
            ['NO', 'NAME', 'BARANGAY', 'DISABILITY', 'BIRTHDAY', 'SEX', 'ID NO', 'B.TYPE', 'AGE'] // Headers
        ];
    }

    public function title(): string
    {
        return $this->barangay;
    }

    public function map($row): array
    {
        return [
            ++$this->rowNumber, // Ensures the first row is "1"
            $row->name,
            $row->barangay,
            $row->disability,
            $row->birthday,
            $row->sex,
            $row->id_number,
            $row->blood_type,
            $row->age,
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function(AfterSheet $event) {
                // Merge title row across columns
                $event->sheet->mergeCells('A1:I1'); 
                $event->sheet->setCellValue('A1', 'BARANGAY ' . $this->barangay);  
                $event->sheet->getStyle('A1')->getFont()->setBold(true)->setSize(14);
                $event->sheet->getRowDimension(1)->setRowHeight(20);
            },
        ];
    }
}
