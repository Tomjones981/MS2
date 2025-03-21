import React from 'react'
import CICL_Graph from './CICL/CICL_Graph'
import Age_Report_Graph from './CICL/Age_Report_Graph'
const Index = () => {
  return (
    <div className='p-10'>
        <CICL_Graph />
        <Age_Report_Graph />
    </div>
  )
}

export default Index