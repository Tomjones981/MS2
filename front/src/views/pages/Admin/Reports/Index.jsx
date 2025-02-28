import React from 'react'
import Monthly_Hours from './Total_Hours_Reports/Monthly_Hours'
import Faculty_Total_Hours from './Total_Hours_Reports/Faculty_Total_Hours'
import MonthlyTotal_Gross_Netpay from './MonthlyTotal_Gross_Netpay/MonthlyTotal_Gross_Netpay'
import Status_Counts from './Salary_Status_Counts/Status_Counts'
const Index = () => {
  return (
    <div>
        <Monthly_Hours/>
        <Faculty_Total_Hours/>
        
        <div className='grid grid-cols-2 gap-3'>
          <div>
            <MonthlyTotal_Gross_Netpay/>
          </div>
          <div>
            <Status_Counts/>
          </div>
        </div>
    </div>
  )
}

export default Index