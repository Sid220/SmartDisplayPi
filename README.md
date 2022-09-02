<!--
Copyright (C) 2022 The Fake Slim Shady

SPDX-License-Identifier: MIT
-->

# SmartDisplayPi
[![REUSE status](https://api.reuse.software/badge/github.com/Sid220/SmartDisplayPi)](https://api.reuse.software/info/github.com/Sid220/SmartDisplayPi)
[![GitHub license](https://img.shields.io/github/license/Sid220/SmartDisplayPi)](https://github.com/Sid220/SmartDisplayPi/blob/master/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/Sid220/SmartDisplayPi)](https://github.com/Sid220/SmartDisplayPi/issues)
[![Documentation](https://img.shields.io/badge/docs-published-success)](https://docs.sdp.vestal.tk/user/installation)
[![Uptime](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/Sid220/server-status/master/api/smart-display-pi-backend/uptime.json)](https://status.vestal.tk/history/smart-display-pi-backend)
[![Uptime](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/Sid220/server-status/master/api/smart-display-pi-backend/response-time.json)](https://status.vestal.tk/history/smart-display-pi-backend)
[![CircleCI](https://img.shields.io/circleci/build/github/Sid220/SmartDisplayPi/alpha-branch)](https://circleci.com/gh/Sid220/SmartDisplayPi/?branch=alpha-branch)
![GitHub repo file count](https://img.shields.io/github/directory-file-count/Sid220/SmartDisplayPi)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/Sid220/SmartDisplayPi)
![GitHub release (latest by date including pre-releases)](https://img.shields.io/github/v/release/Sid220/SmartDisplayPi?include_prereleases)
<br>
An awesome smart display powered by Google Assistant and Raspberry Pi.
## Features

* Google Assistant (hanging by a thread)
* Main page widgets
* Built-in browser
* Built-in onscreen keyboard
* Custom apps
* Auto-ambient mode
* Settings page

## Screenshots!
![img.png](assets/screenshots/img.png)
![img.png](assets/screenshots/img1.png)
![img.png](assets/screenshots/img2.png)
## Required:
* Raspberry Pi 3B or newer (At *least* 1GB of memory)
* *Minimum* 16GB SD card
* Internet connection

## Installation guide:
[Install Ubuntu 21.10](https://ubuntu.com/download/raspberry-pi/thank-you?version=21.10&architecture=server-arm64+raspi) and then run:
```bash
cd ~/ && wget https://tinyurl.com/installsmartdisplay -O install.sh && chmod +x install.sh && ./install.sh stable
```
### Beta [male] testing
[Install Ubuntu 21.10](https://ubuntu.com/download/raspberry-pi/thank-you?version=21.10&architecture=server-arm64+raspi) and then run:
```bash
cd ~/ && wget https://tinyurl.com/installsmartdisplay -O install.sh && chmod +x install.sh && ./install.sh beta
```
### Alpha [male] testing
[Install Ubuntu 21.10](https://ubuntu.com/download/raspberry-pi/thank-you?version=21.10&architecture=server-arm64+raspi) and then run:
```bash
cd ~/ && wget https://tinyurl.com/installsmartdisplay -O install.sh && chmod +x install.sh && ./install.sh alpha
```
##  Installing Google Assistant
<b>NOTE:</b> Even some taken-for-granted features of Google Assistant like timers don't work. Hot words don't work. Currently, there is no method of triggering it. In other words, don't install it if you value your sanity.<br>
To install Google Assistant, run:
```bash
cd ~/SmartDisplayPi/assets/gassist && bash install.sh
```
Odds are it won't work. When it doesn't, please report an issue.
## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change. Any help or feedback will greatly be appreciated.

## Further Development
In the near future, we would love to see SmartDisplayPi support Google Assistant further as some basic features don't work.

## License
[MIT](https://choosealicense.com/licenses/mit/)
