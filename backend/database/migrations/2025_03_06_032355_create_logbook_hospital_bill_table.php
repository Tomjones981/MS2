<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('logbook_hospital_bill', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->string('name');
            $table->string('age')->nullable();
            $table->string('address');
            $table->string('beneficiary_name');
            $table->string('hospital_name');
            $table->string('amount');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('logbook_hospital_bill');
    }
};
