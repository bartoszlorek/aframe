
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

    function repeatUntilFrame(callback, frame, context) {
        var start = 0;
        return repeat(function(request) {
            if (start >= (frame || 0)) {
                callback.call(context, request);
                return false;
            } start++;
        });
    }

    function repeatDelay(callback, delay, context) {
        var start = Date.now();
        return repeat(function(request) {
            var current = Date.now(),
                delta = current - start;
            if (delta >= (delay || 0)) {
                if (callback.call(context, request) === false)
                    return false;
                start = current;
            } 
        });
    }

    function waitForFrame(delay, callback) {
        var out = { wait: wait },
            sum = 0;

        function wait(delay, callback) {
            callback = typeof delay === 'function' ? delay
                : (typeof callback === 'function' ? callback
                : function() {});
            delay = typeof delay === 'number' ? delay : 1;
            sum += delay;

            repeatUntilFrame(function() {
                if (typeof callback === 'function')
                    callback.call();
                return false;
            }, sum);
            return out;
        }
        return wait(delay, callback);
    }

    return {
        setInterval: repeatDelay,
        setTimeout: function(callback, delay, context) {
            return repeatDelay(function(request) {
                callback(request);
                return false;
            }, delay, context);
        },
        clear: function(request) {
            if (request.hasOwnProperty('id'))
                cancelAnimationFrame(request.id);
        },
        wait: waitForFrame
    }

});