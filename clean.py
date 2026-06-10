#!/usr/bin/env python3
"""Command line utility to clean text of invisible watermarks and typographic characters."""

import argparse
import sys
import os
from pathlib import Path

# Allow imports from ../src
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'src')))
from remover import remove_watermarks  # type: ignore


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Clean text of invisible watermarks and typographic characters."
    )
    parser.add_argument(
        "--file", type=Path, help="Path to input file. Reads from stdin if omitted."
    )
    parser.add_argument(
        "--no-invisibles",
        action="store_true",
        help="Do not remove invisible characters.",
    )
    parser.add_argument(
        "--no-typical",
        action="store_true",
        help="Do not normalise typographic characters.",
    )
    args = parser.parse_args()
    if args.file:
        data = args.file.read_text(encoding="utf-8")
    else:
        data = sys.stdin.read()
    result = remove_watermarks(
        data,
        remove_invisible=not args.no_invisibles,
        replace_typical=not args.no_typical,
    )
    sys.stdout.write(result)


if __name__ == "__main__":
    main()