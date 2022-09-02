# Copyright (C) 2022 The Fake Slim Shady
#
# SPDX-License-Identifier: MIT

xset s off
echo "[DEV]: SCREENSAVER: OFF"
xset -dpms
echo "[DEV]: ENERGY STAR FEATURES: OFF"
xset s noblank
echo "[DEV]: BLANKING: OFF"
echo "[DEV]: APP: STARTING"
cd ~/SmartDisplayPi
npm start
