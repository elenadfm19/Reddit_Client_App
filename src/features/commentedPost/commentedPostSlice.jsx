import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { searchMedia, getDateTime, decodeHtml } from "../../utils/utilities";

/*
  Helper function that recursively extracts comment data from a Reddit's post nested comment structure.
  Each comment includes author, body, score, creation time, and replies.
  It receives as argument an array of raw comment objects from Reddit's API
 */
const extractComments = (commentsArray) => {
  return commentsArray.map((item) => {
    const comment = {
      author: item.data.author,
      body: item.data.body,
      createdUTC: item.data.created_utc,
      createdTime: getDateTime(item.data.created_utc),
      score: item.data.score,
      replies: [],
    };
    // Recursively extracts nested replies if they exist
    if (item.data.replies && item.data.replies !== "") {
      comment.replies = extractComments(item.data.replies.data.children);
    }
    return comment; //Returns a parsed and flattened comment object with a 'replies' property which is an array of nested comments objects if they exist
  });
};

/*
  Helper function that recursively sorts comments (and their nested replies) by creation time (newest first)
 */
const organiseComments = (commentsArray) => {
  commentsArray.sort((a, b) => b.createdUTC - a.createdUTC);
  commentsArray.forEach((c) => {
    if (c.replies.length > 0) {
      organiseComments(c.replies);
    }
  });
};

/*
  Async thunk for fetching a specific post data by ID from Reddits API
  Argument passed to the thunk is the 'id' of the post in Reddit website.
*/
export const fetchCommentedPost = createAsyncThunk(
  "commentedPost/fetchCommentedPost",
  async (id) => {
    const urlPost = `https://api.reddit.com/comments/${id}.json`;
    const response = await fetch(urlPost);
    const json = await response.json();

    //Post data is in the first element of the API returned array
    const data = json[0].data.children[0].data;

    //Media parsing (e.g. images, videos, galleries)
    const { mediaType, url, urlArray, html, dashUrl } = searchMedia(data);

    //Array that will store the comment objects if they exist. Comments are in the second element of the API returned array
    let comments = [];
    if (json[1].data.children.length > 0) {
      comments = extractComments(json[1].data.children);
      organiseComments(comments);
    }

    //We construct the post object with parsed data
    const post = {
      author: data.author,
      createdTime: getDateTime(data.created_utc),
      name: data.name,
      permalink: data.permalink,
      score: data.score,
      text: decodeHtml(data.selftext),
      title: decodeHtml(data.title),
      mediaType: mediaType,
      url: url,
      urlArray: urlArray,
      html: html,
      dashUrl: dashUrl,
      comments: comments,
    };

    return post;
  }
);

/*
  Slice for managing commentedPost state
 */
export const commentedPost = createSlice({
  name: "commentedPost",
  initialState: {
    post: {},           //Post object with comments from Reddit API
    loading: false,     //true while API request is in progress
    error: false,       //true if API request fails
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommentedPost.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(fetchCommentedPost.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.post = action.payload;
      })
      .addCase(fetchCommentedPost.rejected, (state) => {
        state.loading = false;
        state.error = true;
      });
  },
});

//Selectors for accessing the slice state and the action clearCommentPost in 'CommentedPost' component
export const selectedCommentedPost = (state) => state.commentedPost.post;
export const selectedLoading = (state) => state.commentedPost.loading;
export const selectedError = (state) => state.commentedPost.error;

//Reducer export for store configuration
export default commentedPost.reducer;
