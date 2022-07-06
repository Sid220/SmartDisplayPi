fullApps.init();
fullApps.show();
[...fullApps.appList.getElementsByTagName("a")].forEach(app => {
    app.href = "#";
})
const Sortable = require("sortablejs");
new Sortable(fullApps.appList, {
    filter: '.full-apps-search',
    onMove(e) {
        return e.related.className.indexOf('full-apps-search') === -1;
    },
    store: {
        /**
         * Get the order of elements. Called once during initialization.
         * @param   {Sortable}  sortable
         * @returns {Array}
         */
        get: function(sortable) {
            var order = settings.get("appListAppsOrder", null);
            return order ? order.split("|") : [];
        },

        /**
         * Save the order of elements. Called onEnd (when the item is dropped).
         * @param {Sortable}  sortable
         */
        set: function(sortable) {
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
         * @param   {Sortable}  sortable
         * @returns {Array}
         */
        get: function(sortable) {
            var order = settings.get("shortcutList", null);
            return order ? order.split("|") : [];
        },

        /**
         * Save the order of elements. Called onEnd (when the item is dropped).
         * @param {Sortable}  sortable
         */
        set: function(sortable) {
            var order = sortable.toArray();
            settings.set("shortcutList", order.join("|"));
        }
    },
});

let holdMc = new Hammer(document.getElementsByClassName("app-list-app"));

holdMc.on("press", function(ev) {
    alert("Pressed!")
});