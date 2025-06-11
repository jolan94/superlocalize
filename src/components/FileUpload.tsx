'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface FileUploadProps {
  onFileUpload: (content: string) => void;
}

export function FileUpload({ onFileUpload }: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    
    // Validate file type
    if (!file.name.endsWith('.json')) {
      toast.error('Please upload a JSON file');
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        
        // Basic JSON validation
        JSON.parse(content);
        
        onFileUpload(content);
        toast.success(`Loaded ${file.name} successfully`);
      } catch (error) {
        toast.error('Invalid JSON file');
      }
    };

    reader.onerror = () => {
      toast.error('Failed to read file');
    };

    reader.readAsText(file);
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    multiple: false,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <div
        {...getRootProps()}
        className={`relative p-8 border-2 border-dashed rounded-xl transition-all duration-200 cursor-pointer group ${
          isDragActive && !isDragReject
            ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
            : isDragReject
            ? 'border-red-400 bg-red-50 dark:bg-red-900/20'
            : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 bg-slate-50 dark:bg-slate-800/50'
        }`}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center gap-4 text-center">
          {/* Icon */}
          <motion.div
            className={`p-3 rounded-full transition-all duration-200 ${
              isDragActive && !isDragReject
                ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
                : isDragReject
                ? 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 group-hover:bg-slate-300 dark:group-hover:bg-slate-600'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {isDragReject ? (
              <AlertCircle className="w-8 h-8" />
            ) : isDragActive ? (
              <Upload className="w-8 h-8" />
            ) : (
              <FileText className="w-8 h-8" />
            )}
          </motion.div>

          {/* Text Content */}
          <div className="space-y-2">
            <h3 className={`text-lg font-semibold transition-colors ${
              isDragActive && !isDragReject
                ? 'text-blue-700 dark:text-blue-300'
                : isDragReject
                ? 'text-red-700 dark:text-red-300'
                : 'text-slate-700 dark:text-slate-300'
            }`}>
              {isDragReject
                ? 'Invalid file type'
                : isDragActive
                ? 'Drop your JSON file here'
                : 'Upload JSON File'
              }
            </h3>
            
            <p className={`text-sm transition-colors ${
              isDragActive && !isDragReject
                ? 'text-blue-600 dark:text-blue-400'
                : isDragReject
                ? 'text-red-600 dark:text-red-400'
                : 'text-slate-500 dark:text-slate-400'
            }`}>
              {isDragReject
                ? 'Please upload a .json file'
                : isDragActive
                ? 'Release to upload'
                : 'Drag and drop your JSON file here, or click to browse'
              }
            </p>
          </div>

          {/* File Requirements */}
          {!isDragActive && (
            <div className="text-xs text-slate-400 dark:text-slate-500 space-y-1">
              <p>Supported formats: .json</p>
              <p>Maximum file size: 10MB</p>
            </div>
          )}
        </div>

        {/* Animated Background */}
        {isDragActive && !isDragReject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-indigo-500/10 rounded-xl pointer-events-none"
          />
        )}
      </div>
    </motion.div>
  );
} 