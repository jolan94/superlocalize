# SuperLocalize - JSON Translation Studio

A beautiful, modern Next.js application for translating JSON key-value pairs into multiple languages. Built with professional-grade UI/UX and designed for developers who need efficient localization tools.

## ✨ Features

### Core Functionality
- **JSON Validation**: Real-time JSON parsing with detailed error messages
- **Multi-Language Translation**: Support for Spanish (es), French (fr), and German (de)
- **Smart Filtering**: Automatically skips technical strings (URLs, emails, IDs, etc.)
- **Batch Processing**: Efficient translation with progress indicators
- **Google Translate Integration**: Ready for Google Translate API integration

### User Experience
- **Modern Dark/Light Mode**: Seamless theme switching with system preference detection
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Monaco Editor**: Professional code editor with syntax highlighting
- **Drag & Drop Upload**: Easy JSON file uploads with validation
- **Copy & Download**: One-click copying and file downloads for all translations

### Technical Features
- **Real-time Validation**: Instant JSON validation as you type
- **Undo/Redo System**: Full history management for JSON editing
- **Format/Prettify**: Automatic JSON formatting and beautification
- **Progress Tracking**: Detailed progress indicators during translation
- **Error Handling**: Comprehensive error states with helpful messages
- **Animation & Micro-interactions**: Smooth transitions and engaging UI feedback

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd superlocalize
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎯 How to Use

1. **Upload or Paste JSON**: Either drag & drop a JSON file or paste your content directly into the Monaco editor
2. **Select Target Languages**: Choose from Spanish, French, or German using the language selector
3. **Translate**: Click the "Translate JSON" button to start the translation process
4. **Review Results**: View translations in the tabbed interface on the right
5. **Download**: Copy individual translations or download all results as files

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with theme provider
│   ├── page.tsx           # Main application page
│   └── globals.css        # Global styles and theme variables
├── components/            # React components
│   ├── Header.tsx         # App header with theme toggle
│   ├── JsonEditor.tsx     # Monaco editor for JSON input
│   ├── LanguageSelector.tsx # Language selection interface
│   ├── FileUpload.tsx     # Drag & drop file upload
│   ├── ActionButtons.tsx  # Main action buttons
│   ├── TranslationProgress.tsx # Progress indicator
│   ├── StatusPanel.tsx    # Status and validation display
│   └── ResultsPanel.tsx   # Translation results viewer
├── hooks/                 # Custom React hooks
│   ├── useJsonValidation.ts # JSON validation logic
│   └── useTranslation.ts  # Translation management
└── types/                 # TypeScript type definitions
    └── index.ts           # Shared types and interfaces
```

## 🔧 Configuration

### Google Translate API Setup

The application is configured to use Google Translate API. To enable live translation:

1. Get a Google Translate API key from the [Google Cloud Console](https://console.cloud.google.com/)
2. Update the `GOOGLE_TRANSLATE_API_KEY` in `src/hooks/useTranslation.ts`
3. Uncomment the actual API call in the `translateWithGoogleAPI` function

### Supported Languages

Currently supports:
- **Spanish (es)** 🇪🇸
- **French (fr)** 🇫🇷  
- **German (de)** 🇩🇪

To add more languages:
1. Update the `Language` type in `src/types/index.ts`
2. Add language info in `src/components/LanguageSelector.tsx`
3. Add mock translations in `src/hooks/useTranslation.ts`

## 🎨 Customization

### Theme Colors
Modify CSS custom properties in `src/app/globals.css`:
```css
:root {
  --primary: 220 85% 57%;
  --secondary: 220 14% 96%;
  /* ... more variables */
}
```

### Animation Settings
Adjust Framer Motion animations in individual components:
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
```

## 📦 Dependencies

### Core
- **Next.js 15**: React framework with App Router
- **React 19**: Latest React with concurrent features
- **TypeScript**: Type safety and developer experience

### UI & Styling
- **Tailwind CSS 4**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **Lucide React**: Modern icon library
- **next-themes**: Theme management

### Functionality
- **Monaco Editor**: VS Code editor for the web
- **react-dropzone**: File upload with drag & drop
- **react-hot-toast**: Toast notifications

## 🌟 Key Features Breakdown

### Smart Translation Logic
- Detects and skips technical strings (URLs, emails, IDs)
- Preserves JSON structure during translation
- Handles nested objects and arrays
- Batch processing for efficiency

### Professional UI/UX
- Glassmorphism effects and modern gradients
- Smooth micro-interactions and hover effects
- Responsive grid layouts
- Accessible design patterns

### Developer Experience
- TypeScript for type safety
- ESLint for code quality
- Modern React patterns with hooks
- Component-based architecture

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔮 Future Enhancements

- [ ] More language support (Italian, Portuguese, Chinese, etc.)
- [ ] Bulk file processing
- [ ] Translation memory and caching
- [ ] Export to various formats (CSV, YAML, etc.)
- [ ] Collaborative translation features
- [ ] Translation quality scoring
- [ ] Custom translation glossaries

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.
