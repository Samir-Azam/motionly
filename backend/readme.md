# Motionly — Backend (Node.js, Express, MongoDB)

Motionly is a YouTube-inspired backend supporting videos, comments, likes, subscriptions, playlists, authentication, tweets, watch history, search, and creator dashboards.  
Built with Node.js, Express, MongoDB, Cloudinary, and JWT authentication.

---

## 📌 Status

**MVP Backend: Complete**  
All core models, controllers, routes, and middleware implemented and production-ready.

---

## 🛠 Tech Stack

### Backend Framework

- Node.js
- Express.js

### Database

- MongoDB
- Mongoose (ODM)

### File Uploads

- Multer (temp storage)
- Cloudinary (images/videos)

### Authentication & Security

- JWT (Access & Refresh Tokens)
- bcrypt
- cookie-parser
- validator

### Utilities

- mongoose-aggregate-paginate-v2
- dotenv
- Winston (logging)
- Morgan (HTTP logging)

---

## 📁 Project Structure

```bash
backend/
├── public/
│   └── temp/ # Temporary uploads (auto cleaned)
├── src/
│   ├── config/
│   │   ├── db.js # MongoDB connection
│   │   └── logger.js # Winston logger
│   ├── controllers/
│   │   ├── auth.controllers.js
│   │   ├── user.controllers.js
│   │   ├── video.controllers.js
│   │   ├── comment.controllers.js
│   │   ├── like.controllers.js
│   │   ├── subscription.controllers.js
│   │   ├── playlist.controllers.js
│   │   ├── playlistVideo.controllers.js
│   │   ├── watchHistory.controllers.js
│   │   ├── tweet.controllers.js
│   │   ├── search.controllers.js
│   │   └── dashboard.controllers.js
│   ├── middlewares/
│   │   ├── auth.middlewares.js
│   │   ├── multer.middlewares.js
│   │   └── cleanup.middlewares.js
│   ├── models/
│   │   ├── user.model.js
│   │   ├── video.model.js
│   │   ├── comment.model.js
│   │   ├── like.model.js
│   │   ├── subscription.model.js
│   │   ├── playlist.model.js
│   │   ├── playlistVideo.model.js
│   │   ├── watchHistory.model.js
│   │   └── tweet.model.js
│   ├── routes/
│   │   ├── healthcheck.routes.js
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── video.routes.js
│   │   ├── comment.routes.js
│   │   ├── like.routes.js
│   │   ├── subscription.routes.js
│   │   ├── playlist.routes.js
│   │   ├── watchHistory.routes.js
│   │   ├── tweet.routes.js
│   │   └── search.routes.js
│   ├── utils/
│   │   ├── ApiError.js
│   │   ├── ApiResponse.js
│   │   ├── asyncHandler.js
│   │   ├── cloudinary.js
│   │   └── helper.js
│   ├── constants.js
│   ├── app.js
│   └── index.js
├── .env
├── .gitignore
├── package.json
└── README.md
```

---

## 🔐 Authentication

### Features

- Register/Login: username/email + password (bcrypt hashed)
- Tokens: Access (short-lived) + Refresh (HTTP-only cookie)
- Protected routes: `verifyJWT` middleware

**Endpoints:**

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `POST /api/v1/auth/refresh-token`

---

## 👤 User Module

### Features

- Register new users with:
  - `username`, `fullName`, `email`, `password`  
  - `avatar` (required) and optional cover image (Cloudinary)  
- Input validation via `validator` and regex.  
- Login with username or email.  
- Refresh access tokens using refresh token.  

### User Endpoints

- `GET /api/v1/users/me` – Get current logged-in user  
- `POST /api/v1/users/reset-password` – Update password  
- `PATCH /api/v1/users/update-avatar` – Update avatar  
- `PATCH /api/v1/users/update-coverimage` – Update cover image  
- `PATCH /api/v1/users/update-account` – Update username, email, fullName  
- `GET /api/v1/users/profile/:username` – Get channel profile with subscriber count, video count, etc.  
- `DELETE /api/v1/users/delete-account` – Delete account and clean related data (videos, comments, likes, watch history, subscriptions, playlists, tweets)  

---

## 🎥 Video Module

### Features

