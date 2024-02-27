// ==UserScript==
// @name         TextReplace
// @namespace    http://tampermonkey.net/
// @version      2024-02-20
// @description  Remplace du texte sur une page web
// @author       Iban
// @match        https://*.atlassian.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atlassian.net
// @grant        none
// @downloadURL  https://github.com/IbanEtchep/TampermonkeyTextReplace/raw/main/textreplace.user.js
// @updateURL    https://github.com/IbanEtchep/TampermonkeyTextReplace/raw/main/textreplace.user.js
// ==/UserScript==

(function () {
  'use strict'

  const replacements = [
    {
      pattern: /En tant qu'\s*utilisateur\s*\(\s*administrat(eur|ion) (de|du) site\s*\)\s*,? (je peux|je souhaite)?(\s*pouvoir)?\s*/gi,
      replacement: "Admin - "
    },
    {
      pattern: /En tant qu'\s*utilisateur\s*,? (je peux|je souhaite)?(\s*pouvoir)?\s*/gi,
      replacement: "User - "
    }
  ];

  function replaceText(element) {
    if (!element || !element.childNodes) return

    element.childNodes.forEach((node) => {
      // Type 3 est un Node.TEXT_NODE
      if (node.nodeType === 3) {
        let value = node.nodeValue
        replacements.forEach(({ pattern, replacement }) => {
          value = value.replace(pattern, replacement);
        });
        node.nodeValue = value
      } else if (node.nodeType === 1) { // Type 1 est un Node.ELEMENT_NODE
        if (!['SCRIPT', 'STYLE'].includes(node.tagName)) {
          replaceText(node)
        }
      }
    })
  }

  replaceText(document.body)

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        replaceText(node)
      })
    })
  })

  const config = {
    childList: true,
    subtree: true
  }

  observer.observe(document.body, config)
})()
