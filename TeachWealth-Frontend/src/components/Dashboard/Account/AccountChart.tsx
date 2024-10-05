import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import React, { useEffect, useState } from "react";
import { Pie, PieChart, Label, Cell } from "recharts";

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

  const colors = [
    '#ff6384', // red
    '#36a2eb', // blue
    '#ffce56', // yellow
    '#4bc0c0', // teal
    '#9966ff', // purple
    '#ff9f40', // orange
    '#ff4500'  // red-orange
  ];

  const TransactionTable = () => {
    if (!Array.isArray(transactions) || transactions.length === 0) {
      return <p>No transactions available</p>;
    }

    return (
      <section style={{ padding: '10px' }}>
        <h1 className="text-xl font-bold">Transactions</h1>
        <table>
          <tbody>
            {transactions.map(transaction => (
              <tr key={transaction.id}>
                <td>{transaction.description}</td>
                <td>R{transaction.amount}</td>
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
          setBalance(balanceData.data.currentBalance);
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
      }

      // Fetch transactions
      try {
        const transactionsResponse = await fetch(`https://team2.sandboxpay.co.za/za/pb/v1/accounts/${accountId}/transactions`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });

        if (transactionsResponse.ok) {
          const transactionsData = await transactionsResponse.json();
          // Check if transactionsData is an array
          if (Array.isArray(transactionsData.data.transactions)) {
            setTransactions(transactionsData.data.transactions);
          } else {
            console.error("Expected an array of transactions");
          }
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
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Label
                    key={`label-${index}`}
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
                              y={viewBox.cy}
                              className="fill-foreground text-3xl font-bold"
                            >
                              R{balance}
                            </tspan>
                          </text>
                        );
                      }
                    }}
                    fill={colors[index % colors.length]} // Assign color based on index
                  />
                ))}
                {chartData.map((entry, index) => (
  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
))}
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
        <section style={{ padding: '10px' }}>
          <TransactionTable />
        </section>
      </Card>
    </div>
  );
};

export default AccountChart;
