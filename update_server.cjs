const fs = require('fs');

let content = fs.readFileSync('server.ts', 'utf-8');

// 1. Add servicesDatabase
const seedServices = [
  "General Appointment",
  "Crowns & Bridges",
  "Wisdom Teeth Extraction",
  "Oral Surgery",
  "Teeth Cleaning",
  "Root Canals",
  "Orthodontics",
  "Sedation Sleep Dentistry",
  "Children's Dentistry",
  "Veneers",
  "Teeth Whitening",
  "Implant",
  "Oral Cancer Screening"
];

// Find where databases are defined
content = content.replace(
  "let reviewDatabase: Review[] = [];",
  "let reviewDatabase: Review[] = [];\nlet servicesDatabase: string[] = [];"
);

content = content.replace(
  "const REVIEWS_FILE = path.join(DATA_DIR, 'reviews.json');",
  "const REVIEWS_FILE = path.join(DATA_DIR, 'reviews.json');\nconst SERVICES_FILE = path.join(DATA_DIR, 'services.json');"
);

content = content.replace(
  "function persistReviews() { saveJSON(REVIEWS_FILE, reviewDatabase); fbSet('reviews', reviewDatabase); }",
  "function persistReviews() { saveJSON(REVIEWS_FILE, reviewDatabase); fbSet('reviews', reviewDatabase); }\nfunction persistServices() { saveJSON(SERVICES_FILE, servicesDatabase); fbSet('services', servicesDatabase); }"
);

// Add API endpoints for services
const apiServicesBlock = `
app.get('/api/services', (req: Request, res: Response) => {
  res.json(servicesDatabase);
});

app.post('/api/services', requireAdmin, (req: Request, res: Response) => {
  const { services } = req.body;
  if (!Array.isArray(services)) return res.status(400).json({ error: 'Invalid services array' });
  servicesDatabase = services;
  persistServices();
  res.json({ success: true });
});
`;

content = content.replace(
  "app.get('/api/doctors', (req: Request, res: Response) => {",
  apiServicesBlock + "\napp.get('/api/doctors', (req: Request, res: Response) => {"
);

// Load from JSON at startup
content = content.replace(
  "reviewDatabase = loadJSON<Review>(REVIEWS_FILE, fbReviews || []);",
  "reviewDatabase = loadJSON<Review>(REVIEWS_FILE, fbReviews || []);\n  servicesDatabase = loadJSON<string>(SERVICES_FILE, [], undefined);\n  if (servicesDatabase.length === 0) {\n    servicesDatabase = " + JSON.stringify(seedServices) + ";\n    persistServices();\n  }"
);

// We need to also add fbServices for firebase hydration if it's there
content = content.replace(
  "const fbReviews = await fbGet<Review[]>('reviews');",
  "const fbServices = await fbGet<string[]>('services');\n  if (Array.isArray(fbServices) && fbServices.length > 0) {\n    servicesDatabase = fbServices;\n    saveJSON(SERVICES_FILE, servicesDatabase);\n  } else {\n    await fbSet('services', servicesDatabase);\n  }\n\n  const fbReviews = await fbGet<Review[]>('reviews');"
);

fs.writeFileSync('server.ts', content, 'utf-8');
console.log('server.ts updated with services database');
