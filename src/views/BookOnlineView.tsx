import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, Calendar, MapPin, Phone, Check, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PageView, Doctor } from '../types';
import { CLINIC_SETTINGS } from '../data/mockData';
import { COUNTRIES, detectCountryCode } from '../components/BookingModal';
import { isDateInPast, todaySlug } from '../lib/dateUtil';

interface BookOnlineViewProps {
  onSelectView: (view: PageView) => void;
  onOpenBooking: () => void;
}

export const BookOnlineView: React.FC<BookOnlineViewProps> = ({ onSelectView }) => {
  const [countryCode, setCountryCode] = useState('US');
  const [countrySearch, setCountrySearch] = useState('');
  const [countryIndex, setCountryIndex] = useState(0);
  const [countryOpen, setCountryOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [doctorPreference, setDoctorPreference] = useState('Any Available');
  const [servicesList, setServicesList] = useState<string[]>([]);
  const [selectedService, setSelectedService] = useState('General Appointment');
  
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '',
    preferredDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    preferredTimeSlot: '09:00 AM',
    notes: '',
    consent: false
  });
  const phoneInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    detectCountryCode().then(code => setCountryCode(code));
    
    fetch('/api/doctors')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setDoctors(data); })
      .catch(() => {});
      
    fetch('/api/services')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setServicesList(data); })
      .catch(() => {});
  }, []);

  const selectedCountry = COUNTRIES.find(c => c.code === countryCode) || COUNTRIES.find(c => c.code === 'US')!;

  const filteredCountries = countrySearch.trim()
    ? COUNTRIES.filter(c => {
        const cleanSearch = countrySearch.replace(/\D/g, '');
        const matchesDial = cleanSearch ? c.dial.replace(/\D/g, '').includes(cleanSearch) : false;
        const matchesName = c.name.toLowerCase().includes(countrySearch.toLowerCase());
        const matchesCode = c.code.toLowerCase().includes(countrySearch.toLowerCase());
        return matchesName || matchesCode || matchesDial;
      })
    : COUNTRIES;

  const selectCountry = (code: string) => {
    setCountryCode(code);
    setCountryOpen(false);
    setCountrySearch('');
    phoneInputRef.current?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!formData.fullName || !formData.email || !formData.phone) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }
    if (!formData.consent) {
      setErrorMsg('Please agree to the terms before booking.');
      return;
    }
    if (isDateInPast(formData.preferredDate)) {
      setErrorMsg('Apologies, but that date has already passed. Please choose a future date.');
      return;
    }
    setIsSubmitting(true);
    
    const nameParts = formData.fullName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || 'Patient';

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email: formData.email,
          phone: `${selectedCountry.dial} ${formData.phone}`,
          preferredDate: formData.preferredDate,
          preferredTimeSlot: formData.preferredTimeSlot,
          notes: formData.notes,
          serviceName: selectedService,
          serviceId: selectedService.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          doctorPreference,
          insuranceProvider: 'Not Specified',
          isNewPatient: true,
          consent: formData.consent,
          isEmergency: false
        })
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setErrorMsg(data.error || 'Something went wrong.');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-[24px] shadow-2xl flex flex-col md:flex-row overflow-hidden border border-slate-200">
          
          {/* LEFT COLUMN: BRANDING & INFO */}
          <div className="w-full md:w-[35%] bg-[#0f4c5c] text-white p-8 md:p-12 flex flex-col shrink-0">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-white p-2 rounded-xl">
                <img src="/logo.png" alt="First Avenue Dentistry" className="h-10 w-auto" />
              </div>
            </div>

            <h2 className="text-4xl font-extrabold mb-4 leading-tight">Book an<br/>appointment</h2>
            <p className="text-[#a4c9c8] text-sm mb-12 pr-4 leading-relaxed">
              Choose a service and doctor, then pick a free time. We confirm every booking by email within one working hour.
            </p>

            <div className="space-y-8 flex-1">
              <div className="flex gap-4">
                <Calendar className="w-6 h-6 text-[#a4c9c8] shrink-0" />
                <div>
                  <h3 className="font-semibold text-sm mb-1">Opening hours</h3>
                  <p className="text-sm text-[#a4c9c8]">Mon–Fri, {CLINIC_SETTINGS.hours.weekdays}<br/>Closed at weekends and bank holidays</p>
                </div>
              </div>

              <div className="flex gap-4">
                <MapPin className="w-6 h-6 text-[#a4c9c8] shrink-0" />
                <div>
                  <h3 className="font-semibold text-sm mb-1">Address</h3>
                  <p className="text-sm text-[#a4c9c8]">{CLINIC_SETTINGS.address}<br/>Free parking available</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Phone className="w-6 h-6 text-[#a4c9c8] shrink-0" />
                <div>
                  <h3 className="font-semibold text-sm mb-1">Reception</h3>
                  <p className="text-sm font-semibold">{CLINIC_SETTINGS.phone}</p>
                </div>
              </div>
            </div>

            <div className="bg-[#155b6d] rounded-2xl p-6 mt-12 border border-[#1d6b7e]">
              <h3 className="font-semibold text-sm mb-4">What to bring</h3>
              <ul className="space-y-3 text-sm text-[#a4c9c8]">
                <li className="flex gap-3 items-start"><Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> Photo ID and your insurance card</li>
                <li className="flex gap-3 items-start"><Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> A list of current medicines and doses</li>
                <li className="flex gap-3 items-start"><Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> Recent test results or referral letters</li>
                <li className="flex gap-3 items-start"><Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> Arrive 10 minutes early for check-in</li>
              </ul>
            </div>
          </div>

          {/* RIGHT COLUMN: FORM */}
          <div className="w-full md:w-[65%] p-8 md:p-12 md:px-16 bg-white flex flex-col justify-center">
            
            {submitted ? (
               <div className="text-center py-16 space-y-6 my-auto">
                 <div className="w-24 h-24 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
                   <CheckCircle2 className="w-12 h-12" />
                 </div>
                 <h3 className="text-3xl font-bold text-slate-900">Request Sent!</h3>
                 <p className="text-slate-500 max-w-sm mx-auto text-lg">Thank you for choosing First Avenue Dentistry. We will contact you within 2 business hours to confirm your visit.</p>
                 <button onClick={() => onSelectView('home')} className="mt-8 px-8 py-4 rounded-full bg-[#0f4c5c] hover:bg-[#155b6d] text-white font-semibold transition-colors shadow-lg shadow-teal-900/20">Return to Home</button>
               </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-10">
                
                {errorMsg && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl font-medium">{errorMsg}</div>
                )}

                {/* STEP 1 */}
                <div>
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-8 h-8 rounded-full bg-[#e8f1f1] text-[#0f4c5c] flex items-center justify-center font-bold text-sm">1</div>
                    <h3 className="font-bold text-slate-900 text-lg">Doctor & Service</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-5 pl-12">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Service</label>
                      <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[#0f4c5c]/50 focus:border-[#0f4c5c] focus:bg-white transition-colors">
                        <option value="General Appointment">General Appointment</option>
                        {servicesList.filter(s => {
                          const name = typeof s === 'string' ? s : (s as any).label || (s as any).name;
                          return name && name !== "General Appointment";
                        }).map((s, i) => {
                          const name = typeof s === 'string' ? s : (s as any).label || (s as any).name;
                          return <option key={i} value={name}>{name}</option>;
                        })}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Doctor</label>
                      <select value={doctorPreference} onChange={(e) => setDoctorPreference(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[#0f4c5c]/50 focus:border-[#0f4c5c] focus:bg-white transition-colors">
                        <option value="Any Available">Choose a doctor...</option>
                        {doctors.map(doc => (
                          <option key={doc.id} value={`${doc.name}${doc.credentials ? `, ${doc.credentials}` : ''}`}>
                            {doc.name} — {doc.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <hr className="border-slate-100" />

                {/* STEP 2 */}
                <div>
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-8 h-8 rounded-full bg-[#e8f1f1] text-[#0f4c5c] flex items-center justify-center font-bold text-sm">2</div>
                    <h3 className="font-bold text-slate-900 text-lg">Date & time</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-5 pl-12">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Preferred date</label>
                      <input type="date" required min={todaySlug()} value={formData.preferredDate} onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[#0f4c5c]/50 focus:border-[#0f4c5c] focus:bg-white transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Available times</label>
                      <select required value={formData.preferredTimeSlot} onChange={(e) => setFormData({ ...formData, preferredTimeSlot: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[#0f4c5c]/50 focus:border-[#0f4c5c] focus:bg-white transition-colors">
                        <option value="09:00 AM">9:00 AM</option>
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="11:00 AM">11:00 AM</option>
                        <option value="12:00 PM">12:00 PM</option>
                        <option value="01:00 PM">1:00 PM</option>
                        <option value="02:00 PM">2:00 PM</option>
                        <option value="03:00 PM">3:00 PM</option>
                        <option value="04:00 PM">4:00 PM</option>
                      </select>
                    </div>
                  </div>
                </div>

                <hr className="border-slate-100" />

                {/* STEP 3 */}
                <div>
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-8 h-8 rounded-full bg-[#e8f1f1] text-[#0f4c5c] flex items-center justify-center font-bold text-sm">3</div>
                    <h3 className="font-bold text-slate-900 text-lg">Patient details</h3>
                  </div>
                  
                  <div className="space-y-5 pl-12">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Full name</label>
                      <input type="text" required value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[#0f4c5c]/50 focus:border-[#0f4c5c] focus:bg-white transition-colors" placeholder="e.g. John Doe" />
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Email</label>
                        <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[#0f4c5c]/50 focus:border-[#0f4c5c] focus:bg-white transition-colors" placeholder="name@example.com" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Phone</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={selectedCountry.dial}
                            readOnly
                            className="w-16 px-2 py-3 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 outline-none text-center cursor-not-allowed font-medium"
                          />
                          <input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[#0f4c5c]/50 focus:border-[#0f4c5c] focus:bg-white transition-colors" placeholder="(555) 010-2030" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Reason for visit (optional)</label>
                      <textarea rows={4} value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[#0f4c5c]/50 focus:border-[#0f4c5c] focus:bg-white transition-colors resize-none" placeholder="Any specific concerns..." />
                      <p className="text-[11px] text-slate-400 mt-1.5 text-right font-medium">{formData.notes.length} / 400 characters</p>
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer mt-6 group">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.consent ? 'bg-[#0f4c5c] border-[#0f4c5c]' : 'border-slate-300 bg-slate-50 group-hover:border-[#0f4c5c]'}`}>
                        {formData.consent && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <input type="checkbox" className="hidden" checked={formData.consent} onChange={(e) => setFormData({ ...formData, consent: e.target.checked })} />
                      <span className="text-sm text-slate-600 select-none">I agree that First Avenue Dentistry may store these details to manage my appointment.</span>
                    </label>
                  </div>
                </div>

                <div className="pt-6 pl-12 flex items-center gap-4">
                  <button type="submit" disabled={isSubmitting || !formData.consent} className="px-10 py-4 rounded-full bg-[#0f4c5c] hover:bg-[#155b6d] text-white font-bold text-sm shadow-xl shadow-teal-900/20 transition-all disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2">
                    {isSubmitting ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Processing...</> : <>Request appointment <ChevronRight className="w-4 h-4" /></>}
                  </button>
                  <span className="text-xs font-medium text-slate-400">Demo – nothing is sent. For urgent problems call 911.</span>
                </div>

              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
