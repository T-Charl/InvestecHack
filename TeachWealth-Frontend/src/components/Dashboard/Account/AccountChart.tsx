import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TrendingUp } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Pie, PieChart, Label } from "recharts";

type Props = {};

const AccountChart = (props: Props) => {
  const [balance, setBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  
  const chartData = [
    { category: "Accounts", desktop: 120, mobile: 80 },
    { category: "Balances", desktop: 200, mobile: 140 },
    { category: "Transactions", desktop: 150, mobile: 110 },
    { category: "Transfers", desktop: 90, mobile: 50 },
    { category: "Beneficiary Payments", desktop: 60, mobile: 30 },
    { category: "Statements", desktop: 180, mobile: 90 },
    { category: "Tax Certificates", desktop: 75, mobile: 45 },
  ];

  const getRandomColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return `#${randomColor}`;
  };

  const TransactionTable = () => {
    return (
      <section style={{ padding: '10px' }}>
        <h1 className="text-xl font-bold">Transactions</h1>
        <table style={{}}>
          <tbody>
            {transactions.map(transaction => (
              <tr key={transaction.id}>
                <td style={{backgroundColor: getRandomColor(), width: '10px', height: '10px', borderRadius: '50%'}}>{}</td>
                <td style={{ }}>{transaction.description}</td>
                <td style={{ }}>R{transaction.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = "your_auth_token"; // Replace with your actual token
      const accountId = "your_account_id"; // Replace with your actual account ID
      
      // Fetch account balance
      try {
        const balanceResponse = await fetch(`/balance/${accountId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });

        if (balanceResponse.ok) {
          const balanceData = await balanceResponse.json();
          setBalance(balanceData.balance);
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
      }

      // Fetch transactions
      try {
        const transactionsResponse = await fetch(`/transactions/${accountId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });

        if (transactionsResponse.ok) {
          const transactionsData = await transactionsResponse.json();
          // Get the last 5 transactions
          setTransactions(transactionsData.slice(-5));
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchData();
  }, []);

  const chartConfig = {
    visitors: {
      label: "Visitors",
    },
    desktop: {
      label: "Desktop",
      color: "#2563eb",
    },
    mobile: {
      label: "Mobile",
      color: "#60a5fa",
    },
  };

  // Calculate total visitors (desktop + mobile) for all categories
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce(
      (acc, curr) => acc + curr.desktop + curr.mobile,
      0
    );
  }, [chartData]);

  return (
    <div>
      <Card className="flex flex-row">
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="desktop"
                nameKey="category"
                innerRadius={60}
                outerRadius={80}
                strokeWidth={5}
                fill={chartConfig.desktop.color}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Balances
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            R{totalVisitors.toLocaleString()}
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
        <section style={{ padding: '10px' }}>
          <h1 className="text-xl font-bold">Account Balance</h1>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
            R{balance !== null ? balance.toFixed(2) : "Loading..."}
          </p>
          <TransactionTable />
        </section>
      </Card>
    </div>
  );
};

export default AccountChart;
