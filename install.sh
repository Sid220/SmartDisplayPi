#!/bin/bash
cd ~/ || exit
echo "  ______                                       __      _______   __                      __                      _______   __ 
 /      \                                     /  |    /       \ /  |                    /  |                    /       \ /  |
/$$$$$$  | _____  ____    ______    ______   _$$ |_   $$$$$$$  |$$/   _______   ______  $$ |  ______   __    __ $$$$$$$  |$$/ 
$$ \__$$/ /     \/    \  /      \  /      \ / $$   |  $$ |  $$ |/  | /       | /      \ $$ | /      \ /  |  /  |$$ |__$$ |/  |
$$      \ $$$$$$ $$$$  | $$$$$$  |/$$$$$$  |$$$$$$/   $$ |  $$ |$$ |/$$$$$$$/ /$$$$$$  |$$ | $$$$$$  |$$ |  $$ |$$    $$/ $$ |
 $$$$$$  |$$ | $$ | $$ | /    $$ |$$ |  $$/   $$ | __ $$ |  $$ |$$ |$$      \ $$ |  $$ |$$ | /    $$ |$$ |  $$ |$$$$$$$/  $$ |
/  \__$$ |$$ | $$ | $$ |/$$$$$$$ |$$ |        $$ |/  |$$ |__$$ |$$ | $$$$$$  |$$ |__$$ |$$ |/$$$$$$$ |$$ \__$$ |$$ |      $$ |
$$    $$/ $$ | $$ | $$ |$$    $$ |$$ |        $$  $$/ $$    $$/ $$ |/     $$/ $$    $$/ $$ |$$    $$ |$$    $$ |$$ |      $$ |
 $$$$$$/  $$/  $$/  $$/  $$$$$$$/ $$/          $$$$/  $$$$$$$/  $$/ $$$$$$$/  $$$$$$$/  $$/  $$$$$$$/  $$$$$$$ |$$/       $$/ 
                                                                              $$ |                    /  \__$$ |              
                                                                              $$ |                    $$    $$/               
                                                                              $$/                      $$$$$$/                "

BRANCH="alpha-branch"
sudo apt update && sudo apt upgrade -y
if [ $? != 0 ]; then
    echo "There was an error updating. Look above for more info."
    echo -n "Would you like to continue anyway? (y/N): "
    read continue7
    if [ "$continue7" = "y" ]; then
        echo "Continuing anyway..."
    else
        exit 1
    fi
fi
sudo apt-get install xserver-xorg-core --no-install-recommends --no-install-suggests -y
if [ $? != 0 ]; then
    echo "There was an error installing X. Look above for more info."
    echo -n "Would you like to continue anyway? (y/N): "
    read continue2
    if [ "$continue2" = "y" ]; then
        echo "Continuing anyway..."
    else
        exit 1
    fi
fi
sudo apt install npm openbox xinit slim dbus-x11 network-manager -y
if [ $? != 0 ]; then
    echo "There was an error installing Slim, NetworkManager, OpenBox, Xinit, or NPM. Look above for more info."
    echo -n "Would you like to continue anyway? (y/N): "
    read continue3
    if [ "$continue3" = "y" ]; then
        echo "Continuing anyway..."
    else
        exit 1
    fi
fi
sudo apt install gnome-control-center --no-install-recommends --no-install-suggests -y
if [ $? != 0 ]; then
    echo "There was an error installing GNOME Control Centre. Look above for more info."
    echo -n "Would you like to continue anyway? (y/N): "
    read continue4
    if [ "$continue4" = "y" ]; then
        echo "Continuing anyway..."
    else
        exit 1
    fi
fi
git clone -b "$BRANCH" https://github.com/Sid220/SmartDisplayPi.git
if [ $? != 0 ]; then
    echo "There was an error cloning the git repo. Look above for more info. It could be you are not connected to the internet."
    echo -n "Would you like to continue anyway? (y/N): "
    read continue5
    if [ "$continue5" = "y" ]; then
        echo "Continuing anyway..."
    else
        exit 1
    fi
fi
cd ~/SmartDisplayPi
npm install
if [ $? != 0 ]; then
    echo "There was an error installing the required NPM packages. Look above for more info."
    echo -n "Would you like to continue anyway? (y/N): "
    read continue6
    if [ "$continue6" = "y" ]; then
        echo "Continuing anyway..."
    else
        exit 1
    fi
fi
mkdir ~/.config/autostart
if ! bash ./updates.sh; then
    echo "There was an error installing other packages. Look above for more info."
    echo -n "Would you like to continue anyway? (y/N): "
    read continue8
    if [ "$continue8" = "y" ]; then
        echo "Continuing anyway..."
    else
        exit 1
    fi
fi
echo "[Desktop Entry]
Name=SmartDisplayPi
Exec=bash -c 'cd ~/SmartDisplayPi && ./kiosk.sh'
Terminal=false
Type=Application" | sudo tee ~/.config/autostart/smartdisplay.desktop
echo "[Desktop Entry]
Name=LXPolKit
Exec=bash -c 'lxpolkit'
Terminal=false
Type=Application" | sudo tee ~/.config/autostart/lxpolkit.desktop
sudo setcap CAP_SYS_BOOT=+ep /usr/bin/node
RAWSLIMCONF=$(<assets/slim_CURSOR.conf)
echo "${RAWSLIMCONF/\[SMARTDISPLAYPI_USER_HERE_YOUR_MOM\]/"$USER"}" | sudo tee /etc/slim.conf > /dev/null
echo "Rebooting..."
sudo reboot
