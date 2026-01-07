import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { 
  Leaf, Award, Sprout, ArrowRight, User, Briefcase, MapPin, 
  Mail, Phone, Instagram, Facebook, 
  Twitter, X, CheckCircle2, ChevronRight, TrendingUp   
} from 'lucide-react';
import logo from './assets/logo2.png';


const galleryItems = [
  { 
    url: "https://images.pexels.com/photos/1483880/pexels-photo-1483880.jpeg?auto=compress&cs=tinysrgb&w=1260", 
    title: "Pure Organic Fertilizer", 
    alt: "AgroVita Organic Fertilizer for carbon enriched Indian soil" 
  },
  { 
    url: "https://images.pexels.com/photos/235925/pexels-photo-235925.jpeg?auto=compress&cs=tinysrgb&w=1260", 
    title: "Soil Health Microbial Science", 
    alt: "Advanced microbial science for organic farming health" 
  },
  { 
    url: "https://images.pexels.com/photos/2165688/pexels-photo-2165688.jpeg?auto=compress&cs=tinysrgb&w=1260", 
    title: "Golden Yields Farmer Prosperity", 
    alt: "Farmers achieving high yields with AgroVita bio-natural solutions" 
  }
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

  // --- 2. SIDE EFFECTS ---
  useEffect(() => {
    const timer = setTimeout(() => setShowPopup(true), 1200);
    const moveCursor = (e) => setCursorPos({ x: e.clientX, y: e.clientY });
    const slideTimer = setInterval(() => setActiveSlide((p) => (p + 1) % galleryItems.length), 5000);

    window.addEventListener('mousemove', moveCursor);
    return () => {
      clearTimeout(timer);
      clearInterval(slideTimer);
      window.removeEventListener('mousemove', moveCursor);
    };
  }, []);

// --- 1. CONFIGURATION & SANITIZATION ---
// Use fallback empty string to prevent .trim() on undefined
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID?.trim() || "";
const EMAILJS_ADMIN_TEMPLATE = import.meta.env.VITE_EMAILJS_ADMIN_TEMPLATE?.trim() || "";
const EMAILJS_USER_TEMPLATE = import.meta.env.VITE_EMAILJS_USER_TEMPLATE?.trim() || "";
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY?.trim() || "";

const [heroError, setHeroError] = useState(null);
const [contactError, setContactError] = useState(null);

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePhone = (phone) => /^[0-9]{10}$/.test(phone);

const sendEmail = async (e, formType) => {
  if (e) e.preventDefault();
  
  // Reset previous errors
  if (formType === 'Launch Notification') setHeroError(null);
  else setContactError(null);

  const form = e.target;
  const formData = new FormData(form);
  const email = formData.get('email');
  const phone = formData.get('phone');

  // 1. Professional Validation
  if (!validateEmail(email)) {
    const msg = "Please enter a valid email address.";
    return formType === 'Launch Notification' ? setHeroError(msg) : setContactError(msg);
  }
  
  if (formType === 'Inquiry' && phone && !validatePhone(phone)) {
    return setContactError("Please enter a valid 10-digit WhatsApp number.");
  }

  if (!EMAILJS_PUBLIC_KEY || EMAILJS_PUBLIC_KEY === "undefined") {
    const msg = "System error. Please try again later.";
    return formType === 'Launch Notification' ? setHeroError(msg) : setContactError(msg);
  }

  setIsSubmitting(true);
  
  const templateParams = {
    form_type: formType,
    full_name: formData.get('full_name') || "Interested User",
    email: email,
    phone: phone || "Not provided",
    city: formData.get('city') || "Not provided",
    message: formData.get('message') || "User requested launch notification.",
    user_role: typeof userType !== 'undefined' ? userType : "Guest",
  };

  try {
    await Promise.all([
      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_ADMIN_TEMPLATE, templateParams, EMAILJS_PUBLIC_KEY),
      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_USER_TEMPLATE, templateParams, EMAILJS_PUBLIC_KEY)
    ]);

    if (formType === 'Launch Notification') setHeroSuccess(true);
    else setContactSuccess(true);
    form.reset();
} catch (error) {
    console.error("EMAILJS ERROR:", error);

    // PROFESSIONAL BILINGUAL ERROR MESSAGES
    const errorMsg = lang === 'hi' 
      ? "क्षमा करें! तकनीकी समस्या के कारण संदेश नहीं भेजा जा सका। कृपया फिर से प्रयास करें या व्हाट्सएप करें।" 
      : "We're sorry! We couldn't receive your inquiry due to a connection error. Please try again or reach out via WhatsApp.";

    if (formType === 'Launch Notification') setHeroError(errorMsg);
    else setContactError(errorMsg);
}finally {
    setIsSubmitting(false);
  }
};

  const content = {
    en: {
      seoTitle: "AgroVita Organics | Best Organic Fertilizer Manufacturer in Gujarat",
      seoDesc: "AgroVita Organics offers lab-tested, bio-natural organic fertilizers for Indian soil. Sustainable growth for farmers and dealers.",
      tag: "Launching Soon",
      tagline: "Cultivating the Future of Soil.",
      sub: "AgroVita Organics combines innovation with tradition. We are building a sustainable range of lab-tested organic fertilizers to make your harvest greener and healthier.",
      notifyBtn: "Notify Me",
      formTitle: "Connect With Us",
      placeholders: { name: "Full Name", email: "Email Address", phone: "WhatsApp No.", city: "City/District", msg: "Message..." },
      submit: "Send Inquiry",
      successMsg: "Email sent! Check your inbox.",
      contact: { add: "Bandhani Chokdi, Anand - Sojitra Road, Bandhani, Ta. Petlad, Dist. Anand, Gujarat - 388410", mail: "agrovitaorganics@gmail.com", phone: "+91 95103 04547" }
    },
    hi: {
      seoTitle: "एग्रोविटा ऑर्गेनिक्स | गुजरात में सर्वश्रेष्ठ जैविक उर्वरक निर्माता",
      seoDesc: "एग्रोविटा ऑर्गेनिक्स भारतीय मिट्टी के लिए प्रयोगशाला परीक्षण जैविक उर्वरक प्रदान करता है। किसानों और डीलरों के लिए स्थायी विकास।",
      tag: "जल्द आ रहा है",
      tagline: "मिट्टी के भविष्य को सँवारते हुए।",
      sub: "एग्रोविटा ऑर्गेनिक्स नवाचार को परंपरा के साथ जोड़ता है। हम आपकी फसल को हरा-भरा और स्वस्थ बनाने के लिए प्रयोगशाला में परीक्षण किए गए जैविक उर्वरकों की एक श्रृंखला बना रहे हैं।",
      notifyBtn: "सूचित करें",
      formTitle: "हमसे जुड़ें",
      placeholders: { name: "पूरा नाम", email: "ईमेल", phone: "व्हाट्सएप नंबर", city: "शहर / जिला", msg: "संदेश..." },
      submit: "पूछताछ भेजें",
      successMsg: "ईमेल भेजा गया! अपना इनबॉक्स जांचें।",
      contact: { add: "बांधनी चौकड़ी, आनंद - सोजित्रा रोड, बांधनी, ता. पेटलाद, जिला. आनंद, गुजरात - 388410", mail: "agrovitaorganics@gmail.com", phone: "+91 95103 04547" }
    }
  };

  const t = content[lang];
  const waMessage = encodeURIComponent("Namaste AgroVita! 🌱 I just explored your bio-natural solutions on www.agrovitaorganics.com and I'm interested in improving my soil health. Could you guide me further for Dealership/Order?");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "AgroVita Organics",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Bandhani Chokdi, Anand - Sojitra Road",
      "addressLocality": "Petlad, Anand",
      "addressRegion": "Gujarat",
      "postalCode": "388410",
      "addressCountry": "IN"
    },
    "description": t.seoDesc,
    "telephone": "+919510304547",
    "url": "https://www.agrovitaorganics.com"
  };



  return (
    <div className="relative min-h-screen selection:bg-agro-orange selection:text-white overflow-x-hidden">
      
      {/* --- SEO METADATA (React 19 Native Hoisting) --- */}
      <title>{t.seoTitle}</title>
      <meta name="description" content={t.seoDesc} />
      <meta name="keywords" content="Organic Fertilizer, Bio-natural, Sustainable farming India, Soil health, AgroVita, Gujarat Fertilizer Manufacturer, Organic Agriculture, Fertilizer in Gujarat" />
      <link rel="canonical" href="https://www.agrovitaorganics.com" />
      <meta property="og:title" content={t.seoTitle} />
      <meta property="og:description" content={t.seoDesc} />
      <meta property="og:type" content="website" />
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>

      {/* 1. CUSTOM CURSOR */}
      <div 
        className="hidden lg:block pointer-events-none fixed z-[9999] transition-transform duration-100 ease-out"
        style={{ left: cursorPos.x, top: cursorPos.y, transform: 'translate(-50%, -50%)' }}
      >
        <Leaf size={40} className="text-agro-orange opacity-80" strokeWidth={1} fill="none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-agro-orange rounded-full" />
      </div>  

      {/* 2. POPUP MODAL */}
      <AnimatePresence>
        {showPopup && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 overflow-hidden" role="dialog" aria-modal="true">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPopup(false)} className="absolute inset-0 bg-[#0a2118]/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 40 }} className="bg-white w-full max-w-[420px] rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden relative shadow-2xl border border-white/20">
              <div className="h-20 md:h-24 bg-white relative">
                <button onClick={() => setShowPopup(false)} aria-label="Close" className="absolute top-4 right-4 md:top-6 md:right-6 z-20 p-2 bg-gray-100 hover:bg-agro-orange hover:text-white text-gray-400 rounded-full transition-all"><X size={18} /></button>
              </div>
              <div className="relative px-6 md:px-8 pt-12 pb-10 md:pb-12 text-center">
                <div className="absolute -top-12 md:-top-14 left-1/2 -translate-x-1/2">
                  <div className="w-24 h-24 md:w-28 md:h-28 bg-white rounded-full p-3 shadow-2xl ring-[8px] md:ring-[12px] ring-agro-green/5 flex items-center justify-center">
                    <img src={logo} alt="AgroVita Logo" className="w-full h-full object-contain" />
                  </div>
                </div>
                <motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }} className="flex flex-col gap-4">
                  <motion.div variants={{ hidden: { y: 10, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
                    <span className="px-4 py-1.5 rounded-full bg-agro-orange/10 text-agro-orange text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em]">Purely Bio-Natural</span>
                  </motion.div>
                  <h2 className="text-3xl md:text-4xl font-black text-agro-green leading-[0.9] italic tracking-tighter">
                    Welcome to <br/> <span className="text-agro-orange">AgroVita Organics</span>
                  </h2>
                  <p className="text-gray-500 font-medium text-xs md:text-sm leading-relaxed px-2">Building the future of Bharat's soil with lab-tested formulas.</p>
                  <div className="flex items-center justify-center gap-4 md:gap-6 py-4 md:py-5 my-2 border-y border-gray-100">
                    <div className="flex items-center gap-2 text-agro-green/40"><Award size={14} /><span className="text-[7px] md:text-[8px] font-bold uppercase tracking-widest">Lab Tested</span></div>
                    <div className="flex items-center gap-2 text-agro-green/40"><Leaf size={14} /><span className="text-[7px] md:text-[8px] font-bold uppercase tracking-widest">100% Organic</span></div>
                  </div>
                  <motion.button variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} whileHover={{ scale: 1.02, backgroundColor: "#e67e22" }} whileTap={{ scale: 0.98 }} onClick={() => setShowPopup(false)} className="w-full bg-agro-green text-white py-4 md:py-5 rounded-full md:rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-[9px] md:text-[10px] shadow-2xl">Explore Experience</motion.button>
                </motion.div> 
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. NAVIGATION */}
      <header className="fixed top-0 w-full z-[100] bg-white/80 backdrop-blur-xl border-b border-agro-green/5 px-4 md:px-16 py-3 flex justify-between items-center shadow-sm">
        <img src={logo} alt="AgroVita Logo" className="h-8 md:h-10 w-auto object-contain" />
        <nav className="flex bg-gray-100/50 rounded-full p-1 border border-gray-200/50" aria-label="Language switch">
          <button onClick={() => setLang('en')} className={`px-4 md:px-5 py-1.5 md:py-2 rounded-full text-[9px] md:text-[10px] font-black transition-all ${lang === 'en' ? 'bg-agro-green text-white shadow-md' : 'text-gray-400'}`}>EN</button>
          <button onClick={() => setLang('hi')} className={`px-4 md:px-5 py-1.5 md:py-2 rounded-full text-[9px] md:text-[10px] font-black transition-all ${lang === 'hi' ? 'bg-agro-green text-white shadow-md' : 'text-gray-400'}`}>हिन्दी</button>
        </nav>
      </header>

      {/* 4. MAIN CONTENT */}
      <main>
        {/* HERO SECTION */}
        <section className="relative min-h-screen flex items-center bg-vivid-hero px-6 md:px-20 pt-28 pb-12 overflow-hidden">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center lg:text-left">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-agro-green/5 text-agro-green text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-6 border border-agro-green/10">
                 <div className="w-2 h-2 rounded-full bg-agro-green animate-pulse" /> {t.tag}
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-8xl font-black text-agro-green leading-[1] tracking-tighter mb-6 md:mb-8 italic">{t.tagline}</h1>
              <p className="text-sm md:text-lg text-gray-600 max-w-lg mx-auto lg:mx-0 mb-8 md:mb-10 font-medium leading-relaxed">{t.sub}</p>
              
              <div className="max-w-md mx-auto lg:mx-0 w-full">
  <AnimatePresence mode="wait">
    {heroSuccess ? (
      <motion.div 
        key="success"
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="flex items-center justify-center lg:justify-start gap-3 text-agro-green font-black uppercase text-xs md:text-sm bg-agro-green/5 p-4 md:p-5 rounded-2xl border border-agro-green/10"
      >
        <CheckCircle2 className="text-agro-orange" size={20}/> 
        {t.successMsg}
      </motion.div>
    ) : (
      <div className="flex flex-col gap-3">
        <motion.form 
          key="form"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onSubmit={(e) => sendEmail(e, 'Launch Notification')} 
          className={`flex flex-col sm:flex-row bg-white p-1.5 rounded-2xl sm:rounded-full shadow-2xl border transition-all duration-300 ${heroError ? 'border-red-500 ring-4 ring-red-500/10' : 'border-gray-100 ring-1 ring-black/5'}`}
        >
          <input 
            required 
            name="email" 
            type="email" 
            placeholder="Email address..." 
            aria-label="Email address" 
            className="flex-1 px-6 py-4 outline-none text-sm font-bold bg-transparent" 
          />
          <button 
            disabled={isSubmitting} 
            type="submit"
            className="bg-agro-green text-white px-8 py-4 rounded-xl sm:rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-agro-orange transition-all disabled:opacity-50 flex items-center justify-center min-w-[140px]"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              t.notifyBtn
            )}
          </button>
        </motion.form>
        
        <AnimatePresence>
          {heroError && (
            <motion.p 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }} 
              exit={{ opacity: 0, height: 0 }}
              className="text-red-500 text-[10px] font-black uppercase tracking-[0.2em] ml-6 mt-1"
            >
              {heroError}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    )}
  </AnimatePresence>
              </div>
            </motion.div>

            <div className="relative mx-auto w-full max-w-[450px] lg:max-w-[500px]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] md:rounded-[4rem] border-[8px] md:border-[12px] border-white shadow-2xl bg-gray-100">
                <img src={galleryItems[activeSlide].url} loading="lazy" className="w-full h-full object-cover transition-opacity duration-1000" alt={galleryItems[activeSlide].alt}/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                <div className="absolute bottom-8 left-0 w-full flex justify-center items-end gap-3 z-30">
                  {galleryItems.map((_, index) => (
                    <button
                      key={index}
                      aria-label={`Go to slide ${index + 1}`}
                      onClick={() => setActiveSlide(index)}
                      className="relative flex items-center justify-center transition-all duration-300"
                      style={{ width: activeSlide === index ? '32px' : '8px', height: '8px' }}
                    >
                      <div 
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                          activeSlide === index 
                            ? "w-full bg-agro-orange shadow-[0_0_10px_rgba(242,140,40,0.8)]" 
                            : "w-2 bg-white/60 hover:bg-white"
                        }`} 
                      />
                      {activeSlide === index && (
                        <div className="absolute -inset-2 border border-white/30 rounded-full animate-[ping_1.5s_infinite] pointer-events-none" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONNECT SECTION */}
        <section id="contact" className="relative min-h-screen py-20 md:py-24 bg-vivid-soil px-6 md:px-20 flex items-center">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 lg:gap-16 w-full items-start">
            <div className="lg:col-span-5 text-white text-center lg:text-left">
              <h2 className="text-4xl md:text-6xl lg:text-8xl font-black mb-8 md:mb-12 tracking-tighter leading-[0.9] italic">{t.formTitle}</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                {[
                  { icon: <Phone size={20} />, val: t.contact.phone, label: "Phone" },
                  { icon: <Mail size={20} />, val: t.contact.mail, label: "Email" },
                  { icon: <MapPin size={20} />, val: t.contact.add, label: "Manufacturing Unit" }
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col lg:flex-row items-center lg:items-start gap-4 p-5 bg-white/5 backdrop-blur-md rounded-[2rem] border border-white/10 group hover:bg-white/10 transition-all text-center lg:text-left">
                    <div className="text-agro-orange p-3 bg-white/5 rounded-xl group-hover:scale-110 transition-transform">{item.icon}</div>
                    <div>
                      <p className="text-[8px] md:text-[9px] uppercase tracking-[0.3em] text-agro-orange mb-1 font-black">{item.label}</p>
                      <address className="text-sm md:text-base font-bold leading-snug not-italic">{item.val}</address>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="lg:col-span-7 bg-white p-6 md:p-14 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl">
              <AnimatePresence mode="wait">
  {contactSuccess ? (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16 md:py-20 flex flex-col items-center">
      <div className="w-16 h-16 md:w-20 md:h-20 bg-agro-green/10 rounded-full flex items-center justify-center mb-6"><CheckCircle2 size={36} className="text-agro-green" /></div>
      <h3 className="text-2xl md:text-3xl font-black text-agro-green mb-2 tracking-tighter uppercase">{t.successMsg}</h3>
      <button onClick={() => setContactSuccess(false)} className="mt-6 text-agro-orange font-black uppercase text-[9px] tracking-widest hover:underline">New Inquiry</button>
    </motion.div>
  ) : (
    <form onSubmit={(e) => sendEmail(e, 'Inquiry')} className="grid sm:grid-cols-2 gap-4 md:gap-6">
      {/* PROFESSIONAL ERROR ALERT */}
      <AnimatePresence shadow-md>
        {contactError && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="sm:col-span-2 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600"
          >
            <div className="bg-red-500 text-white p-1 rounded-full"><X size={12} strokeWidth={4} /></div>
            <p className="text-[10px] font-black uppercase tracking-wider">{contactError}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex sm:col-span-2 bg-gray-50 p-1 rounded-2xl md:rounded-[2rem] border border-gray-100 mb-2">
        <button type="button" onClick={() => setUserType('farmer')} className={`flex-1 py-3 md:py-4 rounded-xl text-[9px] md:text-[10px] font-black transition-all ${userType === 'farmer' ? 'bg-white text-agro-green shadow-md' : 'text-gray-400'}`}>I am a Farmer</button>
        <button type="button" onClick={() => setUserType('dealer')} className={`flex-1 py-3 md:py-4 rounded-xl text-[9px] md:text-[10px] font-black transition-all ${userType === 'dealer' ? 'bg-white text-agro-green shadow-md' : 'text-gray-400'}`}>I am a Dealer</button>
      </div>
      
      <input required name="full_name" aria-label="Full Name" placeholder={t.placeholders.name} className="w-full bg-gray-50 p-4 md:p-5 rounded-xl outline-none font-bold text-sm focus:ring-2 focus:ring-agro-green/10" />
      <input required name="email" type="email" aria-label="Email" placeholder={t.placeholders.email} className="w-full bg-gray-50 p-4 md:p-5 rounded-xl outline-none font-bold text-sm focus:ring-2 focus:ring-agro-green/10" />
      <input required name="phone" type="tel" aria-label="Phone" placeholder={t.placeholders.phone} className="w-full bg-gray-50 p-4 md:p-5 rounded-xl outline-none font-bold text-sm focus:ring-2 focus:ring-agro-green/10" />
      <input required name="city" aria-label="City" placeholder={t.placeholders.city} className="w-full bg-gray-50 p-4 md:p-5 rounded-xl outline-none font-bold text-sm focus:ring-2 focus:ring-agro-green/10" />
      <textarea required name="message" aria-label="Message" rows="3" placeholder={t.placeholders.msg} className="sm:col-span-2 w-full bg-gray-50 p-4 md:p-5 rounded-xl outline-none font-bold text-sm resize-none focus:ring-2 focus:ring-agro-green/10" />
      
      <button disabled={isSubmitting} className="sm:col-span-2 w-full bg-agro-green py-5 md:py-6 rounded-full text-white font-black uppercase tracking-[0.3em] text-[10px] hover:bg-agro-orange transition-all shadow-xl disabled:opacity-50 flex items-center justify-center">
        {isSubmitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>{t.submit} <ChevronRight size={16} className="inline ml-2" /></>}
      </button>
    </form>
  )}
</AnimatePresence>
            </motion.div>
          </div>
        </section>
      </main>

      {/* 5. FOOTER */}
      <footer className="bg-[#0a2118] text-white pt-12 pb-8 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-agro-orange/40 to-transparent" />
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <img src={logo} alt="AgroVita Logo" className="h-16 md:h-20 w-auto mb-6" />
          <p className="text-white/30 text-[8px] md:text-[9px] uppercase tracking-[0.4em] font-black mb-8 text-center max-w-xs leading-relaxed">
            Pure Bio-Natural Solutions <br className="sm:hidden" /> for Indian Soil
          </p>

          <div className="flex gap-3 mb-10">
            {[ 
              { i: <Instagram size={18} />, url: "https://instagram.com/agrovitaorganics", label: "Instagram" }, 
              { i: <Facebook size={18} />, url: "https://facebook.com/agrovitaorganics", label: "Facebook" } 
            ].map((s, idx) => (
              <a key={idx} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 text-white/60 hover:text-white hover:bg-agro-orange transition-all">
                {s.i}
              </a>
            ))}
          </div>

          <div className="w-full pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-[8px] md:text-[9px] font-bold uppercase tracking-[0.2em] text-center md:text-left text-white/20">
            <div>© 2025 AgroVita Organics | All Copyrights Reserved</div>
            <div className="flex flex-wrap justify-center gap-6 opacity-30">
              <div className="flex items-center gap-2"><Award size={14} /><span>Lab Tested</span></div>
              <div className="flex items-center gap-2"><Sprout size={14} /><span>100% Organic</span></div>
              <div className="flex items-center gap-2"><TrendingUp size={14} /><span>Yield Assured</span></div>
            </div>
          </div>
        </div>
      </footer>
      
      {/* 6. FLOATING WHATSAPP */}
      <motion.a
        drag dragConstraints={{ left: -300, right: 0, top: -500, bottom: 0 }}
        whileDrag={{ scale: 1.1, cursor: 'grabbing' }}
        initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}
        href={`https://wa.me/919510304547?text=${waMessage}`}
        target="_blank" rel="noreferrer" aria-label="Contact on WhatsApp"
        className="fixed bottom-6 right-6 z-[1000] flex items-center group cursor-grab active:cursor-grabbing"
      >
        <div className="relative flex items-center gap-3 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white px-5 py-3 rounded-2xl md:rounded-full shadow-2xl border border-white/20 backdrop-blur-sm transition-all duration-500 group-hover:shadow-[0_20px_40px_rgba(37,211,102,0.4)] group-hover:-translate-y-1">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 448 512" fill="currentColor" className="drop-shadow-md transition-transform duration-500 group-hover:rotate-[12deg]">
            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.4 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.5-2.8-23.2-8.5-44.2-27.1-16.4-14.6-27.4-32.6-30.6-38.1-3.2-5.6-.3-8.6 2.5-11.4 2.5-2.5 5.5-6.5 8.3-9.7 2.8-3.3 3.7-5.6 5.6-9.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.4-29.8-17-40.7-4.5-10.7-9-9.2-12.4-9.4h-10.6c-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.8 23.5 9.2 31.5 11.8 13.3 4.2 25.4 3.6 35 2.2 10.7-1.5 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
          </svg>
          <div className="flex flex-col items-start select-none">
            <span className="text-[9px] uppercase tracking-[0.2em] font-black text-white/80 leading-tight">GET MORE INFO</span>
            <span className="text-sm font-bold tracking-tight whitespace-nowrap">Chat With Us</span>
          </div>
        </div>
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white shadow-lg border-2 border-white pointer-events-none">1</span>
      </motion.a>
    </div>
  );
};

export default App;