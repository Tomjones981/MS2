<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('children_case', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('sub_cat_id');
            $table->string('locations');
            $table->string('code_name')->nullable();
            $table->string('age')->nullable();
            $table->string('sex')->nullable();
            $table->string('religion')->nullable();
            $table->string('educational_attainment')->nullable();
            $table->string('educational_status')->nullable();
            $table->string('ethnic_affiliation')->nullable();
            $table->string('four_ps_beneficiary')->nullable();
            $table->string('case')->nullable();
            $table->string('case_status')->nullable();
            $table->string('perpetrator')->nullable();
            $table->string('interventions')->nullable();
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
        Schema::dropIfExists('children_case');
    }
};
