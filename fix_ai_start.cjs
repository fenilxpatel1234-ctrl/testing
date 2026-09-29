const fs = require('fs');

let txt = fs.readFileSync('src/components/DentalConciergeAI.tsx', 'utf8');

txt = txt.replace(
  /if \(data\.action === 'booking_start'\) \{\s*setBookingStage\('firstName'\);\s*\}/,
  `if (data.action === 'booking_start') {
        setBookingStage('service');
      }`
);

fs.writeFileSync('src/components/DentalConciergeAI.tsx', txt, 'utf8');
