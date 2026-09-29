import React, { useState, useEffect, useRef } from 'react';
import { X, CheckCircle2, Calendar, MapPin, Phone, Info, ChevronRight, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Doctor } from '../types';
import { isDateInPast, todaySlug } from '../lib/dateUtil';

export const COUNTRIES = [
  { code: 'CA', name: 'Canada', dial: '+1' },
  { code: 'US', name: 'United States', dial: '+1' },
  { code: 'GB', name: 'United Kingdom', dial: '+44' },
  { code: 'IN', name: 'India', dial: '+91' },
  { code: 'AU', name: 'Australia', dial: '+61' },
  // Adding just top 5 for brevity in demo, full list normally here
];

export const detectCountryCode = async (): Promise<string> => {
  try {
    const res = await fetch('https://ipapi.co/json/');
    const data = await res.json();
    return data.country_code || 'US';
  } catch {
    return 'US';
  }
};

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedServiceId?: string;
  isEmergency?: boolean;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, preselectedServiceId, isEmergency }) => {
  const [countryCode, setCountryCode] = useState('US');
  const [countrySearch, setCountrySearch] = useState('');
  const [countryIndex, setCountryIndex] = useState(0);
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '',
    preferredDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    preferredTimeSlot: '09:00 AM',
    notes: '',
    consent: false
  });
  const [countryOpen, setCountryOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [doctorPreference, setDoctorPreference] = useState('Any Available');
  const [servicesList, setServicesList] = useState<string[]>([]);
  const [selectedService, setSelectedService] = useState('General Appointment');
  const phoneInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && preselectedServiceId && servicesList.length > 0) {
      const match = servicesList.find(s => {
        if (typeof s === 'object') return (s as any).id === preselectedServiceId;
        return typeof s === 'string' && s.toLowerCase().replace(/[^a-z0-9]+/g, '-') === preselectedServiceId;
      });
      if (match) {
        setSelectedService(typeof match === 'string' ? match : (match as any).label || (match as any).name);
      }
    } else if (isOpen && !preselectedServiceId && selectedService === 'General Appointment') {
        setSelectedService('General Appointment');
    }
  }, [preselectedServiceId, servicesList, isOpen]);

  useEffect(() => {
    detectCountryCode().then(code => setCountryCode(code));
  }, []);

  useEffect(() => {
    fetch('/api/doctors')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setDoctors(data); })
      .catch(() => {});
      
    fetch('/api/services')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setServicesList(data); })
      .catch(() => {});
  }, []);

  if (!isOpen) return null;

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
    
    // Split full name into first and last for API compatibility
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
          isEmergency: !!isEmergency
        })
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      } else {
        setErrorMsg(data.error || 'Something went wrong.');
      }
    } catch {
      setErrorMsg('Network error. Please call us instead.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-[24px] shadow-2xl flex flex-col md:flex-row overflow-hidden my-auto mx-auto min-h-[600px]">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 md:right-6 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors z-20 shadow-sm border border-slate-200">
          <X className="w-5 h-5" />
        </button>

        {/* LEFT COLUMN: BRANDING & INFO */}
        <div className="w-full md:w-[35%] bg-[#0f4c5c] text-white p-8 md:p-10 flex flex-col relative shrink-0">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-white p-2 rounded-xl">
              <img src="/logo.png" alt="First Avenue Dentistry" className="h-10 w-auto" />
            </div>
          </div>

          <h2 className="text-3xl font-extrabold mb-4 leading-tight">Book an<br/>appointment</h2>
          <p className="text-[#a4c9c8] text-sm mb-10 pr-4 leading-relaxed">
            Choose a service and doctor, then pick a free time. We confirm every booking by email within one working hour.
          </p>

          <div className="space-y-6 flex-1">
            <div className="flex gap-4">
              <Calendar className="w-5 h-5 text-[#a4c9c8] shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm mb-1">Opening hours</h3>
                <p className="text-sm text-[#a4c9c8]">Mon–Fri, 9:00 am – 6:00 pm<br/>Closed at weekends and bank holidays</p>
              </div>
            </div>

            <div className="flex gap-4">
              <MapPin className="w-5 h-5 text-[#a4c9c8] shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm mb-1">Address</h3>
                <p className="text-sm text-[#a4c9c8]">308 Wellington Street, St.Thomas<br/>Free parking behind the building</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Phone className="w-5 h-5 text-[#a4c9c8] shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm mb-1">Reception</h3>
                <p className="text-sm font-semibold">(519) 207-6890</p>
              </div>
            </div>
          </div>

          <div className="bg-[#155b6d] rounded-2xl p-5 mt-10">
            <h3 className="font-semibold text-sm mb-3">What to bring</h3>
            <ul className="space-y-2 text-sm text-[#a4c9c8]">
              <li className="flex gap-2 items-start"><Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> Photo ID and your insurance card</li>
              <li className="flex gap-2 items-start"><Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> A list of current medicines and doses</li>
              <li className="flex gap-2 items-start"><Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> Recent test results or referral letters</li>
              <li className="flex gap-2 items-start"><Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> Arrive 10 minutes early for check-in</li>
            </ul>
          </div>
        </div>

        {/* RIGHT COLUMN: FORM */}
        <div className="w-full md:w-[65%] p-8 md:p-10 md:px-12 bg-white flex flex-col justify-center">
          
          {submitted ? (
             <div className="text-center py-12 space-y-5 my-auto">
               <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
                 <CheckCircle2 className="w-10 h-10" />
               </div>
               <h3 className="text-2xl font-bold text-slate-900">Request Sent!</h3>
               <p className="text-slate-500 max-w-sm mx-auto">Thank you for choosing First Avenue Dentistry. We will contact you within 2 business hours to confirm your visit.</p>
               <button onClick={() => { setSubmitted(false); onClose(); }} className="mt-8 px-8 py-3 rounded-full bg-[#0f4c5c] hover:bg-[#155b6d] text-white font-semibold transition-colors">Return to site</button>
             </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {errorMsg && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl font-medium">{errorMsg}</div>
              )}

              {/* STEP 1 */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-6 h-6 rounded-full bg-[#e8f1f1] text-[#0f4c5c] flex items-center justify-center font-bold text-xs">1</div>
                  <h3 className="font-bold text-slate-900">Doctor & Service</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Service</label>
                    <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[#0f4c5c]/50 focus:border-[#0f4c5c]">
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
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Doctor</label>
                    <select value={doctorPreference} onChange={(e) => setDoctorPreference(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[#0f4c5c]/50 focus:border-[#0f4c5c]">
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
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-6 h-6 rounded-full bg-[#e8f1f1] text-[#0f4c5c] flex items-center justify-center font-bold text-xs">2</div>
                  <h3 className="font-bold text-slate-900">Date & time</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Preferred date</label>
                    <input type="date" required min={todaySlug()} value={formData.preferredDate} onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[#0f4c5c]/50 focus:border-[#0f4c5c]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Available times</label>
                    <select required value={formData.preferredTimeSlot} onChange={(e) => setFormData({ ...formData, preferredTimeSlot: e.target.value })} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[#0f4c5c]/50 focus:border-[#0f4c5c]">
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
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-6 h-6 rounded-full bg-[#e8f1f1] text-[#0f4c5c] flex items-center justify-center font-bold text-xs">3</div>
                  <h3 className="font-bold text-slate-900">Patient details</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Full name</label>
                    <input type="text" required value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[#0f4c5c]/50 focus:border-[#0f4c5c]" placeholder="John Doe" />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email</label>
                      <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[#0f4c5c]/50 focus:border-[#0f4c5c]" placeholder="name@example.com" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">Phone</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={selectedCountry.dial}
                          readOnly
                          className="w-16 px-2 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-500 outline-none text-center cursor-not-allowed"
                        />
                        <input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[#0f4c5c]/50 focus:border-[#0f4c5c]" placeholder="(555) 010-2030" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Reason for visit (optional)</label>
                    <textarea rows={3} value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[#0f4c5c]/50 focus:border-[#0f4c5c] resize-none" placeholder="Any specific concerns..." />
                    <p className="text-[10px] text-slate-400 mt-1.5 text-right">{formData.notes.length} / 400 characters</p>
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer mt-4 group">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.consent ? 'bg-[#0f4c5c] border-[#0f4c5c]' : 'border-slate-300 bg-white group-hover:border-[#0f4c5c]'}`}>
                      {formData.consent && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <input type="checkbox" className="hidden" checked={formData.consent} onChange={(e) => setFormData({ ...formData, consent: e.target.checked })} />
                    <span className="text-xs text-slate-600 select-none">I agree that First Avenue Dentistry may store these details to manage my appointment.</span>
                  </label>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-4">
                <button type="submit" disabled={isSubmitting || !formData.consent} className="px-8 py-3.5 rounded-full bg-[#0f4c5c] hover:bg-[#155b6d] text-white font-semibold text-sm shadow-md transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  {isSubmitting ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Processing...</> : <>Request appointment <ChevronRight className="w-4 h-4" /></>}
                </button>
                <span className="text-xs text-slate-400">Demo – nothing is sent. For urgent problems call 911.</span>
              </div>

            </form>
          )}
        </div>
      </div>
    </div>
  );
};
