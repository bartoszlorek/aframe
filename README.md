# Request Animation Frame Utilities
Includes [polyfill](https://gist.github.com/paulirish/1579671) by Erik Möller (fixes from Paul Irish and Tino Zijdel).

## Methods
The `setTimeout` and `setInterval` are similar to native JavaScript functions but operate on animation frames.

### setTimeout
```javascript
.setTimeout(callback, delay=0, param1, param2, ...)
```
Returns the `request` object.

### setInterval
```javascript
.setInterval(callback, delay=0, param1, param2, ...)
```
The `callback` function may exit iteration early by returning `false`. Method returns the `request` object.

### waitTimeout
```javascript
.waitTimeout(callback, delay=0, param1, param2, ...)
```
Chain multiple `setTimeout` methods where previous `callback` function starts next timer. Function that returns `false` stops execution of next methods. Method returns the `request` object.

### setTaskout
```javascript
.setTaskout(callback, duration=0, steps=1, param1, param2, ...)
```
Method similar to the `setTimeout` but call the function `steps` times in `duration` time. The `callback` function is invoked with arguments: `progress` which is a number from 0 to 1 and n additional parameters. Method returns the `request` object.

### setRandval
```javascript
.setRandval(callback, delay=0, variation=0, param1, param2, ...)
```
Method similar to the `setInterval` but calls each iteration function after random `variation` time. Final delay time is calculated as `delay + random(+/-variation)`. Method returns the `request` object.

### clear
```javascript
.clear(request)
```
Clear a request animation frame of any method.

## Examples
Clear `request` after timeout.
```javascript
let request = aframe.setInterval(() => {
    console.log('fire!')
}, 100)

aframe.setTimeout(() => {
    aframe.clear(request)
}, 1000)
```

Return `false` to exit iteration.
```javascript
let counter = 0
aframe.setInterval(() => {
    if (++counter >= 5) {
        return false
    }
}, 100)
```

The third `callback` function won't be executed.
```javascript
let request = aframe
    .waitTimeout(() => console.log('Hello'), 300)
    .waitTimeout(name => console.log(name), 100, 'John')
    .waitTimeout(surname => console.log(surname), 200, 'Doe') 

aframe.setTimeout(() => {
    aframe.clear(request)
}, 500)
```
