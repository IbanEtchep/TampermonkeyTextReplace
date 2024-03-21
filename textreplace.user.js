// ==UserScript==
// @name         TextReplace
// @namespace    http://tampermonkey.net/
// @version      2024-03-21
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
    if (node.nodeType === 3) { // Type 3 est un Node.TEXT_NODE
      let originalValue = node.nodeValue;
      let modifiedValue = originalValue;
      replacements.forEach(({ pattern, replacement }) => {
        modifiedValue = modifiedValue.replace(pattern, replacement);
      });

      if (originalValue !== modifiedValue) {
        node.nodeValue = modifiedValue;
      }

    } else if (node.nodeType === 1 && !node.hasAttribute('data-processed')) { // Type 1 est un Node.ELEMENT_NODE
      if (!['SCRIPT', 'STYLE'].includes(node.tagName)) {
        replaceText(node);
        node.setAttribute('data-processed', 'true');
      }
    }
  });
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
