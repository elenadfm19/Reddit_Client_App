import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Subreddits from "../features/subreddits/Subreddits";
import Posts from "../features/posts/Posts";

/*
  Search component
 
  - Displays results based on a dynamic search term from the URL (via React Router).
  - Allows users to toggle between viewing matching posts and subreddits.
  - Conditionally renders either the <Posts> or <Subreddits> component.
 */
export default function Search() {
  //We extract the search term from the route parameter
  const { term } = useParams();

  //Local states that will allow toggling between posts and subreddits
  const [showPosts, setShowPosts] = useState(true);
  const [showSubreddits, setShowSubreddits] = useState(false);

  return (
    <>
      {/* Toggle buttons to switch between post and subreddit results */}
      <div className='show-buttons'>
        <button onClick={(e) => { setShowPosts(true); setShowSubreddits(false) }} className={`button-${showPosts ? 'active' : 'inactive'}`}>Posts</button>
        <button onClick={(e) => { setShowPosts(false); setShowSubreddits(true) }} className={`button-${showSubreddits ? 'active' : 'inactive'}`}>Subreddits</button>
      </div >

      {/* Conditionally show Posts component */}
      {showPosts === true && (<Posts topic={term} search={true} style={{display: showPosts ? 'block':'none'}} />)}
      
      {/* Conditionally show Subreddits component */}
      {showSubreddits === true && (<Subreddits topic={term} search={true} style={{ display: showSubreddits ? 'block' : 'none' }} />)}
    </>
  );
}
