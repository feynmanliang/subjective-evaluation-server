#!/usr/bin/env zsh


lines=("${(@f)$(az storage blob list -c responses | jq -r '.[] | .name' | grep 8-1-bachbot-questions)}")
for item in $lines; do
  if [[ ! -e $item ]]; then
    touch $item
    az storage blob download -c responses -n $item -f $item
  fi
done
