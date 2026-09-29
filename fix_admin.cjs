const fs = require('fs');

let content = fs.readFileSync('src/views/AdminView.tsx', 'utf-8');

// Replace handleLogin block
content = content.replace(
  /if \(data\.success\) \{\s*setIsLoggedIn\(true\);\s*setLoggedInUser\(data\.user \|\| null\);\s*\} else \{/g,
  `if (data.success) {
        setAuthLoading(true);
        setTimeout(() => {
          setAuthLoading(false);
          setIsLoggedIn(true);
          setLoggedInUser(data.user || null);
        }, 1500);
      } else {`
);

// Inject authLoading view block
const loadingBlock = `
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="bg-white p-10 rounded-3xl shadow-xl flex flex-col items-center max-w-sm w-full text-center space-y-6"
        >
          <div className="relative w-20 h-20">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="absolute inset-0 rounded-full border-[3px] border-slate-100 border-t-blue-600"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <ShieldAlert className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-900">Authenticating</h3>
            <p className="text-slate-500 text-sm font-medium">Establishing secure connection...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!isLoggedIn) {`;

content = content.replace(/  if \(!isLoggedIn\) \{/g, loadingBlock);

fs.writeFileSync('src/views/AdminView.tsx', content, 'utf-8');
console.log('Fixed handleLogin to correctly show loading screen!');
