#!/bin/bash
cd ~/SmartDisplayPi/assets/gassist || exit 1
arecord -l
echo -n "Please type the card number of the microphone you would like to use (do not include \"card\"): "
read -r micCARDNUMBER
echo -n "Please type the device number of the microphone you would like to use (do not include \"device\"): "
read -r micDEVICENUMBER
aplay -l
echo -n "Please type the card number of the speaker you would like to use (do not include \"card\"): "
read -r speakCARDNUMBER
echo -n "Please type the device number of the speaker you would like to use (do not include \"device\"): "
read -r speakDEVICENUMBER
RAWASOUNDCONF=$(<PLACEHOLDER.asoundrc)
RAWASOUNDCONF="${RAWASOUNDCONF/\[SMARTDISPLAYPI_MIC_CARD_NUMBER\]/"$micCARDNUMBER"}"
RAWASOUNDCONF="${RAWASOUNDCONF/\[SMARTDISPLAYPI_MIC_DEVICE_NUMBER\]/"$micDEVICENUMBER"}"
RAWASOUNDCONF="${RAWASOUNDCONF/\[SMARTDISPLAYPI_SPEAK_CARD_NUMBER\]/"$speakCARDNUMBER"}"
RAWASOUNDCONF="${RAWASOUNDCONF/\[SMARTDISPLAYPI_SPEAK_DEVICE_NUMBER\]/"$speakDEVICENUMBER"}"
speaker-test -t wav -l 2
echo -n "Did you hear that sound? (y/N): "
read -r speakDIDHEAR
if [ "$speakDIDHEAR" = "y" ]; then
    echo "Great! We'll continue..."
else
    echo "Please run this script again and make sure you have selected the correct speaker card and device number."
    exit 1
fi
echo "Recording starting in..."
for i in {5..1}
do
    echo "$i"
    sleep 1
done
echo "Recording started!"
arecord --format=S16_LE --duration=5 --rate=16000 --file-type=raw out.raw
echo "Recording complete!"
echo "Playing..."
aplay --format=S16_LE --rate=16000 out.raw
rm -rf out.raw
echo -n "Did you hear your voice? (y/N): "
read -r speakDIDHEAR
if [ "$speakDIDHEAR" = "y" ]; then
    echo "Great! We'll continue..."
else
    echo "Please run this script again and make sure you have selected the correct mic card and device number."
    exit 1
fi
echo "$RAWASOUNDCONF" | sudo tee /home/"$USER"/.asoundrc > /dev/null
echo "[DEV]: Audio setup: complete."

if ! sudo apt update && sudo apt upgrade -y ; then
    echo "[DEV]: There was an error updating. Look above for more info."
    exit 1
fi
echo "[DEV]: System update: complete."

echo "[DEV]: Installing necessary packages..."
sudo apt install python3-dev python3-venv python3-pip libssl-dev libffi-dev libportaudio2
if [ $? != 0 ]; then
    echo "[DEV]: There was an error installing packages. Look above for more info."
    exit 1
fi
echo "[DEV]: Installing necessary packages: complete."

python3 -m venv env

echo "[DEV]: Installing necessary pip packages..."
env/bin/python3 -m pip install --upgrade pip setuptools --upgrade
source env/bin/activate
python3 -m pip install 'google_assistant_library-1.1.0-py2.py3-none-linux_aarch64.whl'
python3 -m pip install --upgrade google-assistant-library
python3 -m pip install --upgrade google-assistant-sdk[samples]
python3 -m pip install --upgrade google-auth-oauthlib[tool]
echo "[DEV]: Installing necessary pip packages: complete."

mkdir ~/googleassistant
cd ~/googleassistant || exit 1
echo -n "Please type the location of your Google Assistant Credentials JSON file (full path, including .json file extension): "
read -r credentialsJSONLOCATION
cp "$credentialsJSONLOCATION" credentials.json
echo "[DEV]: Credentials file: complete."

echo "Visit the link the next command will give to you. MAKE SURE YOU AGREE TO EVERYTHING!"
sleep 1
google-oauthlib-tool --client-secrets ~/googleassistant/credentials.json \
--scope https://www.googleapis.com/auth/assistant-sdk-prototype \
--scope https://www.googleapis.com/auth/gcm \
--save --headless
echo "[DEV]: Google Assistant OAuth: complete."

cd ~/SmartDisplayPi/assets/gassist || exit 1

echo "[DEV]: Making script to run on startup..."
RAWSERVICE=$(<assistant.service)
echo "${RAWSERVICE//\[SMARTDISPLAYPI_USER_PLACEHOLDER\]/"$USER"}" | sudo tee ./assistant.service > /dev/null
echo -n "Please enter your PROJECT ID: "
read -r PROJECTID
echo -n "Please enter your DEVICE MODEL ID: "
read -r DEVICEMODELID
RAWSERVICESCRIPT=$(<start_assistant.sh)
RAWSERVICESCRIPT="${RAWSERVICESCRIPT//\[SMARTDISPLAYPI_PROJECT_ID\]/"$PROJECTID"}"
echo "${RAWSERVICESCRIPT//\[SMARTDISPLAYPI_DEVICE_MODEL_ID\]/"$DEVICEMODELID"}" | sudo tee ./start_assistant.sh > /dev/null
echo "The hard part is over! Sit back, relax and watch as we finish up some things..."
sudo systemctl enable assistant.service
sudo systemctl start assistant.service
cp pushtotalk.py /home/"$USER"/.local/lib/python3.9/site-packages/googlesamples/assistant/grpc/pushtotalk.py
echo "[DEV]: Script to run on startup: complete."

npm install snowboy node-record-lpcm16 play-sound
cp ./snowboy.desktop ~/.config/autostart/snowboy.desktop
echo "[DEV]: Set up SnowBoy"

echo "Complete!"
echo "You can now talk to your Google Assistant by saying \"Alexa\". Kinda counter-intuitive, but it works."
echo "Rebooting in..."
for i in {5..1}
do
    echo "$i"
    sleep 1
done
echo "Rebooting..."
sudo reboot
