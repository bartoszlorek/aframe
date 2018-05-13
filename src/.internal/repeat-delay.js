import noRequest from './no-request'
import repeatUntil from './repeat-until'

function repeatDelay(callback, delay, ...params) {
    if (callback == null) {
        return noRequest()
    }
    delay = delay || 0
    let start = Date.now()
    return repeatUntil(() => {
        let current = Date.now()
        if (current - start >= delay) {
            if (callback.apply(null, params) === false) {
                return false
            }
            start = current
        }
    })
}

export default repeatDelay
