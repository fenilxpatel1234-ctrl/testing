const fs = require('fs');
const path = require('path');

const dir = 'src/views';
fs.readdirSync(dir).forEach(file => {
  if (file.endsWith('.tsx')) {
    let txt = fs.readFileSync(path.join(dir, file), 'utf8');
    const rx = /<div className="inline-flex items-center gap-2[^>]*?>\s*<Sparkles[^>]*?>[^<]*?<\/div>/gi;
    if (rx.test(txt)) {
      txt = txt.replace(rx, '');
      fs.writeFileSync(path.join(dir, file), txt);
      console.log('Fixed ' + file);
    }
  }
});
