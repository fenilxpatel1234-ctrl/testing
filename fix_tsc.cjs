const fs = require('fs');

let serverContent = fs.readFileSync('server.ts', 'utf-8');

// Fix 1: Add servicesDatabase if not added
if (!serverContent.includes('let servicesDatabase')) {
  serverContent = serverContent.replace(
    "let reviewDatabase: SiteReview[] = loadJSON(REVIEWS_FILE, [], path.join(SEEDS_DIR, 'reviews.json'));",
    "let reviewDatabase: SiteReview[] = loadJSON(REVIEWS_FILE, [], path.join(SEEDS_DIR, 'reviews.json'));\nlet servicesDatabase: string[] = [];"
  );
}

// Ensure SERVICES_FILE is defined
if (!serverContent.includes('const SERVICES_FILE = ')) {
  serverContent = serverContent.replace(
    "const REVIEWS_FILE = path.join(DATA_DIR, 'reviews.json');",
    "const REVIEWS_FILE = path.join(DATA_DIR, 'reviews.json');\nconst SERVICES_FILE = path.join(DATA_DIR, 'services.json');"
  );
}

// Add API endpoints
if (!serverContent.includes('app.get(\'/api/services\'')) {
  const apiServicesBlock = `
app.get('/api/services', (req: Request, res: Response) => {
  res.json(servicesDatabase);
});

app.post('/api/services', requireAdmin, (req: Request, res: Response) => {
  const { services } = req.body;
  if (!Array.isArray(services)) return res.status(400).json({ error: 'Invalid services array' });
  servicesDatabase = services;
  saveJSON(SERVICES_FILE, servicesDatabase);
  if (fbSet) fbSet('services', servicesDatabase);
  res.json({ success: true });
});
`;
  serverContent = serverContent.replace(
    "app.get('/api/doctors', (req: Request, res: Response) => {",
    apiServicesBlock + "\napp.get('/api/doctors', (req: Request, res: Response) => {"
  );
}

// Fix Firebase hydrate
serverContent = serverContent.replace(
  "servicesDatabase = fbServices;",
  "// servicesDatabase = fbServices; handled manually"
);

const seedServices = [
  "General Appointment", "Crowns & Bridges", "Wisdom Teeth Extraction", "Oral Surgery",
  "Teeth Cleaning", "Root Canals", "Orthodontics", "Sedation Sleep Dentistry",
  "Children's Dentistry", "Veneers", "Teeth Whitening", "Implant", "Oral Cancer Screening"
];

// Inside hydrateFromFirebase
if (!serverContent.includes('servicesDatabase = loadJSON<string>(SERVICES_FILE, [], undefined);')) {
  const replacement = `
  const fbServices = await fbGet<string[]>('services');
  servicesDatabase = loadJSON<string>(SERVICES_FILE, [], undefined);
  if (Array.isArray(fbServices) && fbServices.length > 0) {
    servicesDatabase = fbServices;
    saveJSON(SERVICES_FILE, servicesDatabase);
  } else if (servicesDatabase.length === 0) {
    servicesDatabase = ${JSON.stringify(seedServices)};
    saveJSON(SERVICES_FILE, servicesDatabase);
    await fbSet('services', servicesDatabase);
  }
`;
  serverContent = serverContent.replace(
    "const fbReviews = await fbGet<SiteReview[]>('reviews');",
    replacement + "\n  const fbReviews = await fbGet<SiteReview[]>('reviews');"
  );
}

// Also fix the previous failed injections which caused typescript errors:
serverContent = serverContent.replace(/servicesDatabase = loadJSON<string>\(SERVICES_FILE, \[\], undefined\);\s*if \(servicesDatabase\.length === 0\) \{\s*servicesDatabase = \[.*?\];\s*persistServices\(\);\s*\}/s, '');

serverContent = serverContent.replace(/const fbServices = await fbGet<string\[\]>\('services'\);\s*if \(Array\.isArray\(fbServices\) && fbServices\.length > 0\) \{\s*servicesDatabase = fbServices;\s*saveJSON\(SERVICES_FILE, servicesDatabase\);\s*\} else \{\s*await fbSet\('services', servicesDatabase\);\s*\}/s, '');

fs.writeFileSync('server.ts', serverContent, 'utf-8');

// Fix AdminView.tsx
let adminContent = fs.readFileSync('src/views/AdminView.tsx', 'utf-8');
if (adminContent.includes('const fetchServices = async () => {') && !adminContent.includes('useEffect(() => {\n    if (isLoggedIn) {')) {
  // It's out of scope or inside something else?
  // Let's just rebuild the useEffect for isLoggedIn
  const effMatch = adminContent.match(/useEffect\(\(\) => \{\s*if \(isLoggedIn\) \{\s*fetchAppointments\(\);\s*fetchMessages\(\);\s*fetchAdmins\(\);\s*fetchDoctors\(\);\s*fetchReviews\(\);\s*\}/);
  if (effMatch) {
    adminContent = adminContent.replace(
      "fetchDoctors();\n      fetchReviews();",
      "fetchDoctors();\n      fetchReviews();\n      fetchServices();"
    );
  }
}
fs.writeFileSync('src/views/AdminView.tsx', adminContent, 'utf-8');

console.log('Fixed typescript errors in server.ts and AdminView.tsx');
