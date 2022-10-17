"use strict";
// Copyright (C) 2022 The Fake Slim Shady
//
// SPDX-License-Identifier: MIT
const Store = require('electron-store');
const settings = new Store();
const root = require('electron-root-path').rootPath.replaceAll("\\", "/");
const child_process = require('child_process');
const loudness = require('loudness');
const defaultApps = [{
        name: "Browser",
        icon: "/apps/apps/Browser/ie.png",
        href: "/apps/apps/Browser/app/browser.html",
        pinned: true,
        user: true,
    }, {
        name: "YouTube",
        icon: "/apps/apps/YouTube/youtube.png",
        href: "/src/webview.html?url=https://www.youtube.com/",
        pinned: true,
        user: true,
    },
    {
        name: "Ambient",
        icon: "/media/clock.png",
        href: "/src/ambient.html",
        pinned: false,
        user: false,
    }, {
        name: "OutLook",
        icon: "/apps/apps/OutLook/outlook.png",
        href: "/src/webview.html?url=https://outlook.live.com/",
        pinned: true,
        user: true,
    }, {
        name: "Settings",
        icon: "/media/settings.png",
        href: "/src/settings.html",
        pinned: true,
        user: false,
    }, {
        name: "App Store",
        icon: "/media/app-store.png",
        href: "/src/app-store.html",
        pinned: true,
        user: false,
    }];
const fullApps = {
    initialized: false,
    shown: false,
    animating: false,
    appList: document.createElement("div"),
    searchBar: document.createElement("input"),
    noResults: document.createElement("div"),
    apps: new Array(),
    resultArray: new Array(),
    init: function () {
        this.appList.style.display = "none";
        this.appList.classList.add("animate__faster");
        document.body.appendChild(this.appList);
        this.appList.classList.add("full-apps");
        this.searchBar.type = "text";
        this.searchBar.placeholder = "Search Apps...";
        this.searchBar.classList.add("full-apps-search", "p-form-text", "p-form-no-validate");
        this.searchBar.oninput = () => {
            search(this.searchBar.value);
        };
        this.noResults.innerHTML = "No results.";
        this.noResults.style.display = "none";
        this.noResults.style.color = "#fff";
        this.appList.appendChild(this.searchBar);
        this.appList.appendChild(this.noResults);
        settings.get("apps", defaultApps).forEach((app) => {
            let shortcut = document.createElement("a");
            shortcut.href = root + app.href;
            shortcut.draggable = false;
            let icon = document.createElement("img");
            icon.src = root + app.icon;
            shortcut.appendChild(icon);
            let shortcutName = document.createElement("div");
            shortcutName.innerHTML = app.name;
            shortcut.appendChild(shortcutName);
            shortcut.dataset.smartdisplaypiName = app.name;
            shortcut.classList.add('app-list-app');
            this.appList.appendChild(shortcut);
            this.apps.push(app.name);
        });
        this.initialized = true;
    },
    show: function () {
        if (!this.animating) {
            this.animating = true;
            this.appList.style.display = "block";
            this.shown = true;
            this.appList.classList.remove("animate__slideOutDown");
            this.appList.classList.add("animate__animated", "animate__slideInUp");
            setTimeout(() => {
                this.animating = false;
            }, 500);
        }
    },
    hide: function () {
        if (!this.animating) {
            this.shown = false;
            this.animating = true;
            this.appList.classList.remove("animate__slideInUp");
            this.appList.classList.add("animate__animated", "animate__slideOutDown");
            setTimeout(() => {
                this.appList.style.display = "none";
                this.animating = false;
            }, 500);
        }
    }
};
const fuzzysort = require('fuzzysort');
function search(query) {
    let results = fuzzysort.go(query, fullApps.apps, {
        limit: 50,
        all: true
    });
    results.forEach((result) => {
        fullApps.resultArray.push(result.target);
    });
    fullApps.noResults.style.display = "none";
    fullApps.appList.childNodes.forEach((element) => {
        if (element !== fullApps.searchBar) {
            // @ts-ignore
            if (fullApps.resultArray.includes(element.dataset.smartdisplaypiName)) {
                // @ts-ignore
                element.style.display = "inline-block";
            }
            else {
                // @ts-ignore
                element.style.display = "none";
            }
        }
    });
    if (fullApps.resultArray.length === 0) {
        fullApps.noResults.style.display = "block";
    }
}
let dock = document.createElement("DIV");
dock.id = "shortcuts";
let shortcutsWrapper = document.createElement("DIV");
shortcutsWrapper.classList.add("shortcuts-wrapper");
document.body.appendChild(shortcutsWrapper);
shortcutsWrapper.appendChild(dock);
const shortcuts = document.createElement("DIV");
shortcuts.classList.add("apps-container");
dock.appendChild(shortcuts);
let shortcut = document.createElement("A");
let tools = document.createElement("DIV");
tools.classList.add("tools");
tools.innerHTML = `<span draggable="false" id="time" style="
font-size: 30px;
">12:35<br>
</span><span style="
padding-top: -100px;
">AM; 8/13/2022</span><br>
<span><button class="p-btn"><img src="${root}/assets/feather/triangle.svg"></button><button data-p-open-actions="#actions_vol" class="p-btn"><img src="${root}/assets/feather/volume-2.svg"></button><button data-p-open-actions="#actions_power" class="p-btn"><img src="${root}/assets/feather/power.svg"></button>
</span>`;
document.getElementById("shortcuts").appendChild(tools);
let powerAction = document.createElement("DIV");
powerAction.classList.add("p-action-background");
powerAction.innerHTML = `<div class="p-action-big-container" id="actions_power" data-p-close-on-outside="true">
    <div class="p-action-container">
      <div class="p-action-title">
        <h3 class="p-action-title--intern">What would you like to do?</h3>
      </div>
      <a href="#" class="p-action--intern p-action-neutral">Power Off</a>
      <a href="#" class="p-action--intern">Reboot</a>
    </div>
    <div class="p-action-container">
      <a href="#" class="p-action--intern p-action-cancel" data-p-cancel-action="true">Cancel</a>
    </div>
  </div>`;
