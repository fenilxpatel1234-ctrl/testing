const fs = require('fs');
let content = fs.readFileSync('src/views/AdminView.tsx', 'utf-8');

const target = `  const fetchDoctors = async () => {
    try {
      const res = await fetch('/api/doctors');
      const data = await res.json();
      if (Array.isArray(data)) setDoctors(data);
    } catch {}
  };`;

const newTarget = `  const fetchDoctors = async () => {
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

content = content.replace(target, newTarget);
fs.writeFileSync('src/views/AdminView.tsx', content, 'utf-8');
console.log('fetchServices injected into AdminView.tsx');
