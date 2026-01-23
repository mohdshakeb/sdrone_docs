#!/bin/bash
# Find and delete all files starting with "._" or containing ".!*!._" recursively
find . -type f \( -name '._*' -o -name '.*!._*' \) -delete
echo "Cleanup complete: Removed macOS metadata (._) files."
