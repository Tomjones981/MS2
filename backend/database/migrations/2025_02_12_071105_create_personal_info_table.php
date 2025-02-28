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
        Schema::create('personal_info', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('sub_cat_id');
            $table->string('name');
            $table->string('barangay');
            $table->string('disability')->nullable(); 
            $table->string('birthday')->nullable(); 
            $table->string('sex')->nullable(); 
            $table->string('id_number')->nullable(); 
            $table->string('blood_type')->nullable(); 
            $table->string('age')->nullable(); 
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
        Schema::dropIfExists('personal_info');
    }
};
