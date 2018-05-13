import isRequest from './.internal/is-request'

function clear(request) {
    if (isRequest(request)) {
        cancelAnimationFrame(request.id)
        request.id = -1
    }
}

export default clear
