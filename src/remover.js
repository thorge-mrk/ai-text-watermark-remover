/**
 * Remove invisible watermarks and normalise typographic characters.
 *
 * @param {string} text Input text to clean.
 * @param {object} [options] Optional settings.
 * @param {boolean} [options.removeInvisible=true] Remove invisible Unicode characters entirely.
 * @param {boolean} [options.replaceTypical=true] Replace typographic quotes/dashes with ASCII.
 * @returns {string} Cleaned text.
 */
function removeWatermarks(text, options = {}) {
  const { removeInvisible = true, replaceTypical = true } = options;
  let result = String(text);
  if (removeInvisible) {
    // List of invisible characters to strip
    const invisibles = [
      '\u200B', // zero width space
      '\u200C', // zero width non‑joiner
      '\u200D', // zero width joiner
      '\u2060', // word joiner
      '\u00A0', // non‑breaking space
      '\u202F', // narrow non‑breaking space
      '\uFEFF', // zero width no‑break space/BOM
      '\u200E', // left‑to‑right mark
      '\u200F', // right‑to‑left mark
      '\u202A', // left‑to‑right embedding
      '\u202B', // right‑to‑left embedding
      '\u202C', // pop directional formatting
      '\u202D', // left‑to‑right override
      '\u202E'  // right‑to‑left override
    ];
    invisibles.forEach(char => {
      const re = new RegExp(char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      result = result.replace(re, '');
    });
  }
  if (replaceTypical) {
    // Map of typographic characters to their ASCII replacements
    const typical = {
      '–': '-', // en dash
      '—': '-', // em dash
      '“': '"', // left double quote
      '”': '"', // right double quote
      '„': '"', // double low‑9 quote
      '‟': '"', // double high‑reversed‑9 quote
      '«': '"',
      '»': '"',
      '‘': "'", // left single quote
      '’': "'", // right single quote
      '‚': "'", // single low‑9 quote
      '‛': "'", // single high‑reversed‑9 quote
      '…': '...', // ellipsis
      '\u00A0': ' ' // NBSP normalised to regular space (if not removed)
    };
    Object.keys(typical).forEach(char => {
      const re = new RegExp(char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      result = result.replace(re, typical[char]);
    });
  }
  return result;
}

module.exports = {
  removeWatermarks
};
