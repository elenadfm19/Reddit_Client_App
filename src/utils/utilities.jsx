/*
  Helper function that determines what type of media data and realted URLs are contained in a Reddit post object.
  Argument is the Reddit post data object.
  
  @returns {Object} An object containing:
    - mediaType: string indicating the type of media (e.g. "image", "hosted:video", "rich:video", "link", "gallery").
    - url: primary URL associated with the post.
    - urlArray: array of URLs (used for galleries).
    - html: embedded HTML content (currently unused, but reserved for rich media).
    - dashUrl: URL for DASH video streams (used in hosted videos).
 */
export const searchMedia = (data) => {
  let mediaType = "";
  let urlArray = [];
  let html = "";
  let url = data.url;
  let dashUrl = "";

  if (
    data.post_hint &&
    data.post_hint === "image" &&
    data.url.match(/\.(jpg|png|gif|jpeg)$/)        
  ) {
    mediaType = "image";  //Media data in the post is an image. The image link is contained in the url.
  } else if (
    data.post_hint &&
    data.post_hint === "hosted:video" &&
    data.media.reddit_video.dash_url              
  ) {
    mediaType = "hosted:video";                   //Media data in the post is a Reddit hosted video
    dashUrl = data.media.reddit_video.dash_url;   //Extracts the url for DASH streaming
  } else if (
    data.post_hint &&
    data.post_hint === "rich:video" &&
    data.secure_media.oembed.html
  ) {
    mediaType = "rich:video"; //Media data in the post is an external video. The video link is contained in the url.
  } else if (data.post_hint && data.post_hint === "link") {
    mediaType = "link"; //No media present. The post contains an external link in the url field.
  } else if (
    data.post_hint &&
    data.post_hint === "gallery" &&
    data.media_metadata
  ) {
    mediaType = "gallery";  //Media data in the post is a photo gallery.
    //We extract the URLs of all the gallery photos
    let ids = data.gallery_data.items.map((item) => item.media_id);
    urlArray = ids.map((item) => data.media_metadata[item].s.u);
  }

  return {
    mediaType: mediaType,
    url: url,
    urlArray: urlArray,
    html: html,
    dashUrl: dashUrl,
  };
};

/*
  Helper function that converts a UNIX timestamp (in seconds) into a localized human-readable date and time string.
 */
export const getDateTime = (timeUTC) => {
  const dateTime = new Date(timeUTC * 1000);
  return dateTime.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

/*
  Helper function that decodes HTML entities in a string into their corresponding characters.
  Example: converts "&amp;" into "&" or "&gt;" into ">".
 */
export const decodeHtml=(html) => {
  const parser = new DOMParser();
  const dom = parser.parseFromString(html, "text/html");
  return dom.documentElement.textContent;
}

/*
  Helper function that rounds up the number of subscribers to a subreddit to millions or thousands for easier reading.
  It receives a number as an argument and returns a string.
 */
export const formatNumber = (num) => {
  if (num >= 1000000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return `${num}`;
};