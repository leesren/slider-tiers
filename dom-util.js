const UTIL = {

    resizeCanvas: (canvas, w, h) => {
        const canvasResized = document.createElement('canvas');
        canvasResized.width = w;
        canvasResized.height = h;
        canvasResized.getContext('2d').drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, w, h);
        return canvasResized;
    },

    drawRoundRect: (ctx, x, y, w, h, r) => {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
    },

    wrapText: (ctx, text, conf) => {
        let separator = ' ';
        let words = [];

        if (document.documentElement.lang == 'ja') {
            const notAtStartOfLine = ')]｝〕〉》」』】〙〗〟’"｠»‐゠–〜?!‼⁇⁈⁉・、:;,。.';
            const notAtEndOfLine = '([｛〔〈《「『【〘〖〝‘"｟«';

            for (let i = 0; i < text.length; i++) {
                const thisChar = text[i];
                const nextChar = text[i + 1];

                if (nextChar && notAtStartOfLine.indexOf(nextChar) >= 0) {
                    words.push(thisChar + nextChar);
                    i++;
                } else if (nextChar && notAtEndOfLine.indexOf(thisChar) >= 0) {
                    words.push(thisChar + nextChar);
                    i++;
                } else {
                    words.push(thisChar);
                }
            }

            separator = '';

        } else {
            words = text.split(separator);
        }

        const maxLineLength = conf.width - conf.padding[0] - conf.padding[2];
        let line = '';
        let y = conf.padding[1];

        for (var i = 0; i < words.length; i++) {
            const testLine = line + words[i] + separator;
            const metrics = ctx.measureText(testLine.trim());

            if (metrics.width > maxLineLength) {
                ctx.fillText(line.trim(), conf.padding[0], y);
                line = words[i] + separator;
                y += conf.lineHeight;
            } else {
                line = testLine;
            }

            ctx.fillText(line.trim(), conf.padding[0], y);
        }
    },

    createEl: (tag, attrs) => {
        const el = document.createElement(tag);
        Object.keys(attrs).forEach(prop => el[prop] = attrs[prop]);
        return el;
    }, 

    addNormalizedListener: (el, eventName, callback) => {
        const MOUSE = 0, TOUCH = 1, POINTER = 2;
        const EVENTS = {
            'enter': ['mouseenter', null, 'pointerenter'],
            'leave': ['mouseleave', null, 'pointerleave'],
            'down': ['mousedown', 'touchstart', 'pointerdown'],
            'move': ['mousemove', 'touchmove', 'pointermove'],
            'up': ['mouseup', 'touchend', 'pointerup'],
        };

        if (window.PointerEvent) {
            el.addEventListener(EVENTS[eventName][POINTER], e => UTIL.normalizeEvent(e, callback));
        } else {
            if (EVENTS[eventName][MOUSE]) el.addEventListener(EVENTS[eventName][MOUSE], e => UTIL.normalizeEvent(e, callback));
            el.addEventListener(EVENTS[eventName][TOUCH], e => UTIL.normalizeEvent(e, callback));
        }
    },

    normalizeEvent: (e, callback) => {
        if (e.changedTouches && e.changedTouches.length) {
            callback(e, {
                x: e.changedTouches[0].clientX,
                y: e.changedTouches[0].clientY,
                canHover: false,
            });
        } else {
            callback(e, {
                x: e.clientX,
                y: e.clientY,
                canHover: true,
            });
        }
    },

    setVendorStyle: (el, prop, val) => {
        ['-webkit-', '-ms-', '-moz-', ''].forEach(prefix => {
            el.style[prefix + prop] = val;
        })
    },

    preventWheelBubbles: function (e) {
        e.preventDefault();
        e.stopPropagation();

        const scale = e.deltaMode > 0 ? 40 : 1;

        this.scrollTop += e.deltaY * scale;
        this.scrollLeft += e.deltaX * scale;
    },

    rgbInterpolate: function (c1, c2, p) {
        return `rgb(${
            Math.round(Strut.interpolate(c1[0], c2[0], p))}, ${
            Math.round(Strut.interpolate(c1[1], c2[1], p))}, ${
            Math.round(Strut.interpolate(c1[2], c2[2], p))})`;
    },

    currency: function (n, loc, cur, { minDecimal, maxDecimal } = {}) {
        let localeString = n.toLocaleString(loc, {
            style: 'currency', currency: cur,
            minimumFractionDigits: minDecimal, maximumFractionDigits: maxDecimal
        })

        localeString = localeString.replace(/SGD/, 'S$');

        if (/DKK|NOK|SEK/.test(localeString)) localeString = localeString.replace(/DKK|NOK|SEK/, '') + 'kr';

        return localeString;
    },

    delayedHandler: function (cb, delay) {
        delay = delay || 250;
        let timeout;

        return function () {
            clearTimeout(timeout);
            timeout = setTimeout(cb, delay);
        };
    },

};

// export default UTIL;