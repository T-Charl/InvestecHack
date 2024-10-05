import AccountBalance from '@/components/Dashboard/Account/AccountBalance'
import Navbar from '@/components/Navbar/Navbar'
import React, { useEffect, useState } from 'react'
import Chatbot from './Chatbot'

type Props = {}

const Dashboard = (props: Props) => {
    const [currentBalance, setCurrentBalance] = useState<number | null>(null);
    const [availableBalance, setAvailableBalance] = useState<number | null>(null);
    //const [transactions, setTransactions] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const token = "your_auth_token"; // Replace with your actual token
            const accountId = "4675778129910189600000004"; // Replace with your actual account ID

            // Fetch account balance
            try {
                const balanceResponse = await fetch(`https://team2.sandboxpay.co.za/za/pb/v1/accounts/${accountId}/balance`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                });

                if (balanceResponse.ok) {
                    const balanceData = await balanceResponse.json();
                    setCurrentBalance(balanceData.data.currentBalance);
                    setAvailableBalance(balanceData.data.availableBalance);
                }
            } catch (error) {
                console.error("Error fetching balance:", error);
            }

            fetchData();
        }
    }, []);
    return (
        <div style={{ display: 'flex', backgroundColor: "#ffffff" }}>
            <div style={{ width: '50%', padding: '1rem' }}>
                <div className='w-[100%]'>
                    <div className='flex flex-row w-full justify-between items-center p-4'>
                        <h1 className='text-lg'>Dashboard</h1>
                        <div className='flex flex-row space-x-8'>
                            <div className='text-center'>
                                <h1 className='text-xl font-bold'>R{availableBalance !== null ? availableBalance : 'Loading...'}</h1>
                                <h1 className='text-sm text-gray-600'>Available Balance</h1>
                            </div>
                            <div className='text-center'>
                                <h1 className='text-xl font-bold'>R{currentBalance !== null ? currentBalance : 'Loading...'}</h1>
                                <h1 className='text-sm text-gray-600'>Current Balance</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-[100%] flex flex-col'>
                    <div className='w-[100%]'>
                        <AccountBalance />
                    </div>
                </div>

            </div>
            <div className='w-[100%]'>
                <Chatbot/>
            </div>
        </div>

    )
}

export default Dashboard
