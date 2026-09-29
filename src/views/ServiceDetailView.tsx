import React from 'react';
import { PageView, ServiceDetail } from '../types';
import { SERVICE_DETAILS, SERVICES_LIST } from '../data/mockData';
import { Sparkles, Calendar, CheckCircle2, ChevronRight } from 'lucide-react';

interface ServiceDetailViewProps {
  serviceId: string;
  onSelectView: (view: PageView) => void;
  onOpenBooking: () => void;
  onSelectService: (serviceId: string) => void;
}

export const ServiceDetailView: React.FC<ServiceDetailViewProps> = ({
  serviceId,
  onSelectView,
  onOpenBooking,
  onSelectService
}) => {
  const service = SERVICE_DETAILS[serviceId];
  const currentIndex = SERVICES_LIST.findIndex(s => s.id === serviceId);
  const prevService = currentIndex > 0 ? SERVICES_LIST[currentIndex - 1] : null;
  const nextService = currentIndex < SERVICES_LIST.length - 1 ? SERVICES_LIST[currentIndex + 1] : null;

  if (!service) {
    return (
      <div className="pt-32 pb-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Service not found</h1>
        <button onClick={() => onSelectView('home')} className="mt-4 text-blue-600 underline">Back to Home</button>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <button onClick={() => onSelectView('home')} className="hover:text-blue-600">Home</button>
        <ChevronRight className="w-3 h-3" />
        <span className="text-blue-600 font-semibold">{service.title}</span>
      </div>

      <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xl grid grid-cols-1 lg:grid-cols-2">
        <div className="p-8 sm:p-12 space-y-6">
          
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {service.title}
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            {service.description}
          </p>
          <button
            onClick={onOpenBooking}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs shadow-md hover:scale-[1.02] transition-all inline-flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" /> Book Appointment
          </button>
        </div>
        <div className="h-72 lg:h-auto bg-slate-100">
          <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xl space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">About {service.title}</h2>
        <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{service.fullDescription}</div>
      </div>

      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xl space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">Benefits</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {service.benefits.map((benefit, idx) => (
            <div key={idx} className="flex items-center gap-3 text-sm text-slate-700">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xl space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Procedure</h2>
          <p className="text-sm text-slate-600 leading-relaxed">{service.procedure}</p>
        </div>
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xl space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Recovery Time</h2>
          <p className="text-sm text-slate-600 leading-relaxed">{service.recoveryTime}</p>
        </div>
      </div>

      {service.image2 && (
        <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-200/80">
          <img src={service.image2} alt={service.title} className="w-full h-[400px] object-cover" />
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        {prevService ? (
          <button
            onClick={() => onSelectService(prevService.id)}
            className="px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            <ChevronRight className="w-4 h-4 rotate-180" /> {prevService.label}
          </button>
        ) : <div />}
        {nextService && (
          <button
            onClick={() => onSelectService(nextService.id)}
            className="px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            {nextService.label} <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl p-8 sm:p-12 text-white text-center space-y-4 shadow-xl">
        <h2 className="text-2xl sm:text-3xl font-bold">Ready to Get Started?</h2>
        <p className="text-sm text-blue-100">Book your appointment today and take the first step toward a healthier smile.</p>
        <button
          onClick={onOpenBooking}
          className="px-8 py-3.5 rounded-full bg-blue-700 text-white font-bold text-xs hover:bg-blue-800 transition-colors shadow-lg inline-flex items-center gap-2"
        >
          <Calendar className="w-4 h-4" /> Book Appointment
        </button>
      </div>

    </div>
  );
};
