const fs = require('fs');

let content = fs.readFileSync('src/views/AdminView.tsx', 'utf-8');

const startStr = '  if (!isLoggedIn) {';
const endRegex = /  \}\s*return \(\s*<div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">/;

const startIdx = content.indexOf(startStr);
const match = content.match(endRegex);

if (startIdx !== -1 && match) {
  const endIdx = match.index + 4; // offset for `  }\n` before `return (`

  const newBlock = `  if (!isLoggedIn) {
    if (showForgotPassword) {
      if (showResetForm) {
        return (
          <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute inset-0 z-0">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
              <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
              <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-cyan-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>
            
            <div className="relative z-10 w-full max-w-md">
              <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/40">
                <div className="text-center mb-10">
                  <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                    <Lock className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Create New Password</h2>
                  <p className="text-slate-500 font-medium">Please enter the 6-digit code sent to your email and your new password.</p>
                </div>

                {resetSuccess && (
                  <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-emerald-800">Password Reset Successful</h4>
                      <p className="text-xs text-emerald-600 mt-1">{resetSuccess}</p>
                    </div>
                  </div>
                )}
                {resetError && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm font-medium text-red-800">{resetError}</p>
                  </div>
                )}

                {!resetSuccess && (
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    if (resetNewPassword !== resetConfirmPassword) {
                      setResetError('Passwords do not match');
                      return;
                    }
                    setResetError('');
                    setResetSubmitting(true);
                    try {
                      const res = await fetch('/api/admin/reset-password', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ code: resetCode, newPassword: resetNewPassword })
                      });
                      const data = await res.json();
                      if (data.success) {
                        setResetSuccess('Your password has been successfully reset. Redirecting to login...');
                        setTimeout(() => {
                          setShowForgotPassword(false);
                          setShowResetForm(false);
                          setForgotMsg('');
                          setResetCode('');
                          setResetNewPassword('');
                          setResetConfirmPassword('');
                        }, 2000);
                      } else {
                        setResetError(data.error || 'Failed to reset password.');
                      }
                    } catch {
                      setResetError('Network error.');
                    } finally { setResetSubmitting(false); }
                  }} className="space-y-5">
                    
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">6-Digit Code</label>
                      <input type="text" required maxLength={6} value={resetCode} onChange={(e) => setResetCode(e.target.value.replace(/\\D/g, ''))} placeholder="000000" className="w-full px-5 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-lg text-center tracking-[0.5em] font-bold text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white transition-all duration-200" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">New Password</label>
                      <input type="password" required minLength={6} value={resetNewPassword} onChange={(e) => setResetNewPassword(e.target.value)} placeholder="Minimum 6 characters" className="w-full px-5 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white transition-all duration-200" />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm Password</label>
                      <input type="password" required minLength={6} value={resetConfirmPassword} onChange={(e) => setResetConfirmPassword(e.target.value)} placeholder="Repeat new password" className="w-full px-5 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white transition-all duration-200" />
                    </div>

                    <button type="submit" disabled={resetSubmitting} className="w-full py-4 mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-500/30 transform transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                      {resetSubmitting ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Resetting...</> : 'Reset Password'}
                    </button>
                    <button type="button" onClick={() => { setShowResetForm(false); setResetError(''); }} className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-sm transition-colors">Go Back</button>
                  </form>
                )}
              </div>
            </div>
          </div>
        );
      }

      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-cyan-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
          </div>

          <div className="relative z-10 w-full max-w-md">
            <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/40">
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Recover Access</h2>
                <p className="text-slate-500 font-medium">Enter your registered email address to receive a secure password reset code.</p>
              </div>

              {forgotMsg && (
                <div className={\`mb-6 p-4 rounded-2xl flex items-start gap-3 \${forgotMsg.includes('sent') ? 'bg-emerald-50 border border-emerald-100 text-emerald-800' : 'bg-red-50 border border-red-100 text-red-800'}\`}>
                  {forgotMsg.includes('sent') ? <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-500" /> : <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" />}
                  <p className="text-sm font-medium">{forgotMsg}</p>
                </div>
              )}

              <form onSubmit={async (e) => {
                e.preventDefault();
                setForgotMsg('');
                setForgotLoading(true);
                try {
                  const res = await fetch('/api/admin/forgot-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: forgotEmail })
                  });
                  const data = await res.json();
                  if (data.success) {
                    setForgotMsg('We have sent a 6-digit code to your email.');
                    setShowResetForm(true);
                  } else {
                    setForgotMsg(data.error || 'Failed to send reset code.');
                  }
                } catch {
                  setForgotMsg('Network error occurred.');
                } finally { setForgotLoading(false); }
              }} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <input type="email" required value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} placeholder="admin@firstavenuedentistry.com" className="w-full pl-12 pr-5 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white transition-all duration-200" />
                  </div>
                </div>
                
                <button type="submit" disabled={forgotLoading} className="w-full py-4 mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-500/30 transform transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {forgotLoading ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Sending...</> : 'Send Reset Code'}
                </button>
                <button type="button" onClick={() => { setShowForgotPassword(false); setForgotMsg(''); }} className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-sm transition-colors">Return to Login</button>
              </form>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] left-[15%] w-[40rem] h-[40rem] bg-blue-300/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-70"></div>
          <div className="absolute top-[20%] right-[10%] w-[35rem] h-[35rem] bg-indigo-300/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-70"></div>
          <div className="absolute bottom-[-10%] left-[30%] w-[45rem] h-[45rem] bg-cyan-300/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-70"></div>
        </div>

        <div className="relative z-10 w-full max-w-lg">
          <div className="bg-white/80 backdrop-blur-2xl p-10 sm:p-12 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white">
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/30 transform -rotate-3 hover:rotate-3 transition-transform duration-500 ease-out">
                <ShieldAlert className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">Admin Portal</h1>
              <p className="text-slate-500 font-medium text-lg">First Avenue Family Dentistry</p>
            </div>

            {loginError && (
              <div className="mb-8 p-4 bg-red-50/80 backdrop-blur-sm border border-red-100 rounded-2xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-red-800">{loginError}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Username or Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-500 text-slate-400">
                    <UserCheck className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    required
                    value={adminLogin}
                    onChange={(e) => setAdminLogin(e.target.value)}
                    placeholder="Enter your credentials"
                    className="w-full pl-12 pr-5 py-4 bg-slate-50/50 border-2 border-slate-100 rounded-2xl text-base text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all duration-300"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2 ml-1">
                  <label className="block text-sm font-bold text-slate-700">Password</label>
                  <button type="button" onClick={() => { setShowForgotPassword(true); setLoginError(''); }} className="text-sm text-blue-600 hover:text-indigo-600 font-bold transition-colors">Forgot?</button>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-500 text-slate-400">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    type="password"
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-5 py-4 bg-slate-50/50 border-2 border-slate-100 rounded-2xl text-base text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all duration-300"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold text-lg shadow-[0_10px_20px_rgb(59,130,246,0.3)] hover:shadow-[0_15px_30px_rgb(59,130,246,0.4)] transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Sign In Securely
                <ChevronRight className="w-5 h-5" />
              </button>
            </form>
          </div>
          
          <div className="mt-8 text-center text-slate-500 text-sm font-medium">
            Secure connection established. Unauthorized access is prohibited.
          </div>
        </div>
      </div>
    );
  }\n`;

  const newContent = content.substring(0, startIdx) + newBlock + content.substring(endIdx);
  fs.writeFileSync('src/views/AdminView.tsx', newContent, 'utf-8');
  console.log('Successfully replaced login block');
} else {
  console.error('Could not find start or end block');
  console.log('startIdx', startIdx);
  console.log('match', match);
}
