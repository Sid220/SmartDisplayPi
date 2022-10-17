"use strict";
// Copyright (C) 2022 The Fake Slim Shady
//
// SPDX-License-Identifier: MIT
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function searchIcons(query) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fetch("https://p1txh7zfb3-3.algolianet.com/1/indexes/macOSicons/query?x-algolia-agent=Algolia%20for%20JavaScript%20(4.13.1)%3B%20Browser", {
            "credentials": "omit",
            "headers": {
                "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:102.0) Gecko/20100101 Firefox/102.0",
                "Accept": "*/*",
                "Accept-Language": "en-US,en;q=0.5",
                "x-algolia-api-key": "0ba04276e457028f3e11e38696eab32c",
                "x-algolia-application-id": "P1TXH7ZFB3",
                "content-type": "application/x-www-form-urlencoded",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "cross-site"
            },
            "referrer": "https://macosicons.com/",
            "body": "{\"query\":\"" + query + "\",\"filters\":\"approved:true\",\"hitsPerPage\":25,\"page\":0}",
            "method": "POST",
            "mode": "cors"
        }).then(response => response.json()).then(function (data) {
            console.log(data);
            document.getElementById("icons").innerHTML = "";
            data.hits.forEach((hit) => {
                let img = document.createElement("img");
                img.src = hit.lowResPngUrl;
                document.getElementById("icons").appendChild(img);
                img.onerror = function () {
                    this.remove();
                };
                img.onclick = function () {
                    document.getElementById("icon").value = hit.icnsUrl;
                    document.getElementById("icon-preview").src = img.src;
                    document.getElementById("iconModal").style.display = "none";
                };
            });
        });
    });
}
searchIcons("");
