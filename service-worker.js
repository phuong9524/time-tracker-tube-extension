let id;

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (
    changeInfo.status === "complete" &&
    tab.url.includes("https://www.youtube.com/watch")
  ) {
    id = tabId;
    chrome.runtime.sendMessage({ message: id });
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.fromContentScript) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs.length > 0) {
        const activeTab = tabs[0];
        const responseData = {
          tabId: activeTab.id,
          tabUrl: activeTab.url,
        };
        chrome.tabs.sendMessage(sender.tab.id, responseData);
      }
    });
  }
});

chrome.tabs.onActivated.addListener(function (activeInfo) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: "open_dialog_box" });
  });
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, updatedTab) {
  // if (tabId === tab.id && changeInfo.status === "complete") {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: "open_dialog_box" });
  });
  // }
});

// chrome.webNavigation.onHistoryStateUpdated.addListener(function (details) {
//   console.log(details);
//   if (details.url.startsWith("https://www.youtube.com/watch")) {
//     chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//       chrome.tabs.sendMessage(tabs[0].id, { action: "open_dialog_box" });
//     });
//   }
// });
