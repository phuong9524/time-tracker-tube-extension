const elementToObserve = document.querySelector(
  "#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > div.ytp-time-display.notranslate > span:nth-child(2) > span.ytp-time-current"
);

const observer = new MutationObserver(() => {
  // chrome.runtime.sendMessage({ action: "domChanged" });
  chrome.runtime.sendMessage({ fromContentScript: true });
});

observer.observe(elementToObserve, {
  characterData: true,
  attributes: true,
  childList: true,
  subtree: true,
});

chrome.runtime.onMessage.addListener(function (response) {
  if (response) {
    const watchTime = document.querySelector(".ytp-time-current");
    const duration = document.querySelector(".ytp-time-duration");
    const videoId = response.tabUrl.searchParams.get("v");

    fetchData(videoId, watchTime.innerText, duration.innerText);
    // let channelHandle = document.getElementById("channel-handle");

    // let title = channelHandle.getAttribute("title");

    // console.log(title);
  }
});

const fetchData = async (videoId, timeViewed, totalVideoTime) => {
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
      return response.json();
    })
    .then((data) => {
      return data;
    });
};

function createCustomAlert(message) {
  // Create a div element for the popup
  const popup = document.createElement("div");
  popup.style.position = "fixed";
  popup.style.top = "50%";
  popup.style.left = "50%";
  popup.style.transform = "translate(-50%, -50%)";
  popup.style.background = "white";
  popup.style.padding = "20px";
  popup.style.border = "1px solid #ccc";
  popup.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.1)";
  popup.style.zIndex = "9999";

  popup.innerHTML = `
    <h1>Custom Alert</h1>
    <p>${message}</p>
    <button onclick="document.body.removeChild(this.parentNode)">Close</button>
  `;

  document.body.appendChild(popup);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "open_dialog_box") {
    if (getStatus()) {
      createCustomAlert("cần xem hết để thực hiện hành động này");
    }
  }
});
