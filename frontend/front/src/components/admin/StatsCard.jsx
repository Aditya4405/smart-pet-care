import React, { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const AnimatedCounter = ({ value }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!value || value === 0) { setCount(0); return; }
    let start = 0; const duration = 1000; const inc = value / (duration / 16);
    const timer = setInterval(() => { start += inc; if (start >= value) { setCount(value); clearInterval(timer); } else setCount(Math.floor(start)); }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{count.toLocaleString()}</span>;
};

const StatsCard = ({ title, value, prefix = "", suffix = "", icon: Icon, trendDirection, percentageChange, isLoading, color = "indigo" }) => {
  if (isLoading) return <div className="bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/60 rounded-2xl p-6 animate-pulse h-36"></div>;
  const isUp = trendDirection === 'up';
  
  return (
    <div className="bg-white dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group shadow-sm hover:shadow-md dark:shadow-lg h-full flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`p-2.5 sm:p-3 rounded-xl border text-${color}-600 dark:text-${color}-400 bg-${color}-50 dark:bg-${color}-500/10 border-${color}-100 dark:border-${color}-500/20 shrink-0`}>
          <Icon size={20} />
        </div>
        {percentageChange && (
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full flex items-center gap-0.5 border shrink-0 ml-2 ${isUp ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' : 'bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'}`}>
            {isUp ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>} {percentageChange}%
            </span>
        )}
      </div>
      
      {/* FIXED: Stacking the text vertically so it NEVER crashes horizontally */}
      <div className="relative z-10 mt-auto">
        <h4 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-1 tracking-tight truncate">
          {prefix}<AnimatedCounter value={value} />{suffix}
        </h4>
        <div className="text-sm text-slate-500 dark:text-slate-400 font-medium flex flex-col items-start">
          <span className="w-full truncate" title={title}>{title}</span> 
          {percentageChange && <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">vs last week</span>}
        </div>
      </div>
      <div className={`absolute -bottom-10 -right-10 w-32 h-32 bg-${color}-500/10 rounded-full blur-3xl group-hover:bg-${color}-500/20 transition-colors`}></div>
    </div>
  );
};

export default StatsCard;