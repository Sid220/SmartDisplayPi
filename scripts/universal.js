const Store = require('electron-store');
const settings = new Store();
const root = require('electron-root-path').rootPath;
const defaultApps = [{
    name: "Browser",
    icon: "/media/ie.png",
    href: "/browser.html",
    pinned: true
}, {
    name: "YouTube",
    icon: "/media/youtube.png",
    href: "/webview.html?url=https://www.youtube.com/",
    pinned: true
},
{
    name: "Ambient",
    icon: "/media/clock.png",
    href: "/ambient.html",
    pinned: false
}, {
    name: "OutLook",
    icon: "/media/outlook.png",
    href: "/webview.html?url=https://outlook.live.com/",
    pinned: true
}, {
    name: "Settings",
    icon: "/media/settings.png",
    href: "/settings.html",
    pinned: true
}];

const fullApps = {
    initialized: false,
    shown: false,
    animating: false,
    apps: [],
    init: function() {
        this.appList = document.createElement("div");
        this.appList.style.display = "none";
        this.appList.classList.add("animate__faster");
        document.body.appendChild(this.appList);
        this.appList.classList.add("full-apps");
        this.searchBar = document.createElement("input");
        this.searchBar.type = "text";
        this.searchBar.placeholder = "Search Apps...";
        this.searchBar.classList.add("full-apps-search", "p-form-text", "p-form-no-validate");
        this.searchBar.oninput = () => {
            search(this.searchBar.value);
        }
        this.noResults = document.createElement("div");
        this.noResults.innerHTML = "No results."
        this.noResults.style.display = "none";
        this.noResults.style.color = "#fff";
        this.appList.appendChild(this.searchBar);
        this.appList.appendChild(this.noResults);
        settings.get("apps", defaultApps).forEach(app => {
            let shortcut = document.createElement("A");
            shortcut.href = root + app.href;
            shortcut.draggable = false;
            shortcut.innerHTML = `<img draggable="false" src="${root + app.icon}"><div>${app.name}</div>`;
            shortcut.dataset.smartdisplaypiName = app.name;
            if (app.icon.includes("/media/usr/")) {
                shortcut.classList.add("usr");
            }
            shortcut.classList.add('app-list-app');
            this.appList.appendChild(shortcut);
            this.apps.push(app.name);
        });
        this.initialized = true;
    },
    show: function() {
        if(!this.animating) {
            this.animating = true;
            this.appList.style.display = "block";
            this.shown = true;
            this.appList.classList.remove("animate__slideOutDown");
            this.appList.classList.add("animate__animated", "animate__slideInUp");
            setTimeout(() => {
                this.animating = false;
            }, 500)
        }
    },
    hide: function() {
        if(!this.animating) {
            this.shown = false;
            this.animating = true;
            this.appList.classList.remove("animate__slideInUp");
            this.appList.classList.add("animate__animated", "animate__slideOutDown");
            setTimeout(() => {
                this.appList.style.display = "none";
                this.animating = false;
            }, 500)
        }
    }
}
const fuzzysort = require('fuzzysort');
function search(query) {
    let results = fuzzysort.go(query, fullApps.apps, {
        limit: 50,
        all: true
    });
    fullApps.resultArray = [];
    results.forEach(result => {
        fullApps.resultArray.push(result.target);
    })
    fullApps.noResults.style.display = "none";
    fullApps.appList.childNodes.forEach((element) => {
        if (element !== fullApps.searchBar) {
            if (fullApps.resultArray.includes(element.dataset.smartdisplaypiName)) {
                element.style.display = "inline-block";
            } else {
                element.style.display = "none";
            }
        }
    });
    if(fullApps.resultArray.length === 0) {
        fullApps.noResults.style.display = "block";
    }
}
var shortcuts = document.createElement("DIV");
shortcuts.id = "shortcuts";
let shortcutsWrapper = document.createElement("DIV");
shortcutsWrapper.classList.add("shortcuts-wrapper");
document.body.appendChild(shortcutsWrapper);
shortcutsWrapper.appendChild(shortcuts);
let shortcut = document.createElement("A");
shortcut.onclick = () => {
    if(!fullApps.initialized) {
        fullApps.init();
    }
    if(!fullApps.shown) {
        fullApps.show();
    }
    else {
        fullApps.hide();
    }
}
shortcut.draggable = false;
shortcut.innerHTML = `<img draggable="false" src="${root}/media/apps.png">`;
shortcuts.appendChild(shortcut);
settings.get("apps", defaultApps).forEach(app => {
    if(app.pinned) {
        let shortcut = document.createElement("A");
        shortcut.href = root + app.href;
        shortcut.draggable = false;
        shortcut.innerHTML = `<img draggable="false" src="${root + app.icon}">`;
        if (app.icon.includes("/media/usr/")) {
            shortcut.classList.add("usr");
        }
        shortcuts.appendChild(shortcut);
    }
});
// GOOGLE ASSISTANT
if(settings.get("googleAssistant", false)) {
    const fs = require("fs");
    fs.watchFile(root + '/assets/gassist/SMARTDISPLAYPI_GOOGLE_ASSISTANT_OUTPUT.html', () => {
        if(!document.getElementById("googleAssistantOutput")) {
            let googleAssistantOutput = document.createElement("iframe");
            document.body.appendChild(googleAssistantOutput);
            googleAssistantOutput.id = "googleAssistantOutput";
            googleAssistantOutput.classList.add("google-assistant-output");
            googleAssistantOutput.src = root + '/assets/gassist/SMARTDISPLAYPI_GOOGLE_ASSISTANT_OUTPUT.html';
        }
    })
    fs.watchFile(root + '/assets/gassist/SMARTDISPLAYPI_DID_CALL_GOOGLE_ASSISTANT.yourmother', {
        interval: 500
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
    window.googleButton.draggable = false;
    window.googleButton.href = "#";
    window.googleButton.innerHTML = `<img draggable="false" src="${root + '/assets/gassist/images/GoogleAssistantMicTransparent.png'}">`;
    window.googleButton.classList.add("google-assistant", "user");
    shortcuts.appendChild(window.googleButton);
    window.googleButton.onclick = () => {
        googleAssistant();
    }
}

function closeopen() {
    if(!fullApps.initialized) {
        fullApps.init();
    }
    if(fullApps.shown) {
        fullApps.hide();
    }
    else {
        fullApps.show();
    }
}
homebutton = document.createElement("DIV");
homebutton.id = "homebutton";
homesquare = document.createElement("DIV");
homesquare.id = "homesquare"
document.body.appendChild(homebutton);
homebutton.appendChild(homesquare);
homebutton.addEventListener('click', () => {
    window.location.href = root + "/index.html";
}, false);
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
window.addEventListener("load", function() {
    BetterBoard.run('yourmom');
})
    var _paq = window._paq = window._paq || [];
    /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
    _paq.push(['trackPageView']);
    _paq.push(['enableLinkTracking']);
    (function() {
    var u="https://vestal.tk/matomo/";
    _paq.push(['setTrackerUrl', u+'matomo.php']);
    _paq.push(['setSiteId', '2']);
    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
    g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
})();
// Hammer Time
// Let's get it started
// Let's get it started (up in here)
// Let's get it started
// Let's get it started (up in here)
const Hammer = require(root + "/assets/hammer");

var shortcutMc = new Hammer.Manager(shortcuts, {
    recognizers: [
        [Hammer.Swipe,{ direction: Hammer.DIRECTION_VERTICAL }],
    ]
});

shortcutMc.on("swipeup swipedown", function(ev) {
    if(!fullApps.initialized) {
        fullApps.init();
        var appListMc = new Hammer.Manager(fullApps.appList, {
            recognizers: [
                [Hammer.Swipe,{ direction: Hammer.DIRECTION_VERTICAL, threshold: 1, velocity: 0.1 }],
            ]
        });

        appListMc.on("swipeup swipedown", function(ev) {
            if(!fullApps.initialized) {
                fullApps.init();
            }
            if(ev.type === "swipeup") {
                fullApps.show();
            }
            if(ev.type === "swipedown"){
                fullApps.hide();
            }
        });
    }
    if(ev.type === "swipeup") {
        fullApps.show();
    }
    if(ev.type === "swipedown"){
        fullApps.hide();
    }
});

