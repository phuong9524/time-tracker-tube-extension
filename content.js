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
  videoStatus = await response.text();
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

const getStatus = async (videoId) => {
  return fetch(`http://localhost:8080/api/video/${videoId}/watch-status`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.text();
    })
    .then((textData) => {
      return textData;
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

window.alert = function (message) {
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.left = "0";
  overlay.style.top = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.zIndex = "9999";

  const modal = document.createElement("div");
  modal.style.background = "white";
  modal.style.padding = "20px";
  modal.style.border = "1px solid #ccc";
  modal.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.1)";
  modal.style.maxWidth = "80%";
  modal.style.textAlign = "center";

  const closeButton = document.createElement("button");
  closeButton.textContent = "OK";
  closeButton.style.marginTop = "10px";
  closeButton.addEventListener("click", function () {
    document.body.removeChild(overlay);
  });

  const paragraph = document.createElement("p");
  paragraph.textContent = message;

  modal.appendChild(paragraph);
  modal.appendChild(closeButton);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
};

// observe change video
function observeVideoChanges() {
  const videoElement = document.querySelector("video");
  if (videoElement && videoElement.src !== lastVideoUrl) {
    lastVideoId = getParameterByName("v", lastVideoUrl);
    getStatus(lastVideoId).then((videoStatus) => {
      videoElement.pause();
      if (videoStatus === "INCOMPLETE") {
        videoElement.pause();
        alert("Cần xem hết để thực hiện hành động này");
      }
    });
    lastVideoUrl = videoElement.src;
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
