<?php

namespace App\Exports;

use App\Models\OpolCdc;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;

class CdcExport implements FromCollection, WithHeadings, WithTitle, WithMapping, WithEvents
{
    protected $barangay;
    private $rowNumber = 0;

    public function __construct($barangay)
    {
        $this->barangay = $barangay;
    }

    public function collection()
    {
        $data = OpolCdc::where('barangay', $this->barangay)
        ->select([
            'last_name', 'first_name', 'middle_name', 'birthday', 'barangay', 
            'M', 'F', 'months_old', '1_11_yrs_old', '2_11_yrs_old', 
            '3_11_yrs_old', '4_11_yrs_old', '5_yrs_old', 'pwd'
        ])->get();

    if ($data->isEmpty()) {
        throw new \Exception("No data found for barangay: " . $this->barangay);
    }

    return $data;
    }

    public function headings(): array
    {
        return [
            ['BARANGAY ' . strtoupper($this->barangay)],  
            ['MUNICIPALITY OF OPOL'],  
            ['MUNICIPAL SOCIAL WELFARE AND DEVELOPMENT OFFICE'],  
            ['CHILDREN 3-4 YEARS OLD'],  
            ['C.Y. 2024'],  
            ['','No', 'Last Name', 'First Name', 'Middle Name', 'Birthday', 'Barangay', 'M', 'F', 'Months Old', '1.11 Years Old', '2.11 Years Old', '3.11 Years Old', '4.11 Years Old', '5 Years Old', 'PWD']
        ];
    }

    public function title(): string
    {
        // return preg_replace('/[\/:*?"<>|]/', '', strtoupper($this->barangay));
        return preg_replace('/[\/:*?"<>|]/', '', strtoupper($this->barangay)) ?: 'Sheet1';
    }

    public function map($row): array
    {
        return [
            '',
            ++$this->rowNumber,  
            (string) ($row->last_name ?? ''),
            (string) ($row->first_name ?? ''),
            (string) ($row->middle_name ?? ''),
            (string) ($row->birthday ?? ''),
            (string) ($row->barangay ?? ''),
            (string) ($row->M ?? ''),
            (string) ($row->F ?? ''), 
            (string) ($row->months_old ?? ''), 
            (string) ($row->{'1_11_yrs_old'} ?? ''), 
            (string) ($row->{'2_11_yrs_old'} ?? ''), 
            (string) ($row->{'3_11_yrs_old'} ?? ''), 
            (string) ($row->{'4_11_yrs_old'} ?? ''), 
            (string) ($row->{'5_yrs_old'} ?? ''),  
            (string) ($row->pwd ?? ''),
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                // Merge and style the title row
                $event->sheet->mergeCells('A1:O1');
                $event->sheet->setCellValue('A1', 'BARANGAY ' . strtoupper($this->barangay)); 
                $event->sheet->mergeCells('A2:O2');
                $event->sheet->mergeCells('A3:O3');
                $event->sheet->mergeCells('A4:O4');
                $event->sheet->getStyle('A1')->getFont()->setBold(true)->setSize(14);
                $event->sheet->getRowDimension(1)->setRowHeight(20);
                
                $event->sheet->getStyle('A3:O3')->getFont()->setBold(true);
            },
        ];
    }
}
