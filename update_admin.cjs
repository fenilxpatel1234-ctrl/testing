const fs = require('fs');

let content = fs.readFileSync('src/views/AdminView.tsx', 'utf-8');

// 1. Add authLoading state
content = content.replace(
  "const [isLoggedIn, setIsLoggedIn] = useState(false);",
  "const [isLoggedIn, setIsLoggedIn] = useState(false);\n  const [authLoading, setAuthLoading] = useState(false);"
);

// 2. Modify handleLogin
const oldHandleLogin = `  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminLogin === 'admin' && adminPassword === 'password') {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Invalid credentials. Please try again.');
    }
  };`;

const newHandleLogin = `  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminLogin === 'admin' && adminPassword === 'password') {
      setLoginError('');
      setAuthLoading(true);
      setTimeout(() => {
        setAuthLoading(false);
        setIsLoggedIn(true);
      }, 1500); // Wait 1.5 seconds to show professional loading screen
    } else {
      setLoginError('Invalid credentials. Please try again.');
    }
  };`;

content = content.replace(oldHandleLogin, newHandleLogin);

// 3. Render authLoading screen
// If authLoading is true, render a beautiful loading spinner screen.
// We can inject it right before `if (!isLoggedIn) {`
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

content = content.replace('  if (!isLoggedIn) {', loadingBlock);

fs.writeFileSync('src/views/AdminView.tsx', content, 'utf-8');
console.log('AdminView.tsx updated successfully with loading screen');
