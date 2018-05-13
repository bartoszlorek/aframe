import './.globals'
import setFrameTimeout from '../src/set-frame-timeout'

describe('setFrameTimeout', () => {
    it('should handle errors', () => {
        expect(setFrameTimeout()).toEqual({ id: -1 })
        expect(setFrameTimeout(null)).toEqual({ id: -1 })
        jest.runTimersToTime(100)
    })

    it('should assign 0 to the falsy delay', () => {
        const callback = jest.fn()
        const request = setFrameTimeout(callback)
        expect(request).not.toEqual({ id: -1 })
        jest.runTimersToTime(100)
    })

    it('should call only once', () => {
        const callback = jest.fn()
        setFrameTimeout(callback)

        jest.runTimersToTime(100)
        expect(callback).toHaveBeenCalledTimes(1)
    })

    it('should stop timer after 20 ms', () => {
        let counter = 0
        const timer = setInterval(() => ++counter, 1)
        const callback = jest.fn(() => clearInterval(timer))
        const request = setFrameTimeout(callback, 20)

        jest.runTimersToTime(100)
        expect(callback).toHaveBeenCalledTimes(1)
        expect(counter).toBe(20)
    })

    it('should handle extra parameters', () => {
        const callback = jest.fn()
        const request = setFrameTimeout(callback, 5, 'a', 'b')

        jest.runTimersToTime(100)
        expect(callback).toHaveBeenCalledTimes(1)
        expect(callback).toHaveBeenCalledWith('a', 'b')
    })
})
