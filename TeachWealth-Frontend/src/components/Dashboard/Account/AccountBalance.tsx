import React from 'react'
import AccountChart from './AccountChart'
import AccountHistory from './AccountHistory'

type Props = {}

const AccountBalance = (props: Props) => {
  return (
    <div className='p-[5%]'>
      <div className='mb-[10%]'>
      <AccountChart/>
      </div>
      <div className=''>
      <AccountHistory/>
      </div>
    </div>
  )
}

export default AccountBalance