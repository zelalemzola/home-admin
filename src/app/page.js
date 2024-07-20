
import { Button } from "@/components/ui/button";
import Link from "next/link";



export default function Home() {
 
  return (
<div className='bg-primary w-full h-full '>
      <div className='flex flex-col items-center justify-center gap-10 pt-40 px-[20px] pb-[270px] '>
      <h1 className='text-primary text-4xl text-white'>Welcome, Dear Admin Click the button below to go to the Dashbaord</h1>
      <div className='pt-6'>
         <Button className='bg-white hover:bg-white'><Link href="/dashboard" className="text-primary rounded-lg">Go To Dashboard</Link></Button>
      </div>
      </div>
    </div>
  );
}
