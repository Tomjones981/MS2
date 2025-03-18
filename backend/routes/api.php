<?php

use App\Http\Controllers\AuthController; 
use App\Http\Controllers\HospitalBillController;
use App\Http\Controllers\OpolCDCController;
use App\Http\Controllers\OpolECCDController;
use App\Http\Controllers\SubCategoryController; 
use App\Http\Controllers\UserController;         
use App\Http\Controllers\PasswordController;   
use App\Http\Controllers\OTPController;
use App\Http\Controllers\LogBookController;
use App\Http\Controllers\YearController;
use App\Http\Controllers\BrgySectorController;
use App\Http\Controllers\PersonalInfoController;
use App\Http\Controllers\PWD\PWDController;
use App\Http\Controllers\PWD\PwdExportController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
 
Route::middleware('auth:sanctum')->post('/change-password', [PasswordController::class, 'changePassword']);
Route::middleware('auth:sanctum')->group(function() {
    Route::post('logout', [AuthController::class,'logout']);
    Route::get('/user', [UserController::class, 'user']);
    Route::apiResource('/users', UserController::class);
    Route::get('/user-profile', [UserController::class,'getUserProfile']);
});
    Route::post('/login', [AuthController::class,'login']);
    Route::post('/send-otp', [OTPController::class,'sendOtp']);
    Route::post('/verify-otp', [OTPController::class,'verifyOtp']);
    Route::post('/validate-credentials', [OTPController::class,'validateCredentials']);
 

    Route::post('/log-book-create', [LogBookController::class,'createLogBook']);
    Route::get('/log-book-fetching', [LogBookController::class,'fetchLogBookData']);
    Route::put('/log-book-update/{id}', [LogBookController::class, 'updateLogBook']);
    Route::get('/logbook-export', [LogBookController::class, 'export']);
    Route::post('/logbook-import', [LogBookController::class, 'import']);
    Route::post('/year-create', [YearController::class,'createYear']);
    Route::get('/year-fetching', [YearController::class,'getAllYears']);
    Route::get('/brgy-sectors/{yearId}', [BrgySectorController::class,'getSectorsByYear']);
    Route::post('/brgy-sectors-create', [BrgySectorController::class,'createSector']);
    Route::get('/brgy-sectors/years/{id}', [YearController::class, 'getYearDate']);
    // Route::get('/brgy-sectors/{year_id}', [BrgySectorController::class,'getSectorsByYear']);

    Route::post('/sub-category-create', [SubCategoryController::class, 'createSubCategory']);
    Route::get('/brgy-sectors/sub-category/{id}', [SubCategoryController::class, 'getSectorsSubCategory']);
    Route::get('/sub-category/{subCatId}', [SubCategoryController::class,'getSubCategoryBySectors']);


    
    Route::get('/brgy-sectors/sub-category/sub-cat-name/{id}', [PersonalInfoController::class, 'getSubCategoryName']);
    Route::get('/sub-category/personal-info/{subCatId}', [PersonalInfoController::class,'getPersonalInfoBySubCategory']);


    
    Route::post('/personal-info-create', [PersonalInfoController::class,'createPersonalInfo']);
    Route::put('/personal-info-update/{id}', [PersonalInfoController::class, 'updatePersonalInfo']);


    
    Route::post('/pwd-import', [PWDController::class, 'importPWDPersonalInfo']);
    Route::get('/pwd-brgy-report-counts', [PWDController::class, 'getPWDBarangayCounts']);
    Route::get('/pwd-brgy-report-view-age-by-gender/{barangay}', [PWDController::class, 'getBarangayDetails']);
    Route::get('/pwd-export-excel-personal-info/{subCatId}', [PwdExportController::class, 'exportBarangayPWDPersonalInfo']);
 

 

    Route::get('/opol-cdc', [OpolCDCController::class, 'index']);
    Route::post('/opol-cdc-create', [OpolCDCController::class,'createOPOLCDC']);
    Route::post('/opol-cdc-import', [OpolCDCController::class, 'importOPOLCDC']);
    Route::get('/opol-cdc-export-excel/{subCatId}', [OpolCDCController::class, 'exportCDC']);
    Route::get('/opol-cdc-enrollees-totalcounts', [OpolCDCController::class, 'getCDCEnrolleesTotals']);


    Route::post('/logbook/total-amount', [LogBookController::class, 'getTotalAmountOverAll']); 

    
    Route::post('/opol-eccd-import', [OpolECCDController::class, 'importECCD']);
    Route::post('/opol-eccd-create', [OpolECCDController::class, 'createOPOLECCD']);
    Route::put('/opol-eccd-update/{id}', [OpolECCDController::class, 'updateECCD']);

    
    Route::post('/logbook-hospital-bill-create', [HospitalBillController::class, 'createHospitalInfo']);
    Route::get('/logbook-hospital-bill-fetch', [HospitalBillController::class, 'fetchHospitalBillData']);
    Route::get('/logbook-hospital-bill-export', [HospitalBillController::class, 'exportHospitalBillInfo']);
    Route::post('/logbook-hospital-bill-import', [HospitalBillController::class, 'importHospitalBillInfo']);
    Route::post('/logbook-hospital-bill-total-amount', [HospitalBillController::class, 'getTotalAmountHospitalBill']);
    Route::put('/logbook-hospital-bill-update/{id}', [HospitalBillController::class, 'updateHospitalBill']);


 

 

 

 
 
 

 









    
 
 

 
  
 