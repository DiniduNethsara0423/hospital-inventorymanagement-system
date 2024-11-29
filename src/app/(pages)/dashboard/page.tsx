import React from 'react'
import Navbar from '@/app/components/navbar'
function page() {
  return (
    <div className='flex w-full h-screen'>
        <div className='w-[20%] border border-red-500'>
        <Navbar/>

        </div>
       <div className='w-[80%]'>
        <div>header</div>
        <div>body</div>
       </div>
        </div>
    
  )
}

export default page