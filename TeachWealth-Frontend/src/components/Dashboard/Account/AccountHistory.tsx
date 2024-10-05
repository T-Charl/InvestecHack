import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { TrendingUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { BarChart, CartesianGrid, XAxis, Bar } from 'recharts';

type Props = {};

const chartConfig: ChartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
};

const AccountHistory = (props: Props) => {
  const [chartData, setChartData] = useState<{ month: string; desktop: number }[]>([]);
  const [averageSpend, setAverageSpend] = useState<number | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = "your_auth_token"; // Replace with your actual token or use context/state
        const accountId = "your_account_id"; // Replace with your actual account ID

        const response = await fetch(`/transactions/${accountId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const transactions = await response.json();
        const monthlyData = processTransactions(transactions); // Process transactions into monthly data

        setChartData(monthlyData);
        calculateAverage(monthlyData);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  const processTransactions = (transactions: any[]) => {
    const monthlyTotals: { [key: string]: number } = {};

    transactions.forEach((transaction) => {
      const month = new Date(transaction.date).toLocaleString('default', { month: 'long' });
      monthlyTotals[month] = (monthlyTotals[month] || 0) + Math.abs(transaction.amount); // Aggregate spendings
    });

    // Filter for the last three months
    const currentDate = new Date();
    const lastThreeMonths = new Date(currentDate.setMonth(currentDate.getMonth() - 3));

    return Object.entries(monthlyTotals)
      .filter(([month]) => new Date(month).getTime() >= lastThreeMonths.getTime())
      .map(([month, total]) => ({
        month,
        desktop: total,
      }));
  };

  const calculateAverage = (monthlyData: { month: string; desktop: number }[]) => {
    if (monthlyData.length > 0) {
      const totalSpend = monthlyData.reduce((acc, data) => acc + data.desktop, 0);
      const average = totalSpend / monthlyData.length;
      setAverageSpend(average);
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Account History</CardTitle>
          {/* <CardDescription>Last 3 Months</CardDescription> */}
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
                tickFormatter={(value) => value.slice(0, 3)} // Display first three letters of month
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          {/* Spending history statistics */}
          <div className="flex gap-2 font-medium leading-none">
            Average spend: {averageSpend !== null ? `$${averageSpend.toFixed(2)}` : "Loading..."} 
            <TrendingUp className="h-4 w-4" />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AccountHistory;
