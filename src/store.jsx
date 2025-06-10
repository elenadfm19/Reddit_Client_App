import { configureStore } from "@reduxjs/toolkit";
import subredditsReducer from "./features/subreddits/subredditsSlice";
import postsReducer from "./features/posts/postsSlice";
import commentedPostReducer from "./features/commentedPost/commentedPostSlice";

/*
  Redux store configuration for the app. 
  It combines 3 slices: subreddits, posts and commentedPost.
  
  Redux state shape reference:
  {
    subreddits: {
      subreddits: [],          // Array of subreddit objects from Reddit API
      loading: false,          // true while API request is in progress
      error: false             // true if API request fails
    },
    posts: {
      posts: [],               // Array of posts objects from Reddit API
      loading: false,          // true while API request is in progress
      error: false             // true if API request fails
    },
    commentedPost: {
      post: {},                // Post object with comments from Reddit API
      loading: false,          // true while API request is in progress
      error: false             // true if API request fails
    }
  }
*/
export default configureStore({
  reducer: {
    subreddits: subredditsReducer,
    posts: postsReducer,
    commentedPost:commentedPostReducer,
  },
});
