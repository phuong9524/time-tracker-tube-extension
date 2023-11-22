let currentId;
let currentUserChannel;

// Limit times call API
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

const fetchData = async (
  videoId,
  videoUrl,
  videoTitle,
  username,
  userChannel,
  timeViewed,
  totalVideoTime
) => {
  const response = await fetch("http://localhost:8080/api/tracking", {
    method: "POST",
    body: JSON.stringify({
      videoId,
      videoUrl,
      videoTitle,
      username,
      userChannel,
      timeViewed,
      totalVideoTime,
    }),
    headers: {
      "Content-type": "application/json; charset-UFT-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST,PATCH,OPTIONS",
    },
  });
  return response.json;
};

function getDOMbyClass(className) {
  return Array.from(
    document.getElementsByClassName(className),
    (el) => el.innerHTML
  );
}

function getDombyId(id) {
  return document.getElementById(id).innerText;
}

async function getData(tabId) {
  const tabs = await chrome.tabs.query({ active: true });
  const url = new URL(tabs[0].url);

  const videoId = url.searchParams.get("v");

  const currentTime = await chrome.scripting.executeScript({
    target: { tabId: tabId },
    func: getDOMbyClass,
    args: ["ytp-time-current"],
  });

  const duration = await chrome.scripting.executeScript({
    target: { tabId: tabId },
    func: getDOMbyClass,
    args: ["ytp-time-duration"],
  });

  const title = await chrome.scripting.executeScript({
    target: { tabId: tabId },
    func: () => document.title,
  });

  const username = await chrome.scripting.executeScript({
    target: { tabId: tabId },
    func: getDombyId,
    args: ["account-name"],
  });

  const userChannel = await chrome.scripting.executeScript({
    target: { tabId: tabId },
    func: getDombyId,
    args: ["channel-handle"],
  });

  const watchTime = currentTime[0].result[0];
  const durationTime = duration[0].result[0];
  const titleVideo = title[0].result;

  document.getElementById("title").innerText = titleVideo.split(" - YouTube");
  document.getElementById(
    "watchTime"
  ).innerText = `${watchTime} / ${durationTime}`;

  debounce(
    fetchData(
      videoId,
      url,
      titleVideo.split(" - YouTube")[0],
      username[0].result,
      userChannel[0].result,
      watchTime,
      durationTime
    ),
    2000
  );

  localStorage.setItem("userChannel", userChannel[0].result);
}

chrome.runtime.onMessage.addListener(function (request) {
  if (request.message) getData(request.message);
});

const historyButton = document.getElementById("historybtn");
historyButton.addEventListener("click", function () {
  window.open("history.html", "Your last watch", "width=700,height=700");
});
