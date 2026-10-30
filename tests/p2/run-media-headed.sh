#!/bin/sh
set -eu
Xvfb :99 -screen 0 1600x1000x24 -nolisten tcp >/tmp/p2-media-xvfb.log 2>&1 &
xpid=$!
trap 'kill "$xpid" 2>/dev/null || true' EXIT
n=0
until test -S /tmp/.X11-unix/X99; do
  n=$((n+1))
  test "$n" -lt 100 || exit 70
  sleep .1
done
DISPLAY=:99 node "$@"
