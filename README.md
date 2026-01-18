# Reddit Client

A full-stack Reddit client application consisting of a React frontend and an Express backend that proxies requests to Reddit’s public API to prevent CORS issues.
The frontend is built with [Vite](https://vitejs.dev/), [React](https://reactjs.org/), [Redux](https://redux.js.org/), and [React Router](https://reactrouter.com/). 
The backend uses Express to securely fetch data from Reddit before delivering it to the client.

## 🚀 Features

- Browse subreddits by type: default, popular and new.
- Browse posts included in a specific subreddit.
- Search specific subreddits and posts by key words.
- View detailed posts including nested comments.
- Fully responsive UI
- Dynamic routing via React Router
- State management with Redux Toolkit
- Backend proxy to bypass CORS & rate-limit issues

## 🖼️ Demo
[Live Demo on Render] ([(https://reddit-client-app-frontend.onrender.com)](https://reddit-client-app-frontend.onrender.com/))

## 📷 Screenshots
![image](https://github.com/user-attachments/assets/8680ce39-f2b3-4f6d-8f71-f5f0612e5160)


![image](https://github.com/user-attachments/assets/f3709fec-3a38-4054-a417-5dd4205b8c3f)


## 📦 Built with
Frontend
- Vite
- React
- Redux Toolkit
- React Router

Backend
- Express
- Node.js
- Fetch API

## 🔧 Installation & Setup

1. Clone the repository:
```bash
git clone https://github.com/elenadfm19/Reddit_Client_App.git
cd Reddit_Client_App
```
2. Install backend dependencies and run the development server:
```bash
cd backend
npm install
node app.js
```
3. Install frontend dependencies:
```bash
cd ../frontend
npm install
npm run dev
```
4. The app should open at http://localhost:5173.
