import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../../config/api';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';

const Analytics = () => {
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [kpis, setKpis] = useState({ revenue: 0, appointments: 0, patients: 0 });
  const [revenueData, setRevenueData] = useState([]);
  const [serviceData, setServiceData] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const userStr = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (!userStr || !token) {
          navigate('/login');
          return;
        }
        const user = JSON.parse(userStr);

       const response = await fetch(`${API.BASE_API}/appointments/vet/${user.id}`, {
             headers: { 'Authorization': `Bearer ${token}` }
          });

        if (response.ok) {
          const data = await response.json();
          
          // --- 1. CALCULATE KPIs ---
          let totalRev = 0;
          let uniquePets = new Set();
          
          let daysRev = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
          let serviceCounts = { clinic: 0, video: 0, emergency: 0 };

          data.forEach(appt => {
             // KPI sums
             totalRev += (appt.amountPaid || 0);
             uniquePets.add(appt.pet.id);

             // Service Type counts
             let type = (appt.visitType || 'clinic').toLowerCase();
             if (serviceCounts[type] !== undefined) serviceCounts[type]++;
             else serviceCounts['clinic']++; // fallback

             // Day of week revenue
             if (appt.appointmentDate) {
                 let dateObj = new Date(appt.appointmentDate);
                 let dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' }); // Mon, Tue...
                 if (daysRev[dayName] !== undefined) {
                     daysRev[dayName] += (appt.amountPaid || 0);
                 }
             }
          });

          setKpis({
              revenue: totalRev,
              appointments: data.length,
              patients: uniquePets.size
          });

          // --- 2. FORMAT AREA CHART DATA ---
          const formattedRevData = [
              { name: 'Mon', uv: daysRev['Mon'] },
              { name: 'Tue', uv: daysRev['Tue'] },
              { name: 'Wed', uv: daysRev['Wed'] },
              { name: 'Thu', uv: daysRev['Thu'] },
              { name: 'Fri', uv: daysRev['Fri'] },
              { name: 'Sat', uv: daysRev['Sat'] },
              { name: 'Sun', uv: daysRev['Sun'] },
          ];
          setRevenueData(formattedRevData);

          // --- 3. FORMAT PIE CHART DATA ---
          const formattedServiceData = [
              { name: 'Clinic', value: serviceCounts.clinic, color: '#10b981' },
              { name: 'Video', value: serviceCounts.video, color: '#3b82f6' },
              { name: 'Emergency', value: serviceCounts.emergency, color: '#ef4444' }
          ].filter(s => s.value > 0); // Only show ones that have bookings
          
          setServiceData(formattedServiceData.length > 0 ? formattedServiceData : [{ name: 'No Data', value: 1, color: '#cbd5e1' }]);

        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [navigate]);

  if (isLoading) {
      return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Practice Analytics</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {['Total Revenue', 'Appointments', 'Total Patients', 'Avg. Rating'].map((label, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <p className="text-slate-500 text-xs font-bold uppercase">{label}</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {i === 0 ? `₹${kpis.revenue}` : i === 1 ? kpis.appointments : i === 2 ? kpis.patients : '4.9'}
            </h3>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 mt-2">
              ↑ {['12%', '5%', '2%', '0.1'][i]} vs last month
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Revenue Chart (Area) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="font-bold text-slate-900 dark:text-white mb-6">Revenue Trend</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(val) => `₹${val}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value) => [`₹${value}`, "Revenue"]}
                />
                <Area type="monotone" dataKey="uv" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorUv)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Service Distribution (Pie) */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="font-bold text-slate-900 dark:text-white mb-6">Services Breakdown</h3>
          <div className="h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={serviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {serviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
               <span className="text-3xl font-bold text-slate-900 dark:text-white">{kpis.appointments}</span>
               <span className="text-xs text-slate-500 uppercase">Total Svcs</span>
            </div>
          </div>
          
          <div className="mt-4 space-y-2">
            {serviceData.map((item) => (
              <div key={item.name} className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                  {item.name}
                </span>
                <span className="font-bold dark:text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Analytics;