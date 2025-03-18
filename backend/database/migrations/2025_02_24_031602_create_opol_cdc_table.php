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
        Schema::create('opol_cdc', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('sub_cat_id');
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('last_name');
            $table->string('birthday')->nullable();
            $table->string('barangay')->nullable();
            $table->string('M')->nullable();
            $table->string('F')->nullable();
            $table->string('months_old')->nullable();
            $table->string('1_11_yrs_old')->nullable();
            $table->string('2_11_yrs_old')->nullable();
            $table->string('3_11_yrs_old')->nullable();
            $table->string('4_11_yrs_old')->nullable();
            $table->string('5_yrs_old')->nullable();
            $table->string('pwd')->nullable();
            $table->timestamps();
 
            $table->foreign('sub_cat_id')
            ->references('id')
            ->on('sub_category')
            ->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('opol_cdc');
    }
};
