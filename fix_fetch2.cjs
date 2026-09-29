const fs = require('fs');
let content = fs.readFileSync('src/views/AdminView.tsx', 'utf-8');

const regex = /const fetchDoctors = async \(\) => \{\s*try \{\s*const res = await fetch\('\/api\/doctors'\);\s*const data = await res\.json\(\);\s*if \(Array\.isArray\(data\)\) setDoctors\(data\);\s*\} catch \{\}\s*\};/g;

content = content.replace(regex, `const fetchDoctors = async () => {
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
  };`);

fs.writeFileSync('src/views/AdminView.tsx', content, 'utf-8');
