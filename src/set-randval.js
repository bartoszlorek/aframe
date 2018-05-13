import noRequest from './.internal/no-request'
import repeatDelay from './.internal/repeat-delay'
import factor from './.internal/factor'

function setRandval(callback, delay, variation, ...params) {
    if (callback == null) {
        return noRequest()
    }
    const request = {}
    const iterate = initial => {
        if (request.id !== -1) {
            if (!initial && callback.apply(null, params) === false) {
                return false
            }
            let freq = delay + factor(variation)
            if (freq < 0) {
                freq = 0
            }
            let { id } = repeatDelay(iterate, freq)
            request.id = id
        }
        return false
    }
    iterate(true)
    return request
}

export default setRandval
