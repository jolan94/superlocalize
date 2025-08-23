'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Globe, Zap, Shield, Code, Star, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const features = [
  {
    icon: Globe,
    title: "50+ Languages",
    description: "Support for all major world languages including popular and regional dialects",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Real-time translation powered by advanced AI technology",
    color: "from-amber-500 to-orange-500"
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your JSON data is processed securely with no storage on our servers",
    color: "from-emerald-500 to-teal-500"
  },
  {
    icon: Code,
    title: "Developer Friendly",
    description: "Perfect JSON formatting with syntax highlighting and validation",
    color: "from-purple-500 to-pink-500"
  }
];

const benefits = [
  "Save hours of manual translation work",
  "Maintain consistent JSON structure across languages",
  "Professional-grade translation quality",
  "Export ready-to-use localization files",
  "Support for nested JSON objects",
  "Real-time validation and error checking"
];

const stats = [
  { value: "50+", label: "Languages Supported" },
  { value: "10K+", label: "Files Translated" },
  { value: "99.9%", label: "Accuracy Rate" },
  { value: "<1s", label: "Average Processing Time" }
];

export function LandingPage() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/translator');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 overflow-hidden" suppressHydrationWarning={true}>
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" suppressHydrationWarning={true}>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" suppressHydrationWarning={true}></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" suppressHydrationWarning={true}></div>
        <div className="absolute top-3/4 left-1/3 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-500" suppressHydrationWarning={true}></div>
      </div>

      <main className="container mx-auto px-6 py-16 max-w-7xl relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="space-y-24"
          suppressHydrationWarning={true}
        >
          {/* Hero Section */}
          <motion.section 
            variants={fadeInUp}
            className="text-center space-y-8 relative"
          >
            <div className="relative inline-block" suppressHydrationWarning={true}>
              <motion.h1 
                className="text-6xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.8, type: "spring", stiffness: 200 }}
              >
                SuperLocalize
              </motion.h1>
              <motion.div
                className="absolute -top-4 -right-4 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center"
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-3 h-3 text-white" />
              </motion.div>
            </div>
            
            <motion.p 
              className="text-2xl md:text-3xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Transform your JSON files into 
              <span className="font-semibold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text"> 50+ languages </span>
              instantly with AI-powered precision
            </motion.p>

            <motion.p 
              className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              The ultimate JSON localization tool for developers, product managers, and international teams. 
              No more manual translation work.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              suppressHydrationWarning={true}
            >
              <motion.button
                onClick={handleGetStarted}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 text-lg"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center gap-2">
                  Start Translating Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" suppressHydrationWarning={true}></div>
              </motion.button>
              
              <motion.button
                className="px-8 py-4 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-2xl hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 text-lg"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                View Demo
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              suppressHydrationWarning={true}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 + index * 0.1, duration: 0.5 }}
                >
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" suppressHydrationWarning={true}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 mt-1" suppressHydrationWarning={true}>
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

          {/* Features Section */}
          <motion.section 
            variants={fadeInUp}
            className="space-y-12"
          >
            <div className="text-center space-y-4" suppressHydrationWarning={true}>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-slate-200">
                Powerful Features
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                Everything you need to localize your applications with confidence
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" suppressHydrationWarning={true}>
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    className="group p-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`} suppressHydrationWarning={true}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>

          {/* Benefits Section */}
          <motion.section 
            variants={fadeInUp}
            className="space-y-12"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center" suppressHydrationWarning={true}>
              <div className="space-y-8" suppressHydrationWarning={true}>
                <div className="space-y-4" suppressHydrationWarning={true}>
                  <h2 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-slate-200">
                    Why Choose SuperLocalize?
                  </h2>
                  <p className="text-xl text-slate-600 dark:text-slate-400">
                    Built by developers, for developers. Save time and ensure accuracy with our professional-grade translation tool.
                  </p>
                </div>

                <div className="space-y-4" suppressHydrationWarning={true}>
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={benefit}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                    >
                      <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">
                        {benefit}
                      </span>
                    </motion.div>
                  ))}
                </div>

                <motion.button
                  onClick={handleGetStarted}
                  className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>

              <div className="relative" suppressHydrationWarning={true}>
                <motion.div
                  className="relative p-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-2xl"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  <div className="space-y-4" suppressHydrationWarning={true}>
                    <div className="flex items-center gap-3" suppressHydrationWarning={true}>
                      <div className="w-3 h-3 bg-red-500 rounded-full" suppressHydrationWarning={true}></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full" suppressHydrationWarning={true}></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full" suppressHydrationWarning={true}></div>
                      <span className="text-sm text-slate-500 dark:text-slate-400 ml-2">JSON Translator</span>
                    </div>
                    <div className="bg-slate-900 dark:bg-slate-950 rounded-lg p-4 font-mono text-sm" suppressHydrationWarning={true}>
                      <div className="text-green-400" suppressHydrationWarning={true}>&#123;</div>
                       <div className="ml-4 text-blue-400" suppressHydrationWarning={true}>&quot;welcome&quot;: &quot;Welcome to our app&quot;,</div>
                       <div className="ml-4 text-blue-400" suppressHydrationWarning={true}>&quot;login&quot;: &quot;Sign in to continue&quot;,</div>
                       <div className="ml-4 text-blue-400" suppressHydrationWarning={true}>&quot;submit&quot;: &quot;Submit form&quot;</div>
                       <div className="text-green-400" suppressHydrationWarning={true}>&#125;</div>
                       <div className="mt-4 text-purple-400" suppressHydrationWarning={true}>↓ Translating to Spanish...</div>
                       <div className="mt-2 text-green-400" suppressHydrationWarning={true}>&#123;</div>
                       <div className="ml-4 text-blue-400" suppressHydrationWarning={true}>&quot;welcome&quot;: &quot;Bienvenido a nuestra app&quot;,</div>
                       <div className="ml-4 text-blue-400" suppressHydrationWarning={true}>&quot;login&quot;: &quot;Iniciar sesión para continuar&quot;,</div>
                       <div className="ml-4 text-blue-400" suppressHydrationWarning={true}>&quot;submit&quot;: &quot;Enviar formulario&quot;</div>
                       <div className="text-green-400" suppressHydrationWarning={true}>&#125;</div>
                    </div>
                  </div>
                </motion.div>
                
                {/* Floating elements */}
                <motion.div
                  className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center"
                  animate={{ y: [-5, 5, -5], rotate: [0, 180, 360] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Star className="w-4 h-4 text-white" />
                </motion.div>
                
                <motion.div
                  className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center"
                  animate={{ y: [5, -5, 5], rotate: [360, 180, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                >
                  <Zap className="w-3 h-3 text-white" />
                </motion.div>
              </div>
            </div>
          </motion.section>

          {/* Final CTA Section */}
          <motion.section 
            variants={fadeInUp}
            className="text-center space-y-8 py-16"
          >
            <div className="space-y-4" suppressHydrationWarning={true}>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-slate-200">
                Ready to Go Global?
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                Join thousands of developers who trust SuperLocalize for their internationalization needs.
              </p>
            </div>

            <motion.button
              onClick={handleGetStarted}
              className="group relative px-12 py-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 text-xl"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center gap-3">
                <Globe className="w-6 h-6" />
                Start Translating Now
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" suppressHydrationWarning={true}></div>
            </motion.button>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              No signup required • Free to use • Secure & Private
            </p>
          </motion.section>
        </motion.div>
      </main>
    </div>
  );
}