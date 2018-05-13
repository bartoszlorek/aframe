import './.globals'
import setFrameInterval from '../src/set-frame-interval'
import clear from '../src/clear'

describe('clear', () => {
    it('should handle falsy values', () => {
        expect(() => clear()).not.toThrow()
        expect(() => clear(null)).not.toThrow()
        expect(() => clear({})).not.toThrow()
        expect(() => clear(20)).not.toThrow()
    })

    it('should stop interval after 50 ms (inclusive)', () => {
        const callback = jest.fn()
        const request = setFrameInterval(callback, 10)
        setTimeout(() => clear(request), 50)

        jest.runTimersToTime(150) // 100 frames more
        expect(callback).toHaveBeenCalledTimes(4)
    })

    it('should assign -1 to the request id', () => {
        const request = { id: 10 }
        clear(request)
        expect(request).toEqual({ id: -1 })
    })
})
