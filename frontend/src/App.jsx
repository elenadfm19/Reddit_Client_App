import "./App.css";
import Home from "./components/Home.jsx";
import Search from './components/Search.jsx';
import Subreddits from "./features/subreddits/Subreddits.jsx";
import Posts from "./features/posts/Posts.jsx";
import CommentedPost from "./features/commentedPost/CommentedPost.jsx";
import { Routes, Route } from "react-router-dom";
/*
  Root component of the application.
  It sets up the app routing.
*/
export default function App() {

  return (
    <Routes>
      {/* Global route that shows the permanent navigation bar. It nests the rest of the routes */}
      <Route path="/" element={<Home />}>
        
        {/* Default route that will show popular reddit posts when we redirect to the global route */}
        <Route path="default" element={<Posts topic={'news'} search={true} />} />

        {/* Displays a list of default subreddits */}
        <Route
          path="subreddits/default"
          element={<Subreddits topic="default" search={false} />}
        />

        {/* Displays a list of popular subreddits */}
        <Route
          path="subreddits/popular"
          element={<Subreddits topic="popular" search={false}/>}
        />

        {/* Displays a list of new subreddits */}
        <Route path="subreddits/new" element={<Subreddits topic="new" search={false} />} />

        {/* Displays a list of searched posts and subreddits.
            :term is a dynamic URL parameter representing the search term entered by the user.
            The Search component uses this term to fetch and display matching posts or subreddits. */}
        <Route path="search/:term" element={<Search />} />

        {/* Displays a list of posts that belong to a specific subreddit 
            :subreddit is a dynamic URL parameter representing the subreddit whose posts will be retrieved. */}
        <Route path="posts/r/:subreddit" element={<Posts search={false} />} />
        
        {/* Displays a specific post including user comments 
            :id is the reddit identifier of the post that will be displayed */}
        <Route path="post/:id" element={<CommentedPost />} />
        
      </Route>
    </Routes>
  );
}
