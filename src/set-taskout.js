import Fraction from 'fraction.js'
import noRequest from './.internal/no-request'
import repeatDelay from './.internal/repeat-delay'

function setTaskout(callback, duration, steps, ...params) {
    if (callback == null) {
        return noRequest()
    }
    steps = steps && steps > 0 ? steps : 1
    let progress = new Fraction(0)
    const task = () => {
        if (progress < 1 && request.id !== -1) {
            progress = progress.add(1 / steps)
            if (callback(progress.valueOf(), ...params) !== false) {
                return true
            }
        }
        return false
    }
    const delay = Math.round(duration / steps)
    const request = repeatDelay(task, delay)
    return request
}

export default setTaskout
