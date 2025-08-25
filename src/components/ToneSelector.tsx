'use client';

import { motion } from 'framer-motion';
import { TranslationTone } from '@/types';
import { Briefcase, MessageSquare, Code2 } from 'lucide-react';

interface ToneSelectorProps {
  selectedTone: TranslationTone;
  onToneChange: (tone: TranslationTone) => void;
}

const toneOptions = [
  {
    value: 'professional' as const,
    label: 'Professional',
    icon: Briefcase,
    description: 'Business & formal content',
    gradient: 'from-blue-500 to-indigo-600'
  },
  {
    value: 'casual' as const,
    label: 'Casual',
    icon: MessageSquare,
    description: 'Friendly & conversational',
    gradient: 'from-green-500 to-teal-600'
  },
  {
    value: 'technical' as const,
    label: 'Technical',
    icon: Code2,
    description: 'Developer & API docs',
    gradient: 'from-purple-500 to-pink-600'
  }
];

export function ToneSelector({ selectedTone, onToneChange }: ToneSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-center gap-2">
        <div className="w-2 h-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full"></div>
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Translation Tone
        </h3>
      </div>
      
      <div className="flex justify-center">
        <div className="grid grid-cols-3 gap-2 max-w-md">
        {toneOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedTone === option.value;
          
          return (
            <motion.button
              key={option.value}
              onClick={() => onToneChange(option.value)}
              className={`p-2 rounded-lg border-2 transition-all duration-200 relative overflow-hidden group ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              {/* Background gradient on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${option.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              
              <div className="relative flex flex-col items-center gap-2">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                  isSelected 
                    ? `bg-gradient-to-r ${option.gradient} text-white shadow-lg`
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                }`}>
                  <Icon className="w-3 h-3" />
                </div>
                
                <div className="text-center">
                  <div className={`text-xs font-medium ${
                    isSelected 
                      ? 'text-blue-700 dark:text-blue-300' 
                      : 'text-slate-700 dark:text-slate-300'
                  }`}>
                    {option.label}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {option.description}
                  </div>
                </div>
              </div>
              
              {/* Selection indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-3 h-3 bg-blue-500 rounded-full"
                />
              )}
            </motion.button>
          );
        })}
        </div>
      </div>
    </div>
  );
}