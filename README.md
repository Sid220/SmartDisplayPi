# SmartDisplayPi
An awesome smart display powered by Google Assistant and Raspberry Pi.
## NOTE
This is still in development. Google Assistant is currently broken due to the libraries. A fix is on the way. For now, please use [GassistPi](https://github.com/shivasiddharth/GassistPi)
## Features

* Google Assistant
* Built-in home hub powered by Home Assistant
* Airplay compatible speaker
* Bluetooth speaker
* Youtube leanback interface
* Google Photos Photoframe mode
* Main page widgets
* Surveillance camera
* Daily reboot at midnight
* And much more!

## Images
![Image of Home Screen](Images/home.png)
![Image of Home Screen + Shade](Images/homewithshade.png)
![Image of Ambient Mode](Images/ambientmode.png)
![Image of Settings](Images/settings.png)
![Image of Youtube leanback](Images/youtubeleanback.png)
## Required:

* Raspberry Pi 3B or newer (At *least* 1GB of memory)
* Raspberry Pi Foundation 7" Display
* *Minimum* 8GB SD card
* AIY Kit v1
* Raspberry Pi Camera **Optional**


## Installation guide:
<s>It is *recommended* that you use our pre-built images in our [**releases**](https://github.com/piflyer/SmartDisplayPi/releases) tab. Our images are based on Raspbian Buster Lite. We will posting an installer soon if you are up for the challenge. Head over to our Wiki for more information and known bugs.</s><br>
Simply run:
`wget https://raw.githubusercontent.com/Sid220/SmartDisplayPi/master/install.sh -O install.sh && chmod +x install.sh && ./install.sh` <b>IN A FRESH INSTALL OF UBUNTU 21.10</b>

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change. Any help or feedback will greatly be appreciated.

## References:
* [Shairport-sync](https://github.com/mikebrady/shairport-sync)
* [Google Assistant SDK](https://github.com/googlesamples/assistant-sdk-python)
* [GassistPi](https://github.com/shivasiddharth/GassistPi)
* [Home Assistant](https://www.home-assistant.io/)
* <s>[RaspAP](https://github.com/billz/raspap-webgui)</s>
* [Google Photos PhotoFrame](https://github.com/googlesamples/google-photos)
* [Snowboy](https://snowboy.kitt.ai)
* [Electron](https://www.electronjs.org/)
* <s>[PWA](https://github.com/googlecodelabs/your-first-pwapp)</s>
* [Blue-ALSA](https://github.com/Arkq/bluez-alsa)
* [rpi-audio-receiver-master](https://github.com/nicokaiser/rpi-audio-receiver)
* [ffmpeg camera](https://einar.slaskete.net/2018/08/16/using-a-raspberry-pi-as-a-surveillance-camera-in-home-assistant/)
* <s>[Flickity.js](https://flickity.metafizzy.co/)</s>

## Further Development
In the near future, we would love to see SmartDisplayPi to all be controlled by without using command line. If anyone would like to help us push forward towards that goal, or even help us with the widget store, please send us a pull request. Thanks!

## License
[MIT](https://choosealicense.com/licenses/mit/)
