import React, { useEffect, useRef } from "react";
import dashjs from "dashjs";

export default function RedditDashVideo({ dashUrl }) {
  const videoRef = useRef(null);
  console.log(dashUrl);
  console.log(videoRef.current);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (videoRef.current && dashUrl) {
        const player = dashjs.MediaPlayer().create();
          player.initialize(videoRef.current, dashUrl, false);

        console.log("entro a useEffect");
      }
    }, 0);
  }, []);
    console.log(videoRef.current);
    
  return (
    <video
      width="640"
      height="360"
      ref={videoRef}
      allow="fullscreen"
      controls
      className="post-video"
    ></video>
  );
}
