// Copyright (C) 2022 The Fake Slim Shady
//
// SPDX-License-Identifier: MIT

const slidesContainer = document.getElementById("slides-container")!;
const featuredCont = document.getElementById("featured-cont")!;
const electron = (function () {
    // Renderer process
    // @ts-ignore
    if (typeof window !== 'undefined' && typeof window.process === 'object' && window.process.type === 'renderer') {
        return true;
    }

    // Main process
    if (typeof process !== 'undefined' && typeof process.versions === 'object' && !!process.versions.electron) {
        return true;
    }

    // Detect the user agent when the `nodeIntegration` option is set to false
    if (typeof navigator === 'object' && typeof navigator.userAgent === 'string' && navigator.userAgent.indexOf('Electron') >= 0) {
        return true;
    }

    return false;
})();

function getFeaturedWidgets() {
    let xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        JSON.parse(atob(JSON.parse(this.responseText).content.replaceAll("\n", ""))).forEach((widget: string, i: number) => {
                let xhttp = new XMLHttpRequest();
                xhttp.onload = function () {
                    let details = JSON.parse(atob(JSON.parse(this.responseText).content.replaceAll("\n", "")));
                    if(i < 3) {
                        const slide = document.createElement("li");
                        slide.onclick = () => { openApp(widget, details, AppTypes.Widget) };
                        slide.classList.add("slide");
                        slidesContainer.appendChild(slide);
                        slide.innerHTML = `<span>
                            <button class="p-btn" onclick="event.stopPropagation(); changeView('widgets')">Widget</button><button disabled data-associated-app="${widget}" data-type="widget" class="p-btn p-prim-col install">Install</button>
                        </span><div>
                            <h1><img src="https://raw.githubusercontent.com/Sid220/smartdisplaypi-apps/main/widgets/${widget}/${details.icon}"/> ${widget}</h1>
                        <p>${details.description}</p>
                        </div>`
                    }
                    const card = document.createElement("DIV");
                    card.onclick = () => { openApp(widget, details, AppTypes.Widget) };
                    card.classList.add("p-card");
                        card.innerHTML = `<img src="https://raw.githubusercontent.com/Sid220/smartdisplaypi-apps/main/widgets/${widget}/${details.icon}"><h1 class="p-card-title">${widget}<br><button class="p-btn" style="
    margin-left: -3px;
" onclick="event.stopPropagation(); changeView('widgets')">Widget</button><button class="p-btn p-prim-col install" data-associated-app="${widget}" data-type="widget" disabled>Install</button></h1><p class="p-card-text">${details.description}</p>`
                    featuredCont.appendChild(card);
                }
                xhttp.open("GET", "https://api.github.com/repos/Sid220/smartdisplaypi-apps/contents/widgets/" + widget + "/main.sdpw", false);
                xhttp.send();
        });
    }
    xhttp.open("GET", "https://api.github.com/repos/Sid220/smartdisplaypi-apps/contents/featured.sdpfw", false);
    xhttp.send();
}
function getFeaturedApps() {
    let xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        JSON.parse(atob(JSON.parse(this.responseText).content.replaceAll("\n", ""))).forEach((app: string, i: number) => {
            let xhttp = new XMLHttpRequest();
            xhttp.onload = function () {
                let details = JSON.parse(atob(JSON.parse(this.responseText).content.replaceAll("\n", "")))
                if (i < 3) {
                    const slide = document.createElement("li");
                    slide.onclick = () => { openApp(app, details, AppTypes.App) };
                    slide.classList.add("slide");
                    slidesContainer.appendChild(slide);
                    slide.innerHTML = `<span>
                        <button class="p-btn" data-associated-app="${app}" onclick="event.stopPropagation(); changeView('apps')">App</button><button data-associated-app="${app}" data-type="app" disabled class="p-btn p-prim-col install">Install</button>
                    </span><div>
                        <h1><img src="https://raw.githubusercontent.com/Sid220/smartdisplaypi-apps/main/apps/${app}/${details.icon}"/> ${app}</h1>
                    <p>${details.description}</p>
                    </div>`
                }
                const card = document.createElement("DIV");
                card.onclick = () => { openApp(app, details, AppTypes.App) };
                card.classList.add("p-card");
                card.innerHTML = `<img src="https://raw.githubusercontent.com/Sid220/smartdisplaypi-apps/main/apps/${app}/${details.icon}"><h1 class="p-card-title">${app}<br><button class="p-btn" style="
    margin-left: -3px;
" onclick="event.stopPropagation(); changeView('apps')">App</button><button class="p-btn p-prim-col install" data-associated-app="${app}" data-type="app" disabled>Install</button> </h1><p class="p-card-text">${details.description}</p>`
                featuredCont.appendChild(card);
            }
                xhttp.open("GET", "https://api.github.com/repos/Sid220/smartdisplaypi-apps/contents/apps/" + app + "/main.sdpa", false);
                xhttp.send();
            });
    }
    xhttp.open("GET", "https://api.github.com/repos/Sid220/smartdisplaypi-apps/contents/featured.sdpfa", false);
    xhttp.send();
}
getFeaturedWidgets();
getFeaturedApps();

