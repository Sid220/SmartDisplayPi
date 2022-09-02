// Copyright (C) 2022 The Fake Slim Shady
//
// SPDX-License-Identifier: MIT

function offline() {
    console.warn("Offline");
    document.body.innerHTML = '<h1>This page requires an internet connection</h1><button onclick="window.location.reload()">Try again</button> <button onclick="window.location.href = `../settings.html`">Connect</button>';
}
window.addEventListener('offline', offline);
window.onload = () => {
    if (!navigator.onLine) {
        offline();
    }
}
