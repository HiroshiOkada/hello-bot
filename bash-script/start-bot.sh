#!/bin/bash

if [ -z "$TMUX" ]; then
  tmux new-session \; split-window -v \; split-window -v \; split-window -h -t1 \; split-window -h -t2 \
    \; send-keys -t 1 'npm run front' Enter \
    \; send-keys -t 2 'npm run job' Enter \
    \; send-keys -t 3 'npm run job' Enter \
    \; send-keys -t 4 'npm run job' Enter \
    \; select-pane -t 0
else
  tmux split-window -v \; split-window -v -t1 \; split-window -h -t1 \; split-window -h -t2 \
    \; send-keys -t 1 'npm run front' Enter \
    \; send-keys -t 2 'npm run job' Enter \
    \; send-keys -t 3 'npm run job' Enter \
    \; send-keys -t 4 'npm run job' Enter \
    \; select-pane -t 0
fi
