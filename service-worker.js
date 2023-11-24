// chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
//   if (
//     changeInfo.status === "complete" &&
//     tab.url.includes("https://www.youtube.com/watch")
//   ) {
//     chrome.runtime.sendMessage({ message: tabId });
//   }
// });

let previousUrl = {};
let isInjected = false;

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === "complete" &&
    tab.url.includes("https://www.youtube.com/watch")
  ) {
    previousUrl[tabId] = tab.url;
    console.log(previousUrl);
  }
});

chrome.tabs.onActivated.addListener(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0].url !== Object.values(previousUrl).slice(-1)[0]) {
      if (!isInjected) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          files: ["scripts/alert.js"],
        });
      }

      function sendMessageToInjectedScript() {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "previousUrl",
          url: previousUrl,
        });
      }
      sendMessageToInjectedScript();
    }
  });
});

// close tab
chrome.tabs.onRemoved.addListener(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!isInjected) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ["scripts/alert.js"],
      });
    }
    function sendMessageToInjectedScript() {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "previousUrl",
        url: previousUrl,
      });
    }
    sendMessageToInjectedScript();
  });
});

// change video
chrome.runtime.onMessage.addListener((message) => {
  if (message && message.videoChanged) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!isInjected) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          files: ["scripts/alert.js"],
        });
      }
      function sendMessageToInjectedScript() {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "changeVideo",
        });
      }
      sendMessageToInjectedScript();
    });
  }
});
