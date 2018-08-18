'use strict';

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
(function () {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) window.requestAnimationFrame = function (callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function () {
            callback(currTime + timeToCall);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };

    if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function (id) {
        clearTimeout(id);
    };
})();

function isRequest(value) {
    return value && typeof value.id === 'number';
}

function clear(request) {
    if (isRequest(request)) {
        cancelAnimationFrame(request.id);
        request.id = -1;
    }
}

function noRequest() {
    return { id: -1 };
}

function repeatUntil(callback) {
    if (callback == null) {
        return noRequest();
    }
    var request = {};
    var loop = function loop() {
        if (callback() !== false) {
            request.id = requestAnimationFrame(loop);
        }
    };
    request.id = requestAnimationFrame(loop);
    return request;
}

function repeatDelay(callback, delay) {
    for (var _len = arguments.length, params = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        params[_key - 2] = arguments[_key];
    }

    if (callback == null) {
        return noRequest();
    }
    delay = delay || 0;
    var start = Date.now();
    return repeatUntil(function () {
        var current = Date.now();
        if (current - start >= delay) {
            if (callback.apply(null, params) === false) {
                return false;
            }
            start = current;
        }
    });
}

function setFrameTimeout(callback, delay) {
    for (var _len = arguments.length, params = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        params[_key - 2] = arguments[_key];
    }

    if (callback == null) {
        return noRequest();
    }
    var wrap = function wrap() {
        callback.apply(null, params);
        return false;
    };
    return repeatDelay(wrap, delay);
}

function waitTimeout(callback, delay) {
    for (var _len = arguments.length, params = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        params[_key - 2] = arguments[_key];
    }

    var index = 0,
        request = {};

    var stack = [];
    var self = function self() {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
        }

        stack.push(args);
        request = {
            waitTimeout: self,
            id: -1
        };
        return request;
    };
    setTimeout(function () {
        var resolve = function resolve() {
            var args = stack[index++];
            if (args === undefined) {
                return;
            }
            var callback = args[0];
            if (callback == null) {
                return resolve();
            }
            args[0] = function () {
                var result = callback.apply(null, arguments);
                if (result !== false && request.id !== -1) {
                    resolve();
                }
                return false;
            };

            var _repeatDelay$apply = repeatDelay.apply(null, args),
                id = _repeatDelay$apply.id;

            request.id = id;
        };
        resolve();
    }, 0);

    return self.apply(null, arguments);
}

function t(n, i) {
  return i ? t(i, n % i) : n;
}function n(t) {
  return t && !0 === t.__fraction;
}function i(t, i) {
  return n(t) ? t : r(t, i);
}function r(n, i) {
  var r = 0,
      s = 1,
      e = 1;if (null == n || isNaN(n)) r = s = NaN;else if (void 0 !== i) {
    if (r = Math.abs(n), 0 === (s = Math.abs(i))) throw new Error("division by zero");e = n * i;
  } else if (n < 0 && (e = n, n = -n), n % 1 == 0) r = n;else {
    r = n.toString().replace(/\d+[.]/, ""), s = Math.pow(10, r.length), n > 1 && (r = +r + Math.floor(n) * s);var u = t(r, s);r /= u, s /= u;
  }return { n: r, d: s, s: e < 0 ? -1 : 1 };
}var s = { __fraction: !0, valueOf: function valueOf() {
    return this.s * this.n / this.d;
  }, add: function add(t) {
    var n = i(t);return e(this.s * this.n * n.d + n.s * n.n * this.d, this.d * n.d);
  }, subtract: function subtract(t) {
    var n = i(t);return e(this.s * this.n * n.d - n.s * n.n * this.d, this.d * n.d);
  }, multiply: function multiply(t) {
    var n = i(t);return e(this.s * n.s * this.n * n.n, this.d * n.d);
  }, divide: function divide(t) {
    var n = i(t);return e(this.s * n.s * this.n * n.d, this.d * n.n);
  } };function e(t, n) {
  var r = i(t, n),
      e = Object.create(s);return e.n = r.n, e.d = r.d, e.s = r.s, e;
}var tinyFraction_min = e;

function setTaskout(callback, duration, steps) {
    for (var _len = arguments.length, params = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
        params[_key - 3] = arguments[_key];
    }

    if (callback == null) {
        return noRequest();
    }
    steps = steps && steps > 0 ? steps : 1;
    var progress = tinyFraction_min(0),
        oneStep = tinyFraction_min(1, steps);

    var task = function task() {
        if (progress < 1 && request.id !== -1) {
            progress = progress.add(oneStep);
            if (callback.apply(undefined, [progress.valueOf()].concat(params)) !== false) {
                return true;
            }
        }
        return false;
    };
    var delay = Math.round(duration / steps);
    var request = repeatDelay(task, delay);
    return request;
}

function factor(value) {
    return (Math.random() * 2 - 1) * value;
}

function setRandval(callback, delay, variation) {
    for (var _len = arguments.length, params = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
        params[_key - 3] = arguments[_key];
    }

    if (callback == null) {
        return noRequest();
    }
    var request = {};
    var iterate = function iterate(initial) {
        if (request.id !== -1) {
            if (!initial && callback.apply(null, params) === false) {
                return false;
            }
            var freq = delay + factor(variation);
            if (freq < 0) {
                freq = 0;
            }

            var _repeatDelay = repeatDelay(iterate, freq),
                id = _repeatDelay.id;

            request.id = id;
        }
        return false;
    };
    iterate(true);
    return request;
}

var api = {
    clear: clear,
    setInterval: repeatDelay,
    setTimeout: setFrameTimeout,
    waitTimeout: waitTimeout,
    setTaskout: setTaskout,
    setRandval: setRandval
};

module.exports = api;
