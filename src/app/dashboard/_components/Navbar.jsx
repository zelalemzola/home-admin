
import Link from 'next/link'
import React from 'react'

const Navbar = () => {
  return (
    <div className='p-3 flex justify-between border-b border-b-primary text-primary bg-white text-xl fixed z-50 w-full'>
        <Link href='/dashboard' className='font-bold'>Dashboard</Link>
      
        </div>
  )
}

export default Navbar