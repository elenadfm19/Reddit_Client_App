import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { searchMedia, getDateTime, decodeHtml } from "../../utils/utilities";

/*
  Async thunk for fetching posts data from Reddit's API
  Argument passed to the thunk is an array with 2 elements:
  - 1st: String to search/fetch posts
  - 2nd: Boolean that indicates if it's a general search or specific type of posts
*/
export const fetchPosts = createAsyncThunk("posts/fetchPosts", async (args) => {
  const topic = args[0];
  const search = args[1];

  //Selects the appropriate Reddit API endpoint
  const url = search
    ? `https://api.reddit.com/search.json?q=${topic}`       //General post search API request
    : `https://api.reddit.com/r/${topic}/hot.json`;         //Fetch API request for posts belogning to a specific subreddit

  const response = await fetch(url);
  const json = await response.json();

  //Extracts array of posts data from API response
  const data = json.data.children;

  //Array that will store the post objects after extracting and normalizing the data
  let posts = [];

  //Maps the returned API data into each post object inside the 'posts' array
  for (let i = 0; i < data.length; i++) {
    // Helper function to extract media-related fields
    let { mediaType, url, urlArray, html, dashUrl } = searchMedia(data[i].data); 

    posts.push({
      author: data[i].data.author,
      createdTime: getDateTime(data[i].data.created_utc),
      id: data[i].data.id,
      score: data[i].data.score,
      text: decodeHtml(data[i].data.selftext),
      title: decodeHtml(data[i].data.title),
      url: url,
      mediaType: mediaType,
      urlArray: urlArray,
      html: html,
      dashUrl: dashUrl,
    });
  }

  return posts;   //This becomes the action.payload in .fulfilled (fetchPosts.fulfilled)
});

/*
  Slice for managing posts state
 */
export const postsSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],            //Array of posts objects from Reddit API
    loading: false,       //true while API request is in progress
    error: false,         //true if API request fails
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        //console.log("pending");
        state.loading = true;
        state.error = false;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        //console.log("fulfilled");
        state.loading = false;
        state.error = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state) => {
        //console.log("error");
        state.loading = false;
        state.error = true;
      });
  },
});

//Selectors for accessing the slice state in 'Posts' component
export const selectPosts = (state) => state.posts.posts;
export const selectLoading = (state) => state.posts.loading;
export const selectError = (state) => state.posts.error;

//Reducer export for store configuration
export default postsSlice.reducer;
