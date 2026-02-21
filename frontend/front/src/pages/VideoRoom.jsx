import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, Video, VideoOff, PhoneOff, 
  MessageSquare, Send, Maximize, Settings, User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VideoRoom = () => {
  const navigate = useNavigate();
  
  // Call States
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  
  // Chat States
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Dr. Sarah Wilson', text: 'Hello! I am reviewing Bella\'s profile now.', time: '10:00 AM', isMe: false },
    { id: 2, sender: 'You', text: 'Great, thank you doctor. Can you see her ear clearly?', time: '10:01 AM', isMe: true }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef(null);

  // Timer Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Format Time (MM:SS)
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    setMessages([...messages, {
      id: Date.now(),
      sender: 'You',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    }]);
    setNewMessage('');
  };

  const handleEndCall = () => {
    if (window.confirm("Are you sure you want to end this consultation?")) {
      alert("Consultation ended. Redirecting to dashboard...");
      // In a real app, you would send an API request to mark the appointment as completed here
      navigate('/owner/dashboard'); 
    }
  };

  return (
    <div className="h-[calc(100vh-2rem)] md:h-[calc(100vh-6rem)] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col animate-in zoom-in-95 duration-500">
      
      {/* HEADER */}
      <div className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-6 z-10">
        <div className="flex items-center gap-4">
           <div className="flex flex-col">
              <h2 className="text-white font-bold text-lg leading-tight">Consultation: Dr. Sarah Wilson</h2>
              <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                 <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                 {formatTime(callDuration)}
              </span>
           </div>
        </div>
        <div className="flex gap-2">
           <button className="p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white transition-colors">
              <Settings className="w-5 h-5" />
           </button>
           <button 
             onClick={() => setIsChatOpen(!isChatOpen)}
             className={`p-2 rounded-full transition-colors ${isChatOpen ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-300 hover:text-white'}`}
           >
              <MessageSquare className="w-5 h-5" />
           </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* VIDEO GRID */}
        <div className="flex-1 bg-black relative flex items-center justify-center p-4">
           
           {/* Main Feed (Doctor) */}
           <div className="w-full h-full rounded-2xl overflow-hidden relative group">
              <img 
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1200&q=80" 
                alt="Doctor Feed" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center gap-2">
                 <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center">
                    <User className="w-3 h-3 text-white" />
                 </div>
                 <span className="text-white text-sm font-bold">Dr. Sarah Wilson</span>
              </div>
           </div>

           {/* Self View (PiP) */}
           <div className="absolute bottom-24 right-6 w-32 h-48 md:w-48 md:h-64 bg-slate-800 rounded-xl overflow-hidden border-2 border-slate-700 shadow-2xl z-20">
              {isVideoOff ? (
                  <div className="w-full h-full flex items-center justify-center bg-slate-800">
                     <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center">
                        <User className="w-6 h-6 text-slate-400" />
                     </div>
                  </div>
              ) : (
                  <img 
                    src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80" 
                    alt="Self Feed (Pet)" 
                    className="w-full h-full object-cover"
                  />
              )}
              <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-xs text-white font-medium">You (Bella)</div>
              {isMuted && (
                  <div className="absolute top-2 right-2 bg-red-500 p-1 rounded-full">
                     <MicOff className="w-3 h-3 text-white" />
                  </div>
              )}
           </div>

           {/* CALL CONTROLS (Floating Bottom Center) */}
           <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-slate-900/80 backdrop-blur-xl px-6 py-3 rounded-full border border-slate-700/50 shadow-2xl z-30">
              
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isMuted ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-white'}`}
              >
                 {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <button 
                onClick={() => setIsVideoOff(!isVideoOff)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isVideoOff ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-white'}`}
              >
                 {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
              </button>

              <button className="w-12 h-12 rounded-full flex items-center justify-center bg-slate-700 hover:bg-slate-600 text-white transition-all hidden md:flex">
                 <Maximize className="w-5 h-5" />
              </button>

              <div className="w-px h-8 bg-slate-700 mx-2"></div>

              <button 
                onClick={handleEndCall}
                className="w-14 h-14 rounded-full flex items-center justify-center bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20 transition-transform active:scale-95"
              >
                 <PhoneOff className="w-6 h-6" />
              </button>

           </div>
        </div>

        {/* CHAT SIDEBAR */}
        {isChatOpen && (
           <div className="w-full md:w-80 lg:w-96 bg-slate-900 border-l border-slate-800 flex flex-col absolute md:relative right-0 h-full z-40 animate-in slide-in-from-right duration-300">
              <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
                 <h3 className="text-white font-bold">In-Call Messages</h3>
                 <button onClick={() => setIsChatOpen(false)} className="md:hidden text-slate-400"><PhoneOff className="w-4 h-4"/></button>
              </div>

              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                 {messages.map((msg) => (
                    <div key={msg.id} className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                       <span className="text-[10px] text-slate-500 mb-1">{msg.sender} • {msg.time}</span>
                       <div className={`px-4 py-2.5 rounded-2xl max-w-[85%] text-sm ${
                          msg.isMe 
                          ? 'bg-cyan-600 text-white rounded-tr-none' 
                          : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                       }`}>
                          {msg.text}
                       </div>
                    </div>
                 ))}
                 <div ref={chatEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 bg-slate-900 border-t border-slate-800">
                 <form onSubmit={handleSendMessage} className="flex items-center gap-2 bg-slate-800 rounded-full p-1 pl-4 border border-slate-700">
                    <input 
                      type="text" 
                      placeholder="Type a message..." 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 bg-transparent text-white text-sm focus:outline-none"
                    />
                    <button 
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="w-8 h-8 rounded-full bg-cyan-600 hover:bg-cyan-700 flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                       <Send className="w-4 h-4 ml-[-2px] mt-[2px]" />
                    </button>
                 </form>
              </div>
           </div>
        )}

      </div>
    </div>
  );
};

export default VideoRoom;