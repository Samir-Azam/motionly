import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import logger from './config/logger.js';
import 'dotenv/config';

const app = express();

if (process.env.NODE_ENV !== 'production') {
  morgan.token('winlog', (req, res) => {
    return JSON.stringify({
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      responseTime: req.responseTime
    });
  });

  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      req.responseTime = Date.now() - start + 'ms';
    });
    next();
  });

  app.use(
    morgan(':winlog', {
      stream: {
        write: (message) => logger.info(JSON.parse(message))
      }
    })
  );
}

// common middlewares

// this middleware will allow access to the frontend
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
  })
);

// this middleware will parse the json data from the frontend and attach it to req.body
app.use(express.json({ limit: '16kb' }));

// this middleware will parse html form data from the frontend and attach it to req.body. extended: true for nested objects
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

// use for handling cookies
app.use(cookieParser());

// use for serving static files
app.use(express.static('public'));

// import routes
import healthcheckRoutes from './routes/healthcheck.routes.js';
import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js"
import videoRoutes from "./routes/video.routes.js"
import watchRoutes from "./routes/watch.routes.js"
import likeRoutes from "./routes/like.routes.js"
import commentRoutes from "./routes/comment.routes.js"
import subscriptionRoutes from "./routes/subscription.routes.js";
import playlistRoutes from "./routes/playlist.routes.js"
import searchRoutes from "./routes/search.routes.js";
import tweetRoutes from './routes/tweet.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';


// routes
app.use('/api/v1/healthcheck', healthcheckRoutes);
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/users', userRoutes)
app.use("/api/v1/videos", videoRoutes)
app.use("/api/v1/watch", watchRoutes)
app.use("/api/v1/likes", likeRoutes)
app.use("/api/v1/comments", commentRoutes)
app.use("/api/v1/subscriptions", subscriptionRoutes);
app.use("/api/v1/playlists", playlistRoutes)
app.use("/api/v1/search", searchRoutes);
app.use('/api/v1/tweets', tweetRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);

export { app };
