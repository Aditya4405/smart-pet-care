import React, { useState, useEffect, useRef } from 'react';
import { FileText, Download, CheckCircle, Camera } from 'lucide-react';
import toast from 'react-hot-toast';
import { API } from '../config/api'; 

const BASE_URL = API.BASE_URL;
const API_BASE = API.BASE_API;

const Profile = () => {
  const fileInputRef = useRef(null);

  // 1. Get Basic Auth Data
  const currentUser = JSON.parse(localStorage.getItem('user')) || {};
  const token = localStorage.getItem('token');
  const role = currentUser.role?.toUpperCase() || 'USER';
  
  const cleanId = currentUser.id ? String(currentUser.id).split(':')[0] : null;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  // 2. Initialize Empty Form Data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    gender: 'Male',
    clinicName: '',
    specialization: '',
    licenseNumber: '',
    certificateUrl: null
  });

  // 3. FETCH FULL PROFILE ON LOAD
  useEffect(() => {
    const fetchFullProfile = async () => {
      if (!cleanId) return;
      
      try {
        const res = await fetch(`${API_BASE}/users/${cleanId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          setFormData({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            phone: data.phone || '',
            location: data.location || '',
            gender: data.gender || 'Male',
            clinicName: data.clinicName || '',
            specialization: data.specialization || '',
            licenseNumber: data.licenseNumber || '',
            certificateUrl: data.certificateUrl || null
          });

          // Format Image URL if it exists
          if (data.imageUrl) {
            setProfileImage(data.imageUrl.startsWith('/uploads') ? `${BASE_URL}${data.imageUrl}` : data.imageUrl);
          }
        }
      } catch (error) {
        toast.error("Failed to load profile data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFullProfile();
  }, [cleanId, token]);

  // --- HANDLERS ---
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file)); 
    }
  };

  const handleSaveProfile = async () => {
    if (!cleanId) return;
    
    setIsSaving(true);
    const loadingToast = toast.loading("Saving profile...");
    
    try {
      const res = await fetch(`${API_BASE}/users/${cleanId}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        toast.success("Profile updated successfully!", { id: loadingToast });
        
        const updatedUser = { ...currentUser, firstName: formData.firstName, lastName: formData.lastName };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        window.dispatchEvent(new Event('storage')); 
      } else {
        toast.error("Failed to save changes.", { id: loadingToast });
      }
    } catch (error) {
      toast.error("Network error.", { id: loadingToast });
    } finally {
      setIsSaving(false);
    }
  };

  // ✅ FIXED: Robust URL building for the certificate download
  const handleDownloadCertificate = () => {
    if (!formData.certificateUrl) return toast.error("No certificate uploaded.");
    
    let fileUrl = formData.certificateUrl;

    if (!fileUrl.startsWith('http')) {
      if (!fileUrl.startsWith('/')) {
        fileUrl = `/uploads/${fileUrl}`;
      }
      const cleanBaseUrl = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
      fileUrl = `${cleanBaseUrl}${fileUrl}`;
    }
      
    window.open(fileUrl, '_blank');
  };

  if (isLoading) {
    return <div className="p-20 text-center text-slate-500 animate-pulse">Loading Profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Profile Settings</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage your personal information and account security.</p>
        </div>
        <span className={`self-start px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border ${role === 'VET' ? 'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800' : 'bg-cyan-50 text-cyan-700 border-cyan-100 dark:bg-cyan-900/20 dark:text-cyan-300 dark:border-cyan-800'}`}>
            {role === 'VET' ? 'Veterinarian Account' : 'Pet Owner Account'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* === LEFT COLUMN: AVATAR CARD === */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden relative">
            <div className={`h-24 bg-gradient-to-r ${role === 'VET' ? 'from-purple-500 to-indigo-600' : 'from-cyan-500 to-blue-600'}`}></div>
            <div className="px-6 relative text-center">
               
               {/* EDITABLE AVATAR CONTAINER */}
               <div className="relative -mt-12 mx-auto w-24 h-24 rounded-full border-4 border-white dark:border-slate-800 bg-white dark:bg-slate-700 flex items-center justify-center shadow-md group overflow-hidden">
                  
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl font-bold text-slate-400 uppercase">
                        {formData.firstName?.[0] || 'U'}{formData.lastName?.[0] || ''}
                    </span>
                  )}

                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  
                  <button 
                    onClick={() => fileInputRef.current.click()}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                  >
                    <Camera className="w-8 h-8 text-white/90" />
                  </button>
               </div>

               <div className="py-6">
                 <h2 className="text-xl font-bold text-slate-900 dark:text-white capitalize">{formData.firstName} {formData.lastName}</h2>
                 <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{formData.email}</p>
               </div>
            </div>
          </div>
        </div>

        {/* === RIGHT COLUMN: EDIT FORM === */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Basic Info Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-700">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Basic Information</h3>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup label="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} />
                <InputGroup label="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} />
                
                <div className="col-span-1 md:col-span-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
                    <input type="email" value={formData.email} readOnly className="w-full mt-1 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-slate-500 cursor-not-allowed"/>
                </div>

                <InputGroup label="Phone Number" name="phone" value={formData.phone} onChange={handleInputChange} />
                <InputGroup label="Location" name="location" value={formData.location} onChange={handleInputChange} />
              </div>

              {/* === VET PROFESSIONAL SECTION === */}
              {role === 'VET' && (
                <div className="pt-8 mt-2 border-t border-slate-100 dark:border-slate-700">
                  <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-6">Professional Details</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <InputGroup label="Clinic Name" name="clinicName" value={formData.clinicName} onChange={handleInputChange} />
                    <InputGroup label="Specialization" name="specialization" value={formData.specialization} onChange={handleInputChange} />
                    <div className="md:col-span-2"><InputGroup label="License Number" name="licenseNumber" value={formData.licenseNumber} onChange={handleInputChange} /></div>
                  </div>

                  {/* CERTIFICATE DISPLAY SECTION */}
                  <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                    <label className="text-xs font-bold text-slate-500 uppercase mb-3 block">Uploaded Certification</label>
                    
                    <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-lg flex items-center justify-center">
                                <FileText className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[150px] sm:max-w-xs">
                                  {formData.certificateUrl ? formData.certificateUrl.split('/').pop() : 'No Certificate Uploaded'}
                                </p>
                                {formData.certificateUrl && (
                                  <p className="text-xs text-slate-500 flex items-center gap-1">
                                      <CheckCircle className="w-3 h-3 text-emerald-500" /> Verified by Admin
                                  </p>
                                )}
                            </div>
                        </div>
                        
                        {/* ACTIVE DOWNLOAD BUTTON */}
                        <button 
                          onClick={handleDownloadCertificate}
                          disabled={!formData.certificateUrl}
                          className="p-2 text-slate-400 hover:text-emerald-600 disabled:opacity-50 disabled:hover:text-slate-400 transition-colors"
                          title="View / Download Certificate"
                        >
                            <Download className="w-5 h-5" />
                        </button>
                    </div>
                  </div>

                </div>
              )}
              
              <div className="pt-6 border-t border-slate-100 dark:border-slate-700 flex items-center justify-end gap-4">
                <button 
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className={`px-8 py-2.5 rounded-xl text-white font-bold shadow-lg transition-all active:scale-95 disabled:opacity-70 ${role === 'VET' ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/30' : 'bg-cyan-500 hover:bg-cyan-600 shadow-cyan-500/30'}`}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// UPGRADED REUSABLE INPUT COMPONENT
const InputGroup = ({ label, name, value, onChange, type="text", placeholder }) => (
  <div>
    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">{label}</label>
    <input 
      type={type} 
      name={name}
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full mt-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all placeholder:text-slate-400"
    />
  </div>
);

export default Profile;