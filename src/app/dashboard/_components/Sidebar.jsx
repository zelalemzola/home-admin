import { Separator } from '@radix-ui/react-dropdown-menu'
import { Blocks, BriefcaseBusiness } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Sidebar = () => {
  return (
    <div className='h-[100%] sitcky bg-white'>
    <div className='flex flex-col  pt-8 '>
       <div className='border-b border-t border-t-primary border-b-primary p-3'>
        <Link href='/dashboard/categories' className='flex items-center justify-evenly text-primary hover:text-white hover:bg-primary p-3 rounded-lg'>
        <Blocks/>
         <h1 className='text-bold '>Categories</h1>
        </Link>
        </div>
        
        <div className='border-b border-b-primary p-3'>
        <Link href='/dashboard/workers' className='flex items-center justify-evenly top-1 text-primary hover:text-white hover:bg-primary p-3 rounded-lg'>
        <BriefcaseBusiness/> 
        <h1 className='text-bold  '>Workers</h1>
        </Link>
        </div>
    </div>
    </div>
  )
}

export default Sidebar