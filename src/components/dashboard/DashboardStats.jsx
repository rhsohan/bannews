import { useMemo } from 'react';
import { Card, CardContent } from "../ui/Card";
import { formatCurrency } from "../../utils";
import { TrendingUp, TrendingDown, DollarSign, Activity, PieChart, ArrowUpRight, ArrowDownRight } from "lucide-react";

export function DashboardStats({ transactions }) {
  const stats = useMemo(() => {
    const investments = transactions.filter(t => t.Type === 'Invest').reduce((sum, t) => sum + Number(t.Amount), 0);
    const profits = transactions.filter(t => t.Type === 'Profit').reduce((sum, t) => sum + Number(t.Amount), 0);
    const recordedTotal = investments + profits;
    const roi = investments > 0 ? ((profits / investments) * 100).toFixed(2) : 0;
    
    const investCount = transactions.filter(t => t.Type === 'Invest').length;
    const profitCount = transactions.filter(t => t.Type === 'Profit').length;

    return { investments, profits, recordedTotal, roi, investCount, profitCount };
  }, [transactions]);

  const { investments, profits, recordedTotal, roi, investCount, profitCount } = stats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard 
        title="Total Investment" 
        value={formatCurrency(investments)} 
        icon={<TrendingDown className="text-brand-navy" />} 
        description={`${investCount} transactions`}
        trend="neutral"
      />
      <StatCard 
        title="Total Profit" 
        value={formatCurrency(profits)} 
        icon={<TrendingUp className="text-brand-green" />} 
        description={`${profitCount} transactions`}
        trend="positive"
      />
      <StatCard 
        title="Recorded Total" 
        value={formatCurrency(recordedTotal)} 
        icon={<DollarSign className="text-brand-blue" />} 
        description="Investments + Profits"
      />
      <StatCard 
        title="ROI" 
        value={`${roi}%`} 
        icon={<PieChart className="text-brand-purple" />} 
        description="Return on Investment"
        trend={roi > 0 ? "positive" : "neutral"}
      />
    </div>
  );
}

function StatCard({ title, value, icon, description, trend }) {
  return (
    <div className="transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-blue/5 rounded-xl bg-white border border-slate-200 overflow-hidden group">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-slate-500">{title}</h3>
          <div className="p-2 bg-slate-50 rounded-lg">
            {icon}
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <h2 className="text-2xl font-bold text-slate-800">{value}</h2>
        </div>
        {description && (
          <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
            {trend === 'positive' && <ArrowUpRight className="w-4 h-4 text-brand-green" />}
            {trend === 'negative' && <ArrowDownRight className="w-4 h-4 text-red-500" />}
            {description}
          </p>
        )}
      </CardContent>
    </div>
  );
}
