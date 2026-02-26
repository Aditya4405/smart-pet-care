import React from 'react';
export const SkeletonCard = () => (
  <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800/60 rounded-2xl p-6 animate-pulse">
    <div className="h-10 w-10 bg-slate-800 rounded-xl mb-4"></div>
    <div className="h-8 w-1/2 bg-slate-800 rounded mb-2"></div>
    <div className="h-4 w-1/3 bg-slate-800 rounded"></div>
  </div>
);
export const SkeletonRow = () => (
  <div className="flex items-center justify-between p-4 border-b border-slate-800/50 animate-pulse">
    <div className="flex items-center gap-4"><div className="w-10 h-10 bg-slate-800 rounded-full"></div><div className="space-y-2"><div className="h-4 w-32 bg-slate-800 rounded"></div><div className="h-3 w-24 bg-slate-800 rounded"></div></div></div>
    <div className="h-6 w-16 bg-slate-800 rounded-full"></div>
  </div>
);