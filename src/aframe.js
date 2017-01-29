
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

    function repeatFrames(callback, frames, context) {
        var start = 0;
        return repeat(function(request) {
            if (start >= (frames || 0)) {
                if (callback.call(context, request) === false)
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

    // value [, context ] [, callback ]
    function parseArguments(args) {
        if (typeof args !== 'object')
            return null;
        return {
            value: typeof args[0] === 'number' && args[0] || 0,
            context: typeof args[2] === 'function' && args[1] || null,
            callback: args[2] || typeof args[1] === 'function' && args[1]
                              || typeof args[0] === 'function' && args[0]
                              || function() {}
        }
    }

    function Deferred(method, methodName, parameters) {
        methodName = methodName || 'then';
        var state = 'pending',
            deferred = null,
            self = this;

        this.id = [];
        this.params = parseArguments(parameters);
        this.resolve = function() {
            var request = method(function() {
                state = 'resolved';
                self.params.callback.call(self.params.context);
                if (deferred !== null) {
                    deferred.resolve();
                }
            }, self.params.value);
            this.id.push(request);
        }

        this[methodName] = function() {
            deferred = new Deferred(method, methodName);
            deferred.params = parseArguments(arguments);
            deferred.id = this.id;

            if (state === 'resolved')
                deferred.resolve();
            return deferred;
        }

        if (this.params !== null)
            this.resolve();
    }

    return {
        clear: function(request) {
            if (!request.hasOwnProperty('id'))
                return;
            cancelAnimationFrame(
                request.id.constructor === Array ?
                request.id[request.id.length-1].id :
                request.id
            );
        },
        setInterval: repeatDelay,
        setTimeout: function(callback, delay, context) {
            return repeatDelay(function(request) {
                callback(request);
                return false;
            }, delay, context);
        },
        wait: function() {
            return new Deferred(this.setTimeout, 'wait', arguments);
        }
    }

});