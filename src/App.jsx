import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { 
  Leaf, Globe, Award, Sprout, ArrowRight, User, Briefcase, MapPin, 
  MessageCircle, Mail, Phone, Instagram, Facebook, 
  Twitter, X, CheckCircle2, ChevronRight 
} from 'lucide-react';
import logo from './assets/logo2.png'

// --- CONFIGURATION ---
const EMAILJS_SERVICE_ID = "service_ka4y78i";
const EMAILJS_ADMIN_TEMPLATE = "template_fef2env"; // Notification for YOU
const EMAILJS_USER_TEMPLATE = "template_xmb8upy";   // Auto-reply for USER
const EMAILJS_PUBLIC_KEY = "yVXWtDK0F6jrFjIUU";

const galleryItems = [
  { url: "https://images.pexels.com/photos/1483880/pexels-photo-1483880.jpeg?auto=compress&cs=tinysrgb&w=1260", title: "Pure Organic", sub: "Carbon Enrichment" },
  { url: "https://images.pexels.com/photos/235925/pexels-photo-235925.jpeg?auto=compress&cs=tinysrgb&w=1260", title: "Soil Health", sub: "Microbial Science" },
  { url: "https://images.pexels.com/photos/2165688/pexels-photo-2165688.jpeg?auto=compress&cs=tinysrgb&w=1260", title: "Golden Yields", sub: "Farmer Prosperity" }
];

