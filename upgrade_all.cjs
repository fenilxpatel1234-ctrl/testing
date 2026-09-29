const fs = require('fs');

// 1. Fix DentalConciergeAI.tsx
let aiContent = fs.readFileSync('src/components/DentalConciergeAI.tsx', 'utf-8');

const aiOldSearch = `  const filteredCountries = countrySearch.trim()
    ? COUNTRIES.filter(c =>
        c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
        c.code.toLowerCase().includes(countrySearch.toLowerCase()) ||
        c.dial.includes(countrySearch.replace(/\\D/g, ''))
      )
    : COUNTRIES;`;

const aiNewSearch = `  const filteredCountries = countrySearch.trim()
    ? COUNTRIES.filter(c => {
        const cleanSearch = countrySearch.replace(/\\D/g, '');
        const matchesDial = cleanSearch ? c.dial.replace(/\\D/g, '').includes(cleanSearch) : false;
        const matchesName = c.name.toLowerCase().includes(countrySearch.toLowerCase());
        const matchesCode = c.code.toLowerCase().includes(countrySearch.toLowerCase());
        return matchesName || matchesCode || matchesDial;
      })
    : COUNTRIES;`;

aiContent = aiContent.replace(aiOldSearch, aiNewSearch);

// Add smart editing to the AI assistant
const handleBookingStart = `  const handleBookingInput = (value: string) => {
    if (!bookingStage) return false;
    
    // Smart intent detection for editing`;

const handleBookingNew = `  const handleBookingInput = (value: string) => {
    if (!bookingStage) return false;
    
    const lowerVal = value.toLowerCase();
    
    // Extremely smart intent detection for editing
    if (lowerVal.includes('change') || lowerVal.includes('edit') || lowerVal.includes('wrong') || lowerVal.includes('update')) {
       if (lowerVal.includes('name') || lowerVal.includes('first name') || lowerVal.includes('last name')) {
         setBookingStage('firstName');
         addAiMsg("Absolutely. Let's update your name. What is your first name?");
         return true;
       }
       if (lowerVal.includes('email') || lowerVal.includes('mail')) {
         setBookingStage('email');
         addAiMsg("No problem. Let's update your email. What is the correct email address?");
         return true;
       }
       if (lowerVal.includes('phone') || lowerVal.includes('number')) {
         setBookingStage('phone');
         addAiMsg("Sure thing. Let's update your phone number. Please enter your country code and phone number.");
         return true;
       }
       if (lowerVal.includes('date') || lowerVal.includes('day')) {
         setBookingStage('date');
         addAiMsg("Let's pick a different date. When would you like to come in?");
         return true;
       }
       if (lowerVal.includes('time') || lowerVal.includes('hour')) {
         setBookingStage('time');
         addAiMsg("Let's update your time preference. What time works best for you?");
         return true;
       }
       if (lowerVal.includes('note') || lowerVal.includes('message')) {
         setBookingStage('notes');
         addAiMsg("Got it. Let's update your notes. What would you like to add?");
         return true;
       }
    }`;

aiContent = aiContent.replace(handleBookingStart, handleBookingNew);

fs.writeFileSync('src/components/DentalConciergeAI.tsx', aiContent, 'utf-8');


// 2. Enhance BookingModal.tsx with a hyper-professional 2-column layout
let modalContent = fs.readFileSync('src/components/BookingModal.tsx', 'utf-8');

const oldModalLayout = `<div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors z-10">
          <X className="w-4 h-4" />
        </button>

        <div className="p-6">
          <div className="flex items-center gap-3 mb-4 justify-center border-b border-slate-100 pb-4">
            <img src="/logo.png" alt="First Avenue Dentistry Logo" className="h-10 w-auto" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">Book an Appointment</h2>
          <p className="text-xs text-slate-500 mb-6">Fill in your details and we'll confirm your visit.</p>`;

const newModalLayout = `<div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col md:flex-row">
        <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors z-20 shadow-sm">
          <X className="w-5 h-5" />
        </button>

        <div className="hidden md:block md:w-5/12 bg-slate-50 relative overflow-hidden">
          <img src="https://static.wixstatic.com/media/2a5871_f75ac588ee2045fd8dee936181e78335~mv2.png" alt="Dental Office" className="absolute inset-0 w-full h-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/40 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-8 text-white">
             <div className="bg-white p-3 rounded-2xl inline-block mb-6 shadow-xl">
               <img src="/logo.png" alt="First Avenue Dentistry" className="h-12 w-auto" />
             </div>
             <h3 className="text-2xl font-bold mb-2">Premium Dental Care</h3>
             <p className="text-blue-100 text-sm">Experience the difference with our state-of-the-art facility and compassionate team.</p>
          </div>
        </div>

        <div className="w-full md:w-7/12 p-8 md:p-10 relative">
          <div className="md:hidden flex items-center justify-center mb-6">
            <img src="/logo.png" alt="First Avenue Dentistry" className="h-12 w-auto" />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Book an Appointment</h2>
          <p className="text-sm text-slate-500 mb-8">Fill in your details and our concierge will confirm your visit.</p>`;

if(modalContent.includes('max-w-md bg-white rounded-2xl shadow-2xl')) {
    modalContent = modalContent.replace(oldModalLayout, newModalLayout);
}

fs.writeFileSync('src/components/BookingModal.tsx', modalContent, 'utf-8');

// 3. Enhance Email Layout to be super professional
let serverContent = fs.readFileSync('server.ts', 'utf-8');

const oldEmailLayoutStart = `          <tr>
            <td style="background:#ffffff;padding:32px 40px;text-align:center;border-bottom:3px solid #0f172a;">
              <img src="\${SITE_URL}/logo.png" alt="First Avenue Dentistry" style="height:60px;width:auto;display:inline-block;" />
            </td>
          </tr>`;

const newEmailLayoutStart = `          <tr>
            <td style="background:#ffffff;padding:40px;text-align:center;border-bottom:4px solid #1e3a8a;">
              <img src="\${SITE_URL}/logo.png" alt="First Avenue Dentistry" style="height:70px;width:auto;display:inline-block;margin-bottom:15px;" />
              <div style="font-size:12px;color:#64748b;letter-spacing:3px;text-transform:uppercase;font-weight:700;">Premium Dental Care</div>
            </td>
          </tr>`;

if(serverContent.includes('padding:32px 40px;text-align:center;border-bottom:3px solid #0f172a;')) {
    serverContent = serverContent.replace(oldEmailLayoutStart, newEmailLayoutStart);
}

// Add rounded corners and beautiful shadow to email container
serverContent = serverContent.replace(
    'max-width:600px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,0.05);',
    'max-width:650px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 20px 40px rgba(0,0,0,0.1);border:1px solid #e2e8f0;'
);

// Enhance buttons in email
serverContent = serverContent.replace(
    'background-color:#2563eb;',
    'background:linear-gradient(135deg, #1e40af 0%, #2563eb 100%);'
);

fs.writeFileSync('server.ts', serverContent, 'utf-8');

console.log('Done upgrading AI, Booking Form, and Emails');
