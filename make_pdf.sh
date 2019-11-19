#! /bin/bash
output="$1"
chrome="$2"

if [ -z $output ]; then
  output="resume.pdf"
  echo "No output path given, outputting to $output"
fi

if [ -z $chrome ]; then
  chrome="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
fi

"$chrome" --headless --disable-gpu --print-to-pdf="$output" resume.html
