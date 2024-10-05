import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { TrendingUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { BarChart, CartesianGrid, XAxis, Bar, Tooltip } from 'recharts';

type Props = {};

const chartConfig: ChartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
};

const AccountHistory = (props: Props) => {
  const [chartData, setChartData] = useState([]);
  const [averageSpend, setAverageSpend] = useState<number | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = "your_auth_token"; // Replace with your actual token
        const accountId = "4675778129910189600000004"; // Replace with actual account ID

        const response = await fetch(`https://team2.sandboxpay.co.za/za/pb/v1/accounts/${accountId}/transactions`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const transactions = data.data?.transactions || []; // Ensure transactions is an array
        const monthlyData: any = processTransactions(transactions); // Process transactions

        setChartData(monthlyData);
        calculateAverage(monthlyData);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  const processTransactions = (transactions: any[] = []) => {
    const monthlyTotals: any = {};

    transactions.forEach((transaction) => {
      const actionDate = new Date(transaction.actionDate);
      const month = actionDate.toLocaleString('default', { month: 'long', year: 'numeric' });
      monthlyTotals[month] = (monthlyTotals[month] || 0) + Math.abs(Number(transaction.amount));
    });

    const currentDate = new Date();
    const lastThreeMonths = new Date(currentDate.setMonth(currentDate.getMonth() - 3));

    return Object.entries(monthlyTotals)
      .filter(([month]) => {
        const [monthName, year] = month.split(" ");
        const dateToCompare = new Date(`${monthName} 1, ${year}`);
        return dateToCompare >= lastThreeMonths;
      })
      .map(([month, total]) => ({
        month,
        desktop: total,
      }));
  };

  const calculateAverage = (monthlyData: any) => {
    if (monthlyData.length > 0) {
      const totalSpend = monthlyData.reduce((acc: any, data: any) => acc + data.desktop, 0);
      const average = totalSpend / monthlyData.length;
      setAverageSpend(average);
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Account History</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)} // Shorten month names
              />
              <Tooltip
                cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            Average spend: {averageSpend !== null ? `R${averageSpend.toFixed(2)}` : "Loading..."}
            <TrendingUp className="h-4 w-4" />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AccountHistory;

