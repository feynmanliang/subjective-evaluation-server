#!/usr/bin/env zsh


lines=("${(@f)$(azure storage blob list responses \
  | grep 8-1-bachbot-questions)}");
print $#lines
for line in $lines; do
  item=$(echo $line | awk '{ print $2 }')
  if [[ ! -e $item ]]; then
    azure storage blob download responses $item
  fi
done
