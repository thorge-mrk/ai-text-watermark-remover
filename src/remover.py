"""
Utility functions to remove invisible text watermarks and normalise typographic
characters introduced by large language models.
"""

from typing import Dict

INVISIBLE_CHARS = [
    "\u200b",  # zero width space
    "\u200c",  # zero width non‑joiner
    "\u200d",  # zero width joiner
    "\u2060",  # word joiner
    "\u00a0",  # non‑breaking space
    "\u202f",  # narrow non‑breaking space
    "\ufeff",  # zero width no‑break space/BOM
    "\u200e",  # left‑to‑right mark
    "\u200f",  # right‑to‑left mark
    "\u202a",  # left‑to‑right embedding
    "\u202b",  # right‑to‑left embedding
    "\u202c",  # pop directional formatting
    "\u202d",  # left‑to‑right override
    "\u202e",  # right‑to‑left override
]

TYPICAL_CHARS: Dict[str, str] = {
    "–": "-",  # en dash
    "—": "-",  # em dash
    "“": '"',  # left double quote
    "”": '"',  # right double quote
    "„": '"',  # double low‑9 quote
    "‟": '"',  # double high‑reversed‑9 quote
    "«": '"',
    "»": '"',
    "‘": "'",  # left single quote
    "’": "'",  # right single quote
    "‚": "'",  # single low‑9 quote
    "‛": "'",  # single high‑reversed‑9 quote
    "…": "...",  # ellipsis
    "\u00a0": " ",  # NBSP normalised to space if not removed
}


def remove_watermarks(text: str, remove_invisible: bool = True, replace_typical: bool = True) -> str:
    """
    Clean a string by removing invisible Unicode watermarks and normalising
    typographic characters.

    :param text: The input text to clean.
    :param remove_invisible: Whether to strip zero‑width and other invisible characters.
    :param replace_typical: Whether to replace typographic dashes and quotes with ASCII.
    :return: The cleaned text.
    """
    result = str(text)
    if remove_invisible:
        for char in INVISIBLE_CHARS:
            result = result.replace(char, "")
    if replace_typical:
        for char, replacement in TYPICAL_CHARS.items():
            result = result.replace(char, replacement)
    return result


__all__ = ["remove_watermarks"]
