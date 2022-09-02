#!/bin/bash

# Copyright (C) 2022 The Fake Slim Shady
#
# SPDX-License-Identifier: MIT

# updates.sh - A backend for ./update.sh
if [ "$1" != "CIRCLECI" ]; then
  FILE=~/.config/autostart/lxpolkit.desktop
  if ! test -f "$FILE"; then
      sudo apt install lxpolkit policykit-1 -y
      echo "[Desktop Entry]
       Name=LXPolKit
       Exec=/bin/lxpolkit
       Terminal=false
       Type=Application" | tee ~/.config/autostart/lxpolkit.desktop
  fi
fi
sudo apt install icnsutils
sudo apt-get install subversion
