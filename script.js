// Character tables used by the UI.  This mirrors the logic in src/remover.js.
const invisibleChars = {
  '\u202f': { name: 'Narrow No-Break Space' },
  '\u200b': { name: 'Zero Width Space' },
  '\u2060': { name: 'Word Joiner' },
  '\u00a0': { name: 'Non-Breaking Space' },
  '\u200c': { name: 'Zero Width Non-Joiner' },
  '\u200d': { name: 'Zero Width Joiner' },
  '\u200e': { name: 'Left-to-Right Mark' },
  '\u200f': { name: 'Right-to-Left Mark' },
  '\u202a': { name: 'Left-to-Right Embedding' },
  '\u202b': { name: 'Right-to-Left Embedding' },
  '\u202c': { name: 'Pop Directional Formatting' },
  '\u202d': { name: 'Left-to-Right Override' },
  '\u202e': { name: 'Right-to-Left Override' },
  '\uFEFF': { name: 'Zero Width No-Break Space' }
};

const aiTypicalChars = {
  '–': { name: 'En Dash', replace: '-' },
  '—': { name: 'Em Dash', replace: '-' },
  '“': { name: 'Left Double Quote', replace: '"' },
  '”': { name: 'Right Double Quote', replace: '"' },
  '‘': { name: 'Left Single Quote', replace: "'" },
  '’': { name: 'Right Single Quote', replace: "'" },
  '„': { name: 'Double Low-9 Quotation Mark', replace: '"' },
  '‚': { name: 'Single Low-9 Quotation Mark', replace: "'" },
  '…': { name: 'Ellipsis', replace: '...' }
};

let currentText = '';
let foundInvisible = {};
let foundTypical = {};
let analyzed = false;

// Compute a text offset given a DOM node and offset
function getTextOffset(root, node, offset) {
  let pos = 0;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
  let currentNode = walker.nextNode();
  while (currentNode) {
    if (currentNode === node) {
      return pos + offset;
    }
    pos += currentNode.textContent.length;
    currentNode = walker.nextNode();
  }
  return pos;
}

// Restore a selection given text offsets
function setCaretPosition(el, start, end) {
  const sel = window.getSelection();
  sel.removeAllRanges();
  const range = document.createRange();
  let pos = 0;
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
  let node = walker.nextNode();
  while (node) {
    const len = node.textContent.length;
    if (pos + len >= start) {
      range.setStart(node, start - pos);
      break;
    }
    pos += len;
    node = walker.nextNode();
  }
  // Determine the end range
  if (end !== start) {
    pos = 0;
    const walker2 = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
    let node2 = walker2.nextNode();
    while (node2) {
      const len2 = node2.textContent.length;
      if (pos + len2 >= end) {
        range.setEnd(node2, end - pos);
        break;
      }
      pos += len2;
      node2 = walker2.nextNode();
    }
  } else {
    range.collapse(true);
  }
  sel.addRange(range);
}

// Highlight suspicious characters in the content editable
function highlightText() {
  const el = document.getElementById('inputText');
  const raw = el.innerText;
  el.classList.toggle('empty', raw.length === 0);
  if (!analyzed) return;
  // Save the current selection
  const sel = window.getSelection();
  let startOffset = 0;
  let endOffset = 0;
  if (sel.rangeCount > 0) {
    const range = sel.getRangeAt(0);
    startOffset = getTextOffset(el, range.startContainer, range.startOffset);
    endOffset = getTextOffset(el, range.endContainer, range.endOffset);
  }
  // Build highlighted HTML
  let html = '';
  for (const c of raw) {
    if (invisibleChars[c]) {
      html += `<span class="invisible">${c === ' ' ? '␣' : c}</span>`;
    } else if (aiTypicalChars[c]) {
      html += `<span class="typical">${c}</span>`;
    } else {
      html += c;
    }
  }
  el.innerHTML = html;
  // Restore selection
  setCaretPosition(el, startOffset, endOffset);
}

document.getElementById('inputText').addEventListener('input', () => highlightText());

function analyzeText() {
  const input = document.getElementById('inputText').innerText;
  const success = document.getElementById('successMsg');
  if (!input) {
    success.textContent = 'Bitte Text eingeben!';
    success.style.display = 'block';
    return;
  }
  document.getElementById('analyzeBtn').style.display = 'none';
  currentText = input;
  foundInvisible = {};
  foundTypical = {};
  for (const c of input) {
    if (invisibleChars[c]) {
      foundInvisible[c] = (foundInvisible[c] || 0) + 1;
    }
    if (aiTypicalChars[c]) {
      foundTypical[c] = (foundTypical[c] || 0) + 1;
    }
  }
  analyzed = true;
  highlightText();
  showResults();
}

