'use strict'

document.addEventListener('DOMContentLoaded', () => {
  const $settingsTableBody = document.getElementById('settingsTableBody')
  const $clearAll = document.getElementById('clearAll')

  fillSettings()

  $clearAll.addEventListener('click', () => {
    chrome.storage.local.clear(fillSettings)
  })

  function fillSettings() {
    while ($settingsTableBody.firstChild) {
      $settingsTableBody.removeChild($settingsTableBody.lastChild)
    }

    chrome.storage.local.get(null, currentData => {
      Object.entries(currentData).forEach(([origin, settings]) => {
        addSettingItem({ origin, ...settings })
      })
    })
  }

  function addSettingItem(data) {
    const { origin, enabled, scriptContent } = data

    const $row = document.createElement('tr')
    $settingsTableBody.appendChild($row)

    const $origin = document.createElement('td')
    $origin.innerHTML = origin
    $origin.className = 'bold'
    $row.appendChild($origin)

    const $enabled = document.createElement('td')
    $enabled.innerHTML = enabled ? 'enabled' : 'disabled'
    $enabled.className = 'underline'
    $row.appendChild($enabled)

    const $content = document.createElement('td')
    $content.innerHTML = scriptContent ?? ''
    $content.className = 'italic'
    $row.appendChild($content)

    const $action = document.createElement('td')
    $row.appendChild($action)

    const $button = document.createElement('button')
    $button.innerHTML = 'Delete!'
    $button.addEventListener('click', () => {
      chrome.storage.local.remove(origin, removeRow)
    })
    $action.appendChild($button)

    function removeRow() {
      $settingsTableBody.removeChild($row)
    }
  }
})
