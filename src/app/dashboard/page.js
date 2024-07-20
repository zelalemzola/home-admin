import { Button } from '@/components/ui/button'
import { Blocks, UsersRound } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Dashboard = () => {
  return (
    <div className='bg-primary w-full h-full '>
      <div className='flex flex-col items-center justify-center gap-10 pt-40 px-[80px] pb-[250px] '>
      <h1 className='text-primary text-4xl text-white'>Welcome, Dear Admin choose what you want to control</h1>
      <div className='flex items-center gap-10'>
        <Link href='/dashboard/categories' className='bg-white text-primary p-2 rounded-lg flex items-center justify-evenly gap-2'>
        <Blocks/>
        Categories
        </Link>
        <Link href='/dashboard/workers' className='bg-white text-primary p-2 rounded-lg  flex items-center justify-evenly gap-2'>
        <UsersRound />
          Workers 
        </Link>
      </div>
      </div>
    </div>
  )
}

export default Dashboard