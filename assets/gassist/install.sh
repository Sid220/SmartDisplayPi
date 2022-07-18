#!/bin/bash
cd ~/SmartDisplayPi/assets/gassist || exit 1
sudo apt install alsa-utils -y
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
echo "$RAWASOUNDCONF" | sudo tee /home/"$USER"/.asoundrc > /dev/null
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
echo "[DEV]: Audio setup: complete."

if ! sudo apt update && sudo apt upgrade -y ; then
    echo "[DEV]: There was an error updating. Look above for more info."
    exit 1
fi
echo "[DEV]: System update: complete."

echo "[DEV]: Installing necessary packages..."
sudo apt install python3-dev python3-venv python3-pip libssl-dev libffi-dev libportaudio2 -y
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
sudo apt install portaudio19-dev python3-pyaudio -y
python3 -m pip install -r 'GassistPi-pip-requirements.txt'
python3 -m pip install watchdog
python3 -m pip install google-assistant-grpc --upgrade
python3 -m pip install google-assistant-sdk --upgrade
python3 -m pip install tenacity --upgrade
echo "[DEV]: Installing necessary pip packages: complete."

echo -n "Please type the location of your Google Assistant Credentials JSON file (full path, including .json file extension): "
read -r credentialsJSONLOCATION
cp "$credentialsJSONLOCATION" credentials.json
echo "[DEV]: Credentials file: complete."

echo "Visit the link the next command will give to you. MAKE SURE YOU AGREE TO EVERYTHING!"
sleep 3
google-oauthlib-tool --client-secrets credentials.json \
--scope https://www.googleapis.com/auth/assistant-sdk-prototype \
--scope https://www.googleapis.com/auth/gcm \
--save --headless
echo "[DEV]: Google Assistant OAuth: complete."

echo "[DEV]: Making script to run on startup..."
cp ./assistant.desktop ~/.config/autostart/assistant.desktop
# Fixed Audio Helper File
rm ./env/lib/python3.9/site-packages/googlesamples/assistant/grpc/audio_helpers.py
cp ./audio_helpers.py ./env/lib/python3.9/site-packages/googlesamples/assistant/grpc
echo -n "Please enter your PROJECT ID: "
read -r PROJECTID
echo -n "Please enter your DEVICE MODEL ID: "
read -r DEVICEMODELID
RAWSERVICESCRIPT=$(<start_assistant.sh)
RAWSERVICESCRIPT="${RAWSERVICESCRIPT//\[SMARTDISPLAYPI_PROJECT_ID\]/"$PROJECTID"}"
echo "${RAWSERVICESCRIPT//\[SMARTDISPLAYPI_DEVICE_MODEL_ID\]/"$DEVICEMODELID"}" | sudo tee ./start_assistant.sh > /dev/null
echo -n "Please enter your PORCUPINE ACCESS KEY: "
read -r PORCUPINEACCESSKEY
echo "The hard part is over! Sit back, relax and watch as we finish up some things..."
cp pushtotalk.py env/lib/python3.9/site-packages/googlesamples/assistant/grpc/pushtotalk.py
echo "[DEV]: Script to run on startup: complete."

sudo apt install pavucontrol -y
python3 -m pip install pvporcupine pvporcupinedemo pvrecorder
RAWPORCUPINESCRIPT=$(<start_porcupine.sh)
echo "${RAWPORCUPINESCRIPT//\[SMARTDISPLAYPI_PORCUPINE_ACCESS_KEY\]/"$PORCUPINEACCESSKEY"}" | sudo tee ./start_porcupine.sh > /dev/null
cp ./porcupine.desktop ~/.config/autostart/
echo "[DEV]: Finished setting up Porcupine"

echo "Complete!"
echo "You can now talk to your Google Assistant by saying \"Hey Google\"."
echo "Rebooting in..."
for i in {5..1}
do
    echo "$i"
    sleep 1
done
echo "Rebooting..."
sudo reboot
