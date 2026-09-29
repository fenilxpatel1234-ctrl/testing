import React from 'react';
import { PageView } from '../types';
import { SERVICE_CATEGORIES_HOME } from '../data/mockData';
import { Sparkles, Calendar, ChevronRight } from 'lucide-react';

interface ServicesViewProps {
  onSelectView: (view: PageView) => void;
  onOpenBooking: () => void;
  onSelectService: (serviceId: string) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({ onSelectView, onOpenBooking, onSelectService }) => {
  return (
    <div className="pt-28 pb-20 space-y-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <div className="text-center max-w-3xl mx-auto space-y-4">
        
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Dental Services
        </h1>
        <p className="text-slate-600 text-base leading-relaxed">
          Book your dental checkup today! Explore the full range of dental services we offer for your whole family.
        </p>
      </div>

      {/* SERVICE CATEGORIES */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICE_CATEGORIES_HOME.map(cat => (
            <div
              key={cat.id}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-lg hover:shadow-xl transition-all"
            >
              <img src={cat.image} alt={cat.title} className="w-14 h-14 object-contain mb-4" />
              <h3 className="font-bold text-slate-900 text-sm mb-3">{cat.title}</h3>
              <ul className="space-y-2">
                {cat.items.map((item, idx) => (
                  <li key={idx} className="text-xs text-slate-600 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* COMPREHENSIVE DENTAL CARE */}
      <section>
        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 grid grid-cols-1 lg:grid-cols-2">
          <div className="p-8 sm:p-12 space-y-6">
            <span className="text-xs uppercase font-bold text-blue-600 tracking-wider">Dental Services</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Comprehensive Dental Care in St. Thomas, ON
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Have you been on the lookout for comprehensive dental services in St. Thomas, ON? Head over to the leading family dental care clinic: First Avenue Family Dentistry today. We are the top dental care clinic providing a wide range of dental services to meet the diverse needs of our patients.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Our highly skilled team of dental experts has had years of training and is licensed to provide dependable emergency dental care. Here is what you can expect at our family dental care clinic:
            </p>
            <button
              onClick={onOpenBooking}
              className="px-6 py-3 rounded-full bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" /> Book Your Checkup Today
            </button>
          </div>
          <div className="h-80 lg:h-auto bg-slate-100">
            <img
              src="https://static.wixstatic.com/media/02c124_60a2010b82774175b3cb5ea61d6bbd9f~mv2.jpg"
              alt="First Avenue Dentistry Dental Services"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* WHAT TO EXPECT */}
      <section>
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-2xl space-y-8">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs uppercase font-bold text-blue-600 tracking-wider">What to Expect</span>
            <h2 className="text-3xl font-extrabold text-slate-900">Here is what you can expect at our family dental care clinic:</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-black flex items-center justify-center text-sm">1</div>
              <h3 className="font-bold text-slate-900 text-lg">Emergency Dental Care</h3>
              <p className="text-xs text-slate-600 leading-relaxed">Dental emergencies can happen at any time. This is why our clinic is here to provide prompt and effective dental services at any time of the day.</p>
              <button onClick={() => onSelectView('emergency')} className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1">Learn more <ChevronRight className="w-3 h-3" /></button>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-black flex items-center justify-center text-sm">2</div>
              <h3 className="font-bold text-slate-900 text-lg">Family Dental Care Services</h3>
              <p className="text-xs text-slate-600 leading-relaxed">Our dental services are tailored to meet the unique needs and requirements of our patients of all ages. From routine checkups to cleanings and preventative treatments, we can handle it all.</p>
              <button onClick={() => onSelectView('book-online')} className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1">Learn more <ChevronRight className="w-3 h-3" /></button>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-black flex items-center justify-center text-sm">3</div>
              <h3 className="font-bold text-slate-900 text-lg">Cosmetic Dentistry</h3>
              <p className="text-xs text-slate-600 leading-relaxed">Our dental care experts are also trained to provide expert cosmetic dentistry services. We are well-versed in the most advanced cosmetic dentistry procedures and techniques to deliver natural-looking and aesthetically appealing results. Don't just take our word for it! Visit our clinic today to learn more about our dental services.</p>
              <button onClick={onOpenBooking} className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1">Learn more <ChevronRight className="w-3 h-3" /></button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
