window.onload = function() {
  
  chrome.windows.getCurrent(function (currentWindow) {
    chrome.tabs.query({active: true, windowId: currentWindow.id},
      function(activeTabs) {

        chrome.tabs.executeScript(
          activeTabs[0].id, {file: 'modifyTab.js', allFrames: true});

        chrome.tabs.insertCSS(activeTabs[0].id, {
            file: "style.css"
        });
      }
    );
  });
};
