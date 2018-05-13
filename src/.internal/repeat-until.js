import noRequest from './no-request'

function repeatUntil(callback) {
    if (callback == null) {
        return noRequest()
    }
    const request = {}
    const loop = () => {
        if (callback() !== false) {
            request.id = requestAnimationFrame(loop)
        }
    }
    request.id = requestAnimationFrame(loop)
    return request
}

export default repeatUntil
