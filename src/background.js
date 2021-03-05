'use strict'

chrome.tabs.onUpdated.addListener(function (_tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && tab.active) {
    const origin = new URL(tab.url).origin

    chrome.storage.local.get(origin, data => {
      const { enabled = false, scriptContent = '' } = data[origin] ?? {}

      if (enabled && scriptContent) {
        chrome.tabs.executeScript({
          code: scriptContent
        })
      }
    })
  }
})
