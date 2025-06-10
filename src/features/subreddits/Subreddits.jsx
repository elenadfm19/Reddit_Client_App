import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  selectSubreddits,
  selectLoading,
  selectError,
  fetchSubreddits
} from "./subredditsSlice";
import { formatNumber } from "../../utils/utilities";

/*
  Subreddits component fetches and displays a list of subreddit search results.
  
  Props:
  - topic (string): The search term or subreddit type.
  - search (boolean): If true, performs a general subreddit search; otherwise, fetches subreddit by type.
 */
export default function Subreddits({ topic, search }) {
  //Retrieves the subreddits slice state data from Redux store
  const subreddits = useSelector(selectSubreddits);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //Fetches subreddits on mount or when topic/search changes
  useEffect(() => {
    dispatch(fetchSubreddits([topic, search]));
  }, [dispatch, topic, search]);

  //Shows loading or error messages if needed
  if (loading) return <p className='info'>Loading subreddits...</p>;
  if (error) return <p className='info'>Error.</p>;

  /*
    Handles click on a subreddit card to navigate to its posts.
    The subreddit name is extracted from the element ID.
   */
  function handleClick(e) {
    e.preventDefault;
    const name = e.currentTarget.id.slice(2);
    navigate(`/posts/r/${name}`);
  }

  return (
    <div id="subreddit-list">
      {subreddits.map((item) => (
        <div id={item.name} onClick={handleClick} className="subreddit">
          <div className="subreddit-header">
            <p className="subreddit-name">{item.name}</p>
            {item.icon && <img src={item.icon} className="subreddit-icon" />}
          </div>
          <p>
            <strong>{item.title}</strong>
          </p>
          <p>{item.description}</p>
          <p>{formatNumber(item.subscribers)+' members'}</p>
        </div>
      ))}
    </div>
  );
}
