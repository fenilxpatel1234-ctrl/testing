const fs = require('fs');

let txt = fs.readFileSync('src/components/EmergencyBookingModal.tsx', 'utf8');

txt = txt.replace(/BookingModal/g, 'EmergencyBookingModal');
txt = txt.replace(/#0f4c5c/g, '#b91c1c'); // dark teal to crimson
txt = txt.replace(/#155b6d/g, '#991b1b');
txt = txt.replace(/#e8f1f1/g, '#fef2f2');
txt = txt.replace(/#a4c9c8/g, '#fecaca');
txt = txt.replace(/text-emerald-400/g, 'text-red-300');
txt = txt.replace(/#1d6b7e/g, '#7f1d1d');
txt = txt.replace(/Book an<br\/>appointment/, 'Emergency<br/>Dental Request');
txt = txt.replace(
  /Choose a service and doctor, then pick a free time\. We confirm every booking by email within one working hour\./,
  'If you are experiencing a life-threatening emergency, please call 911 immediately. Otherwise, please provide your details below and our on-call team will fit you in as soon as possible.'
);
txt = txt.replace(/What to bring/, 'Important Note');

const oldList = `<li className="flex gap-3 items-start"><Check className="w-4 h-4 text-red-300 shrink-0 mt-0.5" /> Photo ID and your insurance card</li>
              <li className="flex gap-3 items-start"><Check className="w-4 h-4 text-red-300 shrink-0 mt-0.5" /> A list of current medicines and doses</li>
              <li className="flex gap-3 items-start"><Check className="w-4 h-4 text-red-300 shrink-0 mt-0.5" /> Recent test results or referral letters</li>
              <li className="flex gap-3 items-start"><Check className="w-4 h-4 text-red-300 shrink-0 mt-0.5" /> Arrive 10 minutes early for check-in</li>`;
const newList = `<li className="flex gap-3 items-start"><Check className="w-4 h-4 text-red-300 shrink-0 mt-0.5" /> If you do not hear back within 1 hour, please call our clinic directly.</li>
              <li className="flex gap-3 items-start"><Check className="w-4 h-4 text-red-300 shrink-0 mt-0.5" /> Apply a cold compress to reduce swelling while waiting.</li>`;
txt = txt.replace(oldList, newList);

// Set default service to emergency, and hide service selection
txt = txt.replace(/isEmergency: !!isEmergency/, 'isEmergency: true');
txt = txt.replace(/<option value="General Appointment">General Appointment<\/option>/, '<option value="Emergency Consultation">Emergency Consultation</option>');
txt = txt.replace(/<option value="Any Available">Choose a doctor\.\.\.<\/option>/, '<option value="Any Available">Any Available Doctor (ASAP)</option>');

// Default the state for service
txt = txt.replace(/useState\('General Appointment'\)/, "useState('Emergency Consultation')");
txt = txt.replace(/setSelectedService\('General Appointment'\)/g, "setSelectedService('Emergency Consultation')");
txt = txt.replace(/selectedService === 'General Appointment'/g, "selectedService === 'Emergency Consultation'");

fs.writeFileSync('src/components/EmergencyBookingModal.tsx', txt, 'utf8');
