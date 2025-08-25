'use client';

import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

interface FileDropZoneProps {
  onFileContent: (content: string) => void;
  className?: string;
}

export function FileDropZone({ onFileContent, className = '' }: FileDropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const processFile = useCallback(async (file: File) => {
    if (!file.name.endsWith('.json')) {
      toast.error('Please select a JSON file');
      return;
    }

    setIsProcessing(true);
    try {
      const content = await file.text();
      
      // Validate JSON
      try {
        JSON.parse(content);
        onFileContent(content);
        toast.success(`JSON file "${file.name}" loaded successfully`);
      } catch {
        toast.error('Invalid JSON file format');
      }
    } catch {
      toast.error('Failed to read file');
    } finally {
      setIsProcessing(false);
    }
  }, [onFileContent]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processFile(files[0]);
    }
  }, [processFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  }, [processFile]);

  return (
    <motion.div
      className={`relative ${className}`}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-xl p-6 transition-all duration-200 cursor-pointer
          ${isDragOver 
            ? 'border-purple-400 bg-purple-50 dark:bg-purple-900/20' 
            : 'border-slate-300 dark:border-slate-600 hover:border-purple-300 dark:hover:border-purple-500'
          }
          ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <input
          type="file"
          accept=".json"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isProcessing}
        />
        
        <div className="flex flex-col items-center gap-3 text-center">
          <div className={`
            w-12 h-12 rounded-xl flex items-center justify-center transition-colors
            ${isDragOver 
              ? 'bg-purple-100 dark:bg-purple-800' 
              : 'bg-slate-100 dark:bg-slate-800'
            }
          `}>
            {isProcessing ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <FileText className="w-6 h-6 text-purple-600" />
              </motion.div>
            ) : (
              <Upload className={`w-6 h-6 ${
                isDragOver ? 'text-purple-600' : 'text-slate-500'
              }`} />
            )}
          </div>
          
          <div>
            <p className={`font-medium ${
              isDragOver ? 'text-purple-700 dark:text-purple-300' : 'text-slate-700 dark:text-slate-300'
            }`}>
              {isProcessing ? 'Processing...' : 'Drop JSON file here'}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {isProcessing ? 'Reading file content' : 'or click to browse files'}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}