- Upload video + thumbnail:
  - Uploaded via Multer to `public/temp/`  
  - Then uploaded to Cloudinary using `uploadOnCloudinary`  
  - Local temp files cleaned up after upload  
- Fields:
  - `owner`, `videoFile`, `thumbnail`, `title`, `description`, `duration`, `views`, `isPublished`  
- Pagination using `mongoose-aggregate-paginate-v2`.  

### Video Endpoints

- `POST /api/v1/videos` – Upload new video  
- `GET /api/v1/videos` – Get paginated feed  
- `GET /api/v1/videos/:id` – Get a single video with owner info  
- `GET /api/v1/videos/user/:username` – Channel videos  
- `PATCH /api/v1/videos/:id` – Update title/description/thumbnail  
- `DELETE /api/v1/videos/:id` – Delete video (only owner)  

---

## 📺 Watch History

### Features

- Stores which user watched which video and when.  
- Unique constraint on `(user, video)` so duplicates are prevented.  
- Watching a video can:
  - increment views  
  - add/update a watch history entry  

### Watch History Endpoint

- `GET /api/v1/watch-history` – Get recent watch history for logged-in user  

---

## 💬 Comment System

### Features

- Comment on videos.  
- Supports nested replies using `parentComment` field.  

### Comment Endpoints

- `POST /api/v1/comments` – Add comment or reply  
- `GET /api/v1/comments/:videoId` – Get comments on a video  
- `GET /api/v1/comments/replies/:commentId` – Get replies on a comment  
- `PATCH /api/v1/comments/:id` – Update own comment  
- `DELETE /api/v1/comments/:id` – Delete own comment (and optionally replies)  

---

## ❤️ Like System (Polymorphic)

### Features

- Single Like model for multiple target types:
  - `targetType`: `"video" | "comment" | "tweet"`  
  - `targetId`: ObjectId of the target document  
  - `likedBy`: the user who liked  
- Toggle like/unlike.  
- Get like count and like status per user.  

### Like Endpoints

- `POST /api/v1/likes/toggle` – Toggle like/unlike  
- `GET /api/v1/likes/count/:targetType/:targetId` – Get like count  
- `GET /api/v1/likes/status/:targetType/:targetId` – Check if current user liked  

---

## 👥 Subscriptions

### Features

- Subscription model links `subscriber` → `channel` (both Users).  
- Unique index `(subscriber, channel)` prevents duplicate subscriptions.  
- Pre-validation prevents self-subscription.  
- Used in:
  - Channel stats  
  - Tweet/video feed  

### Subscription Endpoints

- `POST /api/v1/subscriptions/toggle/:channelId` – Subscribe/unsubscribe to a channel  
- `GET /api/v1/subscriptions/subscribers/:channelId` – Get subscribers of a channel  
- `GET /api/v1/subscriptions/my/channels` – Get channels current user subscribed to  
- `GET /api/v1/subscriptions/status/:channelId` – Get subscription status for current user  

---

## 📚 Playlists

### Models

- `Playlist`:
  - `owner`, `name`, `description`  
- `PlaylistVideo`:
  - `playlist`, `video`, `addedAt`  

### Playlist Endpoints

- `POST /api/v1/playlists` – Create playlist  
- `GET /api/v1/playlists/mine` – Get own playlists  
- `GET /api/v1/playlists/:playlistId` – Get playlist + videos  
- `POST /api/v1/playlists/add-video` – Add video to playlist  
- `DELETE /api/v1/playlists/remove-video` – Remove video from playlist  
- `PATCH /api/v1/playlists/:playlistId` – Update playlist name/description  
- `DELETE /api/v1/playlists/:playlistId` – Delete playlist  

---

## 🐦 Tweet / Post System

### Features

- Tweet model:
  - `owner`  
  - `content` (max 280 chars)  
- Create tweet similar to YouTube community posts.  
- Feed includes own and subscribed channels’ tweets.  
- Like/unlike uses the same Like system.  

### Tweet Endpoints

- `POST /api/v1/tweets` – Create tweet  
- `GET /api/v1/tweets/feed` – Get feed tweets (own + subscribed channels)  
- `GET /api/v1/tweets/user/:username` – Get tweets by username  
- `DELETE /api/v1/tweets/:id` – Delete own tweet  
- `POST /api/v1/tweets/:id/like` – Like/unlike tweet  

---

## 🔍 Search

### Features

