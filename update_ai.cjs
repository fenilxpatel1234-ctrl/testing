const fs = require('fs');

let txt = fs.readFileSync('src/components/DentalConciergeAI.tsx', 'utf8');

// 1. Add 'service' to BookingStage
txt = txt.replace(/\| 'firstName'/, "| 'service'\n  | 'firstName'");

// 2. Add 'serviceName' to BookingData
txt = txt.replace(/firstName: string;/, "serviceName: string;\n  firstName: string;");
txt = txt.replace(/firstName: '',/g, "serviceName: '', firstName: '',");

// 3. Add fetching services
txt = txt.replace(/const \[messages, setMessages\] = useState<Message\[\]>\(/, 
`const [servicesList, setServicesList] = useState<string[]>([]);
  
  useEffect(() => {
    fetch('/api/services')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setServicesList(data); })
      .catch(() => {});
  }, []);
  
  const [messages, setMessages] = useState<Message[]>(`);

// 4. In submitBooking, pass serviceName and serviceId
txt = txt.replace(/lastName: bookingData.lastName,/, 
`lastName: bookingData.lastName,
          serviceName: bookingData.serviceName || 'General Consultation',
          serviceId: (bookingData.serviceName || 'general-consultation').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          doctorPreference: 'Any Available',`);

txt = txt.replace(/• Name: \${bookingData\.firstName}/, `• Service: \${bookingData.serviceName || 'General Consultation'}\n• Name: \${bookingData.firstName}`);

// 5. Change `booking_start` to set `service` stage
txt = txt.replace(/setBookingStage\('firstName'\);/, `setBookingStage('service');\n        addAiMsg("I can certainly help you book an appointment! What service are you looking for?");`);

// 6. Update handleBookingInput to process 'service' and support editing in 'confirm'
const editLogic = `      case 'service':
        setBookingData(prev => ({ ...prev, serviceName: value }));
        setBookingStage('firstName');
        addAiMsg(\`Got it, \${value}. Now, what's your first name?\`);
        return true;
        
      case 'confirm':
        const v = value.toLowerCase().trim();
        if (['yes', 'yep', 'correct', 'sure', 'yeah'].includes(v)) {
          submitBooking();
        } else if (v.includes('no ') || v === 'no' || v.includes('change') || v.includes('edit') || v.includes('update')) {
          if (v.includes('service')) {
            setBookingStage('service'); addAiMsg("Let's change the service. What service do you need?");
          } else if (v.includes('name')) {
            setBookingStage('firstName'); addAiMsg("Let's update your name. What is your first name?");
          } else if (v.includes('email')) {
            setBookingStage('email'); addAiMsg("Let's update your email. What is your correct email address?");
          } else if (v.includes('phone') || v.includes('number')) {
            setBookingStage('phone'); addAiMsg("Let's update your phone. Please choose the country code and type the number.");
          } else if (v.includes('date') || v.includes('day')) {
            setBookingStage('date'); addAiMsg("Let's update your date. What new date do you prefer?");
          } else if (v.includes('time')) {
            setBookingStage('time'); addAiMsg("Let's update your time. What new time do you prefer?");
          } else if (v.includes('note')) {
            setBookingStage('notes'); addAiMsg("Let's update your notes. What would you like to add?");
          } else {
            addAiMsg("What would you like to change? (e.g. 'edit time', 'change date', 'edit email', 'change service')");
          }
        } else {
          addAiMsg("I didn't quite catch that. Please say 'yes' to submit, or 'edit [field]' to change something (e.g. 'edit date').");
        }
        return true;`;

txt = txt.replace(/case 'firstName':/, editLogic.split('case \'confirm\':')[0] + "\n      case 'firstName':");
txt = txt.replace(/case 'confirm':[\s\S]*?return true;/, editLogic.split('case \'confirm\':\n')[1]);

// Also update the confirmation summary in `case 'notes':`
txt = txt.replace(/Let me confirm your appointment details:\\n\\n• Name:/, `Let me confirm your appointment details:\n\n• Service: \${bookingData.serviceName || 'General Consultation'}\n• Name:`);

// 7. Render UI buttons for services when bookingStage === 'service'
const serviceOptionsUI = `      {bookingStage === 'service' && servicesList.length > 0 && (
        <div className="px-4 py-3 bg-slate-100/70 border-t border-slate-200 space-y-2">
          <p className="text-[10px] uppercase font-semibold text-slate-400">Available Services</p>
          <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
            {servicesList.map((s, i) => {
              const name = typeof s === 'string' ? s : (s as any).label || (s as any).name;
              return (
                <button
                  key={i}
                  onClick={() => {
                    setInput(name);
                    chatInputRef.current?.focus();
                  }}
                  className="text-[10px] text-blue-600 bg-white px-2.5 py-1.5 rounded-full border border-slate-200 hover:bg-blue-50 transition-colors text-left"
                >
                  {name}
                </button>
              );
            })}
          </div>
          <p className="text-[9px] text-slate-400">Tap a service above or type your own.</p>
        </div>
      )}

      {bookingStage === 'phone' && (`;
txt = txt.replace(/\{bookingStage === 'phone' && \(/, serviceOptionsUI);

fs.writeFileSync('src/components/DentalConciergeAI.tsx', txt, 'utf8');
