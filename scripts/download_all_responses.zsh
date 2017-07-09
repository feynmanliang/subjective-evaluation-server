#!/usr/bin/env zsh


lines=("${(@f)$(az storage blob list -c responses \
  | grep 8-1-bachbot-questions)}");
print $#lines
for line in $lines; do
  item=$(echo $line | awk '{ print $2 }')
  if [[ ! -e $item ]]; then
    az storage blob download -c responses -n $item -f $item
  fi
done