const App = () => {
  const [lang, setLang] = useState('en');
  const [userType, setUserType] = useState('farmer');
  const [activeSlide, setActiveSlide] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [showPopup, setShowPopup] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [heroSuccess, setHeroSuccess] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowPopup(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const moveCursor = (e) => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % galleryItems.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // --- UNIFIED EMAILJS LOGIC (FIXED RELOAD) ---
  const sendEmail = async (e, formType) => {
    if (e) e.preventDefault(); // Prevents page reload
    setIsSubmitting(true);

    const form = e.target;
    const formData = new FormData(form);
    
    const templateParams = {
      form_type: formType,
      full_name: formData.get('full_name') || "Interested User",
      email: formData.get('email'),
      phone: formData.get('phone') || "Not provided",
      city: formData.get('city') || "Not provided",
      message: formData.get('message') || "User requested launch notification.",
      user_role: userType,
    };

    try {
      // 1. Send Notification to YOU
      await emailjs.send(
        EMAILJS_SERVICE_ID, 
        EMAILJS_ADMIN_TEMPLATE, 
        templateParams, 
        EMAILJS_PUBLIC_KEY
      );

      // 2. Send Auto-Reply to USER
      await emailjs.send(
        EMAILJS_SERVICE_ID, 
        EMAILJS_USER_TEMPLATE, 
        templateParams, 
        EMAILJS_PUBLIC_KEY
      );

      if (formType === 'Launch Notification') {
        setHeroSuccess(true);
      } else {
        setContactSuccess(true);
      }
      
      form.reset();
    } catch (error) {
      alert("Submission failed. Please check your connection.");
      console.error("EmailJS Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const content = {
    en: {
      tag: "Launching Soon",
      tagline: "Cultivating the Future of Soil.",
      sub: "AgroVita Organics combines innovation with tradition. We are building a sustainable range of lab-tested organic fertilizers to make your harvest greener and healthier.",
      notifyBtn: "Notify Me",
      formTitle: "Connect With Us",
      farmer: "I am a Farmer",
      dealer: "I am a Dealer",
      placeholders: { name: "Full Name", email: "Email Address", phone: "WhatsApp No.", city: "City/District", msg: "Message..." },
      submit: "Send Inquiry",
      successMsg: "Email sent! Check your inbox.",
      contact: { add: "Bandhani Chokdi, Anand - Sojitra Road, Bandhani, Ta. Petlad, Dist. Anand, Gujarat - 388410", mail: "agrovitaorganics@gmail.com", phone: "+91 95103 04547" }
    },
    hi: {
      tag: "जल्द आ रहा है",
      tagline: "मिट्टी के भविष्य को सँवारते हुए।",
      sub: "एग्रोविटा ऑर्गेनिक्स नवाचार को परंपरा के साथ जोड़ता है। हम आपकी फसल को हरा-भरा और स्वस्थ बनाने के लिए प्रयोगशाला में परीक्षण किए गए जैविक उर्वरकों की एक श्रृंखला बना रहे हैं।",
      notifyBtn: "सूचित करें",
      formTitle: "हमसे जुड़ें",
      farmer: "मैं एक किसान हूँ",
      dealer: "मैं एक डीलर हूँ",
      placeholders: { name: "पूरा नाम", email: "ईमेल", phone: "व्हाट्सएप नंबर", city: "शहर / जिला", msg: "संदेश..." },
      submit: "पूछताछ भेजें",
      successMsg: "ईमेल भेजा गया! अपना इनबॉक्स जांचें।",
      contact: { add: "बांधनी चौकड़ी, आनंद - सोजित्रा रोड, बांधनी, ता. पेटलाद, जिला. आनंद, गुजरात - 388410 ", mail: "agrovitaorganics@gmail.com", phone: "+91 95103 04547" }
    }
  };

  const t = content[lang];

  return (
    <div className="relative min-h-screen selection:bg-agro-orange selection:text-white">
      
      {/* 1. OUTLINED LEAF CURSOR */}
      <div 
        className="hidden lg:block pointer-events-none fixed z-[9999] transition-transform duration-100 ease-out"
        style={{ left: cursorPos.x, top: cursorPos.y, transform: 'translate(-50%, -50%)' }}
      >
        <Leaf size={40} className="text-agro-orange opacity-80" strokeWidth={1} fill="none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-agro-orange rounded-full" />
      </div>  

      {/* 2. WELCOME POPUP (Fixed: Removed Green Gradient Header) */}
      <AnimatePresence>
        {showPopup && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPopup(false)} className="absolute inset-0 bg-[#0a2118]/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 40 }} className="bg-white w-full max-w-[420px] rounded-[3.5rem] overflow-hidden relative shadow-2xl border border-white/20">
              <div className="h-24 bg-white relative"> {/* Clean White Header */}
                <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/leaf.png')] bg-center" />
                <button onClick={() => setShowPopup(false)} className="absolute top-6 right-6 z-20 p-2 bg-gray-100 hover:bg-agro-orange hover:text-white text-gray-400 rounded-full transition-all"><X size={18} /></button>
              </div>
              <div className="relative px-8 pt-16 pb-12 text-center">
                <div className="absolute -top-14 left-1/2 -translate-x-1/2">
                  <div className="w-28 h-28 bg-white rounded-full p-3 shadow-2xl ring-[12px] ring-agro-green/5 flex items-center justify-center">
                    <img src={logo} alt="Logo" className="w-full h-full object-contain" />
                  </div>
                </div>
                <motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }} className="flex flex-col gap-4">
                  <motion.div variants={{ hidden: { y: 10, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
                    <span className="px-5 py-1.5 rounded-full bg-agro-orange/10 text-agro-orange text-[10px] font-black uppercase tracking-[0.3em]">Purely Bio-Natural</span>
                  </motion.div>
                  <motion.h2 variants={{ hidden: { y: 10, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="text-4xl font-black text-agro-green leading-[0.9] italic tracking-tighter">
                    Welcome to <br/> <span className="text-agro-orange">AgroVita</span>
                  </motion.h2>
                  <motion.p variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }} className="text-gray-500 font-medium text-sm leading-relaxed">Building the future of Bharat's soil with lab-tested formulas.</motion.p>
                  <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }} className="flex items-center justify-center gap-6 py-5 my-2 border-y border-gray-100">
                    <div className="flex items-center gap-2 text-agro-green/40"><Award size={14} /><span className="text-[8px] font-bold uppercase tracking-widest">ISO 9001</span></div>
                    <div className="flex items-center gap-2 text-agro-green/40"><Leaf size={14} /><span className="text-[8px] font-bold uppercase tracking-widest">100% Organic</span></div>
                  </motion.div>
                  <motion.button variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} whileHover={{ scale: 1.02, backgroundColor: "#e67e22" }} whileTap={{ scale: 0.98 }} onClick={() => setShowPopup(false)} className="w-full bg-agro-green text-white py-5 rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-[10px] shadow-2xl shadow-agro-green/20">Explore Experience</motion.button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. NAVIGATION */}
      <nav className="fixed top-0 w-full z-[100] bg-white/80 backdrop-blur-xl border-b border-agro-green/5 px-6 lg:px-16 py-3 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <img src={logo} alt="AgroVita Logo" className="h-10 w-auto object-contain" />
        </div>
        <div className="flex bg-gray-100/50 rounded-full p-1 border border-gray-200/50">
          <button onClick={() => setLang('en')} className={`px-5 py-2 rounded-full text-[10px] font-black transition-all duration-300 ${lang === 'en' ? 'bg-agro-green text-white shadow-lg shadow-agro-green/20' : 'text-gray-400 hover:text-agro-green'}`}>EN</button>
          <button onClick={() => setLang('hi')} className={`px-5 py-2 rounded-full text-[10px] font-black transition-all duration-300 ${lang === 'hi' ? 'bg-agro-green text-white shadow-lg shadow-agro-green/20' : 'text-gray-400 hover:text-agro-green'}`}>हिन्दी</button>
        </div>
      </nav>

      {/* 4. HERO SECTION */}
      <section className="relative min-h-screen flex items-center bg-vivid-hero px-6 lg:px-20 pt-24 pb-12 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center w-full">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-agro-green/5 text-agro-green text-[10px] font-black uppercase tracking-widest mb-6 border border-agro-green/10">
               <div className="w-2 h-2 rounded-full bg-agro-green animate-pulse" /> {t.tag}
            </span>
            <h1 className="text-6xl lg:text-8xl font-black text-agro-green leading-[0.9] tracking-tighter mb-8 italic">{t.tagline}</h1>
            <p className="text-sm lg:text-lg text-gray-600 max-w-lg mb-10 font-medium">{t.sub}</p>
            
            <AnimatePresence mode="wait">
              {heroSuccess ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 text-agro-green font-black uppercase text-sm bg-agro-green/5 p-5 rounded-2xl border border-agro-green/10 max-w-md">
                  <CheckCircle2 className="text-agro-orange" size={24}/> {t.successMsg}
                </motion.div>
              ) : (
                <form onSubmit={(e) => sendEmail(e, 'Launch Notification')} className="flex flex-col sm:flex-row bg-white p-1.5 rounded-2xl sm:rounded-full shadow-2xl border border-gray-100 max-w-md ring-1 ring-black/5">
                  <input required name="email" type="email" placeholder="Enter email address..." className="flex-1 px-6 py-4 outline-none text-sm font-bold bg-transparent" />
                  <button disabled={isSubmitting} className="bg-agro-green text-white px-8 py-4 rounded-xl sm:rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-agro-orange transition-all disabled:opacity-50 flex items-center justify-center min-w-[140px]">
                    {isSubmitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : t.notifyBtn}
                  </button>
                </form>
              )}
            </AnimatePresence>
          </motion.div>

          <div className="relative mx-auto w-full max-w-[500px]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[4rem] border-[12px] border-white shadow-2xl bg-gray-100">
               <img src={galleryItems[activeSlide].url} className="w-full h-full object-cover transition-opacity duration-1000" alt="hero"/>
               <div className="absolute inset-0 bg-gradient-to-t from-agro-green/60 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* 5. CONNECT SECTION */}
      <section className="relative min-h-screen py-24 bg-vivid-soil px-6 lg:px-20 flex items-center">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-16 w-full items-start">
          <div className="lg:col-span-5 text-white">
            <h2 className="text-5xl lg:text-8xl font-black mb-12 tracking-tighter leading-[0.85] italic">{t.formTitle}</h2>
            <div className="space-y-6">
              {[
                { icon: <Phone size={22} />, val: t.contact.phone, label: "Phone" },
                { icon: <Mail size={22} />, val: t.contact.mail, label: "Email" },
                { icon: <MapPin size={22} />, val: t.contact.add, label: "Manufacuring Unit" }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-6 p-6 bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10 group hover:bg-white/10 transition-all">
                  <div className="text-agro-orange p-4 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">{item.icon}</div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-agro-orange mb-1 font-black">{item.label}</p>
                    <p className="text-lg lg:text-xl font-bold leading-snug max-w-sm">{item.val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="lg:col-span-7 bg-white p-8 lg:p-14 rounded-[3.5rem] shadow-2xl">
            <AnimatePresence mode="wait">
              {contactSuccess ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20 flex flex-col items-center">
                  <div className="w-20 h-20 bg-agro-green/10 rounded-full flex items-center justify-center mb-6"><CheckCircle2 size={40} className="text-agro-green" /></div>
                  <h3 className="text-3xl font-black text-agro-green mb-2 tracking-tighter uppercase">{t.successMsg}</h3>
                  <button onClick={() => setContactSuccess(false)} className="mt-8 text-agro-orange font-black uppercase text-[10px] tracking-widest hover:underline">Send another inquiry</button>
                </motion.div>
              ) : (
                <form onSubmit={(e) => sendEmail(e, 'Orders / Dealership')} className="grid md:grid-cols-2 gap-6">
                  <div className="flex md:col-span-2 bg-gray-50 p-1.5 rounded-[2rem] border border-gray-100 mb-4">
                    <button type="button" onClick={() => setUserType('farmer')} className={`flex-1 py-4 rounded-[1.5rem] text-[10px] font-black transition-all ${userType === 'farmer' ? 'bg-white text-agro-green shadow-md' : 'text-gray-400'}`}>I am a Farmer</button>
                    <button type="button" onClick={() => setUserType('dealer')} className={`flex-1 py-4 rounded-[1.5rem] text-[10px] font-black transition-all ${userType === 'dealer' ? 'bg-white text-agro-green shadow-md' : 'text-gray-400'}`}>I am a Dealer</button>
                  </div>
                  <input required name="full_name" placeholder={t.placeholders.name} className="w-full bg-gray-50 p-5 rounded-2xl outline-none font-bold text-agro-green border-none" />
                  <input required name="email" type="email" placeholder={t.placeholders.email} className="w-full bg-gray-50 p-5 rounded-2xl outline-none font-bold text-agro-green border-none" />
                  <input required name="phone" type="tel" pattern="[0-9]{10}" placeholder={t.placeholders.phone} className="w-full bg-gray-50 p-5 rounded-2xl outline-none font-bold text-agro-green border-none" />
                  <input required name="city" placeholder={t.placeholders.city} className="w-full bg-gray-50 p-5 rounded-2xl outline-none font-bold text-agro-green border-none" />
                  <textarea name="message" rows="2" placeholder={t.placeholders.msg} className="md:col-span-2 w-full bg-gray-50 p-5 rounded-2xl outline-none font-bold text-agro-green border-none resize-none" />
                  <button disabled={isSubmitting} className="md:col-span-2 w-full bg-agro-green py-6 rounded-[2.5rem] text-white font-black uppercase tracking-[0.4em] text-[10px] hover:bg-agro-orange shadow-2xl transition-all flex justify-center items-center gap-4 disabled:opacity-50">
                    {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>{t.submit} <ChevronRight size={18} /></>}
                  </button>
                </form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* 6. MINIMALIST FOOTER */}
      <footer className="bg-[#0a2118] text-white pt-12 pb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-agro-orange/40 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
          <div className="mb-6 group"><img src={logo} alt="Logo" className="h-20 w-auto object-contain transition-transform group-hover:scale-105" /></div>
          <p className="text-white/30 text-[9px] uppercase tracking-[0.4em] font-black mb-8 text-center max-w-xs">Pure Bio-Natural Solutions <br className="sm:hidden" /> for Indian Soil</p>
          <div className="flex gap-2 p-1.5 bg-white/5 rounded-full border border-white/10 mb-10">
            {[ { icon: <Instagram size={18} /> }, { icon: <Facebook size={18} /> }, { icon: <Twitter size={18} /> } ].map((social, i) => (
              <a key={i} href="#" className="w-10 h-10 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-agro-orange transition-all"><div className="cursor-none">{social.icon}</div></a>
            ))}
          </div>
          <div className="w-full pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-[9px] font-bold uppercase tracking-[0.3em] text-white/20">
            <div>© 2025 AgroVita Organics | Gujarat</div>
            <div className="flex items-center gap-6 opacity-40"><div className="flex items-center gap-2"><Award size={14} /><span>ISO 9001</span></div><div className="flex items-center gap-2"><Sprout size={14} /><span>100% Bio-Natural</span></div></div>
          </div>
        </div>
      </footer>
      
      {/* WHATSAPP */}
      <a href="https://wa.me/919510304547" target="_blank" rel="noreferrer" className="fixed bottom-8 right-8 z-[1000] bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform"><MessageCircle size={32} fill="white" /></a>
    </div>
  );
};

export default App;