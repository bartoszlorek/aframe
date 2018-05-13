import noRequest from './.internal/no-request'
import repeatDelay from './.internal/repeat-delay'

function setFrameTimeout(callback, delay, ...params) {
    if (callback == null) {
        return noRequest()
    }
    let wrap = () => {
        callback.apply(null, params)
        return false
    }
    return repeatDelay(wrap, delay)
}

export default setFrameTimeout
