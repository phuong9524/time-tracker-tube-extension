let videoId;
let videoStatus;
let lastVideoUrl = "";

const setStatus = async (videoId, timeViewed, totalVideoTime) => {
  const response = await fetch(
    `http://localhost:8080/api/video/${videoId}/watch-status`,
    {
      method: "PUT",
      body: JSON.stringify({
        videoId,
        timeViewed,
        totalVideoTime,
      }),
      headers: {
        "Content-type": "application/json; charset-UFT-8",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, PATCH, OPTIONS, PUT",
      },
    }
  );
  return response.json;
};

const getStatus = async (videoId) => {
  await fetch(`http://localhost:8080/api/video/${videoId}/watch-status`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.text();
    })
    .then((textData) => {
      videoStatus = textData;
    });
};

function getParameterByName(name, url) {
  if (!url) {
    url = window.location.href;
  }
  name = name.replace(/[[\]]/g, "\\$&");
  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
  const results = regex.exec(url);
  if (!results) {
    return null;
  }
  if (!results[2]) {
    return "";
  }
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// observe time watch change
const elementToObserve = document.querySelector(
  "#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > div.ytp-time-display.notranslate > span:nth-child(2) > span.ytp-time-current"
);

const observeWatchTimeChange = new MutationObserver(() => {
  const watchTime = document.querySelector(".ytp-time-current");
  const duration = document.querySelector(".ytp-time-duration");
  const title = document.title.split(" - YouTube")[0];
  const currentURL = window.location.href;
  videoId = getParameterByName("v", currentURL);

  setStatus(videoId, watchTime.innerText, duration.innerText);
});

observeWatchTimeChange.observe(elementToObserve, {
  characterData: true,
  attributes: true,
  childList: true,
  subtree: true,
});

// observe change video
function observeVideoChanges() {
  const videoElement = document.querySelector("video");
  if (videoElement && videoElement.src !== lastVideoUrl) {
    lastVideoUrl = videoElement.src;
    getStatus(videoId);
    videoElement.pause();
    if (videoStatus === "INCOMPLETE")
      chrome.runtime.sendMessage({ videoChanged: true });
  }
}

// Listen for clicks on the YouTube page that might indicate a change in the video
document.addEventListener("click", () => {
  observeVideoChanges();
});

const observerVideoChange = new MutationObserver(observeVideoChanges);

observerVideoChange.observe(document.body, {
  subtree: true,
  childList: true,
  attributes: true,
  attributeFilter: ["src"],
});
