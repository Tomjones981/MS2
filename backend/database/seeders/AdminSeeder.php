<?php

namespace Database\Seeders;

use App\Models\User;  
use App\Models\Year;
use App\Models\Brgy_Sectors;
use App\Models\Sub_Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        

        User::create([
            'id' => "1",
            'email' => 'occ.vacalares.tomjoseph111@gmail.com',
            'user_type' => 'payroll',
            'password' => 'password123',
        ]);
        User::create([
            'id' => "2",
            'email' => 'vacalares.tomjoseph@occ.edu.ph',
            'user_type' => 'admin',
            'password' => bcrypt('password123'),

        ]);



        Year::create([
            'id' => "1",
            'year_date' => "2024",
        ]);


        Brgy_Sectors::create([
            'id' => "1",
            'year_id' => "1",
            'sector_name' => "CHILDREN",
        ]);Brgy_Sectors::create([
            'id' => "2",
            'year_id' => "1",
            'sector_name' => "YOUTH",
        ]);
        Brgy_Sectors::create([
            'id' => "3",
            'year_id' => "1",
            'sector_name' => "PWD",
        ]);Brgy_Sectors::create([
            'id' => "4",
            'year_id' => "1",
            'sector_name' => "SOLO PARENT",
        ]);Brgy_Sectors::create([
            'id' => "5",
            'year_id' => "1",
            'sector_name' => "CBRP GRADUATES",
        ]);Brgy_Sectors::create([
            'id' => "6",
            'year_id' => "1",
            'sector_name' => "EXITED 4Ps",
        ]);Brgy_Sectors::create([
            'id' => "7",
            'year_id' => "1",
            'sector_name' => "SENIOR CITIZEN",
        ]);

        Sub_Category::create([
            'id' => "1",
            'brgy_sector_id' => "1",
            'sub_cat_name' => "PWD",
            'age_range' => "0-17 years Old",
        ]);
        Sub_Category::create([
            'id' => "2",
            'brgy_sector_id' => "1",
            'sub_cat_name' => "ENROLLEES",
            'age_range' => "3-4 Years Old",
            'description' => "Children Development Center",
        ]);
        Sub_Category::create([
            'id' => "3",
            'brgy_sector_id' => "1",
            'sub_cat_name' => "ECCD",
            'age_range' => "3-4 Years Old",
            'description' => "Children Development Center",
        ]);
        Sub_Category::create([
            'id' => "4",
            'brgy_sector_id' => "1",
            'sub_cat_name' => "CICL",
            'age_range' => "0-17 Years Old",
            'description' => "Children in Conflict with the Law Cases",
        ]);


        
    }
}
