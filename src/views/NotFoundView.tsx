import React from 'react';
import { PageView } from '../types';
import { FileQuestion, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface NotFoundViewProps {
  onSelectView: (view: PageView) => void;
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({ onSelectView }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center space-y-8"
      >
        <motion.div 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5, delay: 0.1 }}
          className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center mx-auto text-blue-600"
        >
          <FileQuestion className="w-12 h-12" />
        </motion.div>
        
        <div className="space-y-3">
          <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">404</h1>
          <h2 className="text-2xl font-bold text-slate-800">Page not found</h2>
          <p className="text-slate-500 font-medium">
            Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
          </p>
        </div>

        <div className="pt-6">
          <button
            onClick={() => onSelectView('home')}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:-translate-y-1 transition-all duration-300"
          >
            Back to Home
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
