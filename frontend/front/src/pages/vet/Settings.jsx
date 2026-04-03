import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, Shield, Globe, Trash2, Moon, Sun, Monitor, 
  Eye, EyeOff, ChevronRight, AlertTriangle 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { API } from '../../config/api';
import { useTheme } from '../../hooks/useTheme';

const BASE_URL = API.BASE_API;

// --- REUSABLE COMPONENTS ---
const Section = ({ title, description, children, className = "" }) => (
  <div className={`bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden ${className}`}>
    <div className="p-6 border-b border-slate-200 dark:border-slate-700">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
      {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const Toggle = ({ label, description, checked, onChange }) => (
  <div className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
    <div className="pr-4">
      <p className="font-semibold text-slate-900 dark:text-white text-sm">{label}</p>
      {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
    </div>
    <button 
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${checked ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-700'}`}
    >
      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  </div>
);

// --- MAIN PAGE COMPONENT ---
const Settings = () => {
  const navigate = useNavigate();
  const { theme: appTheme, toggleTheme } = useTheme();
  
  const currentUser = JSON.parse(localStorage.getItem('user')) || { id: 1 };
  const token = localStorage.getItem('token');

  const [activeTab, setActiveTab] = useState('notifications');
  const [isLoading, setIsLoading] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });

  const [settings, setSettings] = useState({
    appointments: true, vaccinations: true, marketplace: false, 
    messages: true, marketing: false, sms: true, theme: 'System', language: 'English (US)'
  });

  // 1. FETCH INITIAL SETTINGS
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${BASE_URL}/settings/${currentUser.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) setSettings(await res.json());
      } catch (error) {
        toast.error("Failed to load settings");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, [currentUser.id, token]);

  // 2. AUTO-SAVE SETTINGS
  const handleUpdateSetting = async (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings); 

    try {
      await fetch(`${BASE_URL}/settings/${currentUser.id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
    } catch (e) {
      toast.error("Failed to save preference");
    }
  };

  // 3. CHANGE PASSWORD
  const handlePasswordUpdate = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword) return toast.error("Please fill both fields.");
    
    const loadingToast = toast.loading("Updating password...");
    try {
      const res = await fetch(`${BASE_URL}/settings/${currentUser.id}/password`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(passwordData)
      });

      if (res.ok) {
        toast.success("Password updated successfully!", { id: loadingToast });
        setPasswordData({ currentPassword: '', newPassword: '' });
      } else {
        const err = await res.text();
        toast.error(err || "Failed to update password", { id: loadingToast });
      }
    } catch (e) {
      toast.error("Network error", { id: loadingToast });
    }
  };

  // 4. CHANGE THEME
  const handleThemeChange = (newTheme) => {
    handleUpdateSetting('theme', newTheme);
    if ((newTheme === 'Dark' && appTheme !== 'dark') || (newTheme === 'Light' && appTheme === 'dark')) {
      toggleTheme();
    }
  };

  // 5. DELETE ACCOUNT
  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you ABSOLUTELY sure? This will delete all your practice data, orders, and appointments permanently.")) return;
    
    try {
      const res = await fetch(`${BASE_URL}/settings/${currentUser.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success("Account deleted.");
        localStorage.clear();
        navigate('/login');
      }
    } catch (e) {
      toast.error("Failed to delete account");
    }
  };

  const MENU = [
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: Globe },
    { id: 'danger', label: 'Danger Zone', icon: Trash2, danger: true },
  ];

  if (isLoading) return <div className="p-20 text-center animate-pulse text-slate-500">Loading settings...</div>;

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your practice configuration and security.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 flex-shrink-0">
          <nav className="space-y-1 sticky top-24">
            {MENU.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeTab === item.id
                    ? item.danger ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' : 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700'
                    : item.danger ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" /> {item.label}
                {activeTab === item.id && <ChevronRight className="w-4 h-4 ml-auto opacity-50" />}
              </button>
            ))}
          </nav>
        </aside>

        <div className="flex-1 min-w-0">
          
          {activeTab === 'notifications' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <Section title="Practice Alerts" description="Manage how you receive updates about your clinic.">
                <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {/* Mapping Vet labels to the backend entity fields */}
                  <Toggle label="New Appointment Requests" description="Get notified when a pet owner books a slot." checked={settings.appointments} onChange={(v) => handleUpdateSetting('appointments', v)} />
                  <Toggle label="Emergency Alerts" description="High priority notifications for critical cases." checked={settings.vaccinations} onChange={(v) => handleUpdateSetting('vaccinations', v)} />
                  <Toggle label="Patient Reviews" description="When a client leaves feedback." checked={settings.messages} onChange={(v) => handleUpdateSetting('messages', v)} />
                </div>
              </Section>
              <Section title="Communication" description="Manage marketing and direct messages.">
                 <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  <Toggle label="Platform Updates" description="News about VetConsole features." checked={settings.marketing} onChange={(v) => handleUpdateSetting('marketing', v)} />
                  <Toggle label="SMS Notifications" description="Receive urgent alerts via SMS." checked={settings.sms} onChange={(v) => handleUpdateSetting('sms', v)} />
                </div>
              </Section>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <Section title="Password" description="Update your password to keep your account secure.">
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Current Password</label>
                    <input type="password" value={passwordData.currentPassword} onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">New Password</label>
                    <div className="relative">
                      <input type={showPass ? "text" : "password"} value={passwordData.newPassword} onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-emerald-500" />
                      <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <button onClick={handlePasswordUpdate} className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity">
                    Update Password
                  </button>
                </div>
              </Section>
              
              <Section title="Two-Factor Authentication">
                <Toggle label="Enable 2FA" description="Add an extra layer of security via SMS or Authenticator App." checked={false} onChange={() => {}} />
              </Section>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <Section title="Appearance" description="Customize your workspace theme.">
                <div className="grid grid-cols-3 gap-4">
                  {['Light', 'Dark', 'System'].map((theme) => (
                    <button key={theme} onClick={() => handleThemeChange(theme)} className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${settings.theme === theme ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}>
                      {theme === 'Light' && <Sun className={`w-6 h-6 ${settings.theme === theme ? 'text-amber-500' : 'text-slate-400'}`} />}
                      {theme === 'Dark' && <Moon className={`w-6 h-6 ${settings.theme === theme ? 'text-indigo-500' : 'text-slate-400'}`} />}
                      {theme === 'System' && <Monitor className={`w-6 h-6 ${settings.theme === theme ? 'text-emerald-500' : 'text-slate-400'}`} />}
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{theme}</span>
                    </button>
                  ))}
                </div>
              </Section>
              <Section title="Localization">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                     <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Language</label>
                     <select value={settings.language} onChange={e => handleUpdateSetting('language', e.target.value)} className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none text-slate-900 dark:text-white cursor-pointer">
                       <option>English (US)</option><option>Hindi</option><option>French</option>
                     </select>
                  </div>
                </div>
              </Section>
            </div>
          )}

          {activeTab === 'danger' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-200 dark:border-red-900/30 overflow-hidden">
                <div className="p-6">
                   <h3 className="text-lg font-bold text-red-700 dark:text-red-400 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" /> Danger Zone
                   </h3>
                   <p className="text-sm text-red-600/80 dark:text-red-400/80 mt-1">These actions are irreversible. Please proceed with caution.</p>
                </div>
                <div className="px-6 pb-6 space-y-4">
                   <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl border border-red-100 dark:border-red-900/20">
                      <div>
                         <p className="font-bold text-slate-900 dark:text-white">Export Practice Data</p>
                         <p className="text-xs text-slate-500">Download a full copy of your patient records and financial data.</p>
                      </div>
                      <button onClick={() => toast.success("Exporting data to CSV...")} className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
                         Export CSV
                      </button>
                   </div>

                   <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl border border-red-100 dark:border-red-900/20">
                      <div>
                         <p className="font-bold text-slate-900 dark:text-white">Delete Account</p>
                         <p className="text-xs text-slate-500">Permanently delete your account and all associated data.</p>
                      </div>
                      <button onClick={handleDeleteAccount} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold shadow-lg shadow-red-500/20 transition-all active:scale-95">
                         Delete Account
                      </button>
                   </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Settings;