function showResults() {
  const result = document.getElementById('result');
  let html = '';
  const hasInvisible = Object.keys(foundInvisible).length > 0;
  const hasTypical = Object.keys(foundTypical).length > 0;
  if (!hasInvisible && !hasTypical) {
    result.innerHTML =
      '<div style="text-align:center;color:#4CAF50;font-size:18px;padding:20px;">Keine verdächtigen Zeichen gefunden!</div>';
    result.style.display = 'block';
    return;
  }
  if (hasInvisible) {
    html +=
      '<div class="char-section"><div class="section-title">Gefundene unsichtbare Zeichen:</div><div class="char-list">';
    for (const c in foundInvisible) {
      html += `<div class="char-item"><input type="checkbox" class="charCheck" value="${c}" checked><span>${
        invisibleChars[c].name
      }</span><span class="char-code">U+${c.charCodeAt(0).toString(16).toUpperCase()}</span><span class="char-count">${
        foundInvisible[c]
      }</span></div>`;
    }
    html += '</div></div>';
  }
  if (hasTypical) {
    html +=
      '<div class="char-section"><div class="section-title">Gefundene KI-typische Zeichen:</div><div class="char-list">';
    for (const c in foundTypical) {
      html += `<div class="char-item"><input type="checkbox" class="charCheck" value="${c}" checked><span>${
        aiTypicalChars[c].name
      }</span><span class="char-code">→ ${
        aiTypicalChars[c].replace
      }</span><span class="char-count">${foundTypical[c]}</span></div>`;
    }
    html += '</div></div>';
  }
  html +=
    '<div class="action-section"><button class="process-btn" onclick="processText()">Text bereinigen</button></div>';
  result.innerHTML = html;
  result.style.display = 'block';
}

function processText() {
  let cleaned = currentText;
  let removedCount = 0;
  let normalisedCount = 0;
  document.querySelectorAll('.charCheck').forEach((chk) => {
    if (chk.checked) {
      const char = chk.value;
      const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      if (invisibleChars[char]) {
        const re = new RegExp(escapeRegex(char), 'g');
        const matches = cleaned.match(re) || [];
        removedCount += matches.length;
        cleaned = cleaned.replace(re, '');
      }
      if (aiTypicalChars[char]) {
        const re = new RegExp(escapeRegex(char), 'g');
        const matches = cleaned.match(re) || [];
        normalisedCount += matches.length;
        cleaned = cleaned.replace(re, aiTypicalChars[char].replace);
      }
    }
  });
  // Update the editable field and reset UI
  const el = document.getElementById('inputText');
  el.innerText = cleaned;
  highlightText();
  document.getElementById('result').style.display = 'none';
  const copyBtn = document.getElementById('copyBtn');
  copyBtn.style.display = 'inline-block';
  const success = document.getElementById('successMsg');
  success.textContent = `Text wurde bereinigt. ${
    removedCount > 0 ? removedCount + ' unsichtbare Zeichen entfernt. ' : ''
  }${normalisedCount > 0 ? normalisedCount + ' Zeichen normalisiert.' : ''}`;
  success.style.display = 'block';
}

function copyCleanedText() {
  const el = document.getElementById('inputText');
  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(el);
  selection.removeAllRanges();
  selection.addRange(range);
  try {
    document.execCommand('copy');
    const success = document.getElementById('successMsg');
    success.textContent = 'Text wurde kopiert.';
    success.style.display = 'block';
  } catch (err) {
    console.error('Fehler beim Kopieren:', err);
  }
  selection.removeAllRanges();
}

function clearField() {
  const el = document.getElementById('inputText');
  el.innerText = '';
  highlightText();
  document.getElementById('result').style.display = 'none';
  document.getElementById('copyBtn').style.display = 'none';
  document.getElementById('successMsg').style.display = 'none';
  document.getElementById('analyzeBtn').style.display = 'inline-block';
  analyzed = false;
}

// Update theme colour on load and when system theme changes
function updateTheme() {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (prefersDark) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
  const meta = document.getElementById('themeColor');
  if (meta) {
    meta.content = prefersDark ? '#121212' : '#f5f5f5';
  }
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateTheme);

// Save state to localStorage so the UI can be restored after a refresh
function saveState() {
  const state = {
    text: document.getElementById('inputText').innerText,
    analyzed,
    foundInvisible,
    foundTypical,
    resultDisplayed: document.getElementById('result').style.display === 'block',
    copyBtnDisplayed: document.getElementById('copyBtn').style.display === 'inline-block',
    successMsg: document.getElementById('successMsg').textContent,
    successDisplayed: document.getElementById('successMsg').style.display === 'block',
    analyzeBtnDisplayed: document.getElementById('analyzeBtn').style.display
  };
  localStorage.setItem('aiWatermarkState', JSON.stringify(state));
}

window.addEventListener('beforeunload', saveState);

window.addEventListener('load', () => {
  updateTheme();
  const state = JSON.parse(localStorage.getItem('aiWatermarkState') || 'null');
  if (state) {
    document.getElementById('inputText').innerText = state.text;
    analyzed = state.analyzed;
    foundInvisible = state.foundInvisible || {};
    foundTypical = state.foundTypical || {};
    if (state.resultDisplayed) {
      showResults();
    }
    document.getElementById('copyBtn').style.display = state.copyBtnDisplayed ? 'inline-block' : 'none';
    const success = document.getElementById('successMsg');
    success.textContent = state.successMsg || '';
    success.style.display = state.successDisplayed ? 'block' : 'none';
    document.getElementById('analyzeBtn').style.display = state.analyzeBtnDisplayed || 'inline-block';
    highlightText();
  }
});