const record = require('node-record-lpcm16');
const Detector = require('snowboy').Detector;
const Models = require('snowboy').Models;
const fs = require('fs');
const player = require('play-sound')(opts = {})

const file = '/home/' + require("os").userInfo().username + '/SmartDisplayPi/assets/gassist/SMARTDISPLAYPI_DID_CALL_GOOGLE_ASSISTANT.yourmother';
const models = new Models();

models.add({
  file: '/home/' + require("os").userInfo().username + '/SmartDisplayPi/assets/gassist/alexa.umdl',
  sensitivity: '0.6',
  hotwords : 'Alexa',
  ApplyFrontend: true
});

const detector = new Detector({
  resource: '/home/' + require("os").userInfo().username + "/SmartDisplayPi/assets/gassist/common.res",
  models: models,
  audioGain: 2.0,
  applyFrontend: true
});

detector.on('silence', function () {
  console.log('silence');
});

detector.on('sound', function (buffer) {
  // <buffer> contains the last chunk of the audio that triggers the "sound"
  // event. It could be written to a wav stream.
  console.log('sound');
});

detector.on('error', function () {
  console.log('error');
});

function googleAssistant() {
   console.log("[DEV]: Assisting");
   fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return;
        }
        if(data.includes("0")) {
            console.log("[DEV]: Google Assistant NOT Started; Starting");
            fs.writeFile(file, '1', err2 => {
                if (err2) {
                    console.log(err2);
                    return;
                }
            });
	   player.play('resources/dong.wav', function (err) {
   if (err) throw err;
   console.log("[DEV]: Audio finished");
 });
        }
        if(data.includes("1")) {
            console.log("[DEV]: Google Assistant Started; NOT Starting");
        }
    });

}
detector.on('hotword', function (index, hotword, buffer) {
  // <buffer> contains the last chunk of the audio that triggers the "hotword"
  // event. It could be written to a wav stream. You will have to use it
  // together with the <buffer> in the "sound" event if you want to get audio
  // data after the hotword.
  console.log(buffer);
  console.log('hotword', index, hotword);
  googleAssistant();
});

const mic = record.record({
  threshold: 0,
  verbose: true
});

mic.stream().pipe(detector);
