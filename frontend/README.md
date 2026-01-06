# Motionly Frontend

A modern, responsive video streaming platform built with React, Vite, and Tailwind CSS.

## 🚀 Features

- **User Authentication**: Register, login, logout with JWT tokens
- **Video Management**: Upload, view, update, and delete videos
- **User Profiles**: Channel pages with subscriber counts
- **Watch History**: Track and view watch history
- **Likes & Comments**: Engage with videos
- **Subscriptions**: Subscribe to channels
- **Playlists**: Create and manage playlists
- **Tweets**: Post and view tweets
- **Dashboard**: Analytics for content creators
- **Search**: Find videos and channels
- **Responsive Design**: Mobile-first approach

## 📦 Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **React Router v6** - Routing
- **Axios** - HTTP client
- **Zustand** - State management
- **React Hook Form** - Form handling
- **Tailwind CSS** - Styling
- **Lucide Icons** - Icons
- **React Hot Toast** - Notifications

## 🛠️ Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
VITE_API_URL=http://localhost:8080/api/v1
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## 📁 Project Structure

```
src/
├── api/              # API service layer
├── components/       # Reusable components
├── pages/           # Page components
├── store/           # Zustand store
├── utils/           # Helper functions
├── App.jsx          # Main app component
└── main.jsx         # Entry point
```

## 🔑 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8080/api/v1` |

## 🎯 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code

## 📝 API Endpoints Used

### Auth
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `POST /auth/refresh-token` - Refresh access token

### User
- `GET /users/current` - Get current user
- `PATCH /users/update` - Update account details
- `PATCH /users/avatar` - Update avatar
- `PATCH /users/cover-image` - Update cover image
- `PATCH /users/reset-password` - Reset password
- `GET /users/channel/:username` - Get channel profile
- `DELETE /users/delete` - Delete account

### Videos
- `POST /videos/upload` - Upload video
- `GET /videos/feed/all` - Get all videos
- `GET /videos/:id` - Get video by ID
- `GET /videos/user/:username` - Get user videos
- `PATCH /videos/update/:id` - Update video
- `DELETE /videos/delete/:id` - Delete video

## 👨‍💻 Author

Built with ❤️ by Samir Azam

---

**Note**: Make sure the backend server is running before starting the frontend.
