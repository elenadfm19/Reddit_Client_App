const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const errorHandler = require("./errorHandler.js");
require("dotenv").config();
const PORT = process.env.PORT || 3000;

// Parses incoming requests with JSON payloads
app.use(bodyParser.json());

// Enable CORS for requests coming from our frontend (Vite dev server).
app.use(cors());


// ==========================
// FETCH POSTS ENDPOINT
// ==========================
// Handles:
//   GET /posts/search?q=react      → performs a general Reddit post search
//   GET /posts/subreddit?q=reactjs → fetches "hot" posts for a specific subreddit
app.use("/posts/:type", async (req, res) => {
  const { type } = req.params;
  const { q } = req.query;

  // Construct dynamic Reddit API URL based on request type
  const redditUrl =
    type === "search"
      ? `https://api.reddit.com/search.json?q=${encodeURIComponent(q)}` //General post search API request
      : `https://api.reddit.com/r/${encodeURIComponent(q)}/hot.json`; //Fetch API request for posts belogning to a specific subreddit

  // Call Reddit API
  const response = await fetch(redditUrl, {
    headers: {
      "User-Agent": "MyRedditProxy/1.0 by YourRedditUser",
    },
  });
  const data = await response.json();
  res.json(data); // Relay response to frontend
});


// ==========================
// FETCH SUBREDDITS ENDPOINT
// ==========================
// Handles:
//   GET /subreddits/search?q=react  → performs a general subreddit search
//   GET /subreddits/popular?q=all   → fetch subreddits for a specific category
app.use("/subreddits/:type", async (req, res) => {
  const { type } = req.params;
  const { q } = req.query;

  // Construct dynamic Reddit API URL based on request type
  const redditUrl =
    type === "search"
      ? `https://api.reddit.com/subreddits/search.json?q=${encodeURIComponent(q)}` //General subreddit search API request
      : `https://api.reddit.com/subreddits/${encodeURIComponent(q)}.json`; //Specific subreddit category fetch API request

  // Call Reddit API
  const response = await fetch(redditUrl, {
    headers: {
      "User-Agent": "MyRedditProxy/1.0 by YourRedditUser",
    },
  });
  const data = await response.json();
  res.json(data);
});


// ==========================
// FETCH COMMENTS ENDPOINT
// ==========================
// Handles:
//   GET /comments/:id
// Example:
//   GET /comments/abc123 → fetches comments for a reddit post
app.use("/comments/:id", async (req, res) => {
  const { id } = req.params;

  const redditUrl = `https://api.reddit.com/comments/${id}.json`;

  const response = await fetch(redditUrl, {
    headers: {
      "User-Agent": "MyRedditProxy/1.0 by YourRedditUser",
    },
  });
  const data = await response.json();
  res.json(data);
});


// Handler for catching unknown routes
app.use((req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.status = 404;
  next(error);
});

// Error handler middleware
app.use(errorHandler);

// Starts the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
