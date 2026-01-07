<div align="center">
  <h1>🎥 Motionly</h1>
  <p><strong>A Full-Stack Video Sharing Platform Built with MERN Stack</strong></p>
  
  ![MERN Stack](https://img.shields.io/badge/Stack-MERN-61DAFB?style=for-the-badge&logo=react&logoColor=white)
  ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
  ![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=node.js&logoColor=white)
  ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
  ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
  ![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)
  
  <h3>
    <a href="https://motionly-1.onrender.com">🚀 Live Demo</a> • 
    <a href="#api-documentation">📡 API Docs</a> • 
    <a href="#features">✨ Features</a> •
    <a href="#installation">📦 Setup</a> •
    <a href="#author">👤 Author</a>
  </h3>
  
  <p>
    <a href="https://motionly-1.onrender.com" target="_blank">
      <img src="https://img.shields.io/badge/Live%20Demo-Visit%20Now-success?style=for-the-badge" alt="Live Demo"/>
    </a>
    <a href="https://github.com/Samir-Azam/motionly" target="_blank">
      <img src="https://img.shields.io/github/stars/Samir-Azam/motionly?style=for-the-badge" alt="GitHub Stars"/>
    </a>
    <img src="https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge" alt="Status"/>
  </p>
  
  <p><em>A YouTube-inspired platform for video sharing, engagement, and content creation</em></p>
</div>

---

## 📖 Table of Contents

- [About](#about)
- [Live Demo](#live)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Screenshots](#screenshots)
- [Author](#author)

---

<a id="about"></a>
## 🎯 About

**Motionly** is a modern, full-stack video sharing platform built with the MERN stack. It allows users to upload, share, and interact with videos, manage playlists, comment on content, and engage with other creators.

### ✨ Key Highlights

- 🎬 **Video Management**: Upload, edit, delete, and publish videos
- 👤 **User Authentication**: Secure JWT-based authentication with refresh tokens
- 💬 **Interactive Comments**: Nested commenting system with replies
- ❤️ **Engagement System**: Like videos, comments, and tweets
- 📝 **Community Posts**: Twitter-like tweet functionality
- 📚 **Playlist Management**: Create and organize video playlists
- 🔍 **Advanced Search**: Search videos and channels with debouncing
- 📊 **User Dashboard**: Analytics and content management
- 📜 **Watch History**: Track and manage viewing history
- 🔔 **Subscriptions**: Follow channels and get updates

---

<a id="live"></a>
## 🌐 Live Deployment

**🎬 [Experience Motionly Live →](https://motionly-1.onrender.com)**

| Component | URL | Status |
|-----------|-----|--------|
| **Frontend Application** | [motionly-1.onrender.com](https://motionly-1.onrender.com) | ![](https://img.shields.io/badge/status-live-brightgreen) |
| **Backend REST API** | [motionly-ulji.onrender.com](https://motionly-ulji.onrender.com/api/v1) | ![](https://img.shields.io/badge/status-live-brightgreen) |
| **Database** | MongoDB Atlas | ![](https://img.shields.io/badge/status-live-brightgreen) |
| **Media Storage** | Cloudinary CDN | ![](https://img.shields.io/badge/status-live-brightgreen) |

> **Note:** First request may take 30-60 seconds as the free-tier server wakes up from sleep mode.

---

<a id="features"></a>
## 🚀 Features

### User Features

- ✅ User registration and login with JWT authentication
- ✅ Profile management (avatar, cover image, bio)
- ✅ Channel page with uploaded videos
- ✅ Watch history tracking
- ✅ Subscription management
- ✅ Password change functionality

### Video Features

- ✅ Video upload with thumbnail
- ✅ Video player with controls
- ✅ View count tracking
- ✅ Like/unlike videos
- ✅ Video search functionality
- ✅ Related videos suggestion
- ✅ Publish/unpublish toggle

### Social Features

- ✅ Comment on videos with nested replies
- ✅ Like/unlike comments
- ✅ Create and manage tweets
- ✅ Like/unlike tweets
- ✅ User subscriptions

### Playlist Features

- ✅ Create custom playlists
- ✅ Add/remove videos from playlists
- ✅ Edit playlist details
- ✅ Delete playlists
- ✅ Private playlist management

### Additional Features

- ✅ Responsive design for all devices
- ✅ Debounced search for performance
- ✅ Loading states and error handling
- ✅ Toast notifications
- ✅ Clean and modern UI

---

<a id="tech-stack"></a>
## 🛠️ Tech Stack

### Frontend

| Technology          | Purpose                                        |
| ------------------- | ---------------------------------------------- |
| **React 18**        | UI library for building interactive interfaces |
| **React Router v6** | Client-side routing                            |
| **Zustand**         | Lightweight state management                   |
| **Axios**           | HTTP client for API calls                      |
| **Tailwind CSS**    | Utility-first CSS framework                    |
| **Lucide React**    | Modern icon library                            |
| **React Hot Toast** | Toast notifications                            |

### Backend

| Technology     | Purpose                   |
| -------------- | ------------------------- |
| **Node.js**    | JavaScript runtime        |
| **Express.js** | Web application framework |
| **MongoDB**    | NoSQL database            |
| **Mongoose**   | MongoDB ODM               |
| **JWT**        | Authentication tokens     |
| **Bcrypt**     | Password hashing          |
| **Multer**     | File upload handling      |
| **Cloudinary** | Media storage             |

### Development Tools

- **Vite** - Fast build tool
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Nodemon** - Auto-restart server
- **Git** - Version control

---

<a id="architecture"></a>
## 🏗️ Architecture

```bash
┌─────────────────────────────────────────────────────────┐
│ Client (React)                                          │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐      │
│ │ Pages    │ │Components│ │ API      │ │ Store   │      │
│ └──────────┘ └──────────┘ └──────────┘ └─────────┘      │
└────────────────────────┬────────────────────────────────┘
                  HTTP/REST API
┌────────────────────────▼────────────────────────────────┐
│ Server (Express.js)                                     │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐      │
│ │ Routes   │ │Controller│ │ Models   │ │ Utils   │      │
│ └──────────┘ └──────────┘ └──────────┘ └─────────┘      │
└────────────────────────┬────────────────────────────────┘
                    Mongoose ODM
┌────────────────────────▼────────────────────────────────┐
│ Database (MongoDB)                                      │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐      │
│ │ Users    │ │ Videos   │ │ Comments │ │Playlists│      │
│ └──────────┘ └──────────┘ └──────────┘ └─────────┘      │
└─────────────────────────────────────────────────────────┘
```

---

<a id="installation"></a>
## 📦 Installation

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local or Atlas)
- **Git**

### Step 1: Clone the Repository

```bash
git clone https://github.com/Samir-Azam/motionly.git
cd motionly
```

### Step 2: Backend Setup

Navigate to backend directory
`cd backend`

Install dependencies
`npm install`

Create .env file
`cp .env.example .env`

Edit .env with your configuration

### Step 3: Frontend Setup

Navigate to frontend directory
`cd ../frontend`

Install dependencies
`npm install`

Create .env file
`cp .env.example .env`

Edit .env with your configuration

### Step 4: Run the Application

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

The application will be available at:

- **Frontend**: `http://localhost:3000`
- **Backend**: `http://localhost:8080`

---

<a id="environment-variables"></a>
## 🔐 Environment Variables

### Backend `.env`

```.env
Server Configuration
PORT=8080
NODE_ENV=development

Database
MONGODB_URI=mongodb://localhost:27017/motionly

OR for MongoDB Atlas:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/motionly
JWT Secrets
ACCESS_TOKEN_SECRET=your_access_token_secret_here
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
REFRESH_TOKEN_EXPIRY=10d

CORS
CORS_ORIGIN=http://localhost:3000

Cloudinary (Optional - for media storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend `.env`

```.env
# API Configuration
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

---

<a id="api-documentation"></a>
## 📚 API Documentation

### Base URL

`http://localhost:8080/api/v1`

### Quick Reference

#### Authentication

```bash
POST /auth/register # Register new user
POST /auth/login # Login user
POST /auth/logout # Logout user
POST /auth/refresh-token # Refresh access token
```

#### Users

```bash
GET /users/profile # Get current user profile
PATCH /users/profile # Update user profile
PATCH /users/avatar # Update avatar
PATCH /users/cover-image # Update cover image
POST /users/change-password # Change password
```

#### Videos

```bash
GET /videos # Get all videos (paginated)
GET /videos/:id # Get video by ID
POST /videos # Upload video
PATCH /videos/:id # Update video
DELETE /videos/:id # Delete video
PATCH /videos/toggle/publish/:id # Toggle publish status
```

#### Comments

```bash
GET /comments/video/:videoId # Get video comments
POST /comments/video/:videoId # Add comment
PATCH /comments/:commentId # Update comment
DELETE /comments/:commentId # Delete comment
```

#### Playlists

```bash
GET /playlists/mine # Get user's playlists
GET /playlists/:id # Get playlist by ID
POST /playlists # Create playlist
POST /playlists/add-video # Add video to playlist
DELETE /playlists/remove-video # Remove video from playlist
PATCH /playlists/:id # Update playlist
DELETE /playlists/:id # Delete playlist
```

#### Likes

```bash
POST /likes/toggle # Toggle like (video/comment/tweet)
GET /likes/count/:type/:id # Get like count
GET /likes/status/:type/:id # Get user's like status
```

#### Subscriptions

```bash
POST /subscriptions/toggle/:channelId # Toggle subscription
GET /subscriptions/user/:userId # Get user subscriptions
GET /subscriptions/channel/:channelId # Get channel subscribers
```

#### Watch History

```bash
GET /watch-history # Get watch history
POST /watch-history/:videoId # Add to watch history
DELETE /watch-history/clear # Clear watch history
```

#### Tweets

```bash
GET /tweets/user/:userId # Get user tweets
POST /tweets # Create tweet
PATCH /tweets/:id # Update tweet
DELETE /tweets/:id # Delete tweet
```

#### Search

```bash
GET /search?q=query # Search videos and channels
```

#### Health Check

```bash
GET /healthcheck # Check server status
```

### Example Request/Response

**Login User**
POST /api/v1/auth/login
Content-Type: application/json

```json
{
  "username": "johndoe",
  "password": "password123"
}
```

```json
**Response:**
{
"statusCode": 200,
"data": {
"user": {
"_id": "user_id",
"username": "johndoe",
"email": "john@example.com",
"fullName": "John Doe",
"avatar": "avatar_url"
},
"message": "Logged in successfully",
"success": true
}
}
```

---

<a id="project-structure"></a>
## 📁 Project Structure

```bash
motionly/
├── backend/
│ ├── public/
│ │ └── temp/ # Temporary uploads (auto cleaned)
│ ├── src/
│ │ ├── config/
│ │ │ ├── db.js # MongoDB connection
│ │ │ └── logger.js # Winston logger
│ │ ├── controllers/
│ │ │ ├── auth.controllers.js
│ │ │ ├── user.controllers.js
│ │ │ ├── video.controllers.js
│ │ │ ├── comment.controllers.js
│ │ │ ├── like.controllers.js
│ │ │ ├── subscription.controllers.js
│ │ │ ├── playlist.controllers.js
│ │ │ ├── playlistVideo.controllers.js
│ │ │ ├── watchHistory.controllers.js
│ │ │ ├── tweet.controllers.js
│ │ │ ├── search.controllers.js
│ │ │ └── dashboard.controllers.js
│ │ ├── middlewares/
│ │ │ ├── auth.middlewares.js
│ │ │ ├── multer.middlewares.js
│ │ │ └── cleanup.middlewares.js
│ │ ├── models/
│ │ │ ├── user.model.js
│ │ │ ├── video.model.js
│ │ │ ├── comment.model.js
│ │ │ ├── like.model.js
│ │ │ ├── subscription.model.js
│ │ │ ├── playlist.model.js
│ │ │ ├── playlistVideo.model.js
│ │ │ ├── watchHistory.model.js
│ │ │ └── tweet.model.js
│ │ ├── routes/
│ │ │ ├── healthcheck.routes.js
│ │ │ ├── auth.routes.js
│ │ │ ├── user.routes.js
│ │ │ ├── video.routes.js
│ │ │ ├── comment.routes.js
│ │ │ ├── like.routes.js
│ │ │ ├── subscription.routes.js
│ │ │ ├── playlist.routes.js
│ │ │ ├── watchHistory.routes.js
│ │ │ ├── tweet.routes.js
│ │ │ └── search.routes.js
│ │ ├── utils/
│ │ │ ├── ApiError.js
│ │ │ ├── ApiResponse.js
│ │ │ ├── asyncHandler.js
│ │ │ ├── cloudinary.js
│ │ │ └── helper.js
│ │ ├── constants.js
│ │ ├── app.js
│ │ └── index.js
│ ├── .env
│ ├── .gitignore
│ ├── package.json
│ └── README.md
│
├── frontend/
│ ├── public/
│ ├── src/
│ │ ├── api/
│ │ │ ├── axios.js
│ │ │ ├── video.js
│ │ │ ├── comment.js
│ │ │ ├── playlist.js
│ │ │ ├── like.js
│ │ │ ├── subscription.js
│ │ │ ├── tweet.js
│ │ │ ├── watchHistory.js
│ │ │ └── search.js
│ │ ├── components/
│ │ │ ├── common/
│ │ │ │ ├── Header.jsx
│ │ │ │ ├── Sidebar.jsx
│ │ │ │ └── LoadingSpinner.jsx
│ │ │ ├── video/
│ │ │ │ ├── VideoCard.jsx
│ │ │ │ ├── VideoPlayer.jsx
│ │ │ │ └── VideoUpload.jsx
│ │ │ ├── comment/
│ │ │ │ ├── CommentSection.jsx
│ │ │ │ └── CommentItem.jsx
│ │ │ └── playlist/
│ │ │ ├── CreatePlaylistModal.jsx
│ │ │ ├── EditPlaylistModal.jsx
│ │ │ └── AddToPlaylistModal.jsx
│ │ ├── pages/
│ │ │ ├── Home.jsx
│ │ │ ├── VideoPlayer.jsx
│ │ │ ├── Login.jsx
│ │ │ ├── Register.jsx
│ │ │ ├── Channel.jsx
│ │ │ ├── Playlists.jsx
│ │ │ ├── PlaylistView.jsx
│ │ │ ├── Search.jsx
│ │ │ └── WatchHistory.jsx
│ │ ├── store/
│ │ │ └── authStore.js
│ │ ├── App.jsx
│ │ ├── main.jsx
│ │ └── index.css
│ ├── .env
│ ├── .gitignore
│ ├── package.json
│ ├── tailwind.config.js
│ ├── vite.config.js
│ └── index.html
│
├── .gitignore
└── README.md
```

---

<a id="database-schema"></a>
## 🗄️ Database Schema

### User Model

```bson
{
username: String (unique, required, lowercase, indexed),
email: String (unique, required, lowercase),
fullName: String (required),
avatar: String (required),
coverImage: String,
password: String (required, hashed),
refreshToken: String,
watchHistory: [ObjectId] (ref: Video),
createdAt: Date,
updatedAt: Date
}
```

### Video Model

```bson
{
title: String (required),
description: String (required),
videoFile: String (required),
thumbnail: String (required),
duration: Number (required),
views: Number (default: 0),
isPublished: Boolean (default: true),
owner: ObjectId (ref: User, required),
createdAt: Date,
updatedAt: Date
}
```

### Comment Model

```bson
{
content: String (required),
video: ObjectId (ref: Video, required),
owner: ObjectId (ref: User, required),
createdAt: Date,
updatedAt: Date
}
```

### Playlist Model

```bson
{
name: String (required),
description: String,
owner: ObjectId (ref: User, required),
createdAt: Date,
updatedAt: Date
}
```

### PlaylistVideo Model

```bson
{
playlist: ObjectId (ref: Playlist, required),
video: ObjectId (ref: Video, required),
addedAt: Date (default: Date.now)
}
```

### Like Model

```bson
{
targetType: String (enum: ['video', 'comment', 'tweet'], required),
targetId: ObjectId (required),
user: ObjectId (ref: User, required),
createdAt: Date
}
```

### Subscription Model

```bson
{
subscriber: ObjectId (ref: User, required),
channel: ObjectId (ref: User, required),
createdAt: Date
}
```

### Tweet Model

```bson
{
content: String (required),
owner: ObjectId (ref: User, required),
createdAt: Date,
updatedAt: Date
}
```

### WatchHistory Model

```bson
{
user: ObjectId (ref: User, required),
video: ObjectId (ref: Video, required),
watchedAt: Date (default: Date.now)
}
```

---

<a id="screenshots"></a>
## 📸 Screenshots


### Home Page

![Home Page](frontend/public/home.png)

### Video Player

![Video Player](frontend/public/videoplayer.png)

### User Dashboard

![Dashboard](frontend/public/dashboard.png)

### Playlists

![Playlists](frontend/public/playlist.png)

### Playlist View

![Playlists](frontend/public/playlistview.png)

---

---

<a id="author"></a>
## 👨‍💻 Author

**Samir Azam**  
Full Stack Web Developer • Data Science Enthusiast

- GitHub: [github.com/Samir-Azam](https://github.com/Samir-Azam)
- LinkedIn: [linkedin.com/in/samir-azam](https://linkedin.com/in/samir-azam)
- Email: azamsamir190@gmail.com

---

## 🙏 Acknowledgments

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [JWT Authentication](https://jwt.io/)
- [Cloudinary](https://cloudinary.com/)

---

## 🔮 Future Enhancements

- [ ] Real-time notifications
- [ ] Live streaming support
- [ ] Video recommendations algorithm
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Video transcoding and quality options
- [ ] Email verification
- [ ] Social media sharing
- [ ] Advanced search filters

---

## 🐛 Known Issues

- None at the moment

If you find any bugs, please open an issue [here](https://github.com/Samir-Azam/motionly/issues).

---

## 💡 Support

If you have any questions or need help, feel free to:

- Open an issue on GitHub
- Contact me via email
- Star ⭐ this repo if you find it helpful

---

<div align="center">
  <p>Made with ❤️ and ☕ by Samir Azam</p>
  <p>⭐ Star this repo if you find it helpful!</p>
  <p>🍴 Fork it to customize for your needs!</p>
</div>
