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
        Schema::create('generated_payroll', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('faculty_id'); 
            $table->date('date_from'); 
            $table->date('date_to'); 
            $table->string('hours_or_days'); 
            $table->decimal('gross_amount', 10, 2); 
            $table->time('late'); 
            $table->decimal('tax', 10, 2); 
            $table->decimal('netpay', 10, 2); 
            $table->enum('payroll_type', ['ft_payroll','pt_payroll','el_payroll','ptr_payroll','ph_payroll']);
            $table->timestamps();

            $table->foreign('faculty_id')
            ->references('id')
            ->on('faculty')
            ->onDelete('cascade'); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('generated_payroll');
    }
};
