import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { formatCurrency } from "../../utils";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

export function DashboardCharts({ transactions }) {
  // Aggregate data by month
  const monthlyData = transactions.reduce((acc, t) => {
    const date = new Date(t.Date);
    const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
    
    if (!acc[monthYear]) {
      acc[monthYear] = { name: monthYear, Invest: 0, Profit: 0, date: date.getTime() };
    }
    
    if (t.Type === 'Invest') {
      acc[monthYear].Invest += Number(t.Amount);
    } else {
      acc[monthYear].Profit += Number(t.Amount);
    }
    
    return acc;
  }, {});

  const chartData = Object.values(monthlyData).sort((a, b) => a.date - b.date);

  // Cumulative Data
  let cumulativeInvest = 0;
  let cumulativeProfit = 0;
  const cumulativeData = chartData.map(d => {
    cumulativeInvest += d.Invest;
    cumulativeProfit += d.Profit;
    return {
      name: d.name,
      Invest: cumulativeInvest,
      Profit: cumulativeProfit
    };
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-slate-100 shadow-sm rounded-lg">
          <p className="font-semibold text-slate-800 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <Card>
        <CardHeader>
          <CardTitle>Monthly Investment vs Profit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} />
                <YAxis 
                  tickFormatter={(value) => `৳${(value/1000)}k`}
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748B' }} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" />
                <Bar dataKey="Invest" fill="#172554" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Profit" fill="#16A34A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cumulative Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cumulativeData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorInvest" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#172554" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#172554" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16A34A" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#16A34A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} />
                <YAxis 
                  tickFormatter={(value) => `৳${(value/1000)}k`}
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748B' }} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" />
                <Area type="monotone" dataKey="Invest" stroke="#172554" strokeWidth={2} fillOpacity={1} fill="url(#colorInvest)" />
                <Area type="monotone" dataKey="Profit" stroke="#16A34A" strokeWidth={2} fillOpacity={1} fill="url(#colorProfit)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
