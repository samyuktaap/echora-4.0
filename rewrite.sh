#!/bin/bash
git filter-branch --env-filter '
  if [ "$GIT_COMMITTER_NAME" = "Praveen" ] || [ "$GIT_COMMITTER_NAME" = "Acchu Masterpiece" ]; then
      export GIT_COMMITTER_NAME="samyuktaap"
  fi
  if [ "$GIT_AUTHOR_NAME" = "Praveen" ] || [ "$GIT_AUTHOR_NAME" = "Acchu Masterpiece" ]; then
      export GIT_AUTHOR_NAME="samyuktaap"
  fi
' --force -- --all
