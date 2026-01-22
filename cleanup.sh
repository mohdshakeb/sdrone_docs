#!/bin/bash
# Find and delete all files starting with "._" recursively from the current directory
find . -type f -name '._*' -delete
echo "Cleanup complete: Removed macOS metadata (._) files."
