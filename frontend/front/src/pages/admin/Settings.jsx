import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Globe, AlertTriangle, Database, Save, Plus, Trash2 } from 'lucide-react';
import ConfirmModal from '../../components/shared/ConfirmModal';
import toast from 'react-hot-toast';

const AdminSettings = () => {
  const [confirmModal, setConfirmModal] = useState(false);
  const [healthScore, setHealthScore] = useState(100);

  const [security, setSecurity] = useState({
    enforce2FA: true, passwordPolicyLevel: 'Enterprise', sessionTimeoutMinutes: 15, maxLoginAttempts: 3, geoRestrictionEnabled: true,
    suspiciousLoginAlerts: true, bruteForceProtection: true, apiRateLimitPerMinute: 60, dataRetentionDays: 365, gdprMode: true, auditLogLock: true
  });
  const [ipWhitelist, setIpWhitelist] = useState(['192.168.1.1', '10.0.0.5']);
  const [newIp, setNewIp] = useState('');

  useEffect(() => {
    let score = 0;
    if (security.enforce2FA) score += 20;
    if (security.passwordPolicyLevel === 'Enterprise') score += 20; else if (security.passwordPolicyLevel === 'Strong') score += 10;
    if (security.bruteForceProtection) score += 20;
    if (security.suspiciousLoginAlerts) score += 20;
    if (security.apiRateLimitPerMinute <= 100) score += 20;
    setHealthScore(score);
  }, [security]);

  const addIp = () => { if(newIp && !ipWhitelist.includes(newIp)) { setIpWhitelist([...ipWhitelist, newIp]); setNewIp(''); } };
  const removeIp = (ip) => setIpWhitelist(ipWhitelist.filter(i => i !== ip));
  const handleSaveSecuritySettings = () => toast.success("Enterprise security policies deployed globally.");

  const Toggle = ({ label, desc, stateKey }) => (
    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-200 dark:border-slate-800/50 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
      <div><p className="font-bold text-slate-900 dark:text-slate-200">{label}</p><p className="text-[11px] text-slate-500 mt-0.5">{desc}</p></div>
      <button onClick={() => setSecurity({...security, [stateKey]: !security[stateKey]})} className={`w-12 h-6 rounded-full transition-colors relative ${security[stateKey] ? 'bg-indigo-600 dark:bg-indigo-500' : 'bg-slate-300 dark:bg-slate-700'}`}>
        <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${security[stateKey] ? 'translate-x-6' : ''}`} />
      </button>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-[1200px] mx-auto pb-24">
      <div><h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Security & Compliance</h1><p className="text-slate-500 dark:text-slate-400 mt-1">Configure zero-trust policies, rate limiting, and access control.</p></div>

      <div className={`p-6 rounded-2xl border flex items-center justify-between ${healthScore >= 80 ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20' : healthScore >= 50 ? 'bg-amber-50 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/20' : 'bg-red-50 border-red-200 dark:bg-red-500/10 dark:border-red-500/20'}`}>
        <div>
          <h3 className={`text-lg font-bold flex items-center gap-2 ${healthScore >= 80 ? 'text-emerald-700 dark:text-emerald-400' : healthScore >= 50 ? 'text-amber-700 dark:text-amber-400' : 'text-red-700 dark:text-red-400'}`}><Shield size={20}/> Security Health Score</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Based on active policies and threat protection mechanisms.</p>
        </div>
        <div className={`text-5xl font-black ${healthScore >= 80 ? 'text-emerald-600 dark:text-emerald-500' : healthScore >= 50 ? 'text-amber-600 dark:text-amber-500' : 'text-red-600 dark:text-red-500'}`}>{healthScore}%</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm dark:shadow-lg space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><Lock size={18} className="text-indigo-600 dark:text-indigo-400"/> Authentication Policies</h3>
          <Toggle label="Enforce 2FA (MFA)" desc="Require Authenticator App for all Admins." stateKey="enforce2FA" />
          
          <div className="p-4 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-200 dark:border-slate-800/50">
            <label className="font-bold text-slate-900 dark:text-slate-200 text-sm block mb-2">Password Policy Level</label>
            <select value={security.passwordPolicyLevel} onChange={e=>setSecurity({...security, passwordPolicyLevel: e.target.value})} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-3 py-2 outline-none focus:border-indigo-500 text-sm font-medium cursor-pointer">
              <option value="Basic">Basic (8 chars, 1 number)</option><option value="Strong">Strong (12 chars, Special, Capital)</option><option value="Enterprise">Enterprise (16 chars, No dictionary words)</option>
            </select>
          </div>
          <div className="flex gap-4">
            <div className="flex-1 p-4 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-200 dark:border-slate-800/50">
              <label className="font-bold text-slate-900 dark:text-slate-200 text-xs block mb-2">Session Timeout (Mins)</label>
              <input type="number" value={security.sessionTimeoutMinutes} onChange={e=>setSecurity({...security, sessionTimeoutMinutes: e.target.value})} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-3 py-2 text-center outline-none focus:border-indigo-500" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm dark:shadow-lg space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><Globe size={18} className="text-blue-600 dark:text-blue-400"/> Network Access Control</h3>
          <Toggle label="Geo-Restriction" desc="Block logins originating outside permitted countries." stateKey="geoRestrictionEnabled" />
          
          <div className="p-4 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-200 dark:border-slate-800/50 flex flex-col h-[200px]">
            <label className="font-bold text-slate-900 dark:text-slate-200 text-sm block mb-2">Admin Panel IP Whitelist</label>
            <div className="flex gap-2 mb-3">
              <input type="text" placeholder="e.g. 192.168.1.50" value={newIp} onChange={e=>setNewIp(e.target.value)} className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-3 py-1.5 text-sm outline-none font-mono focus:border-indigo-500" />
              <button onClick={addIp} className="px-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white transition-colors"><Plus size={16}/></button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {ipWhitelist.map(ip => (
                <div key={ip} className="flex justify-between items-center p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg group">
                  <span className="text-sm font-mono text-emerald-600 dark:text-emerald-400">{ip}</span>
                  <button onClick={() => removeIp(ip)} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14}/></button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm dark:shadow-lg space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><AlertTriangle size={18} className="text-amber-600 dark:text-amber-400"/> Threat Mitigation</h3>
          <Toggle label="Suspicious Login Alerts" desc="Email admins if login detected from new device/location." stateKey="suspiciousLoginAlerts" />
          <Toggle label="Brute Force Protection" desc="Auto-ban IPs with high failure rates temporarily." stateKey="bruteForceProtection" />
        </div>

        <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm dark:shadow-lg space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><Database size={18} className="text-emerald-600 dark:text-emerald-400"/> Data & Compliance</h3>
          <Toggle label="Strict GDPR Mode" desc="Enable right-to-be-forgotten auto-deletion scripts." stateKey="gdprMode" />
          <Toggle label="Audit Log Immutability" desc="Prevent super-admins from deleting security logs." stateKey="auditLogLock" />
        </div>
      </div>

      <div className="fixed bottom-6 right-10 z-50">
        <button onClick={() => setConfirmModal(true)} className="flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg transition-all hover:scale-105">
          <Save size={18} /> Enforce Security Policies
        </button>
      </div>

      <ConfirmModal isOpen={confirmModal} onClose={() => setConfirmModal(false)} onConfirm={handleSaveSecuritySettings} title="Deploy Security Policies?" message="Warning: Changing IP Whitelists or MFA requirements may instantly log out users who do not meet the new compliance standards." confirmText="Acknowledge & Deploy" isDanger={true} />
    </motion.div>
  );
};
export default AdminSettings;