<?php

namespace App\Imports;

use App\Models\Schedule;
use App\Models\Faculty;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Carbon;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class ScheduleImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        Log::info('Processing row: ' . json_encode($row));
 
        $faculty = Faculty::firstOrCreate(
            [
                'first_name' => ucfirst(strtolower($row['faculty_first_name'] ?? '')),
                'last_name' => ucfirst(strtolower($row['faculty_last_name'] ?? '')),
            ],
            [
                'designation' => 'full_time',
                'status' => 'active',
            ]
        );

        try {
            $dateFrom = \PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($row['date_from'] ?? '');
            $dateFromFormatted = Carbon::instance($dateFrom)->toDateString();

            $dateTo = \PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($row['date_to'] ?? '');
            $dateToFormatted = Carbon::instance($dateTo)->toDateString();
        } catch (\Exception $e) {
            Log::error('Error parsing date: ' . $e->getMessage());
            return null; 
        }
 
        $timeStart = isset($row['time_start']) ? $this->decimalToTime($row['time_start']) : null;
        $timeEnd = isset($row['time_end']) ? $this->decimalToTime($row['time_end']) : null;

        // Check for existing schedules
        $existingSchedules = Schedule::where('faculty_id', $faculty->id)
            ->whereDate('date_from', $dateFromFormatted)
            ->get();

        foreach ($existingSchedules as $existingSchedule) {
            // Determine if the loading types are compatible
            if ($existingSchedule->loading === $row['loading']) {
                if ($this->isOverlapping($existingSchedule->time_start, $existingSchedule->time_end, $timeStart, $timeEnd)) {
                    Log::info('Conflict found for faculty: ' . $faculty->id . ', date: ' . $dateFromFormatted . ' during time: ' . $timeStart . ' - ' . $timeEnd);
                    return null;  
                }
            }
        }

        return new Schedule([
            'faculty_id' => $faculty->id,
            'date_from' => $dateFromFormatted,
            'date_to' => $dateToFormatted,
            'time_start' => $timeStart,
            'time_end' => $timeEnd,
            'loading' => $row['loading'] ?? null,
        ]);
    }

    /**
     * Check if two time intervals overlap.
     *
     * @param string $startA
     * @param string $endA
     * @param string $startB
     * @param string $endB
     * @return bool
     */
    protected function isOverlapping($startA, $endA, $startB, $endB)
    {
        return ($startA < $endB && $endA > $startB);
    }

    /**
     * Convert decimal representation of time to H:i:s format.
     *
     * @param float $decimalTime
     * @return string
     */
    protected function decimalToTime(float $decimalTime): string
    {
        $hours = (int)($decimalTime * 24);
        $minutes = (int)(($decimalTime * 24 - $hours) * 60);
        $seconds = (int)((($decimalTime * 24 - $hours) * 60 - $minutes) * 60);

        return sprintf('%02d:%02d:%02d', $hours, $minutes, $seconds);
    }
}
