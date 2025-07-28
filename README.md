# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Michael Paul Quimson - Portfolio

A modern, animated React TypeScript portfolio website showcasing professional experience and skills.

## Features

- 🎨 **Modern Design**: Clean, professional layout with gradient backgrounds and glassmorphism effects
- ⚡ **Smooth Animations**: Powered by Framer Motion for fluid interactions and transitions
- 📱 **Responsive**: Fully responsive design that works on all devices
- 🎯 **Resume Focus**: Landing page presents a complete, animated resume
- 🚀 **Fast**: Built with Vite for optimal performance
- 💻 **TypeScript**: Type-safe development with modern React patterns

## Technologies Used

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Framer Motion** for animations
- **Lucide React** for icons
- **CSS3** with modern features (Grid, Flexbox, Custom Properties)

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd portfolio
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/
│   ├── Portfolio.tsx/css    # Main portfolio container
│   ├── Header.tsx/css       # Animated header with contact info
│   └── Resume.tsx/css       # Resume section with experience
├── App.tsx                  # Root component
├── App.css                  # Global styles
├── index.css               # CSS variables and font imports
└── main.tsx                # Entry point
```

## Customization

The portfolio is built with customization in mind. Key areas to modify:

- **Personal Information**: Update contact details in `Header.tsx`
- **Experience**: Modify the experiences array in `Resume.tsx`
- **Colors**: Change CSS custom properties in `index.css`
- **Animations**: Adjust Framer Motion variants in component files

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

Michael Paul Quimson
- Email: michaelpaulquimson@gmail.com
- Phone: (63) 905-6691964
- Location: Brookside Hills Subdivision, Cainta, Rizal 1900

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
