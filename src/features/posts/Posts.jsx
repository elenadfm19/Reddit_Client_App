import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  selectPosts,
  selectLoading,
  selectError,
  fetchPosts,
} from "./postsSlice";
import ReactPlayer from "react-player";
import score from "../../assets/score.png";

/*
  Posts component fetches and displays a list of posts.
  
  Props:
  - topic (string): The search term or subreddit type.
  - search (boolean): If true, performs a general post search; otherwise, fetches posts by subreddit name.
 */
export default function Posts({ topic, search }) {
  //Retrieves the posts slice state data from Redux store
  const posts = useSelector(selectPosts);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let searchTerm = "";

  //If not in search mode, get subreddit name from URL params
  if (!search) {
    const { subreddit } = useParams();
    searchTerm = subreddit;
  } else {
    // Otherwise, encode the search term to be used in the URL
    searchTerm = encodeURIComponent(topic);
  }

  //Fetches posts on mount or when topic/search changes
  useEffect(() => {
    dispatch(fetchPosts([searchTerm, search]));
  }, [dispatch, topic, search]);

  //Shows loading or error messages if needed
  if (loading) return <p className="info">Loading posts...</p>;
  if (error) return <p className="info">Error.</p>;
  if (posts.length === 0)
    return <p className="info">There are no posts for this subreddit yet.</p>;

  /*
    Handles click on a post card to navigate to its data and comments.
    The post id is extracted from the element ID.
   */
  function handleClick(e) {
    e.preventDefault;
    const id = e.currentTarget.id;
    navigate(`/post/${id}`);
  }

  return (
    <div id="post-list">
      {/*Loop through each post and render its content*/}
      {posts.map((item) => {
        return (
          <div className="post">
            {/*Conditionally renders media content based on mediaType*/}
            {item.mediaType === "image" && (
              <div className="post-media">
                <img src={item.url} className="post-img" />
              </div>
            )}
            {item.mediaType === "gallery" && (
              <div id="commented-post-media">
                <img src={item.urlArray[0]} className="post-img" />
              </div>
            )}
            {item.mediaType === "rich:video" && (
              <div className="post-media">
                <ReactPlayer
                  url={item.url}
                  width="100%"
                  height="100%"
                  controls
                />
              </div>
            )}
            {item.mediaType === "hosted:video" && (
              <div className="post-media">
                <ReactPlayer
                  url={item.dashUrl}
                  width="100%"
                  height="100%"
                  controls
                />
              </div>
            )}

            {/*Post content area (clickable for details)*/}
            <div className="post-content" id={item.id} onClick={handleClick}>
              <div className="post-text">
                <p>
                  <strong>{item.title}</strong>
                </p>
                {item.mediaType === "link" && (
                  <a href={item.url} target="_blank">
                    {item.url}
                  </a>
                )}
                <p>{item.text}</p>
              </div>
              <div className="post-bottom">
                <div className="score">
                  <img src={score} />
                  <p>{item.score}</p>
                </div>
                <p>{item.createdTime}</p>
                <div>
                  <p>Author: {item.author}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
