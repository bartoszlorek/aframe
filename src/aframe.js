
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
            if (callback() !== false)
                request.id = requestAnimationFrame(loop);
        } request.id = requestAnimationFrame(loop);
        return request;
    }

    function repeatFrames(callback, frames) {
        var args = Array.prototype.slice.call(arguments, 2),
            start = 0;
        return repeat(function() {
            if (start >= (frames || 0)) {
                if (callback.apply(null, args) === false)
                    return false;
            } start++;
        });
    }

    function repeatDelay(callback, delay) {
        var args = Array.prototype.slice.call(arguments, 2),
            start = Date.now();
        return repeat(function() {
            var current = Date.now(),
                delta = current - start;
            if (delta >= (delay || 0)) {
                if (callback.apply(null, args) === false)
                    return false;
                start = current;
            } 
        });
    }

    // [value, param1, param2, ..., ]callback
    function parseArguments(dirtyArguments) {
        if (typeof dirtyArguments !== 'object')
            return null;
        var params = Array.prototype.slice.call(dirtyArguments),
            paramStart = typeof params[0] === 'number' ? 1 : 0;
        return {
            value: typeof params[0] === 'number' && params[0] || 0,
            extra: params.slice(paramStart, -1),
            callback: typeof params[params.length-1] === 'function'
                && params.slice(-1)[0] || function() {}
        }
    }

    function Deferred(method, methodName, dirtyArguments) {
        methodName = methodName || 'then';
        var state = 'pending',
            deferred = null,
            self = this;

        this.id = [];
        this.params = parseArguments(dirtyArguments);
        this.resolve = function() {
            var request,
                wrapper = function() {
                    state = 'resolved';
                    self.params.callback.apply(null, arguments);
                    if (deferred !== null) {
                        deferred.resolve();
                    }
                },
            params = Array.prototype.slice.call(self.params.extra);
            params.unshift(wrapper, self.params.value);
            request = method.apply(null, params);
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
        setTimeout: function(callback) {
            var params = Array.prototype.slice.call(arguments, 1);
                params.unshift(function() {
                    callback.apply(null, arguments);
                    return false;
                });
            return repeatDelay.apply(null, params);
        },
        wait: function() {
            return new Deferred(this.setTimeout, 'wait', arguments);
        }
    }

});