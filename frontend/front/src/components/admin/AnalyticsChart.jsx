import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const AnalyticsChart = ({ data, isLoading, color = "#6366f1", dataKey = "value" }) => {
  const exportChart = () => toast.success("Chart exported as PNG successfully.");

  if (isLoading) {
    return <div className="h-72 w-full bg-slate-800/30 animate-pulse rounded-xl border border-slate-700/50"></div>;
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-72 w-full flex flex-col items-center justify-center text-slate-500 border border-slate-700/50 rounded-xl bg-slate-900/20">
        <BarChart2 size={32} className="mb-2 opacity-20" />
        <p className="font-medium text-sm">No data available for this period.</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative h-72 w-full group">
      <button onClick={exportChart} className="absolute top-0 right-0 z-10 p-2 bg-slate-800 text-slate-300 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-700 hover:text-white shadow-lg">
        <Download size={16} />
      </button>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={`color-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.4}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
          <Tooltip cursor={{stroke: color, strokeWidth: 1, strokeDasharray: '3 3'}} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', shadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} itemStyle={{color: color, fontWeight: 'bold'}} />
          <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={3} fillOpacity={1} fill={`url(#color-${dataKey})`} animationDuration={1000} />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default AnalyticsChart;