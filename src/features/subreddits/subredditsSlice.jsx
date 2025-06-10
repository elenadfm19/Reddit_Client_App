import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

/*
  Async thunk for fetching subreddit data from Reddit's API
  Argument passed to the thunk is an array with 2 elements:
  - 1st: String to search/fetch subreddits
  - 2nd: Boolean that indicates if it's a general search or specific type of subreddits
*/
export const fetchSubreddits = createAsyncThunk(
  "subreddits/fetchSubreddits",
  async (args) => {
    const topic = encodeURIComponent(args[0]); //Sanitizes input for URL
    const search = args[1];

    //Selects the appropriate Reddit API endpoint
    const url = search
      ? `https://api.reddit.com/subreddits/search.json?q=${topic}`      //General subreddit search API request
      : `https://api.reddit.com/subreddits/${topic}.json`;              //Specific subreddit type fetch API request

    const response = await fetch(url);
    const json = await response.json();

    //Extracts array of subreddit data from API response
    const data = Object.values(json.data.children);

    //Array that will store the subreddit objects after extracting and normalizing the data
    const subreddits = [];

    //Maps the returned API data into each subreddit object inside the 'subreddits' array
    for (let i = 0; i < data.length; i++) {
      subreddits.push({
        name: data[i].data.display_name_prefixed,
        icon: data[i].data.icon_img,
        subscribers: data[i].data.subscribers,
        title: data[i].data.title,
        description: data[i].data.public_description,
      });
    }

    return subreddits;   //This becomes the action.payload in .fulfilled (fetchSubreddits.fulfilled)
  }
);

/*
  Slice for managing subreddits state
 */
export const subredditsSlice = createSlice({
  name: "subreddits",
  initialState: {
    subreddits: [],          //Array of subreddit objects from Reddit API
    loading: false,          //true while API request is in progress
    error: false             //true if API request fails
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubreddits.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(fetchSubreddits.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.subreddits = action.payload;
      })
      .addCase(fetchSubreddits.rejected, (state) => {
        state.loading = false;
        state.error = true;
      });
  },
});

//Selectors for accessing the slice state in 'Subreddits' component
export const selectSubreddits = (state) => state.subreddits.subreddits;
export const selectLoading = (state) => state.subreddits.loading;
export const selectError = (state) => state.subreddits.error;

//Reducer export for store configuration
export default subredditsSlice.reducer;
