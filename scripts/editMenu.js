"use strict";
// Copyright (C) 2022 The Fake Slim Shady
//
// SPDX-License-Identifier: MIT
Object.defineProperty(exports, "__esModule", { value: true });
fullApps.init();
fullApps.show();
let longPress;
let pressTimer;
function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}
[...fullApps.appList.getElementsByTagName("a")].forEach(app => {
    app.href = "#";
    app.addEventListener('click', function () {
        if (longPress) { // if detect hold, stop onclick function
            return false;
        }
    });
    app.addEventListener('mousedown', function () {
        longPress = false; //longpress is false initially
        pressTimer = window.setTimeout(function () {
            // your code here
            longPress = true; //if run hold function, longpress is true
            let pin = confirm("Do you want to pin this app?");
            if (pin) {
                console.log(app.getElementsByTagName("div")[0].innerText);
                console.log(getKeyByValue(settings.get("apps", defaultApps), app.getElementsByTagName("div")[0].innerText));
            }
        }, 1000);
    });
    app.addEventListener('mouseup', function () {
        clearTimeout(pressTimer); //clear time on mouseup
    });
    app.addEventListener('mousemove', function () {
        if (typeof pressTimer !== "undefined") {
            clearTimeout(pressTimer); //clear time on mousemove
        }
    });
});
[...shortcuts.getElementsByTagName("a")].forEach(app => {
    app.href = "#";
});
const Sortable = require("sortablejs");
new Sortable(fullApps.appList, {
    filter: '.full-apps-search',
    onMove(e) {
        return e.related.className.indexOf('full-apps-search') === -1;
    },
    store: {
        /**
         * Get the order of elements. Called once during initialization.
         * @returns {Array}
         */
        get: function () {
            var order = settings.get("appListAppsOrder", null);
            return order ? order.split("|") : [];
        },
        /**
         * Save the order of elements. Called onEnd (when the item is dropped).
         * @param {Sortable}  sortable
         */
        set: function (sortable) {
            var order = sortable.toArray();
            settings.set("appListAppsOrder", order.join("|"));
        }
    },
});
new Sortable(shortcuts, {
    direction: "horizontal",
    filter: "google-assistant",
    onMove(e) {
        return e.related.className.indexOf('google-assistant') === -1;
    },
    store: {
        /**
         * Get the order of elements. Called once during initialization.
         * @returns {Array}
         */
        get: function () {
            var order = settings.get("shortcutList", null);
            return order ? order.split("|") : [];
        },
        /**
         * Save the order of elements. Called onEnd (when the item is dropped).
         * @param {Sortable}  sortable
         */
        set: function (sortable) {
            var order = sortable.toArray();
            settings.set("shortcutList", order.join("|"));
        }
    },
});
