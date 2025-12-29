import React from 'react';
import { ShieldCheck, Zap, Recycle } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: <Recycle className="text-agroOrange" size={32} />,
      title: "100% Circular",
      desc: "We transform organic waste into high-grade plant nutrition."
    },
    {
      icon: <ShieldCheck className="text-agroOrange" size={32} />,
      title: "Certified Safe",
      desc: "Zero chemicals, zero heavy metals. Safe for your family and soil."
    },
    {
      icon: <Zap className="text-agroOrange" size={32} />,
      title: "Fast Acting",
      desc: "Specially formulated for quick nutrient absorption and soil repair."
    }
  ];

  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-agroGreen font-bold tracking-widest uppercase text-sm">Our Mission</h2>
          <p className="text-4xl font-bold text-gray-900 mt-2">Revolutionizing Farming with Bio-Science</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-lg text-gray-600 leading-relaxed">
              At <span className="text-agroGreen font-bold">AgroVita Organics</span>, we believe that the secret to healthy crops lies in the health of the soil. Our manufacturing process combines traditional wisdom with modern biotechnology.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Based on years of research, our organic fertilizers don't just "feed" the plant; they rejuvenate the entire ecosystem of your farmland, ensuring long-term sustainability and higher profits for farmers.
            </p>
            
            <div className="grid grid-cols-1 gap-6 pt-6">
              {features.map((f, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-xl border border-gray-100 hover:shadow-md transition">
                  <div className="mt-1">{f.icon}</div>
                  <div>
                    <h4 className="font-bold text-gray-900">{f.title}</h4>
                    <p className="text-gray-500 text-sm">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=800" 
              alt="Organic Fertilizer" 
              className="rounded-3xl shadow-2xl"
            />
            <div className="absolute -bottom-10 -right-10 hidden lg:block">
               <div className="bg-agroOrange p-8 rounded-2xl text-white text-center">
                  <p className="text-4xl font-black italic">100%</p>
                  <p className="font-medium">Organic Matter</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;