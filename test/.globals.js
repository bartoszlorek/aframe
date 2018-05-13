const createDateNow = (now = 0) => {
    return () => now++
}

global.requestAnimationFrame = callback => {
    return setTimeout(callback, 1)
}
global.cancelAnimationFrame = requestId => {
    clearTimeout(requestId)
}
jest.useFakeTimers()

beforeEach(() => {
    global.Date.now = createDateNow()
    jest.clearAllTimers()
})
