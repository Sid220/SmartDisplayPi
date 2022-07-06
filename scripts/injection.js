function injectScript(webview) {
    webview.executeJavaScript(`
            if(typeof BETTERBOARDINJECTIONscript === 'undefined') {
    var BETTERBOARDINJECTIONscript = document.createElement('script');
    BETTERBOARDINJECTIONscript.src = 'https://cdn.jsdelivr.net/npm/betterboard/dist/betterboard1.0.0-beta.10-aio.min.js';
    document.body.appendChild(BETTERBOARDINJECTIONscript);
    BETTERBOARDINJECTIONscript.onload = () => {
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
BetterBoard.run('yourmom'); 
};
}`);
    console.log("injected");
}
