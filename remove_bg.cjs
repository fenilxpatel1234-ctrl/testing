const fs = require('fs');

function removeBackground(file) {
  let content = fs.readFileSync(file, 'utf-8');
  
  // Replace the container div
  content = content.replace(
    /className="min-h-screen flex items-start justify-center pt-32 sm:pt-40 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-auto bg-cover bg-center bg-no-repeat bg-fixed" style=\{\{ backgroundImage: "url\('https:\/\/images\.unsplash\.com\/photo-[^']+'\)" \}\}/g,
    'className="min-h-screen flex items-start justify-center pt-32 sm:pt-40 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-auto bg-slate-50"'
  );

  // Remove the overlay div
  content = content.replace(
    /(\s*){\/\* Light overlay to ensure form is readable \*\/}\s*<div className="absolute inset-0 bg-white\/20 backdrop-blur-sm"><\/div>/g,
    ''
  );
  content = content.replace(
    /(\s*)<div className="absolute inset-0 bg-white\/20 backdrop-blur-sm"><\/div>/g,
    ''
  );

  // Optionally, change bg-white/85 to bg-white to make it less translucent if background is solid
  content = content.replace(
    /className="bg-white\/85 backdrop-blur-2xl/g,
    'className="bg-white'
  );

  fs.writeFileSync(file, content, 'utf-8');
  console.log('Updated ' + file);
}

removeBackground('src/views/AdminView.tsx');
removeBackground('src/views/ResetPasswordView.tsx');
