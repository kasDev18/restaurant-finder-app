
# 🍽️ Restaurant Finder App

>A modern, full-stack restaurant search app using **React + Vite + TypeScript** (frontend) and **Node.js + TypeScript** (backend) with OpenAI and Foursquare APIs.

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd restaurant-finder-app
```

### 2. Install dependencies
```bash
# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install
```

### 3. Set up environment variables

Please reach to me...

```
FS_API_KEY=your_foursquare_api_key
OPENAI_API_KEY=your_openai_api_key
FS_URI=https://api.foursquare.com/v3/places
```

### 4. Run the application

#### Start the backend server
```bash
cd server
npm run dev
# or: npm start
```

#### Start the frontend
```bash
cd ../client
npm run dev
# The app will be available at http://localhost:5173
```

---

## ✨ Features

### Frontend
- Beautiful, responsive UI with React, Vite, and Tailwind CSS
- Search by cuisine, restaurant name, or location
- Dynamic open/closed status with color indicators
- Star ratings and price level labels ("Cheap", "Moderate", etc.)
- Cuisine badges and rich restaurant details
- Error handling and loading feedback

### Backend
- Type-safe Node.js/TypeScript API
- Integrates OpenAI for query parsing and Foursquare for restaurant data
- Advanced filtering: cuisine, price, rating, open now, hours, etc.
- Robust time/day logic for "open now" (handles overnight, 24-hour, etc.)
- Fetches and enriches results with price, rating, and hours
- Async/parallel API calls for performance
- Strong type safety and error handling throughout

---

## 📂 Project Structure

```
restaurant-finder-app/
  client/    # React frontend
  server/    # Node.js/TypeScript backend
```

---

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License
MIT
