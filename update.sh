#!/bin/bash

# Copyright (C) 2022 The Fake Slim Shady
#
# SPDX-License-Identifier: MIT

# update.sh - A frontend for ./updates.sh
echoerr() { printf "%s\n" "$*" >&2; }
ERR=0
echo "[DEV]: Fetching latest update..."
if ! git pull ; then
    echoerr "There was an error fetching the git repo. Look above for more info. It could be you are not connected to the internet."
    ERR=1
fi
echo "[DEV]: Updating and installing necessary NPM packages..."
if ! npm install ; then
    echoerr "There was an error installing/updating the required NPM packages. Look above for more info."
    ERR=1
fi
echo "[DEV]: Updating system (aptitude) packages..."
if [ "$1" != "CIRCLECI" ]; then
  if ! pkexec apt update && apt upgrade -y ; then
      echoerr "There was an error updating. Look above for more info."
      ERR=1
  fi
else
  if ! sudo apt update && apt upgrade -y ; then
      echoerr "There was an error updating. Look above for more info."
      ERR=1
  fi
fi
echo "[DEV]: Installing system (aptitude) packages..."
if [ "$1" != "CIRCLECI" ]; then
  if ! bash ./updates.sh; then
      echoerr "There was an error updating. Look above for more info."
      ERR=1
  fi
else
  if ! bash ./updates.sh CIRCLECI; then
      echoerr "There was an error updating. Look above for more info."
      ERR=1
  fi
fi
if [ $ERR = 1 ]; then
  echoerr "[DEV]: There was an error."
  exit 1
else
  echo "[DEV]: Update complete."
  exit 0
fi
