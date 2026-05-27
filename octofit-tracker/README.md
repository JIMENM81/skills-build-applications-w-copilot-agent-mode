## 🌦️ OctoFit Weather Dashboard

A modern, full-stack weather dashboard application built with:
- **Frontend:** React 19 + Vite (port 5173)
- **Backend:** Node.js + Express + TypeScript (port 8000)
- **Database:** MongoDB (port 27017)

## 📋 Project Structure

```
octofit-tracker/
├── frontend/                 # React 19 + Vite frontend
│   ├── src/
│   │   ├── main.jsx         # Entry point
│   │   ├── App.jsx          # Main component
│   │   ├── App.css          # Styles
│   │   └── index.css        # Global styles
│   ├── index.html
│   ├── vite.config.js       # Vite config (port 5173)
│   ├── package.json
│   └── .gitignore
├── backend/                  # Express + TypeScript backend
│   ├── src/
│   │   ├── server.ts        # Main server (port 8000)
│   │   ├── config/
│   │   │   └── database.ts  # MongoDB connection
│   │   ├── models/
│   │   │   └── Weather.ts   # Mongoose schema
│   │   └── services/
│   │       └── weatherService.ts
│   ├── tsconfig.json
│   ├── eslint.config.js
│   ├── .prettierrc.json
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB running on port 27017
- OpenWeatherMap API key (free at https://openweathermap.org/api)

### Installation & Setup

#### 1. Backend Setup

```bash
cd octofit-tracker/backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env and add your OpenWeatherMap API key
# OPENWEATHER_API_KEY=your_key_here
# MONGODB_URI=mongodb://localhost:27017/octofit-weather
# PORT=8000
# CORS_ORIGIN=http://localhost:5173

# Start backend (TypeScript with hot reload)
npm run dev
```

Backend runs on: `http://localhost:8000`

#### 2. Frontend Setup

```bash
cd octofit-tracker/frontend

# Install dependencies
npm install

# Start frontend (Vite with HMR)
npm run dev
```

Frontend runs on: `http://localhost:5173`

#### 3. MongoDB Setup

Make sure MongoDB is running on port 27017:

```bash
# macOS with Homebrew
brew services start mongodb-community

# Docker
docker run -d -p 27017:27017 --name mongodb mongo

# Windows
net start MongoDB
```

## 📡 API Endpoints

### Get Current Weather
```
GET http://localhost:8000/api/weather?city=San%20Francisco
```

**Response:**
```json
{
  "city": "San Francisco",
  "country": "US",
  "temperature": 18,
  "feelsLike": 17,
  "humidity": 65,
  "pressure": 1013,
  "description": "Cloudy",
  "windSpeed": 5.2,
  "uvIndex": 45,
  "timestamp": "2024-05-27T10:30:00.000Z"
}
```

### Get Weather History
```
GET http://localhost:8000/api/weather/history/San%20Francisco?limit=5
```

### Get Weather Forecast
```
GET http://localhost:8000/api/forecast?city=San%20Francisco
```

### Health Check
```
GET http://localhost:8000/api/health
```

## 🎨 Features

✨ **Real-time Weather Data** - Fetches current conditions from OpenWeatherMap API  
📱 **Responsive Design** - Works on desktop, tablet, and mobile  
🔍 **City Search** - Search weather for any city worldwide  
📊 **Weather History** - MongoDB stores all weather records  
⚡ **Hot Module Replacement** - Instant feedback during development  
🔗 **API Proxy** - Frontend communicates with backend seamlessly  
🛡️ **Type Safety** - Full TypeScript support on backend  
📈 **5-Day Forecast** - View upcoming weather predictions  

## 🛠️ Development Commands

### Backend
```bash
npm run dev          # Run with tsx watch (hot reload)
npm run build        # Compile TypeScript
npm start            # Run compiled build
npm run typecheck    # Type checking
npm run lint         # ESLint analysis
npm run format       # Prettier formatting
```

### Frontend
```bash
npm run dev          # Development server with HMR
npm run build        # Production build
npm run preview      # Preview production build
```

## 🔧 Configuration

### Environment Variables (.env)

```env
# Backend
PORT=8000
NODE_ENV=development
OPENWEATHER_API_KEY=your_api_key_here
CORS_ORIGIN=http://localhost:5173

# MongoDB
MONGODB_URI=mongodb://localhost:27017/octofit-weather
```

### Port Configuration

| Service | Port | Purpose |
|---------|------|---------|
| Frontend | 5173 | React Vite dev server |
| Backend | 8000 | Express API server |
| MongoDB | 27017 | Database |

## 📚 Learning Resources

- [React 19 Documentation](https://react.dev/)
- [Vite Guide](https://vitejs.dev/)
- [Express.js](https://expressjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [OpenWeatherMap API](https://openweathermap.org/api)

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find process using port
lsof -i :5173  # Frontend
lsof -i :8000  # Backend
lsof -i :27017 # MongoDB

# Kill process
kill -9 <PID>
```

### MongoDB Connection Error
- Ensure MongoDB is running on port 27017
- Check MONGODB_URI in .env file
- Verify database name matches

### CORS Errors
- Ensure backend CORS_ORIGIN matches frontend URL (http://localhost:5173)
- Check that backend is running on port 8000
- Verify frontend proxy configuration points to http://localhost:8000

### Vite Port Conflict
If port 5173 is in use, Vite will automatically use the next available port. Check console output.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ using React 19, Vite, Express, TypeScript, and MongoDB
