const fs = require('fs');

let txt = fs.readFileSync('src/App.tsx', 'utf8');

txt = txt.replace(/import { BookingModal } from '\.\/components\/BookingModal';\r?\nimport { DentalConciergeAI } from '\.\/components\/DentalConciergeAI';/, 
`import { BookingModal } from './components/BookingModal';
import { EmergencyBookingModal } from './components/EmergencyBookingModal';
import { DentalConciergeAI } from './components/DentalConciergeAI';`);

txt = txt.replace(/<BookingModal[\s\S]*?isEmergency={isEmergencyBooking}\s*\/>/, 
`{isEmergencyBooking ? (
        <EmergencyBookingModal
          isOpen={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
          preselectedServiceId={selectedServiceId}
          isEmergency={true}
        />
      ) : (
        <BookingModal
          isOpen={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
          preselectedServiceId={selectedServiceId}
          isEmergency={false}
        />
      )}`);

fs.writeFileSync('src/App.tsx', txt, 'utf8');
