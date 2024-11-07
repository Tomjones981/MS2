import React from 'react'
import { BeatLoader } from 'react-spinners' 
const LoadingScreen = () => {
  return (
    <div className='h-screen flex items-center justify-center'>
      <BeatLoader    color="rgba(63, 131, 248)" size={25} />
    </div>
  )
}

export default LoadingScreen