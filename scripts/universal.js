const Store = require('electron-store');
const settings = new Store();
const root = require('electron-root-path').rootPath;
const defaultApps = [{
    name: "Browser",
    icon: "/media/ie.png",
    href: "/browser.html"
}, {
    name: "YouTube",
    icon: "/media/youtube.png",
    href: "/webview.html?url=https://www.youtube.com/"
},
{
    name: "Ambient",
    icon: "/media/clock.png",
    href: "/ambient.html"
}, {
    name: "OutLook",
    icon: "/media/outlook.png",
    href: "/webview.html?url=https://outlook.live.com/"
}, {
    name: "Settings",
    icon: "/media/settings.png",
    href: "/settings.html"
}];
var shortcuts = document.createElement("DIV");
shortcuts.classList.add("animate__animated");
shortcuts.id = "shortcuts";
document.body.appendChild(shortcuts);
settings.get("apps", defaultApps).forEach(app => {
    let shortcut = document.createElement("A");
    shortcut.href = root + app.href;
    shortcut.innerHTML = `<img src="${root + app.icon}">`;
    if(app.icon.includes("/media/usr/")) {
        shortcut.classList.add("usr");
    }
    shortcuts.appendChild(shortcut);
});
// let shortcut = document.createElement("A");
// shortcut.href = root + '/more-apps.html';
// shortcut.classList.add("more-apps")
// shortcut.innerHTML = `<img src="${root + '/media/more-apps.png'}">`;
// shortcuts.appendChild(shortcut);

var overlay = document.getElementById("shortcuts");
document.documentElement.style.setProperty('--animate-duration', '.75s');

// GOOGLE ASSISTANT
if(settings.get("googleAssistant", false)) {
    const fs = require("fs");
    fs.watchFile(root + '/assets/gassist/SMARTDISPLAYPI_DID_CALL_GOOGLE_ASSISTANT.yourmother', {
        interval: 1000
    }, () => {
        fs.readFile(root + '/assets/gassist/SMARTDISPLAYPI_DID_CALL_GOOGLE_ASSISTANT.yourmother', 'utf8', (err3, data3) => {
            if (err3) {
                console.log(err3);
                return;
            }
            if (data3.includes("0")) {
                googleButton.firstChild.src = root + '/assets/gassist/images/GoogleAssistantMicTransparent.png';
            }
            if(data3.includes("1") && !data3.includes("RESPONDING")) {
                if(googleButton.firstChild.src !== root + '/assets/gassist/images/GoogleAssistantBarsTransparent.gif') {
                    googleButton.firstChild.src = root + '/assets/gassist/images/GoogleAssistantBarsTransparent.gif';
                }
            }
            if (data3.includes("RESPONDING")) {
                if (googleButton.firstChild.src !== root + '/assets/gassist/images/GoogleAssistantTransparent.gif') {
                    googleButton.firstChild.src = root + '/assets/gassist/images/GoogleAssistantTransparent.gif';
                }
            }
        })
    })
}
function googleAssistant(ele) {
    const fs = require("fs");
    fs.readFile(root + '/assets/gassist/SMARTDISPLAYPI_DID_CALL_GOOGLE_ASSISTANT.yourmother', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return;
        }
        if(data.includes("0")) {
            console.log("[DEV]: Google Assistant NOT Started; Starting");
            fs.writeFile(root + '/assets/gassist/SMARTDISPLAYPI_DID_CALL_GOOGLE_ASSISTANT.yourmother', '1', err2 => {
                if (err2) {
                    console.log(err2);
                    return;
                }
            });
        }
        if(data.includes("1")) {
            console.log("[DEV]: Google Assistant Started; NOT Starting");
        }
    });
}

if(settings.get("googleAssistant", false)) {
    window.googleButton = document.createElement("A");
    window.googleButton.href = "#";
    window.googleButton.innerHTML = `<img src="${root + '/assets/gassist/images/GoogleAssistantMicTransparent.png'}">`;
    window.googleButton.classList.add("google-assistant", "user");
    shortcuts.appendChild(window.googleButton);
    window.googleButton.onclick = () => {
        googleAssistant();
    }
}

function closeopen() {
    if (overlay.style.display == "none") {
        const openStart = new Event('openStart');
        document.dispatchEvent(openStart);
        console.log("opening");
        overlay.style.display = "block";
        overlay.classList.replace('animate__slideOutDown', 'animate__slideInUp');
        overlay.addEventListener('animationend', () => {
            overlay.style.display = "block";
            document.body.style.paddingBottom = "calc(13vh + 7px)";

        });
    } else {
        const closeStart = new Event('closeStart');
        document.dispatchEvent(closeStart);
        console.log("closing");
        overlay.classList.remove("animate__slideInUp")
        overlay.classList.add("animate__slideOutDown")
        overlay.addEventListener('animationend', () => {
            overlay.style.display = "none";
            document.body.style.paddingBottom = "0";
        });
    }
}
homebutton = document.createElement("DIV");
homebutton.id = "homebutton";
homesquare = document.createElement("DIV");
homesquare.id = "homesquare"
document.body.appendChild(homebutton);
homebutton.appendChild(homesquare);
homebutton.onclick = () => {
    closeopen();
}
homebutton.addEventListener("dblclick", () => {
   window.location = root + "/index.html";
})
function resize() {
    document.getElementById("shortcuts").firstChild.style.marginLeft = (document.getElementById("shortcuts").firstChild.offsetWidth + (0.015 * document.body.offsetWidth)) + "px";
    homebutton.style.height = document.getElementById("shortcuts").firstChild.offsetWidth + "px";
    homebutton.style.width = document.getElementById("shortcuts").firstChild.offsetWidth + "px";
}
resize();
setTimeout(resize, 100);
// DEVELOPMENT PURPOSES ONLY!!!
window.addEventListener('resize', resize);
// Back to your regularly scheduled programming.
if (settings.get("ambient", true) && !window.location.href.includes("ambient.html")) {
    function ambient() {
        window.location.href = root + "/ambient.html";
    }
    t = setTimeout(ambient, 10000);
    window.addEventListener('load', resetTimer, true);
    var events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(function (name) {
        document.addEventListener(name, resetTimer, true);
    });
    function resetTimer() {
        clearTimeout(t);
        t = setTimeout(ambient, settings.get("ambientDelay", 30) * 60 * 1000);
    }
}

const BetterBoard = require('betterboard');
const { link } = require('original-fs');
BetterBoard.init({
    keysArrayOfObjects: [
        {
            "0": "Q",
            "1": "W",
            "2": "E",
            "3": "R",
            "4": "T",
            "5": "Y",
            "6": "U",
            "7": "I",
            "8": "O",
            "9": "P",
            "10": "+"
        },
        {
            "0": "A",
            "1": "S",
            "2": "D",
            "3": "F",
            "4": "G",
            "5": "H",
            "6": "J",
            "7": "K",
            "8": "L",
            "9": ";"
        },
        {
            "0": "Z",
            "1": "X",
            "2": "C",
            "3": "V",
            "4": "B",
            "5": "N",
            "6": "M",
            "7": ",",
            "8": "."
        }
    ],
    language: 'en',
    theme: 'flat',
    allowRealKeyboard: true,
    allowMobileKeyboard: true,
    autoScroll: true,
    capsLockActive: false,
});
BetterBoard.run('input[type=text], input[type=number], textarea');