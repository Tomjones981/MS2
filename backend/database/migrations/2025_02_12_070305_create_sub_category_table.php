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
        Schema::create('sub_category', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('brgy_sector_id');
            $table->string('sub_cat_name');
            $table->string('age_range');
            $table->string('description')->nullable();
            $table->timestamps();

            $table->foreign('brgy_sector_id')
            ->references('id')
            ->on('brgy_sectors')
            ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sub_category');
    }
};
