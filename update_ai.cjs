const fs = require('fs');

let content = fs.readFileSync('src/components/DentalConciergeAI.tsx', 'utf-8');

// Enhance the AI message to be more professional
const oldIntro = `"Hello! I am the First Avenue AI assistant. Ask me anything about our dental services, appointment scheduling, or general dental care!"`;
const newIntro = `"Welcome to First Avenue Dentistry! I'm your dedicated dental concierge. How may I assist you today? Whether you need to book an appointment, inquire about our services, or have a dental concern, I'm here to provide a premium experience."`;

content = content.replace(oldIntro, newIntro);

// Add smart understanding of "edit/change" in handleBookingInput
const oldHandleBooking = `  const handleBookingInput = (value: string) => {
    if (!bookingStage) return false;

    switch (bookingStage) {`;

const newHandleBooking = `  const handleBookingInput = (value: string) => {
    if (!bookingStage) return false;
    
    // Smart intent detection for editing
    const lowerVal = value.toLowerCase();
    if (lowerVal.includes('change name') || lowerVal.includes('edit name') || lowerVal.includes('wrong name')) {
       setBookingStage('firstName');
       addAiMsg("No problem, let's update your name. What is your first name?");
       return true;
    }
    if (lowerVal.includes('change email') || lowerVal.includes('edit email') || lowerVal.includes('wrong email')) {
       setBookingStage('email');
       addAiMsg("Let's update your email. What is the correct email address?");
       return true;
    }
    if (lowerVal.includes('change phone') || lowerVal.includes('edit phone') || lowerVal.includes('wrong phone')) {
       setBookingStage('phone');
       addAiMsg("Let's update your phone number. Please enter your country code and phone number.");
       return true;
    }
    if (lowerVal.includes('change date') || lowerVal.includes('edit date') || lowerVal.includes('wrong date')) {
       setBookingStage('date');
       addAiMsg("Let's pick a different date. When would you like to come in?");
       return true;
    }
    if (lowerVal.includes('change time') || lowerVal.includes('edit time') || lowerVal.includes('wrong time')) {
       setBookingStage('time');
       addAiMsg("Let's update your time preference. What time works best?");
       return true;
    }

    switch (bookingStage) {`;

content = content.replace(oldHandleBooking, newHandleBooking);

fs.writeFileSync('src/components/DentalConciergeAI.tsx', content, 'utf-8');
console.log('AI Assistant updated with professional greetings and editing capabilities.');
