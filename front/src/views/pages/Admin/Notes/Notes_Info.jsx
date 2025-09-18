import React from 'react'

const Notes_Info = () => {
  return (
    <div className='h-[21rem] p-5'>
        <div className=' overflow-y-auto mt-1 w-full p-5 bg-white border border-gray-200 rounded-lg  dark:bg-gray-800 dark:border-gray-700'>
                <div className="flex justify-between items-center p-2 mb-2 -mt-3       dark:bg-gray-800">
                    <h1 className="text-lg font-light text-gray-900  dark:text-gray-200">
                        Notes Info
                    </h1> 
                </div>
                <hr className="-ml-5 -mt-2 my-2 mb-5 border-t border-gray-300 dark:border-gray-600" style={{ width: '104%' }}/>
        </div>
    </div>
  )
}

export default Notes_Info

