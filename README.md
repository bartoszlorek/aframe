# Request Animation Frame Utilities
Includes [polyfill](https://gist.github.com/paulirish/1579671) by Erik Möller (fixes from Paul Irish and Tino Zijdel).

## Methods
The `setTimeout` and `setInterval` are similar to native JavaScript functions but operate on animation frames.

### setTimeout
```javascript
.setTimeout(callback, delay=0, param1, param2, ...)
```

### setInterval
```javascript
.setInterval(callback, delay=0, param1, param2, ...)
```
The `callback` function may exit iteration early by returning `false`.

### waitTimeout
```javascript
.waitTime(callback, delay=0, param1, param2, ...)
```
Chain multiple `setTimeout` methods where previous `callback` function starts next timer. Function that returns `false` stops execution of next methods.

### setTaskout
```javascript
.setTaskout(callback, duration=0, steps=1, param1, param2, ...)
```
Method similar to the `setTimeout` but call the function `steps` times in `duration` time. The `callback` function is invoked with arguments: `progress` which is a number from 0 to 1 and n additional parameters.

### setRandval
```javascript
.setRandval(callback, delay=0, variation=0, param1, param2, ...)
```
Method similar to the `setInterval` but call the iteration function with random `variation`. Final delay time is calculated as `delay + random(+/-variation)`.

### clear
```javascript
.clear(request)
```
Clear a request animation frame of methods above. The `request` object is a return of them.

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
