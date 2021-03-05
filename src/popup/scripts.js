'use strict'

document.addEventListener('DOMContentLoaded', () => {
  const $textArea = document.getElementById('textArea')
  const $switchInput = document.getElementById('switchInput')
  const $originText = document.getElementById('originText')
  const $saveScriptButton = document.getElementById('saveScript')
  const $settingsTrigger = document.getElementById('settingsTrigger')

  // Wait until tab url to resolve
  setTimeout(() => {
    withCurrentOrigin(origin => {
      updateInputs(origin)
    })
  }, 0)

  $switchInput.addEventListener('change', e => {
    updateStorageData({ enabled: e.target.checked || false })
  })

  $saveScriptButton.addEventListener('click', () => {
    updateStorageData({ scriptContent: $textArea.value })
  })

  $settingsTrigger.addEventListener('click', () => {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage()
    } else {
      window.open(chrome.runtime.getURL('options.html'))
    }
  })

  function withCurrentOrigin(callbackFn) {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      const origin = new URL(tab.url).origin

      callbackFn(origin)
    })
  }

  function updateInputs(origin) {
    chrome.storage.local.get(origin, data => {
      const { enabled = false, scriptContent = '' } = data[origin] ?? {}

      $switchInput.checked = enabled
      $textArea.value = scriptContent
      $originText.innerHTML = origin
    })
  }

  function updateStorageData(newData) {
    withCurrentOrigin(origin => {
      chrome.storage.local.get(origin, currentData => {
        chrome.storage.local.set({ [origin]: { ...currentData[origin], ...newData } })
      })
    })
  }
})
