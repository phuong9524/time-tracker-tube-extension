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
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "previousUrl") {
    const previousUrl = Object.values(message.url).slice(-1)[0];
    videoId = getParameterByName("v", previousUrl);
    console.log("count");
    getStatus(videoId).then((videoStatus) => {
      if (videoStatus === "INCOMPLETE") {
        alert("Cần xem hết để thực hiện hành động này");
      }
    });
  }
});
