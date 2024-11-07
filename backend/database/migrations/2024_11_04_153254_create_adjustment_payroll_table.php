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
        Schema::create('adjustment_payroll', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('generated_payroll_id'); 
            $table->decimal('adjustment', 10, 2); 
            $table->decimal('adjusted_netpay', 10, 2); 
            $table->timestamps();

            $table->foreign('generated_payroll_id')
            ->references('id')
            ->on('generated_payroll')
            ->onDelete('cascade'); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('adjustment_payroll');
    }
};
