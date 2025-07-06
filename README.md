# Real-Time Sports Odds

A modern React application for displaying real-time sports betting odds with a mobile-first design. The app features a clean, responsive interface for viewing football matches, odds, and betting information.

## 🚀 Features

- **Real-time Sports Data**: Displays live sports events and betting odds
- **Mobile-First Design**: Optimized for mobile devices with responsive layout
- **Modern UI**: Clean interface with Tailwind CSS styling
- **Redux State Management**: Efficient state management with Redux Toolkit
- **Font Awesome Icons**: Professional icons for navigation and UI elements
- **Loading States**: Smooth loading indicators and error handling
- **Match Cards**: Detailed match information with teams, leagues, and odds

## 🛠️ Tech Stack

- **Frontend**: React 19.1.0
- **State Management**: Redux Toolkit 2.8.2
- **Styling**: Tailwind CSS 4.1.11
- **Icons**: Font Awesome 6.7.2 & Lucide React 0.525.0
- **Testing**: Jest & React Testing Library
- **Build Tool**: Create React App 5.0.1

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (version 16.0 or higher)
- **npm** (version 8.0 or higher) or **yarn**

You can check your versions by running:

```bash
node --version
npm --version
```

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd real-time-sports-odds
```

### 2. Install Dependencies

Using npm:

```bash
npm install
```

Or using yarn:

```bash
yarn install
```

### 3. Start the Development Server

Using npm:

```bash
npm start
```

Or using yarn:

```bash
yarn start
```

The application will open automatically in your browser at [http://localhost:3000](http://localhost:3000).

## 📱 Usage

1. **View Matches**: The main screen displays a list of football matches with current odds
2. **Match Information**: Each match card shows:
   - Match date and time
   - Home vs Away teams
   - League information
   - Betting odds (1/X/2)
   - Hot matches indicator (🔥)
   - Number of bets placed
3. **Navigation**: Use the bottom navigation bar to access different sections

## 🏗️ Available Scripts

### Development

- **`npm start`** - Runs the app in development mode with hot reloading
- **`npm test`** - Launches the test runner in interactive watch mode
- **`npm run test:coverage`** - Runs tests with coverage report

### Production

- **`npm run build`** - Builds the app for production to the `build` folder
- **`npm run serve`** - Serves the production build locally (requires `serve` package)

### Code Quality

- **`npm run lint`** - Runs ESLint to check code quality
- **`npm run lint:fix`** - Automatically fixes ESLint issues where possible

## 📁 Project Structure

```
real-time-sports-odds/
├── public/
│   ├── data/              # Static data files
│   ├── favicon.ico        # App favicon
│   ├── index.html         # HTML template
│   └── manifest.json      # PWA manifest
├── src/
│   ├── components/        # Reusable React components
│   ├── services/          # API services and data fetching
│   ├── store/             # Redux store and slices
│   ├── utils/             # Utility functions
│   ├── App.js             # Main App component
│   ├── App.css            # App-specific styles
│   ├── index.js           # App entry point
│   └── index.css          # Global styles
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
└── README.md              # This file
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory for environment-specific configurations:

```env
REACT_APP_API_URL=https://your-api-endpoint.com
REACT_APP_REFRESH_INTERVAL=30000
```

### Tailwind CSS

The project uses Tailwind CSS for styling. Configuration can be modified in `tailwind.config.js`.

## 🧪 Testing

Run the test suite:

```bash
npm test
```

Run tests with coverage:

```bash
npm test -- --coverage --watchAll=false
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates a `build` folder with optimized production files.

### Deploy to Netlify

1. Build the project: `npm run build`
2. Drag and drop the `build` folder to Netlify
3. Or connect your Git repository for automatic deployments

### Deploy to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts to deploy

## 🔍 Troubleshooting

### Common Issues

1. **Port 3000 already in use**

   ```bash
   # Kill the process using port 3000
   npx kill-port 3000
   # Or start on a different port
   PORT=3001 npm start
   ```

2. **Node modules issues**

   ```bash
   # Clear npm cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Build fails**
   ```bash
   # Clear build cache
   rm -rf build
   npm run build
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Search existing issues in the repository
3. Create a new issue with detailed information about the problem

## 🔗 Links

- [React Documentation](https://reactjs.org/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Create React App Documentation](https://create-react-app.dev/)
