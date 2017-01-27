
define( [], function () {

    // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    // http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
    // requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
    // MIT license

    (function () {
        var lastTime = 0;
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
                || window[vendors[x] + 'CancelRequestAnimationFrame'];
        }

        if (!window.requestAnimationFrame)
            window.requestAnimationFrame = function (callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function () { callback(currTime + timeToCall); },
                    timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };

        if (!window.cancelAnimationFrame)
            window.cancelAnimationFrame = function (id) {
                clearTimeout(id);
            };
    } ());

    function repeat(callback) {
        var request = {};
        function loop() {
            if (callback(request) !== false)
                request.id = requestAnimationFrame(loop);
        } request.id = requestAnimationFrame(loop);
        return request;
    }

    function repeatDelay(callback, delay, context) {
        var start = Date.now();
        return repeat(function(request) {
            if (isExpired(start, delay)) {
                if (callback.call(context, request) === false)
                    return false;
                start = Date.now();
            } 
        });
    }

    function isExpired(start, duration) {
        var current = Date.now(),
            delta = current - start;
        return (delta >= (duration || 0));
    }

    function clear(request) {
        if (request.hasOwnProperty('id'))
            cancelAnimationFrame(request.id);
    }

    return {
        clear: clear,
        setInterval: repeatDelay,
        setTimeout: function(callback, delay, context) {
            return repeatDelay(function(request) {
                callback(request);
                return false;
            }, delay, context);
        }
    }

});