var slide = document.querySelector(".slide")!;
const prevButton = document.getElementById("slide-arrow-prev")!;
const nextButton = document.getElementById("slide-arrow-next")!;

nextButton.addEventListener("click", () => {
    const slideWidth = slide.clientWidth;
    slidesContainer.scrollLeft += slideWidth;
    if(slidesContainer.scrollLeft === slideWidth * (slidesContainer.children.length - 1)) {
        slidesContainer.scrollLeft = 0;
    }
});

prevButton.addEventListener("click", () => {
    const slideWidth = slide.clientWidth;
    slidesContainer.scrollLeft -= slideWidth;
    if(slidesContainer.scrollLeft === 0) {
        slidesContainer.scrollLeft = slideWidth * (slidesContainer.children.length - 1);
    }
});
function closeOutput() {
    document.getElementById("output")!.innerHTML = "";
    document.getElementById("output")!.style.display = "none";
}
var myHistory = [];

let runCommand = (command: string) => {
    const proc = child_process.spawn(
        command,
        [],
        {
            shell: true,
            stdio: ["ignore", "pipe", "pipe"],
        },
    )
    proc.stdout.on("data", (data: string) => document.getElementById("output")!.innerHTML += data.toString());
    proc.stderr.on("data", (data: string) => document.getElementById("output")!.innerHTML += "<span style='color: orange;'>" + data.toString() + "</span>");
    proc.on("close", (code: number) => {
        if(code !== 0) {
            document.getElementById("output")!.innerHTML += "<span style='color: orange;'>There was an error installing <button onclick='closeOutput()' class='p-btn'>Close</button></span>"
            return false;
        }
        else {
            closeOutput();
            alert("Installed!");
            return true;
        }
    })
}

function installApp(app: string) {
    document.getElementById("output")!.style.display = "block";
    const command = "rm ~/tmp -r && mkdir ~/tmp && cd ~/tmp && svn checkout https://github.com/Sid220/smartdisplaypi-apps/trunk/apps/" + app + " && mv " + app + " " + root + "/apps/apps/";
 runCommand(command);
}

