// Utility functions
var Strut = {

    // Random float between min and max
    random: function (min, max) {
        return Math.random() * (max - min) + min;
    },

    // Returns a random item from an array
    arrayRandom: function (arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    },

    // Linear interpolation between a and b
    // Ex: (100, 200, 0.5) = 150
    interpolate: function (a, b, i) {
        return a * (1 - i) + b * i;
    },

    // Calculate how far i is between a and b
    // Ex: (100, 200, 150) = 0.5
    rangePosition: function (a, b, i) {
        return (i - a) / (b - a);
    },

    // Limits a number on both min and max ends
    clamp: function (num, min, max) {
        return Math.max(Math.min(num, max), min);
    },

    // querySelectorAll as an array
    queryArray: function (selector, node) {
        if (!node) node = document.body;
        return Array.prototype.slice.call(node.querySelectorAll(selector));
    },

    // Handle DOMContentLoaded after document has already been loaded
    ready: function (fn) {
        if (document.readyState !== 'loading') fn();
        else document.addEventListener('DOMContentLoaded', fn);
    },

};

// Retina detection -- matches `@media (--retina)`

Strut.isRetina = window.devicePixelRatio > 1.3;

// Mobile viewport detection, also matching our media queries

Strut.mobileViewportWidth = 670;
Strut.isMobileViewport = window.innerWidth < Strut.mobileViewportWidth;

window.addEventListener('resize', function () {
    Strut.isMobileViewport = window.innerWidth < Strut.mobileViewportWidth;
});

// Touch helpers

Strut.touch = {
    isSupported: 'ontouchstart' in window || navigator.maxTouchPoints,
    isDragging: false
};

document.addEventListener('DOMContentLoaded', function () {

    document.body.addEventListener('touchmove', function () {
        Strut.touch.isDragging = true;
    });

    document.body.addEventListener('touchstart', function () {
        Strut.touch.isDragging = false;
    });

});

// Async (pre)loading of resources

Strut.load = {

    images: function (urls, callback) {
        if (typeof urls === 'string') urls = [urls];

        var progress = -urls.length;

        urls.forEach(function (url) {
            var img = new Image();
            img.src = url;

            img.onload = function () {
                progress++;
                if (progress === 0 && callback) callback();
            };
        });
    },

    css: function (url, callback) {
        var el = document.createElement('link');
        var fileMap = window.readConfig('strut_files') || {};
        var realUrl = fileMap[url];
        if (!realUrl) {
            throw new Error('CSS file "' + url + '" not found in strut_files config');
        }
        el.href = realUrl;
        el.rel = 'stylesheet';
        document.head.appendChild(el);

        if (callback) el.onload = callback;
    },

    js: function (url, callback) {
        var el = document.createElement('script');
        var fileMap = window.readConfig('strut_files') || {};
        var realUrl = fileMap[url];
        if (!realUrl) {
            throw new Error('Javascript file "' + url + '" not found in strut_files config');
        }
        el.src = realUrl;
        el.async = false; // keep the execution order
        document.head.appendChild(el);

        if (callback) el.onload = callback;
    },

};

// Feature detection
// Yes, we should just include modernizr once we have too many of these

Strut.supports = {

    // ES6 support

    es6: function () {
        try {
            new Function("(a = 0) => a");
            return true;
        }
        catch (err) {
            return false;
        }
    }(),

    // CSS pointer-events (missing in IE10 and below)
    // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/css/pointerevents.js

    pointerEvents: (function () {
        var style = document.createElement('a').style;
        style.cssText = 'pointer-events:auto';
        return style.pointerEvents === 'auto';
    })(),

    // CSS position: sticky

    positionSticky: Boolean(window.CSS && CSS.supports("(position: -webkit-sticky) or (position: sticky)")),

    // CSS masks or clip-path
    // Replace with a better test once IE support changes -- http://caniuse.com/#search=mask

    masks: (function () {
        return !(/MSIE|Trident|Edge/i.test(navigator.userAgent))
    })(),

};