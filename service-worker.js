// chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
//   if (
//     changeInfo.status === "complete" &&
//     tab.url.includes("https://www.youtube.com/watch")
//   ) {
//     chrome.runtime.sendMessage({ message: tabId });
//   }
// });

let previousUrl;

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0].url) {
      previousUrl = tabs[0].url;
    }
  });
});

// change tab
chrome.tabs.onHighlighted.addListener(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      files: ["scripts/alert.js"],
    });
    function sendMessageToInjectedScript() {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "previousUrl",
        url: previousUrl,
      });
    }
    sendMessageToInjectedScript();
  });
});

// close tab
chrome.tabs.onRemoved.addListener(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      files: ["scripts/alert.js"],
    });
  });
});

// change video
chrome.runtime.onMessage.addListener((message) => {
  if (message && message.videoChanged) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ["scripts/alert.js"],
      });
    });
  }
});
