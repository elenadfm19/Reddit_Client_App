import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import {
  selectedCommentedPost,
  selectedLoading,
  selectedError,
  fetchCommentedPost,
} from "./commentedPostSlice";
import Comment from "../../components/Comment.jsx";
import ReactPlayer from "react-player";
import score from "../../assets/score.png";

/*
  CommentedPost component fetches and displays details of a specific post:

  - Retrieves a post (and its comments) from Reddit based on the post ID from the URL
  - Displays post details including media (image/video/link)
  - Renders nested comments using a recursive Comment component
 */
export default function CommentedPost() {
  //Retrieves the commentedPost slice state data from Redux store
  const commentedPost = useSelector(selectedCommentedPost);
  const loading = useSelector(selectedLoading);
  const error = useSelector(selectedError);
  const dispatch = useDispatch();
  const { id } = useParams(); // Post ID from route parameter

  //Fetches post and comments on mount
  useEffect(() => {
    dispatch(fetchCommentedPost(id));
  }, [dispatch]);

  //Shows loading or error messages if needed
  if (loading) return <p className="info">Loading post...</p>;
  if (error) return <p className="info">Error.</p>;

  return (
    <>
      <div id="commented-post">
        <h1>{commentedPost.title}</h1>

        {/*Conditionally renders media content based on mediaType*/}
        {commentedPost.mediaType === "image" && (
          <div className="commented-post-media">
            <img src={commentedPost.url} className="post-img" />
          </div>
        )}
        {commentedPost.mediaType === "gallery" && (
          <div className="commented-post-media">
            <img src={commentedPost.urlArray[0]} className="post-img" />
          </div>
        )}
        {commentedPost.mediaType === "rich:video" && (
          <div id="commented-post-media">
            <ReactPlayer
              url={commentedPost.url}
              width="100%"
              height="100%"
              controls
            />
          </div>
        )}
        {commentedPost.mediaType === "hosted:video" && (
          <div id="commented-post-media">
            <ReactPlayer
              url={commentedPost.dashUrl}
              width="100%"
              height="100%"
              controls
            />
          </div>
        )}
        {commentedPost.mediaType === "link" && (
          <a href={commentedPost.url} target="_blank" className="link">
            {commentedPost.url}
          </a>
        )}
        {/*Post text*/}
        <p>{commentedPost.text}</p>
        {/*Link to original Reddit post*/}
        <a
          href={`https://www.reddit.com${commentedPost.permalink}`}
          className="post-link"
          target="_blank"
        >
          Open the post on reddit
        </a>
        <div className="commented-post-bottom">
          <div className="score">
            <img src={score} />
            <p>{commentedPost.score}</p>
          </div>
          <p>{commentedPost.createdTime}</p>
          <div>
            <p>Author: {commentedPost.author}</p>
          </div>
        </div>
        {/*Nested comments section*/}
        <div id="comments">
          <h3>COMMENTS:</h3>
          <Comment comments={commentedPost.comments} depth={0} />
        </div>
      </div>
    </>
  );
}
