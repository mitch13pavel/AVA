# 🦠 Viral Architect - Interactive Microbiology Laboratory

An educational web application where students design and test viruses through realistic environmental challenges. Features a complete virus construction system with scientifically accurate mutations and transmission modes.

## 🌟 Features

- **Virus Construction**: Design viruses with 8 nucleic acid types, 6 capsid shapes, multiple envelope types
- **Scientific Accuracy**: All mutations based on real viral mechanisms (antigenic drift, host jumping, etc.)
- **Interactive Testing**: Two modes - Quick Environmental Testing and Campaign Mode
- **Real-time Visualization**: Watch your virus come to life as you build it
- **Educational Content**: Learn about virology through hands-on experimentation

## 🚀 Deployment Options

### Option 1: GitHub + Netlify (Recommended)

1. **Create a GitHub Repository**
   ```bash
   # Create a new repository on GitHub, then:
   git clone https://github.com/yourusername/viral-architect.git
   cd viral-architect
   ```

2. **Upload Your Files**
   - Copy all files from the outputs folder to your repository:
     - `package.json`
     - `netlify.toml`
     - `public/index.html`
     - `src/index.js`
     - `src/App.js`
     - `README.md`

3. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit - Viral Architect Lab"
   git push origin main
   ```

4. **Deploy on Netlify**
   - Go to [netlify.com](https://netlify.com) and sign up/login
   - Click "New site from Git"
   - Connect your GitHub account
   - Select your repository
   - Build settings should auto-populate:
     - Build command: `npm run build`
     - Publish directory: `build`
   - Click "Deploy site"

### Option 2: Direct Netlify Deployment

1. **Prepare Your Files**
   - Download all files from the outputs folder
   - Create a zip file containing:
     - `package.json`
     - `netlify.toml`
     - `public/` folder with `index.html`
     - `src/` folder with `index.js` and `App.js`

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com) and login
   - Drag and drop your zip file onto the deployment area
   - Netlify will automatically build and deploy your site

### Option 3: Netlify CLI (Advanced)

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build and Deploy**
   ```bash
   # In your project directory
   npm install
   npm run build
   netlify login
   netlify deploy --prod --dir=build
   ```

## 🛠 Local Development

To run the project locally:

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## 📁 File Structure

```
viral-architect/
├── public/
│   └── index.html          # HTML template with Tailwind CSS
├── src/
│   ├── index.js           # React entry point
│   └── App.js             # Main virology lab component
├── package.json           # Dependencies and scripts
├── netlify.toml          # Netlify configuration
└── README.md             # This file
```

## 🎓 Educational Use

This application is designed for:
- **Biology/Microbiology courses**: Hands-on viral engineering
- **Public health education**: Understanding disease transmission
- **STEM outreach**: Engaging students with interactive science
- **Research training**: Learning viral characteristics and environmental factors

## 🧬 Game Modes

### 1. Virus Construction Laboratory
- Progressive unlocking system (nucleic acid → capsid → envelope → receptors → mutations)
- Real-time virus visualization
- Scientific classification with similarity matching to real viruses
- 120 research tokens for strategic decision-making

### 2. Environmental Testing
- Quick test mode: Select environments and get instant survival analysis
- Detailed explanations for each survival factor (temperature, disinfection, humidity, etc.)

### 3. Pandemic Campaign
- 5-mission story mode from Patient Zero to Global Pandemic
- Concrete endings based on performance (grades S through F)
- Strategic choice-making with consequences

## 🔬 Scientific Accuracy

All virus components and mutations are based on real virology:
- **Nucleic acid stability**: Real stability and mutation rates
- **Capsid structures**: Actual viral architectures (icosahedral, helical, complex, etc.)
- **Environmental factors**: Scientifically accurate survival calculations
- **Mutation mechanisms**: Real viral evolution strategies (antigenic drift, host jumping, etc.)

## 🌐 Live Demo

Once deployed, your application will be available at:
- Netlify: `https://your-site-name.netlify.app`
- Custom domain: Configure in Netlify dashboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📧 Support

For deployment issues:
- Check Netlify build logs for specific errors
- Ensure all files are properly uploaded
- Verify Node.js version compatibility (v18+ recommended)

---

**Built with React, Tailwind CSS, and Lucide Icons**

🦠 *Making virology education interactive and engaging!*
