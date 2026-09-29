const fs = require('fs');

let content = fs.readFileSync('src/views/AdminView.tsx', 'utf-8');

// 1. Add services state
const stateDeclarations = `  const [doctors, setDoctors] = useState<Doctor[]>([]);`;
const newStateDeclarations = `  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [services, setServices] = useState<string[]>([]);
  const [newService, setNewService] = useState('');`;
content = content.replace(stateDeclarations, newStateDeclarations);

// 2. Add fetchServices
const fetchDoctors = `  const fetchDoctors = async () => {
    try {
      const res = await fetch('/api/doctors');
      const data = await res.json();
      if (Array.isArray(data)) setDoctors(data);
    } catch {}
  };`;
const fetchBoth = `  const fetchDoctors = async () => {
    try {
      const res = await fetch('/api/doctors');
      const data = await res.json();
      if (Array.isArray(data)) setDoctors(data);
    } catch {}
  };

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services');
      const data = await res.json();
      if (Array.isArray(data)) setServices(data);
    } catch {}
  };`;
content = content.replace(fetchDoctors, fetchBoth);

// 3. Add to isLoggedIn effect
content = content.replace(
  "      fetchDoctors();",
  "      fetchDoctors();\n      fetchServices();"
);

// 4. Add the save services function
const handlers = `  const handleDeleteMessage = async (id: string) => {`;
const saveServicesHandler = `  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.trim()) return;
    const updated = [...services, newService.trim()];
    try {
      await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ services: updated })
      });
      fetchServices();
      setNewService('');
    } catch (err) {
      alert('Failed to add service');
    }
  };

  const handleRemoveService = async (service: string) => {
    if (!confirm('Remove this service?')) return;
    const updated = services.filter(s => s !== service);
    try {
      await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ services: updated })
      });
      fetchServices();
    } catch (err) {
      alert('Failed to remove service');
    }
  };

  const handleDeleteMessage = async (id: string) => {`;
content = content.replace(handlers, saveServicesHandler);

// 5. Add Tab Button
const emailsTab = `          <button
            onClick={() => setActiveTab('emails')}
            className={\`px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 \${
              activeTab === 'emails' ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }\`}
          >
            <Mail className="w-4 h-4" /> Email Automations
          </button>`;

const servicesTabBtn = `          <button
            onClick={() => setActiveTab('emails')}
            className={\`px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 \${
              activeTab === 'emails' ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }\`}
          >
            <Mail className="w-4 h-4" /> Email Automations
          </button>
          
          <button
            onClick={() => setActiveTab('services')}
            className={\`px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 \${
              activeTab === 'services' ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }\`}
          >
            <TrendingUp className="w-4 h-4" /> Services
          </button>`;
content = content.replace(emailsTab, servicesTabBtn);

// 6. Add Services Tab Content right before "if (activeTab === 'doctors')" or similar. Let's find end of emails or analytics.
const doctorsTab = `      {/* TAB 8: DOCTORS */}`;
const servicesTabContent = `      {/* TAB: SERVICES */}
      {activeTab === 'services' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/60 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-50 to-transparent rounded-bl-full pointer-events-none opacity-50"></div>
            
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Manage Services</h2>
                <p className="text-sm text-slate-500">These services appear in the booking form.</p>
              </div>
            </div>

            <form onSubmit={handleAddService} className="flex gap-4 mb-8">
              <input 
                type="text" 
                value={newService} 
                onChange={(e) => setNewService(e.target.value)} 
                placeholder="Add new service (e.g. Braces)"
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
              />
              <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-md hover:bg-blue-700 transition-colors">Add</button>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((svc, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50 hover:border-blue-300 transition-colors">
                  <span className="text-sm font-semibold text-slate-800">{svc}</span>
                  {svc !== 'General Appointment' && (
                    <button onClick={() => handleRemoveService(svc)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: DOCTORS */}`;
content = content.replace(doctorsTab, servicesTabContent);

fs.writeFileSync('src/views/AdminView.tsx', content, 'utf-8');
console.log('AdminView.tsx updated with Services tab');
