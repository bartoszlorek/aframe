# aframe
Request Animation Frame Utilities AMD. Includes polyfill by Erik Möller (fixes from Paul Irish and Tino Zijdel).

## Usage
Methods similar to native JavaScript functions.

```
.setTimeout( function[, delay] )
.setInterval( function[, delay] )
```

Chain multiple `setTimeout` methods, behaving like a promise in few different forms.

```
.wait( function )
.wait( delay, function )
.wait( delay, context, function )
```

Clear a `request` set with the methods above. The `request` is a return of them.

```
.clear( request )
```

## Examples

```javascript
require( ['aframe'], function(af) { ... })
```

Clear `request` after timeout.

```javascript
var request = af.setInterval(function() {
    console.log('fire!');
}, 100);

af.setTimeout(function() {
    af.clear(request);
}, 1000);
```

Return `false` in callback function to clear.

```javascript
var counter = 0;
af.setInterval(function() {
    counter++;
    if (counter > 10) {
        return false;
    }
}, 100);
```

The second callback in this example won't be executed.

```javascript
var request = af.wait(300, function() {
    console.log('hello');

}).wait(100, context, function() {
    console.log('hello with context', this);

}).wait(function() {
    console.log('he is fast, but not enough');
});

af.setTimeout(function() {
    af.clear(request);
}, 400);
```
