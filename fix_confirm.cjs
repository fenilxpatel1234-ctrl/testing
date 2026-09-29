const fs = require('fs');

let txt = fs.readFileSync('src/components/DentalConciergeAI.tsx', 'utf8');

txt = txt.replace(/case 'notes':[\s\S]*?submitBooking\(\);/,
`case 'notes':
        setBookingData(prev => ({ ...prev, notes: value === 'none' ? '' : value }));
        setBookingStage('confirm');
        addAiMsg(\`Let me confirm your appointment details:

• Service: \${bookingData.serviceName || 'General Consultation'}
• Name: \${bookingData.firstName} \${bookingData.lastName}
• Email: \${bookingData.email}
• Phone: \${bookingData.phone}
• Date: \${bookingData.date}
• Time: \${value === 'none' ? bookingData.time : bookingData.time}
\${value !== 'none' ? \`• Notes: \${value}\` : ''}

Does everything look correct? 
Reply "yes" to submit.
Reply "edit [field]" to change something (e.g. "edit time", "change service").
Reply "no" to start over.\`);
        return true;

      case 'confirm':
        const v = value.toLowerCase().trim();
        if (['yes', 'yep', 'correct', 'sure', 'yeah'].includes(v)) {
          submitBooking();`);

// Fix countrySearch logic
txt = txt.replace(/const filteredCountries = countrySearch\.trim\(\)[\s\S]*?: COUNTRIES;/,
`const filteredCountries = countrySearch.trim()
    ? COUNTRIES.filter(c => {
        const cleanSearch = countrySearch.replace(/\\D/g, '');
        const matchesDial = cleanSearch ? c.dial.replace(/\\D/g, '').includes(cleanSearch) : false;
        const matchesName = c.name.toLowerCase().includes(countrySearch.toLowerCase());
        const matchesCode = c.code.toLowerCase().includes(countrySearch.toLowerCase());
        return matchesName || matchesCode || matchesDial;
      })
    : COUNTRIES;`);

fs.writeFileSync('src/components/DentalConciergeAI.tsx', txt, 'utf8');
