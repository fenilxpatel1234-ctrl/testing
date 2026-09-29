import React from 'react';
import { PageView } from '../types';
import { ABOUT_VALUES, PILLARS_OF_CARE, CLINIC_SETTINGS } from '../data/mockData';
import { Sparkles, Calendar, Phone } from 'lucide-react';

interface OurTeamViewProps {
  onSelectView: (view: PageView) => void;
  onOpenBooking: () => void;
}

export const OurTeamView: React.FC<OurTeamViewProps> = ({ onSelectView, onOpenBooking }) => {
  return (
    <div className="pt-28 pb-20 space-y-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div className="text-center max-w-3xl mx-auto space-y-4">
        
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Welcome to First Avenue Family Dentistry
        </h1>
        <p className="text-slate-600 text-base leading-relaxed">
          Your health and comfort is our top priority. We offer quality dental services and guidance which will set you on the path for a lifetime of exceptional dental and oral health. The foundation of a beautiful smile is a healthy smile.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80">
          <img src="https://static.wixstatic.com/media/2a5871_1342019f2be947ecbb2fb19fe827b1ec~mv2.png" alt="First Avenue Dentistry Team" className="w-full h-[400px] object-cover" />
        </div>
        <div className="space-y-4">
          <p className="text-sm text-slate-600 leading-relaxed">
            First Avenue Family Dental team provides family dental care, cosmetic dentistry, dental implants, dentures, sedation, teeth whitening, orthodontics, and so much more. Therefore, with a full range of services, our patients can enjoy quality attention in just one convenient location. Our team is excited to make your first appointment at our First Avenue Family Dental a wonderful experience for both you and your family.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            With a helpful and friendly team, First Avenue Family Dental offers the great community of St. Thomas, Ontario dental care that is attentive and also pleasant. Are you looking for a St. Thomas dentist? Call 519 207 6890 or visit our dental clinic for personalized dental care for patients of all ages. We look forward to treating you and your family and seeing your smiles in our First Avenue Family Dental soon!
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <button onClick={onOpenBooking} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg transition-colors">
              <Calendar className="w-4 h-4" /> Book Your Visit
            </button>
            <a href={`tel:${CLINIC_SETTINGS.phone.replace(/[^0-9+]/g, '')}`} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border-2 border-blue-600 text-blue-700 hover:bg-blue-50 font-bold text-sm transition-colors">
              <Phone className="w-4 h-4" /> {CLINIC_SETTINGS.phone}
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="space-y-4">
          <span className="text-xs uppercase font-bold text-blue-600 tracking-wider">The Leading Family Dental Care Clinic</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Comprehensive care in St. Thomas, ON</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Are you on the lookout for comprehensive dental care in St. Thomas, ON? Head over to First Avenue Dentistry today where your dental health and comfort are our top priorities.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            As one of the leading dental care clinics in St. Thomas, ON, we take pride in our unparalleled expertise and incomparable experience. We understand the importance of a healthy smile and the peace of mind that comes with knowing you have access to emergency dental services when you need them the most.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            Our team of dental care experts is committed to excellence and goes beyond just emergency care; we offer a wide range of services encompassing family dentistry and cosmetic dentistry to ensure every aspect of your dental health is addressed with compassion.
          </p>
        </div>
        <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80">
          <img src="https://static.wixstatic.com/media/2a5871_9aae709b6d1d4239804b63ca3a3aa2cd~mv2.png" alt="Dentist with patient" className="w-full h-[400px] object-cover" />
        </div>
      </div>

      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase font-bold text-blue-600 tracking-wider">Our Value</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">What you can expect from our team</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ABOUT_VALUES.map((value, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xl text-center space-y-4 hover:shadow-xl transition-all">
              <img src={value.image} alt={value.title} className="w-16 h-16 mx-auto object-contain" />
              <h3 className="text-lg font-bold text-slate-900">{value.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white text-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-2xl space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PILLARS_OF_CARE.map((pillar, idx) => (
            <div key={idx} className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-black flex items-center justify-center text-sm">{pillar.number}</div>
              <h3 className="font-bold text-slate-900 text-lg">{pillar.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
