import './.utils/raf-polyfill'

import clear from './clear'
import setFrameInterval from './set-frame-interval'
import setFrameTimeout from './set-frame-timeout'
import waitTimeout from './wait-timeout'
import setTaskout from './set-taskout'
import setRandval from './set-randval'

const api = {
    clear,
    setInterval: setFrameInterval,
    setTimeout: setFrameTimeout,
    waitTimeout,
    setTaskout,
    setRandval
}

export default api
