const fs = require('fs');

let content = fs.readFileSync('src/views/AdminView.tsx', 'utf-8');

// Ensure motion is imported
if (!content.includes("import { motion, AnimatePresence } from 'motion/react';")) {
  content = content.replace(
    "import React, { useState, useEffect } from 'react';",
    "import React, { useState, useEffect } from 'react';\nimport { motion, AnimatePresence } from 'motion/react';"
  );
}

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
          <div className="min-h-screen bg-slate-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3], rotate: [0, 90, 0] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute top-[-10%] left-[-10%] w-[50rem] h-[50rem] bg-indigo-500/20 rounded-full mix-blend-screen filter blur-[100px]" 
              />
              <motion.div 
                animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2], x: [0, 100, 0] }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[20%] right-[-20%] w-[40rem] h-[40rem] bg-fuchsia-500/20 rounded-full mix-blend-screen filter blur-[100px]" 
              />
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.1 } }}
              className="relative z-10 w-full max-w-md"
            >
              <div className="bg-slate-900/60 backdrop-blur-3xl p-10 rounded-[2.5rem] shadow-[0_8px_40px_rgb(0,0,0,0.5)] border border-slate-700/50">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
                  <motion.div 
                    whileHover={{ rotate: 180, scale: 1.1 }}
                    transition={{ duration: 0.6, type: "spring" }}
                    className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/30"
                  >
                    <Lock className="w-8 h-8 text-white" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Create New Password</h2>
                  <p className="text-slate-400 font-medium">Please enter the 6-digit code sent to your email.</p>
                </motion.div>

                <AnimatePresence mode="wait">
                  {resetSuccess && (
                    <motion.div 
                      key="success"
                      initial={{ opacity: 0, height: 0, scale: 0.9 }} animate={{ opacity: 1, height: 'auto', scale: 1 }} exit={{ opacity: 0, height: 0, scale: 0.9 }}
                      className="mb-6 p-4 bg-emerald-900/40 border border-emerald-500/50 rounded-2xl flex items-start gap-3"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-semibold text-emerald-200">Password Reset Successful</h4>
                        <p className="text-xs text-emerald-400 mt-1">{resetSuccess}</p>
                      </div>
                    </motion.div>
                  )}
                  {resetError && (
                    <motion.div 
                      key="error"
                      initial={{ opacity: 0, height: 0, scale: 0.9 }} animate={{ opacity: 1, height: 'auto', scale: 1 }} exit={{ opacity: 0, height: 0, scale: 0.9 }}
                      className="mb-6 p-4 bg-red-900/40 border border-red-500/50 rounded-2xl flex items-start gap-3"
                    >
                      <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm font-medium text-red-200">{resetError}</p>
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
                  }} className="space-y-5">
                    
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">6-Digit Code</label>
                      <motion.input whileFocus={{ scale: 1.02 }} type="text" required maxLength={6} value={resetCode} onChange={(e) => setResetCode(e.target.value.replace(/\\D/g, ''))} placeholder="000000" className="w-full px-5 py-4 bg-slate-800/50 border border-slate-600 rounded-2xl text-lg text-center tracking-[0.5em] font-bold text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all shadow-inner" />
                    </motion.div>
                    
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">New Password</label>
                      <motion.input whileFocus={{ scale: 1.02 }} type="password" required minLength={6} value={resetNewPassword} onChange={(e) => setResetNewPassword(e.target.value)} placeholder="Minimum 6 characters" className="w-full px-5 py-4 bg-slate-800/50 border border-slate-600 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all shadow-inner" />
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">Confirm Password</label>
                      <motion.input whileFocus={{ scale: 1.02 }} type="password" required minLength={6} value={resetConfirmPassword} onChange={(e) => setResetConfirmPassword(e.target.value)} placeholder="Repeat new password" className="w-full px-5 py-4 bg-slate-800/50 border border-slate-600 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all shadow-inner" />
                    </motion.div>

                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={resetSubmitting} className="w-full py-4 mt-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 disabled:opacity-70">
                      {resetSubmitting ? <><motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></motion.span> Resetting...</> : 'Reset Password'}
                    </motion.button>
                    <motion.button whileHover={{ backgroundColor: 'rgba(51, 65, 85, 0.8)' }} whileTap={{ scale: 0.98 }} type="button" onClick={() => { setShowResetForm(false); setResetError(''); }} className="w-full py-4 bg-slate-800 text-slate-300 border border-slate-700 rounded-2xl font-bold text-sm transition-colors">Go Back</motion.button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        );
      }

      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3], rotate: [0, 90, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute top-[-10%] left-[-10%] w-[50rem] h-[50rem] bg-indigo-500/20 rounded-full mix-blend-screen filter blur-[100px]" />
            <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2], x: [0, 100, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[20%] right-[-20%] w-[40rem] h-[40rem] bg-fuchsia-500/20 rounded-full mix-blend-screen filter blur-[100px]" />
          </div>

          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.1 } }} className="relative z-10 w-full max-w-md">
            <div className="bg-slate-900/60 backdrop-blur-3xl p-10 rounded-[2.5rem] shadow-[0_8px_40px_rgb(0,0,0,0.5)] border border-slate-700/50">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
                <motion.div whileHover={{ rotate: 180, scale: 1.1 }} transition={{ duration: 0.6, type: "spring" }} className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/30">
                  <Lock className="w-8 h-8 text-white" />
                </motion.div>
                <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Recover Access</h2>
                <p className="text-slate-400 font-medium">Enter your registered email address to receive a secure password reset code.</p>
              </motion.div>

              <AnimatePresence mode="wait">
                {forgotMsg && (
                  <motion.div 
                    key="forgotMsg"
                    initial={{ opacity: 0, height: 0, scale: 0.9 }} animate={{ opacity: 1, height: 'auto', scale: 1 }} exit={{ opacity: 0, height: 0, scale: 0.9 }}
                    className={\`mb-6 p-4 rounded-2xl flex items-start gap-3 \${forgotMsg.includes('sent') ? 'bg-emerald-900/40 border border-emerald-500/50' : 'bg-red-900/40 border border-red-500/50'}\`}
                  >
                    {forgotMsg.includes('sent') ? <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-400" /> : <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-400" />}
                    <p className={\`text-sm font-medium \${forgotMsg.includes('sent') ? 'text-emerald-200' : 'text-red-200'}\`}>{forgotMsg}</p>
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
              }} className="space-y-5">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-slate-500" /></div>
                    <motion.input whileFocus={{ scale: 1.02 }} type="email" required value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} placeholder="admin@firstavenuedentistry.com" className="w-full pl-12 pr-5 py-4 bg-slate-800/50 border border-slate-600 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all shadow-inner" />
                  </div>
                </motion.div>
                
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={forgotLoading} className="w-full py-4 mt-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 disabled:opacity-70">
                  {forgotLoading ? <><motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></motion.span> Sending...</> : 'Send Reset Code'}
                </motion.button>
                <motion.button whileHover={{ backgroundColor: 'rgba(51, 65, 85, 0.8)' }} whileTap={{ scale: 0.98 }} type="button" onClick={() => { setShowForgotPassword(false); setForgotMsg(''); }} className="w-full py-4 bg-slate-800 text-slate-300 border border-slate-700 rounded-2xl font-bold text-sm transition-colors">Return to Login</motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3], rotate: [0, 90, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute top-[-10%] left-[-10%] w-[50rem] h-[50rem] bg-indigo-500/20 rounded-full mix-blend-screen filter blur-[100px]" />
          <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2], x: [0, 100, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[20%] right-[-20%] w-[40rem] h-[40rem] bg-fuchsia-500/20 rounded-full mix-blend-screen filter blur-[100px]" />
          <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3], y: [0, -50, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-[-10%] left-[20%] w-[45rem] h-[45rem] bg-blue-500/20 rounded-full mix-blend-screen filter blur-[120px]" />
        </div>

        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.1 } }} className="relative z-10 w-full max-w-lg">
          <div className="bg-slate-900/60 backdrop-blur-3xl p-10 sm:p-12 rounded-[2.5rem] shadow-[0_8px_40px_rgb(0,0,0,0.5)] border border-slate-700/50">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
              <motion.div whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }} transition={{ duration: 0.5 }} className="w-20 h-20 bg-gradient-to-tr from-indigo-500 via-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/30">
                <ShieldAlert className="w-10 h-10 text-white" />
              </motion.div>
              <h1 className="text-4xl font-extrabold text-white tracking-tight mb-3">Admin Portal</h1>
              <p className="text-slate-400 font-medium text-lg">First Avenue Family Dentistry</p>
            </motion.div>

            <AnimatePresence mode="wait">
              {loginError && (
                <motion.div 
                  key="loginError"
                  initial={{ opacity: 0, height: 0, scale: 0.9 }} animate={{ opacity: 1, height: 'auto', scale: 1 }} exit={{ opacity: 0, height: 0, scale: 0.9 }}
                  className="mb-8 p-4 bg-red-900/40 border border-red-500/50 rounded-2xl flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm font-medium text-red-200">{loginError}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleLogin} className="space-y-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <label className="block text-sm font-bold text-slate-300 mb-2 ml-1">Username or Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-400 text-slate-500">
                    <UserCheck className="h-5 w-5" />
                  </div>
                  <motion.input whileFocus={{ scale: 1.02 }} type="text" required value={adminLogin} onChange={(e) => setAdminLogin(e.target.value)} placeholder="Enter your credentials" className="w-full pl-12 pr-5 py-4 bg-slate-800/50 border-2 border-slate-700 rounded-2xl text-base text-white placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/40 focus:border-indigo-400 transition-all shadow-inner" />
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <div className="flex items-center justify-between mb-2 ml-1">
                  <label className="block text-sm font-bold text-slate-300">Password</label>
                  <button type="button" onClick={() => { setShowForgotPassword(true); setLoginError(''); }} className="text-sm text-indigo-400 hover:text-indigo-300 font-bold transition-colors">Forgot?</button>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-400 text-slate-500">
                    <Lock className="h-5 w-5" />
                  </div>
                  <motion.input whileFocus={{ scale: 1.02 }} type="password" required value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} placeholder="••••••••" className="w-full pl-12 pr-5 py-4 bg-slate-800/50 border-2 border-slate-700 rounded-2xl text-base text-white placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/40 focus:border-indigo-400 transition-all shadow-inner" />
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <motion.button whileHover={{ scale: 1.02, boxShadow: "0px 10px 30px rgba(99, 102, 241, 0.5)" }} whileTap={{ scale: 0.98 }} type="submit" className="w-full py-4 mt-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 text-white rounded-2xl font-bold text-lg shadow-[0_10px_30px_rgb(99,102,241,0.3)] transition-all flex items-center justify-center gap-2">
                  Sign In Securely <ChevronRight className="w-5 h-5" />
                </motion.button>
              </motion.div>
            </form>
          </div>
          
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-8 text-center text-slate-500 text-sm font-medium">
            Secure connection established. Unauthorized access is prohibited.
          </motion.div>
        </motion.div>
      </div>
    );
  }\n`;

  const newContent = content.substring(0, startIdx) + newBlock + content.substring(endIdx);
  fs.writeFileSync('src/views/AdminView.tsx', newContent, 'utf-8');
  console.log('Successfully replaced login block with framer-motion animations.');
} else {
  console.error('Could not find start or end block');
}
