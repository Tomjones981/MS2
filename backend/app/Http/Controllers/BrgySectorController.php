<?php

namespace App\Http\Controllers;
use App\Models\Brgy_Sectors;
use Illuminate\Http\Request;

class BrgySectorController extends Controller
{
    public function createSector(Request $request)
    {
        $request->validate([
            'sector_name' => 'required|unique:brgy_sectors,sector_name,NULL,id,year_id,' . $request->year_id
        ], [
            'sector_name.unique' => 'Sector name already exists.'
        ]);
    
        $sector = Brgy_Sectors::create([
            'year_id' => $request->year_id,
            'sector_name' => $request->sector_name
        ]);
    
        return response()->json([
            'message' => 'Sector Name Created Successfully!',
            'sectorName' => $sector,
        ], 201);
    }
    


    public function getSectorsByYear($year_id)
    {
        $sectors = Brgy_Sectors::where('year_id', $year_id)->get();
        return response()->json($sectors);
    }

}
