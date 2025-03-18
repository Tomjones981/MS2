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
        Schema::create('opol_eccd', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('sub_cat_id');
            $table->string('children_name');
            $table->string('age')->nullable();
            $table->string('sex')->nullable();
            $table->string('yes')->nullable();
            $table->string('no')->nullable();
            $table->string('school_name')->nullable();
            $table->string('barangay')->nullable();
            $table->string('school_address')->nullable();
            $table->string('remarks')->nullable();
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
        Schema::dropIfExists('opol_eccd');
    }
};
