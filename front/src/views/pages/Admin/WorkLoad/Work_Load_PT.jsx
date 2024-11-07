import React, {  useEffect, useState } from 'react';
import { DatePicker } from 'antd'; 
import axiosClient from '../../../../api/axiosClient';

const Work_Load_PT = () => {
    const [faculties, setFaculties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectMonth, setSelectMonth] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [designationFilter, setDesignationFilter] = useState("");
    const [weekDaysCount, setWeekDaysCount] = useState({
        totalWeekdays: 0,
        monday: 0,
        tuesday: 0,
        wednesday: 0,
        thursday: 0,
        friday: 0,
        saturday: 0,
    });

    const handleMonthChange = (date) => {
        setSelectMonth(date);
        calculateWeekDays(date);
    };

    const calculateWeekDays = (date) => {
        if (!date) return;

        const startOfMonth = date.startOf('month');
        const endOfMonth = date.endOf('month');
        const totalDays = endOfMonth.diff(startOfMonth, 'days') + 1;  
        let counts = {
            totalWeekdays: 0,
            monday: 0,
            tuesday: 0,
            wednesday: 0,
            thursday: 0,
            friday: 0,
            saturday: 0,
        };

        for (let i = 0; i < totalDays; i++) {
            const currentDay = startOfMonth.clone().add(i, 'days');
            const dayOfWeek = currentDay.day();  
            
            if (dayOfWeek > 0 && dayOfWeek < 6) {  
                counts.totalWeekdays++;
            }
            switch (dayOfWeek) {
                case 1: counts.monday++; break;
                case 2: counts.tuesday++; break;
                case 3: counts.wednesday++; break;
                case 4: counts.thursday++; break;
                case 5: counts.friday++; break;
                case 6: counts.saturday++; break;
                default: break;  
            }
        }

        setWeekDaysCount(counts);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosClient.get('/get/faculties/units');
                setFaculties(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

     
    
    
    const handleSave = async () => {
        if (!selectMonth) {
            alert('Please select a month.');
            return;
        }
    
        const monthYearString = selectMonth.format('YYYY-MM-01');  
     
        try {
            const response = await axiosClient.get('/get/faculties/total_units', {
                params: { month_year: monthYearString },
            });
    
            if (response.data.length > 0) {
                alert('Total units for this month and year are already saved.');
                return;  
            }
        } catch (err) {
            console.error(err);
            alert('Failed to check existing total units: ' + (err.response?.data?.message || 'Unexpected error occurred.'));
            return;  
        }
     
        const totalData = faculties.map((faculty) => {
            const UnitID = faculty.unit_id;
            const mondayValue = parseInt(faculty.monday) || 0;
            const tuesdayValue = parseInt(faculty.tuesday) || 0;
            const wednesdayValue = parseInt(faculty.wednesday) || 0;
            const thursdayValue = parseInt(faculty.thursday) || 0;
            const fridayValue = parseInt(faculty.friday) || 0;
            const saturdayValue = parseInt(faculty.saturday) || 0;
    
            const Total = (weekDaysCount.monday * mondayValue) +
                          (weekDaysCount.tuesday * tuesdayValue) +
                          (weekDaysCount.wednesday * wednesdayValue) +
                          (weekDaysCount.thursday * thursdayValue) +
                          (weekDaysCount.friday * fridayValue) +
                          (weekDaysCount.saturday * saturdayValue);
    
            return {
                unit_id: UnitID,
                month_year: monthYearString,
                total_hours: Total,
            };
        });
    
        console.log(totalData); 
    
        setIsSaving(true);
        try { 
            await axiosClient.post('/save/faculties/total_units', { data: totalData });
            alert('Total units saved successfully!');
        } catch (err) {
            console.error(err);
            alert('Failed to save total units: ' + (err.response?.data?.message || 'Unexpected error occurred.'));
        } finally {
            setIsSaving(false);
        }
    };
    
    
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
      };
    
      const handleDesignationChange = (e) => {
        setDesignationFilter(e.target.value);
      };
    

      const filteredFaculty = faculties.filter(faculty => {
        const matchIdOrName = faculty.faculty_id.toString().includes(searchTerm.toLowerCase()) || 
                              (faculty.full_name && faculty.full_name.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchDesignation = designationFilter === "" || faculty.employment_type === designationFilter;
        return matchIdOrName && matchDesignation;
    });
    
    
    

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <>
            <div> 
                <div className="mt-2 w-full p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex flex-col items-start mb-5">
                        <div className="flex w-full justify-between items-center">
                            <h1 className="font-semibold text-xl dark:text-white uppercase">Faculty Work Load</h1>
                            <button 
                                type="button" 
                                onClick={handleSave} 
                                className="py-2.5 px-4 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                disabled={isSaving}  
                                >
                             {isSaving ? 'Saving...' : 'Save Total Units'} 
                            </button>
                        </div>
                        <hr className="my-2 border-t border-gray-300 dark:border-gray-700" style={{ width: '100%' }} />
                    </div>
                    <form>
                        <div className="col-span-3 -mt-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Month</label>
                            <DatePicker 
                                value={selectMonth} 
                                picker="month" 
                                className='h-11 mt-1 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200' 
                                onChange={handleMonthChange} 
                            />  
                        </div> 
                    </form>
                    <div className="flex items-center justify-end mb-4 -mt-10">
                        <div className='mr-2'>
                            <select
                                name="designationFilter"
                                value={designationFilter}
                                onChange={handleDesignationChange}
                                className="text-sm h-10 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            >
                                <option value="">All</option>
                                <option value="full_time">Full Time</option>
                                <option value="part_time">Part Time</option>
                                <option value="part_time_regular">PT-Regular</option>
                            </select>
                        </div>
                        <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none ">
                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <input type="search" value={searchTerm} onChange={handleSearchChange}  className="block w-full p-2.5 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search by ID or Name" />
                        </div>
                    </div>
                    <div className='mt-2 rounded-lg overflow-hidden'>
                        <div className="  grid grid-cols-6 bg-yellow-400 text-center font-bold">
                            <div>{weekDaysCount.monday}</div>
                            <div>{weekDaysCount.tuesday}</div>
                            <div>{weekDaysCount.wednesday}</div>
                            <div>{weekDaysCount.thursday}</div>
                            <div>{weekDaysCount.friday}</div>
                            <div>{weekDaysCount.saturday}</div>
                        </div> 
                        <div className="grid grid-cols-6 bg-gray-200 text-center font-semibold">
                            <div>Mon</div>
                            <div>Tue</div>
                            <div>Wed</div>
                            <div>Thu</div>
                            <div>Fri</div>
                            <div>Sat</div>
                        </div>
                    </div>
                    

                    <div className="relative overflow-x-auto mt-2 rounded-lg">
                        <div className="max-h-[22rem] overflow-y-auto mb-4 rounded-lg">   
                            <table className="table-auto w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border-collapse border border-slate-200 rounded-lg mt-2">
                                <thead className="sticky -top-1 text-xs text-gray-100 bg-gray-600 dark:bg-gray-700 dark:text-gray-200 border-collapse border border-slate-200">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600">Faculty Name</th>
                                        <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600">Subjects</th>
                                        <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600">Units</th>
                                        <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600">Mon</th>
                                        <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600">Tue</th>
                                        <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600">Wed</th>
                                        <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600">Thu</th>
                                        <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600">Fri</th>
                                        <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600">Sat</th>
                                        <th scope="col" className="px-6 py-3 border border-slate-300 dark:border-slate-600">Total</th>  
                                    </tr>
                                </thead>
                                <tbody>
                                {filteredFaculty.map((faculty) => { 
                                    const mondayValue = parseInt(faculty.monday) || 0;
                                    const tuesdayValue = parseInt(faculty.tuesday) || 0;
                                    const wednesdayValue = parseInt(faculty.wednesday) || 0;
                                    const thursdayValue = parseInt(faculty.thursday) || 0;
                                    const fridayValue = parseInt(faculty.friday) || 0;
                                    const saturdayValue = parseInt(faculty.saturday) || 0;

                                     
                                    const MondayMultiply = weekDaysCount.monday * mondayValue;
                                    const TuesdayMultiply = weekDaysCount.tuesday * tuesdayValue;
                                    const WednesdayMultiply = weekDaysCount.wednesday * wednesdayValue;
                                    const ThursdayMultiply = weekDaysCount.thursday * thursdayValue;
                                    const FridayMultiply = weekDaysCount.friday * fridayValue;
                                    const SaturdayMultiply = weekDaysCount.saturday * saturdayValue;

                                     
                                    const Total = MondayMultiply + TuesdayMultiply + WednesdayMultiply + ThursdayMultiply + FridayMultiply + SaturdayMultiply;

                                    return (
                                        <tr key={faculty.faculty_id}>
                                            <td className="px-6 py-3">{faculty.full_name} </td>
                                            <td className="px-6 py-3">{faculty.subjects}</td> 
                                            <td className="px-6 py-3  ">{faculty.teaching_units}</td>
                                            <td className="px-6 py-3 bg-gray-200 font-bold dark:text-gray-700 dark:bg-gray-300">{mondayValue}</td>
                                            <td className="px-6 py-3 bg-gray-200 font-bold dark:text-gray-700 dark:bg-gray-300">{tuesdayValue}</td>
                                            <td className="px-6 py-3 bg-gray-200 font-bold dark:text-gray-700 dark:bg-gray-300">{wednesdayValue}</td>
                                            <td className="px-6 py-3 bg-gray-200 font-bold dark:text-gray-700 dark:bg-gray-300">{thursdayValue}</td>
                                            <td className="px-6 py-3 bg-gray-200 font-bold dark:text-gray-700 dark:bg-gray-300">{fridayValue}</td>
                                            <td className="px-6 py-3 bg-gray-200 font-bold dark:text-gray-700 dark:bg-gray-300">{saturdayValue}</td>
                                            <td className="px-6 py-3">{Total}</td>  
                                        </tr> 
                                    );
                                })}

                                </tbody>
                            </table>
                        </div>
                    </div> 
                </div>
            </div>
        </>
    );
}

export default Work_Load_PT;



