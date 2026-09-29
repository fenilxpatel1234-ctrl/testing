import React, { useState } from 'react';
import { PageView } from '../types';
import { CLINIC_SETTINGS } from '../data/mockData';
import { Sparkles, MapPin, Phone, Mail, Clock, Send, CheckCircle2, Download, ShieldAlert } from 'lucide-react';

interface ContactUsViewProps {
  onSelectView: (view: PageView) => void;
  onOpenBooking: () => void;
}

export const ContactUsView: React.FC<ContactUsViewProps> = ({ onSelectView, onOpenBooking }) => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          subject: 'Contact Form Inquiry',
          message: formData.message
        })
      });
      const data = await res.json();
      if (data.success) setSubmitted(true);
    } catch (err) {
      alert('Failed to send message. Please call us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-20 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div className="text-center max-w-3xl mx-auto space-y-4">
        
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">Contact Us</h1>
        <p className="text-slate-600 text-base leading-relaxed">We'd love to hear from you! Reach out with any questions or to schedule your visit.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xl space-y-6">
            <h3 className="text-xl font-bold text-slate-900">Contact Information</h3>
            <div className="space-y-4 text-sm text-slate-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div><div className="font-bold text-slate-900">Address</div><div>{CLINIC_SETTINGS.address}</div></div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div><div className="font-bold text-slate-900">Phone</div><a href={`tel:${CLINIC_SETTINGS.phone.replace(/\D/g, '')}`} className="hover:text-blue-600 font-semibold">{CLINIC_SETTINGS.phone}</a></div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div><div className="font-bold text-slate-900">Email</div><a href={`mailto:${CLINIC_SETTINGS.email}`} className="hover:text-blue-600">{CLINIC_SETTINGS.email}</a></div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div><div className="font-bold text-slate-900">Hours</div><div>Mon – Fri: {CLINIC_SETTINGS.hours.weekdays}</div><div>Saturday: {CLINIC_SETTINGS.hours.saturday}</div><div>Sunday: {CLINIC_SETTINGS.hours.sunday}</div></div>
              </div>
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/30 p-6 rounded-3xl space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm text-amber-600">
              <ShieldAlert className="w-5 h-5" /> Emergency Care
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">For dental emergencies, please call our office immediately.</p>
            <a href={`tel:${CLINIC_SETTINGS.phone.replace(/\D/g, '')}`} className="inline-block py-2.5 px-4 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-md hover:bg-amber-400 transition-colors">Call {CLINIC_SETTINGS.phone}</a>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Medical History Forms</h3>
            <p className="text-xs text-slate-500">Download and complete before your visit to save time. Forms open in your browser or PDF viewer so you can fill them out digitally.</p>
            <div className="space-y-2">
              <a href="/forms/medical-history-adult.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"><Download className="w-4 h-4 text-blue-500" /> MEDICAL HISTORY - ADULT</a>
              <a href="/forms/medical-history-child-over-5.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"><Download className="w-4 h-4 text-blue-500" /> MEDICAL HISTORY - CHILD OVER 5</a>
              <a href="/forms/medical-history-child-under-5.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"><Download className="w-4 h-4 text-blue-500" /> MEDICAL HISTORY - CHILD UNDER 5</a>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Send Us a Message</h3>
            {submitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-700 text-sm font-semibold flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 shrink-0" />
                <span>Thank you! Your message has been received.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">First Name *</label>
                    <input type="text" required value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-500" placeholder="First Name" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name *</label>
                    <input type="text" required value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Last Name" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email *</label>
                    <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-500" placeholder="your@email.com" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Phone</label>
                    <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-500" placeholder="(555) 000-0000" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Message *</label>
                  <textarea rows={4} required value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="How can we help you?" />
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                  {isSubmitting ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Sending...</> : <><Send className="w-4 h-4" /> Send Message</>}
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

      <div className="rounded-3xl overflow-hidden border border-slate-200/80 shadow-xl h-[400px]">
        <iframe title="First Avenue Dentistry Location Map" src={CLINIC_SETTINGS.googleMapsEmbedUrl} className="w-full h-full border-0" loading="lazy"></iframe>
      </div>

    </div>
  );
};
