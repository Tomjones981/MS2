<?php

namespace App\Http\Controllers;

use App\Models\OpolCdc;
use Illuminate\Http\Request;

class OpolCDCController extends Controller
{
    public function index()
    {
        $opolCdcData = OpolCdc::all();
        return response()->json($opolCdcData);
    }
}
