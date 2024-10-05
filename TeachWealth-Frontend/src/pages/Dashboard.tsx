import AccountBalance from '@/components/Dashboard/Account/AccountBalance'
import Navbar from '@/components/Navbar/Navbar'
import React from 'react'
import Chatbot from './Chatbot'

type Props = {}

const Dashboard = (props: Props) => {
  return (
<div style={{ display: 'flex', backgroundColor: "#ffffff" }}>
    <div style={{ width: '50%', padding: '1rem' }}>
    <div className='w-[100%]'>
    <div className='flex flex-row w-full justify-between items-center p-4'>
    <h1 className='text-lg'>Dashboard</h1>
    <div className='flex flex-row space-x-8'> 
        <div className='text-center'>
            <h1 className='text-xl font-bold'>R200</h1>
            <h1 className='text-sm text-gray-600'>Available Balance</h1>
        </div>
        <div className='text-center'>
            <h1 className='text-xl font-bold'>R50</h1>
            <h1 className='text-sm text-gray-600'>Current Balance</h1>
        </div>
    </div>
</div>

    
        <div>
          
            <AccountBalance />
        </div>
        <div>
           <Chatbot/>
        </div>
    </div>
</div>
</div>

  )
}

export default Dashboard