// Power off
powerAction.childNodes[0].childNodes[1].childNodes[3].addEventListener("click", () => {
    child_process.exec('pkexec /sbin/shutdown -h now');
});
// Reboot
powerAction.childNodes[0].childNodes[1].childNodes[5].addEventListener("click", () => {
    child_process.exec('pkexec /sbin/reboot');
});
document.body.appendChild(powerAction);
let volAction = document.createElement("DIV");
volAction.classList.add("p-action-big-container");
volAction.id = "actions_vol";
volAction.dataset.pCloseOnOutside = "true";
volAction.innerHTML = `
    <div class="p-action-container">
      <div class="p-action-title">
        <h3 class="p-action-title--intern">Master Volume</h3>
      </div>
      <a href="#" class="p-action--intern p-action-neutral"><input type="range" min="0" max="100" class="p-form-range" style="width: 90%;"></a>
    </div>
    <div class="p-action-container">
      <a href="#" class="p-action--intern p-action-cancel" data-p-cancel-action="true">OK</a>
    </div>`;
document.body.appendChild(volAction);
require("../assets/pupertino/actions.js");
shortcut.onclick = () => {
    if (!fullApps.initialized) {
        fullApps.init();
    }
    if (!fullApps.shown) {
        fullApps.show();
    }
    else {
        fullApps.hide();
    }
};
shortcut.draggable = false;
shortcut.innerHTML = `<img draggable="false" src="${root}/media/apps.png">`;
shortcuts.appendChild(shortcut);
settings.get("apps", defaultApps).forEach((app) => {
    if (app.pinned) {
        let shortcut = document.createElement("a");
        shortcut.href = root + app.href;
        shortcut.draggable = false;
        shortcut.innerHTML = `<img draggable="false" src="${root + app.icon}" alt="App Icon">`;
        if (app.icon.includes("/media/usr/")) {
            shortcut.classList.add("usr");
        }
        shortcuts.appendChild(shortcut);
    }
});
// GOOGLE ASSISTANT
if (settings.get("googleAssistant", false)) {
    let googleButton = document.createElement("a");
    googleButton.draggable = false;
    googleButton.href = "#";
    googleButton.innerHTML = `<img draggable="false" src="${root + '/assets/gassist/images/GoogleAssistantMicTransparent.png'}">`;
    googleButton.classList.add("google-assistant", "user");
    shortcuts.appendChild(googleButton);
    googleButton.onclick = () => {
        googleAssistant();
    };
    const fs = require("fs");
    fs.watchFile(root + '/assets/gassist/SMARTDISPLAYPI_GOOGLE_ASSISTANT_OUTPUT.html', () => {
        if (!document.getElementById("googleAssistantOutput")) {
            let googleAssistantOutput = document.createElement("iframe");
            document.body.appendChild(googleAssistantOutput);
            googleAssistantOutput.id = "googleAssistantOutput";
            googleAssistantOutput.classList.add("google-assistant-output");
            googleAssistantOutput.src = root + '/assets/gassist/SMARTDISPLAYPI_GOOGLE_ASSISTANT_OUTPUT.html';
        }
    });
    fs.watchFile(root + '/assets/gassist/SMARTDISPLAYPI_DID_CALL_GOOGLE_ASSISTANT.yourmother', {
        interval: 500
    }, () => {
        fs.readFile(root + '/assets/gassist/SMARTDISPLAYPI_DID_CALL_GOOGLE_ASSISTANT.yourmother', 'utf8', (err3, data3) => {
            if (err3) {
                console.log(err3);
                return;
            }
            if (data3.includes("0")) {
                // @ts-ignore
                googleButton.firstChild.src = root + '/assets/gassist/images/GoogleAssistantMicTransparent.png';
            }
            if (data3.includes("1") && !data3.includes("RESPONDING")) {
                // @ts-ignore
                if (googleButton.firstChild.src !== root + '/assets/gassist/images/GoogleAssistantBarsTransparent.gif') {
                    // @ts-ignore
                    googleButton.firstChild.src = root + '/assets/gassist/images/GoogleAssistantBarsTransparent.gif';
                }
            }
            if (data3.includes("RESPONDING")) {
                // @ts-ignore
                if (googleButton.firstChild.src !== root + '/assets/gassist/images/GoogleAssistantTransparent.gif') {
                    // @ts-ignore
                    googleButton.firstChild.src = root + '/assets/gassist/images/GoogleAssistantTransparent.gif';
                }
            }
        });
    });
}
function googleAssistant() {
    const fs = require("fs");
    fs.readFile(root + '/assets/gassist/SMARTDISPLAYPI_DID_CALL_GOOGLE_ASSISTANT.yourmother', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return;
        }
        if (data.includes("0")) {
            console.log("[DEV]: Google Assistant NOT Started; Starting");
            fs.writeFile(root + '/assets/gassist/SMARTDISPLAYPI_DID_CALL_GOOGLE_ASSISTANT.yourmother', '1', (err2) => {
                if (err2) {
                    console.log(err2);
                    return;
                }
            });
        }
        if (data.includes("1")) {
            console.log("[DEV]: Google Assistant Started; NOT Starting");
        }
    });
}
function closeopen() {
    if (!fullApps.initialized) {
        fullApps.init();
    }
    if (fullApps.shown) {
        fullApps.hide();
    }
    else {
        fullApps.show();
    }
}
if (settings.get("ambient", true) && !window.location.href.includes("ambient.html")) {
    function ambient() {
        window.location.href = root + "/src/ambient.html";
    }
    let t = setTimeout(ambient, 10000);
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
const fs = require("fs");
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
window.addEventListener("load", function () {
    BetterBoard.run('yourmom');
});
// Hammer Time
// Let's get it started
// Let's get it started (up in here)
// Let's get it started
// Let's get it started (up in here)
const Hammer = require(root + "/assets/hammer");
var shortcutMc = new Hammer.Manager(shortcuts, {
    recognizers: [
        [Hammer.Swipe, { direction: Hammer.DIRECTION_VERTICAL }],
    ]
});
shortcutMc.on("swipeup swipedown", function (ev) {
    if (!fullApps.initialized) {
        fullApps.init();
        var appListMc = new Hammer.Manager(fullApps.appList, {
            recognizers: [
                [Hammer.Swipe, { direction: Hammer.DIRECTION_VERTICAL, threshold: 1, velocity: 0.1 }],
            ]
        });
        appListMc.on("swipeup swipedown", function (ev) {
            if (!fullApps.initialized) {
                fullApps.init();
            }
            if (ev.type === "swipeup") {
                fullApps.show();
            }
            if (ev.type === "swipedown") {
                fullApps.hide();
            }
        });
    }
    if (ev.type === "swipeup") {
        fullApps.show();
    }
    if (ev.type === "swipedown") {
        fullApps.hide();
    }
});
