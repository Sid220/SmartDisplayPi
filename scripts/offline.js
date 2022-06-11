function offline() {
    console.warn("Offline");
    document.body.innerHTML = '<h1>This page requires an internet connection</h1><button onclick="window.location.reload()">Try again</button> <button onclick="window.location.href = `../settings.html`">Back</button>';
}
window.addEventListener('offline', offline);
window.onload = () => {
    if (!navigator.onLine) {
        offline();
    }
}
