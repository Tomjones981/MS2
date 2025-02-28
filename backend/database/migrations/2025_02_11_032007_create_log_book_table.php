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
        Schema::create('log_book', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->string('client_name');
            $table->string('age')->nullable();
            $table->enum('gender', ['male','female','other']);
            $table->string('address');
            $table->enum('purpose', ['educational','cash_assistance', 'medical_assistance', 'burial_assistance']);
            $table->enum('beneficiary', ['himself', 'herself', 'parent']);
            $table->enum('hospital_or_institutional', ['cash_assistance', 'polimedic', 'ace', 'sabal', 'maria_reyna']);
            $table->string('contact_number');
            $table->string('amount');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('log_book');
    }
};
