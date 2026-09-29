import React, { useState } from 'react';
import { PageView } from '../types';
import { Lock, ShieldCheck, ArrowLeft, KeyRound, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ResetPasswordViewProps {
  onSelectView: (view: PageView) => void;
}

export const ResetPasswordView: React.FC<ResetPasswordViewProps> = ({ onSelectView }) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const codeValue = code.join('');

  const handleCodeChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;
    const next = [...code];
    next[index] = value;
    setCode(next);
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleCodePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const next = ['', '', '', '', '', ''];
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setCode(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (codeValue.length !== 6) {
      setError('Please enter all 6 digits of the reset code.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: codeValue, newPassword })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Password reset successfully!');
        setTimeout(() => onSelectView('admin'), 2000);
      } else {
        setError(data.error || 'Failed to reset password.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6, 
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[50rem] h-[50rem] bg-indigo-500/20 rounded-full mix-blend-screen filter blur-[100px]" 
        />
        <motion.div 
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, 100, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] right-[-20%] w-[40rem] h-[40rem] bg-fuchsia-500/20 rounded-full mix-blend-screen filter blur-[100px]" 
        />
        <motion.div 
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3],
            y: [0, -50, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] left-[20%] w-[45rem] h-[45rem] bg-blue-500/20 rounded-full mix-blend-screen filter blur-[120px]" 
        />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-lg"
      >
        <div className="bg-slate-800/60 backdrop-blur-3xl p-10 sm:p-12 rounded-[2.5rem] shadow-[0_8px_40px_rgb(0,0,0,0.5)] border border-slate-700/50">
          
          <motion.div variants={itemVariants} className="text-center mb-10">
            <motion.div 
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="w-20 h-20 bg-gradient-to-tr from-indigo-500 via-purple-500 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/30"
            >
              <KeyRound className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight mb-3">Reset Password</h1>
            <p className="text-slate-400 font-medium text-lg">Enter the 6-digit code sent to your email.</p>
          </motion.div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                key="error"
                initial={{ opacity: 0, height: 0, scale: 0.9 }}
                animate={{ opacity: 1, height: 'auto', scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.9 }}
                className="mb-8 p-4 bg-red-900/40 backdrop-blur-md border border-red-500/50 rounded-2xl flex items-start gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">!</div>
                <p className="text-sm font-medium text-red-200">{error}</p>
              </motion.div>
            )}

            {success && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, height: 0, scale: 0.9 }}
                animate={{ opacity: 1, height: 'auto', scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.9 }}
                className="mb-8 p-4 bg-emerald-900/40 backdrop-blur-md border border-emerald-500/50 rounded-2xl flex items-center gap-3"
              >
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-emerald-200">Password Reset Successful!</p>
                  <p className="text-xs text-emerald-400">Redirecting to admin login...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-bold text-slate-300 mb-4 text-center tracking-wider uppercase">Security Code</label>
              <div className="flex gap-2 sm:gap-3 justify-center" onPaste={handleCodePaste}>
                {code.map((digit, i) => (
                  <motion.input
                    key={i}
                    whileFocus={{ scale: 1.1, y: -5 }}
                    id={`code-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(i, e.target.value)}
                    onKeyDown={(e) => handleCodeKeyDown(i, e)}
                    className="w-12 h-14 sm:w-14 sm:h-16 text-center bg-slate-900/50 border-2 border-slate-700 rounded-2xl text-2xl font-bold text-white outline-none focus:ring-4 focus:ring-indigo-500/40 focus:border-indigo-400 focus:bg-slate-800 transition-colors duration-300 shadow-inner"
                  />
                ))}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-5 pt-6">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2 ml-1">New Password</label>
                <div className="relative group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-5 pr-12 py-4 bg-slate-900/50 border-2 border-slate-700 rounded-2xl text-base text-white placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/40 focus:border-indigo-400 focus:bg-slate-800 transition-all duration-300 shadow-inner"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-400 transition-colors">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2 ml-1">Confirm Password</label>
                <div className="relative group">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full pl-5 pr-12 py-4 bg-slate-900/50 border-2 border-slate-700 rounded-2xl text-base text-white placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/40 focus:border-indigo-400 focus:bg-slate-800 transition-all duration-300 shadow-inner"
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-400 transition-colors">
                    {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 mt-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 hover:from-indigo-400 hover:via-purple-400 hover:to-indigo-500 text-white rounded-2xl font-bold text-lg shadow-[0_10px_30px_rgb(99,102,241,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
              >
                {isSubmitting ? (
                  <><motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></motion.span> Processing...</>
                ) : (
                  <><Lock className="w-5 h-5" /> Confirm Reset</>
                )}
              </motion.button>
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(51, 65, 85, 0.8)' }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => onSelectView('admin')}
                className="w-full py-4 bg-slate-800 text-slate-300 border border-slate-700 rounded-2xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Return to Login
              </motion.button>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};