- Single search endpoint: `GET /api/v1/search?q=your+query`  
- Searches:
  - Videos (title, description)  
  - Users (username, fullName)  
  - Playlists (name)  
- Returns a combined result:

```json
{
"videos": [...],
"users": [...],
"playlists": [...]
}
```

---

## 📊 Dashboard

### Features

- Endpoint: `GET /api/v1/dashboard`  
- Provides stats for the logged-in user:
  - Total videos uploaded  
  - Total subscribers  
  - Total subscriptions (channels followed)  
  - Total likes received on videos  
  - Total playlists  
  - Recent uploads  
  - Recent comments  
  - Recent watch history entries  

---

## 🌐 Example API Overview

**Base path:** `/api/v1`

### Health

- `GET /api/v1/healthcheck`

### Auth

- `POST /api/v1/auth/register`  
- `POST /api/v1/auth/login`  
- `POST /api/v1/auth/logout`  
- `POST /api/v1/auth/refresh-token`  

### Users

- `GET /api/v1/users/me`  
- `POST /api/v1/users/reset-password`  
- `PATCH /api/v1/users/update-avatar`  
- `PATCH /api/v1/users/update-coverimage`  
- `PATCH /api/v1/users/update-account`  
- `GET /api/v1/users/profile/:username`  
- `DELETE /api/v1/users/delete-account`  

### Videos

- `POST /api/v1/videos`  
- `GET /api/v1/videos`  
- `GET /api/v1/videos/:id`  
- `GET /api/v1/videos/user/:username`  
- `PATCH /api/v1/videos/:id`  
- `DELETE /api/v1/videos/:id`  

### Comments

- `POST /api/v1/comments`  
- `GET /api/v1/comments/:videoId`  
- `GET /api/v1/comments/replies/:commentId`  
- `PATCH /api/v1/comments/:id`  
- `DELETE /api/v1/comments/:id`  

### Likes

- `POST /api/v1/likes/toggle`  
- `GET /api/v1/likes/count/:targetType/:targetId`  
- `GET /api/v1/likes/status/:targetType/:targetId`  

### Subscriptions

- `POST /api/v1/subscriptions/toggle/:channelId`  
- `GET /api/v1/subscriptions/subscribers/:channelId`  
- `GET /api/v1/subscriptions/my/channels`  
- `GET /api/v1/subscriptions/status/:channelId`  

### Playlists

- `POST /api/v1/playlists`  
- `GET /api/v1/playlists/mine`  
- `GET /api/v1/playlists/:playlistId`  
- `POST /api/v1/playlists/add-video`  
- `DELETE /api/v1/playlists/remove-video`  
- `PATCH /api/v1/playlists/:playlistId`  
- `DELETE /api/v1/playlists/:playlistId`  

### Watch History

- `GET /api/v1/watch-history`  

### Tweets

- `POST /api/v1/tweets`  
- `GET /api/v1/tweets/feed`  
- `GET /api/v1/tweets/user/:username`  
- `DELETE /api/v1/tweets/:id`  
- `POST /api/v1/tweets/:id/like`  

### Search

- `GET /api/v1/search?q=...`  

### Dashboard

- `GET /api/v1/dashboard`  

---

## 🔧 Environment Variables

Create a `.env` file in the project root:

```env
MONGO_URI=your_mongodb_connection_string
MONGODB_NAME=motionly

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_EXPIRY=7d

CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

---

## 🧪 Running the Project

Install dependencies

```bash
npm install
```

Run in development mode (with nodemon)

```bash
npm run dev
```

---

## ✨ Highlights

- Clean, modular MVC-style architecture  
- Centralized error & response handling (`ApiError`, `ApiResponse`, `asyncHandler`)  
- Secure authentication with JWT + HTTP-only cookies  
- Scalable MongoDB schema design with references instead of large embedded arrays  
- Cloudinary integration with temp file cleanup  
- Pagination-ready video feeds and watch history  
- Designed to plug directly into a React / Next.js frontend  

---

## 👨‍💻 Author

**Samir Azam**  
Full Stack Web Developer • Data Science Enthusiast  

- GitHub: [github.com/Samir-Azam](https://github.com/Samir-Azam)  
- LinkedIn: [linkedin.com/in/samir-azam](https://linkedin.com/in/samir-azam)
