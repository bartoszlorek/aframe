import repeatDelay from './.internal/repeat-delay'

function waitTimeout(callback, delay, ...params) {
    let index = 0,
        request = {}

    const stack = []
    const self = (...args) => {
        stack.push(args)
        request = {
            waitTimeout: self,
            id: -1
        }
        return request
    }
    setTimeout(() => {
        const resolve = () => {
            let args = stack[index++]
            if (args === undefined) {
                return
            }
            let callback = args[0]
            if (callback == null) {
                return resolve()
            }
            args[0] = function() {
                let result = callback.apply(null, arguments)
                if (result !== false && request.id !== -1) {
                    resolve()
                }
                return false
            }
            let { id } = repeatDelay.apply(null, args)
            request.id = id
        }
        resolve()
    }, 0)

    return self.apply(null, arguments)
}

export default waitTimeout
