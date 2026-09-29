const fs = require('fs');

let content = fs.readFileSync('src/views/AdminView.tsx', 'utf-8');

const startStr = '  if (!isLoggedIn) {';
const endRegex = /  \}\s*return \(\s*<div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">/;

const startIdx = content.indexOf(startStr);
const match = content.match(endRegex);

if (startIdx !== -1 && match) {
  const endIdx = match.index + 4; // up to `  }\n`

  const newBlock = `  if (!isLoggedIn) {
    if (showForgotPassword) {
      if (showResetForm) {
        return (
          <div className="min-h-screen flex items-center justify-center pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-cover bg-center bg-no-repeat bg-fixed" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1509803874385-db7c23652552?q=80&w=2564&auto=format&fit=crop')" }}>
            <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>

            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-w-[440px]"
            >
              <div className="bg-white/85 backdrop-blur-2xl p-10 sm:p-12 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white/60">
                <div className="text-center mb-10">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-200/50">
                    <Lock className="w-7 h-7 text-slate-800" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">Create new password</h2>
                  <p className="text-slate-500 text-sm">Enter the 6-digit code sent to your email.</p>
                </div>

                <AnimatePresence mode="wait">
                  {resetSuccess && (
                    <motion.div key="success" initial={{ opacity: 0, height: 0, scale: 0.9 }} animate={{ opacity: 1, height: 'auto', scale: 1 }} exit={{ opacity: 0, height: 0, scale: 0.9 }} className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-semibold text-emerald-800">Password Reset Successful</h4>
                        <p className="text-xs text-emerald-600 mt-1">{resetSuccess}</p>
                      </div>
                    </motion.div>
                  )}
                  {resetError && (
                    <motion.div key="error" initial={{ opacity: 0, height: 0, scale: 0.9 }} animate={{ opacity: 1, height: 'auto', scale: 1 }} exit={{ opacity: 0, height: 0, scale: 0.9 }} className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm font-medium text-red-800">{resetError}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!resetSuccess && (
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    if (resetNewPassword !== resetConfirmPassword) { setResetError('Passwords do not match'); return; }
                    setResetError(''); setResetSubmitting(true);
                    try {
                      const res = await fetch('/api/admin/reset-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: resetCode, newPassword: resetNewPassword }) });
                      const data = await res.json();
                      if (data.success) {
                        setResetSuccess('Your password has been successfully reset. Redirecting to login...');
                        setTimeout(() => { setShowForgotPassword(false); setShowResetForm(false); setForgotMsg(''); setResetCode(''); setResetNewPassword(''); setResetConfirmPassword(''); }, 2000);
                      } else { setResetError(data.error || 'Failed to reset password.'); }
                    } catch { setResetError('Network error.'); } finally { setResetSubmitting(false); }
                  }} className="space-y-4">
                    
                    <div>
                      <input type="text" required maxLength={6} value={resetCode} onChange={(e) => setResetCode(e.target.value.replace(/\\D/g, ''))} placeholder="6-digit code" className="w-full px-5 py-4 bg-slate-100/80 border border-transparent rounded-2xl text-center tracking-[0.5em] font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-300 focus:ring-4 focus:ring-slate-100 transition-all" />
                    </div>
                    
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-600 transition-colors"><Lock className="h-5 w-5" /></div>
                      <input type="password" required minLength={6} value={resetNewPassword} onChange={(e) => setResetNewPassword(e.target.value)} placeholder="New password" className="w-full pl-11 pr-5 py-4 bg-slate-100/80 border border-transparent rounded-2xl text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:bg-white focus:border-slate-300 focus:ring-4 focus:ring-slate-100 transition-all" />
                    </div>

                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-600 transition-colors"><Lock className="h-5 w-5" /></div>
                      <input type="password" required minLength={6} value={resetConfirmPassword} onChange={(e) => setResetConfirmPassword(e.target.value)} placeholder="Confirm password" className="w-full pl-11 pr-5 py-4 bg-slate-100/80 border border-transparent rounded-2xl text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:bg-white focus:border-slate-300 focus:ring-4 focus:ring-slate-100 transition-all" />
                    </div>

                    <div className="pt-2">
                      <button type="submit" disabled={resetSubmitting} className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-semibold text-sm shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2 disabled:opacity-70 transition-all transform active:scale-[0.98]">
                        {resetSubmitting ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : 'Reset Password'}
                      </button>
                    </div>
                    <div className="text-center pt-2">
                      <button type="button" onClick={() => { setShowResetForm(false); setResetError(''); }} className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors">Go Back</button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        );
      }

      return (
        <div className="min-h-screen flex items-center justify-center pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-cover bg-center bg-no-repeat bg-fixed" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1509803874385-db7c23652552?q=80&w=2564&auto=format&fit=crop')" }}>
          <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>

          <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="relative z-10 w-full max-w-[440px]">
            <div className="bg-white/85 backdrop-blur-2xl p-10 sm:p-12 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white/60">
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-200/50">
                  <Lock className="w-7 h-7 text-slate-800" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">Recover access</h2>
                <p className="text-slate-500 text-sm">Enter your registered email address</p>
              </div>

              <AnimatePresence mode="wait">
                {forgotMsg && (
                  <motion.div key="forgotMsg" initial={{ opacity: 0, height: 0, scale: 0.9 }} animate={{ opacity: 1, height: 'auto', scale: 1 }} exit={{ opacity: 0, height: 0, scale: 0.9 }} className={\`mb-6 p-4 rounded-2xl flex items-start gap-3 \${forgotMsg.includes('sent') ? 'bg-emerald-50 border border-emerald-100' : 'bg-red-50 border border-red-100'}\`}>
                    {forgotMsg.includes('sent') ? <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-500" /> : <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" />}
                    <p className={\`text-sm font-medium \${forgotMsg.includes('sent') ? 'text-emerald-800' : 'text-red-800'}\`}>{forgotMsg}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={async (e) => {
                e.preventDefault();
                setForgotMsg(''); setForgotLoading(true);
                try {
                  const res = await fetch('/api/admin/forgot-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: forgotEmail }) });
                  const data = await res.json();
                  if (data.success) { setForgotMsg('We have sent a 6-digit code to your email.'); setShowResetForm(true); } 
                  else { setForgotMsg(data.error || 'Failed to send reset code.'); }
                } catch { setForgotMsg('Network error occurred.'); } finally { setForgotLoading(false); }
              }} className="space-y-4">
                
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-600 transition-colors"><Mail className="h-5 w-5" /></div>
                  <input type="email" required value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} placeholder="Email" className="w-full pl-11 pr-5 py-4 bg-slate-100/80 border border-transparent rounded-2xl text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:bg-white focus:border-slate-300 focus:ring-4 focus:ring-slate-100 transition-all" />
                </div>
                
                <div className="pt-2">
                  <button type="submit" disabled={forgotLoading} className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-semibold text-sm shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2 disabled:opacity-70 transition-all transform active:scale-[0.98]">
                    {forgotLoading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : 'Send Reset Code'}
                  </button>
                </div>
                <div className="text-center pt-2">
                  <button type="button" onClick={() => { setShowForgotPassword(false); setForgotMsg(''); }} className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors">Return to Login</button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex items-center justify-center pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-cover bg-center bg-no-repeat bg-fixed" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1509803874385-db7c23652552?q=80&w=2564&auto=format&fit=crop')" }}>
        <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>

        <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="relative z-10 w-full max-w-[440px]">
          <div className="bg-white/85 backdrop-blur-2xl p-10 sm:p-12 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white/60">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-200/50">
                <ShieldAlert className="w-7 h-7 text-slate-800" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">Sign in with email</h1>
              <p className="text-slate-500 text-sm">First Avenue Family Dentistry<br/>Secure Admin Portal</p>
            </div>

            <AnimatePresence mode="wait">
              {loginError && (
                <motion.div key="loginError" initial={{ opacity: 0, height: 0, scale: 0.9 }} animate={{ opacity: 1, height: 'auto', scale: 1 }} exit={{ opacity: 0, height: 0, scale: 0.9 }} className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm font-medium text-red-800">{loginError}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-600 transition-colors">
                  <UserCheck className="h-5 w-5" />
                </div>
                <input type="text" required value={adminLogin} onChange={(e) => setAdminLogin(e.target.value)} placeholder="Email" className="w-full pl-11 pr-5 py-4 bg-slate-100/80 border border-transparent rounded-2xl text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:bg-white focus:border-slate-300 focus:ring-4 focus:ring-slate-100 transition-all" />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-600 transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <input type="password" required value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} placeholder="Password" className="w-full pl-11 pr-5 py-4 bg-slate-100/80 border border-transparent rounded-2xl text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:bg-white focus:border-slate-300 focus:ring-4 focus:ring-slate-100 transition-all" />
              </div>

              <div className="flex justify-end pt-1 pb-4">
                <button type="button" onClick={() => { setShowForgotPassword(true); setLoginError(''); }} className="text-sm font-semibold text-slate-900 hover:text-slate-600 transition-colors">Forgot password?</button>
              </div>

              <button type="submit" className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-semibold text-sm shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]">
                Get Started
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }\n`;

  const newContent = content.substring(0, startIdx) + newBlock + content.substring(endIdx);
  fs.writeFileSync('src/views/AdminView.tsx', newContent, 'utf-8');
  console.log('Successfully replaced login block with reference UI style.');
} else {
  console.error('Could not find start or end block');
}
