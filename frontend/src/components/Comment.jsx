import React from "react";
import star from "../assets/star.png";

/*
  Comment Component used for recursively displaying the nested comments of a Reddit post.
  Each level of nesting increases the left margin for visual hierarchy.
 
  Props:
  - comments: array of comment objects
  - depth: current depth in the comment tree (used for indentation)
 */
export default function Comment({ comments, depth }) {
  if (!comments || comments.length === 0) {
    return (
      <div>
        <p>No comments yet</p>
      </div>
    );
  }
  return (
    <>
      {comments.map((item) => {
        return (
          <div
            className="comment"
            style={{
              marginLeft: `${depth * 0.75}rem`,   //Indent based on depth
              borderLeft: "1px solid #ccc",
              paddingLeft: "1rem",
            }}
          >
            <p>
              <strong>{item.author}</strong>
            </p>
            <p>{item.body}</p>
            <p>{item.createdTime}</p>
            <div className="stars">
              <img src={star} />
              <p>{item.score}</p>
            </div>
            {/*Recursive rendering of replies to a comment*/}
            {item.replies.length > 0 && (
              <div>       
                  <Comment comments={item.replies} depth={depth + 1} />
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
