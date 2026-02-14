import React, { useState } from 'react';
import { 
  Bell, Shield, Globe, Lock, CreditCard, Trash2, Moon, Sun, Monitor, 
  Smartphone, LogOut, Check, ChevronRight, Download, AlertTriangle, Eye, EyeOff 
} from 'lucide-react';

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

// ✅ FIXED TOGGLE COMPONENT
const Toggle = ({ label, description, checked, onChange }) => (
  <div className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
    <div className="pr-4">
      <p className="font-semibold text-slate-900 dark:text-white text-sm">{label}</p>
      {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
    </div>
    <button 
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
        checked ? 'bg-teal-600' : 'bg-slate-200 dark:bg-slate-700'
      }`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  </div>
);

// --- SECTIONS ---

const NotificationsSection = () => {
  const [toggles, setToggles] = useState({
    appointments: true,
    vaccinations: true,
    marketplace: false,
    messages: true,
    marketing: false,
    sms: true,
  });

  const toggle = (key) => setToggles(p => ({ ...p, [key]: !p[key] }));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Section title="Alerts & Reminders" description="Manage how you receive important updates.">
        <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
          <Toggle 
            label="Appointment Reminders" 
            description="Get notified 24h before your vet visit."
            checked={toggles.appointments} 
            onChange={() => toggle('appointments')} 
          />
          <Toggle 
            label="Vaccination Alerts" 
            description="Receive alerts when vaccinations are due."
            checked={toggles.vaccinations} 
            onChange={() => toggle('vaccinations')} 
          />
          <Toggle 
            label="Vet Messages" 
            description="Direct messages from your veterinarian."
            checked={toggles.messages} 
            onChange={() => toggle('messages')} 
          />
        </div>
      </Section>

      <Section title="Marketing & Promo" description="Stay updated with the latest deals.">
         <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
          <Toggle 
            label="Marketplace Updates" 
            description="New products and discounts on pet food."
            checked={toggles.marketplace} 
            onChange={() => toggle('marketplace')} 
          />
          <Toggle 
            label="Marketing Emails" 
            description="Newsletters and product features."
            checked={toggles.marketing} 
            onChange={() => toggle('marketing')} 
          />
          <Toggle 
            label="SMS Notifications" 
            description="Receive urgent alerts via SMS."
            checked={toggles.sms} 
            onChange={() => toggle('sms')} 
          />
        </div>
      </Section>
    </div>
  );
};

const SecuritySection = () => {
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Section title="Password" description="Ensure your account uses a strong password.">
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Current Password</label>
            <input type="password" className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">New Password</label>
            <div className="relative">
              <input type={showPass ? "text" : "password"} className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-teal-500" />
              <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <button className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity">
            Update Password
          </button>
        </div>
      </Section>

      <Section title="Active Sessions" description="Manage devices where you are currently logged in.">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white dark:bg-slate-700 rounded-lg shadow-sm">
                <Monitor className="w-5 h-5 text-slate-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Windows PC - Chrome</p>
                <p className="text-xs text-slate-500">Lucknow, India • Active Now</p>
              </div>
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md border border-green-100">Current</span>
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 opacity-70">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white dark:bg-slate-700 rounded-lg shadow-sm">
                <Smartphone className="w-5 h-5 text-slate-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">iPhone 14 - Safari</p>
                <p className="text-xs text-slate-500">Lucknow, India • 2 days ago</p>
              </div>
            </div>
            <button className="text-xs font-bold text-red-500 hover:underline">Revoke</button>
          </div>
        </div>
      </Section>

      <Section title="Two-Factor Authentication">
        <Toggle 
          label="Enable 2FA" 
          description="Add an extra layer of security to your account."
          checked={false} 
          onChange={() => {}} 
        />
      </Section>
    </div>
  );
};

const PreferencesSection = () => (
  <div className="space-y-6 animate-in fade-in duration-500">
    <Section title="Appearance" description="Customize how PetCare looks on your device.">
      <div className="grid grid-cols-3 gap-4">
        {['Light', 'Dark', 'System'].map((theme) => (
          <button key={theme} className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${theme === 'System' ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}>
            {theme === 'Light' && <Sun className="w-6 h-6 text-amber-500" />}
            {theme === 'Dark' && <Moon className="w-6 h-6 text-indigo-500" />}
            {theme === 'System' && <Monitor className="w-6 h-6 text-slate-500" />}
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{theme}</span>
          </button>
        ))}
      </div>
    </Section>

    <Section title="Localization">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
           <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Language</label>
           <select className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none">
             <option>English (US)</option>
             <option>Hindi</option>
             <option>Spanish</option>
           </select>
        </div>
        <div>
           <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Timezone</label>
           <select className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none">
             <option>(GMT+05:30) India Standard Time</option>
             <option>(GMT-08:00) Pacific Time</option>
           </select>
        </div>
      </div>
    </Section>
    
    <Section title="Units">
        <Toggle 
            label="Use Metric System" 
            description="Display weight in kg and temperature in Celsius."
            checked={true} 
            onChange={() => {}} 
        />
    </Section>
  </div>
);

const BillingSection = () => (
  <div className="space-y-6 animate-in fade-in duration-500">
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
       <div className="relative z-10 flex justify-between items-start">
         <div>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Current Plan</p>
            <h3 className="text-3xl font-bold">PetCare Pro</h3>
            <p className="text-slate-300 mt-2">$12.00 / month</p>
         </div>
         <span className="bg-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full">Active</span>
       </div>
       <div className="relative z-10 mt-6 pt-6 border-t border-slate-700 flex justify-between items-center">
          <p className="text-sm text-slate-400">Next billing date: <span className="text-white font-bold">Oct 24, 2026</span></p>
          <button className="text-sm font-bold hover:text-teal-400 transition-colors">Manage Subscription</button>
       </div>
       <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
    </div>

    <Section title="Payment Methods">
       <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-xl">
          <div className="flex items-center gap-4">
             <div className="w-12 h-8 bg-slate-100 rounded flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-slate-600" />
             </div>
             <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Visa ending in 4242</p>
                <p className="text-xs text-slate-500">Expiry 12/2028</p>
             </div>
          </div>
          <button className="text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white">Edit</button>
       </div>
       <button className="mt-4 text-sm font-bold text-teal-600 hover:underline">+ Add Payment Method</button>
    </Section>

    <Section title="Billing History">
       <div className="space-y-1">
          {[1, 2, 3].map((i) => (
             <div key={i} className="flex items-center justify-between py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 px-2 rounded-lg transition-colors">
                <div className="flex items-center gap-4">
                   <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                      <Download className="w-4 h-4 text-slate-500" />
                   </div>
                   <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">Invoice #2024-00{i}</p>
                      <p className="text-xs text-slate-500">Oct {24 - i}, 2025</p>
                   </div>
                </div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">$12.00</p>
             </div>
          ))}
       </div>
    </Section>
  </div>
);

const DangerZoneSection = () => (
  <div className="space-y-6 animate-in fade-in duration-500">
    <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-200 dark:border-red-900/30 overflow-hidden">
      <div className="p-6">
         <h3 className="text-lg font-bold text-red-700 dark:text-red-400 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> Danger Zone
         </h3>
         <p className="text-sm text-red-600/80 dark:text-red-400/80 mt-1">
            Irreversible actions. Please proceed with caution.
         </p>
      </div>
      <div className="px-6 pb-6 space-y-4">
         <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl border border-red-100 dark:border-red-900/20">
            <div>
               <p className="font-bold text-slate-900 dark:text-white">Export Data</p>
               <p className="text-xs text-slate-500">Download a copy of all your pet data.</p>
            </div>
            <button className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
               Export CSV
            </button>
         </div>

         <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl border border-red-100 dark:border-red-900/20">
            <div>
               <p className="font-bold text-slate-900 dark:text-white">Delete Account</p>
               <p className="text-xs text-slate-500">Permanently delete your account and data.</p>
            </div>
            <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold shadow-lg shadow-red-500/20">
               Delete Account
            </button>
         </div>
      </div>
    </div>
  </div>
);

// --- MAIN PAGE COMPONENT ---

const Settings = () => {
  const [activeTab, setActiveTab] = useState('notifications');

  const MENU = [
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: Globe },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'danger', label: 'Danger Zone', icon: Trash2, danger: true },
  ];

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your account preferences and security.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <aside className="lg:w-64 flex-shrink-0">
          <nav className="space-y-1 sticky top-24">
            {MENU.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeTab === item.id
                    ? item.danger 
                        ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                        : 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700'
                    : item.danger
                        ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10'
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
                {activeTab === item.id && <ChevronRight className="w-4 h-4 ml-auto opacity-50" />}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          {activeTab === 'notifications' && <NotificationsSection />}
          {activeTab === 'security' && <SecuritySection />}
          {activeTab === 'preferences' && <PreferencesSection />}
          {activeTab === 'billing' && <BillingSection />}
          {activeTab === 'danger' && <DangerZoneSection />}
        </div>
      </div>
    </div>
  );
};

export default Settings;