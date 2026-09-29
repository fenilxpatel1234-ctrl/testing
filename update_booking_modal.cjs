const fs = require('fs');

let content = fs.readFileSync('src/components/BookingModal.tsx', 'utf-8');

// 1. Fix country search
const oldCountrySearch = `  const filteredCountries = countrySearch.trim()
    ? COUNTRIES.filter(c =>
        c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
        c.code.toLowerCase().includes(countrySearch.toLowerCase()) ||
        c.dial.includes(countrySearch.replace(/\\D/g, ''))
      )
    : COUNTRIES;`;

const newCountrySearch = `  const filteredCountries = countrySearch.trim()
    ? COUNTRIES.filter(c => {
        const cleanSearch = countrySearch.replace(/\\D/g, '');
        const matchesDial = cleanSearch ? c.dial.replace(/\\D/g, '').includes(cleanSearch) : false;
        const matchesName = c.name.toLowerCase().includes(countrySearch.toLowerCase());
        const matchesCode = c.code.toLowerCase().includes(countrySearch.toLowerCase());
        return matchesName || matchesCode || matchesDial;
      })
    : COUNTRIES;`;

content = content.replace(oldCountrySearch, newCountrySearch);

// 2. Add services state and dropdown
const stateDeclarations = `  const [doctorPreference, setDoctorPreference] = useState('Any Available');
  const phoneInputRef = useRef<HTMLInputElement>(null);`;

const newStateDeclarations = `  const [doctorPreference, setDoctorPreference] = useState('Any Available');
  const [servicesList, setServicesList] = useState<string[]>([]);
  const [selectedService, setSelectedService] = useState('General Appointment');
  const phoneInputRef = useRef<HTMLInputElement>(null);`;

content = content.replace(stateDeclarations, newStateDeclarations);

// Fetch services
const fetchDoctors = `  useEffect(() => {
    fetch('/api/doctors')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setDoctors(data); })
      .catch(() => {});
  }, []);`;

const fetchBoth = `  useEffect(() => {
    fetch('/api/doctors')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setDoctors(data); })
      .catch(() => {});
      
    fetch('/api/services')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setServicesList(data); })
      .catch(() => {});
  }, []);`;

content = content.replace(fetchDoctors, fetchBoth);

// 3. Update POST payload
const oldPayload = `          serviceName: 'General Appointment',
          serviceId: 'general-checkup',`;
const newPayload = `          serviceName: selectedService,
          serviceId: selectedService.toLowerCase().replace(/[^a-z0-9]+/g, '-'),`;

content = content.replace(oldPayload, newPayload);

// 4. Update the visual layout: Add Logo to header
const oldHeader = `          <h2 className="text-xl font-bold text-slate-900 mb-1">Book an Appointment</h2>
          <p className="text-xs text-slate-500 mb-6">Fill in your details and we'll confirm your visit.</p>`;

const newHeader = `          <div className="flex items-center gap-3 mb-4 justify-center border-b border-slate-100 pb-4">
            <img src="/logo.png" alt="First Avenue Dentistry Logo" className="h-10 w-auto" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">Book an Appointment</h2>
          <p className="text-xs text-slate-500 mb-6">Fill in your details and we'll confirm your visit.</p>`;

content = content.replace(oldHeader, newHeader);

// 5. Add the Service dropdown to the form layout
const formFieldsStr = `              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">First Name *</label>`;

const formFieldsWithService = `              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Service *</label>
                <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="General Appointment">General Appointment</option>
                  {servicesList.filter(s => s !== "General Appointment").map((s, i) => (
                    <option key={i} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">First Name *</label>`;

content = content.replace(formFieldsStr, formFieldsWithService);

fs.writeFileSync('src/components/BookingModal.tsx', content, 'utf-8');
console.log('BookingModal updated with new logo, service selection, and robust country search.');