function setup() {
    if (electron) {
        [...document.getElementsByClassName("install")].forEach(btn => {
            // @ts-ignore
            btn.disabled = false;
            // @ts-ignore
            if(btn.dataset.type === "app") {
                // @ts-ignore
                if (settings.get("apps", defaultApps).findIndex(item => item.name === btn.dataset.associatedApp) !== -1) {
                    btn.classList.remove("p-prim-col");
                    // @ts-ignore
                    btn.innerText = "Remove";
                }
                // @ts-ignore
                btn.onclick = function() {
                    // @ts-ignore
                    installApp(btn.dataset.associatedApp);
                }
            }
            else { // @ts-ignore
                if(btn.dataset.type === "widget") {
                                let widgets = settings.get("widgets", [
                                    {
                                        name: "Clock",
                                        usr: false,
                                        type: "INJECTED_HTML",
                                        source: "clock.htmp",
                                        uuid: "sdpe7643333-63b0-4758-a4e0-d8a3935b6d27"
                                    },
                                    {
                                        name: "Weather",
                                        usr: false,
                                        type: "INJECTED_HTML",
                                        source: "weather.htmp",
                                        uuid: "sdp51510e68-a6e7-4b4c-8e4d-24c7d94695a9"
                                    },
                                    {
                                        name: "Calendar",
                                        usr: true,
                                        source: "https://calendar.google.com/calendar/u/0/r/customday"
                                    }]);
                                // @ts-ignore
                    if (widgets.findIndex(item => item.name === btn.dataset.associatedApp) !== -1) {
                                    btn.classList.remove("p-prim-col");
                                    // @ts-ignore
                                    btn.innerText = "Remove";
                                }
                            }
            }
        });
    }
}
setup();
const changeViewBtn = document.getElementById("change-view")!;
interface All {
    apps: any[],
    widgets: any[],
    all: any
}
const all: All = {
    apps: (function() {
        let returnValue: any[] = [];
        let xhttp = new XMLHttpRequest();
        xhttp.onload = function () {
            returnValue = JSON.parse(this.responseText);
        }
        xhttp.open("GET", "https://api.github.com/repos/Sid220/smartdisplaypi-apps/contents/apps", false);
        xhttp.send();
        return returnValue;
    })(),
    widgets: (function () {
        let returnValue: any[] = [];
        let xhttp = new XMLHttpRequest();
        xhttp.onload = function () {
            returnValue = JSON.parse(this.responseText);
        }
        xhttp.open("GET", "https://api.github.com/repos/Sid220/smartdisplaypi-apps/contents/widgets", false);
        xhttp.send();
        return returnValue;
    })(),
    all: function () {return this.apps.concat(this.widgets)}
};
var whatToSearch = all.all();
function changeView(view: string) {
    slidesContainer.innerHTML = "";
    featuredCont.innerHTML = "";
    if(view === 'all') {
        changeViewBtn.querySelector("a.active")!.classList.remove("active");
        changeViewBtn.querySelector("[data-sdp-value=\"All\"]")!.classList.add("active");
        getFeaturedWidgets();
        getFeaturedApps();
        whatToSearch = all.all();
    }
    if(view === 'widgets') {
        changeViewBtn.querySelector("a.active")!.classList.remove("active");
        changeViewBtn.querySelector("[data-sdp-value=\"Widgets\"]")!.classList.add("active");
        getFeaturedWidgets();
        whatToSearch = all.widgets;
    }
    if(view === "apps") {
        changeViewBtn.querySelector("a.active")!.classList.remove("active");
        changeViewBtn.querySelector("[data-sdp-value=\"Apps\"]")!.classList.add("active");
        getFeaturedApps();
        whatToSearch = all.apps;
    }
    slide = document.querySelector(".slide")!;
    setup();
}
enum AppTypes {
    App = "app",
    Widget = "widget"
}
interface AppDetails {
    screenshots: string[],
    description: string,
    version: string,
    license: string,
    developer: string,
    homepage: string | null,
    git: string | null,
    icon: string,
}
function searchApps(query: string) {
    let resultCont = document.getElementById("results")!;
    resultCont.innerHTML = "";
    fuzzysort.go(query, whatToSearch, {key:'name', threshold: -Infinity, all: true}).forEach((result: any) => {
        let appType: AppTypes;
        if(result.obj.path.includes("app")) {
            appType = AppTypes.App;
        }
        else {
            appType = AppTypes.Widget
        }
        let xhttp = new XMLHttpRequest();
        let details: AppDetails;
        xhttp.onload = function () {
            details = JSON.parse(atob(JSON.parse(this.responseText).content.replaceAll("\n", "")))
            let app = document.createElement("DIV");
            app.onclick = () => { openApp(result.target, details, appType) };
            app.classList.add("p-card")
            app.innerHTML = `<img src="https://raw.githubusercontent.com/Sid220/smartdisplaypi-apps/main/${result.obj.path}/${details.icon}"><h1>${result.target}<br><button class="p-btn" style="
    margin-left: -3px;
    cursor: default;
">${appType === AppTypes.App ? "App" : "Widget"}</button></h1>`;
            resultCont.appendChild(app);
        }
        xhttp.open("GET", "https://api.github.com/repos/Sid220/smartdisplaypi-apps/contents/" + result.obj.path + "/main.sdp" + (appType === AppTypes.App ? "a" : "w"), false);
        xhttp.send();
    })
}
function openSearch() {
    // Get the modal
    var modal = document.getElementById("searchModal")!;

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0]!;

    modal.style.display = "block";

    // When the user clicks on <span> (x), close the modal
    // @ts-ignore
    span.onclick = function () {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside the modal, close it
    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }
}
function openApp(app: string, details: AppDetails, type: AppTypes) {
    // Get the modal
    var modal = document.getElementById("viewAppModal")!;
    let screenshots;
    if(typeof details.screenshots === "undefined") {
        screenshots = "<i>No screenshots</i>";
    }
    else {
        let imgs = (function() {
            let screenshots = [];
        for(var i = 0; i < details.screenshots.length; i++) {
            screenshots.push(`<li class="slide"><img src="https://raw.githubusercontent.com/Sid220/smartdisplaypi-apps/main/${type}s/${app}/screenshots/${details.screenshots[i]}"/></li>`);
        }
        return screenshots;
        })();
        screenshots = `<button class="slide-arrow" id="s-slide-arrow-prev">
        &#8249;
    </button>
    <button class="slide-arrow" id="s-slide-arrow-next">
        &#8250;
    </button>
    <ul class="slides-container" id="s-slides-container">
    ${imgs.join("")}
    </ul>`;
    }
    modal.getElementsByClassName("modal-content")[0].innerHTML = `<span id="closeAppModal" class="close">&times;</span><br>
        <h1><img src="https://raw.githubusercontent.com/Sid220/smartdisplaypi-apps/main/${type}s/${app}/${details.icon}"> ${app} <span>
                            <button class="p-btn" style="cursor: default">${type === "app" ? "App" : "Widget"}</button><button data-associated-app="${app}" data-type="${type}" disabled class="p-btn p-prim-col install">Install</button>
                        </span></h1>
            <p>${details.description}</p>
            <ul>
            <li>v${details.version}</li>
            ${details.license !== null ? "<li><span class=\"material-icons-round\">\n" +
        "gavel\n" +
        "</span> " + details.license + "</li>" : ""}
            <li><span class="material-icons-round">
account_circle
</span> ${details.developer}</li>
            ${details.homepage !== null ? "<li><span class=\"material-icons-round\">\n" +
        "language\n" +
        "</span> " + details.homepage + "</li>" : ""}
            ${details.git !== null ? "<li><span class=\"material-icons-round\">\n" +
        "code\n" +
        "</span> " + details.git + "</li>" : ""}
</ul>
        <section class="screenshots s-slider-wrapper">${screenshots}</section>`
    setup();
    if(typeof details.screenshots !== "undefined") {
        let sSlide = document.querySelector(".slide")!;
        let sPrevButton = document.getElementById("s-slide-arrow-prev")!;
        let sNextButton = document.getElementById("s-slide-arrow-next")!;
        let sSlidesContainer = document.getElementById("s-slides-container")!;

        sNextButton.addEventListener("click", () => {
            const slideWidth = sSlide.clientWidth;
            sSlidesContainer.scrollLeft += slideWidth;
            if (sSlidesContainer.scrollLeft === slideWidth * (sSlidesContainer.children.length - 1)) {
                sSlidesContainer.scrollLeft = 0;
            }
        });

        sPrevButton.addEventListener("click", () => {
            const slideWidth = sSlide.clientWidth;
            sSlidesContainer.scrollLeft -= slideWidth;
            if (sSlidesContainer.scrollLeft === 0) {
                sSlidesContainer.scrollLeft = slideWidth * (sSlidesContainer.children.length - 1);
            }
        });
    }
    // Get the <span> element that closes the modal
    var span = document.getElementById("closeAppModal")!;

    modal.style.display = "block";

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside the modal, close it
    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }
}