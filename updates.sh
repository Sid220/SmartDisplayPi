#!/bin/bash
FILE=~/.config/autostart/lxpolkit.desktop
if ! test -f "$FILE"; then
    sudo apt install lxpolkit policykit-1 -y
    echo "[Desktop Entry]
     Name=LXPolKit
     Exec=/bin/lxpolkit
     Terminal=false
     Type=Application" | sudo tee ~/.config/autostart/lxpolkit.desktop
fi

