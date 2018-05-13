import './.globals'
import repeatDelay from '../src/.internal/repeat-delay'

describe('repeatDelay', () => {
    it('should handle errors', () => {
        expect(repeatDelay()).toEqual({ id: -1 })
        expect(repeatDelay(null)).toEqual({ id: -1 })
        jest.runTimersToTime(100)
    })

    it('should assign 0 to the falsy delay', () => {
        const callback = jest.fn()
        repeatDelay(callback)

        jest.runTimersToTime(100)
        expect(callback).toHaveBeenCalledTimes(100)
    })

    it('should stop after falsy output', () => {
        let limit = 5
        const callback = jest.fn(() => --limit > 0)
        const request = repeatDelay(callback, 20)

        jest.runTimersToTime(200) // 100 frames more
        expect(callback).toHaveBeenCalledTimes(5)
    })

    it('should call 10 times (every 20 sec)', () => {
        const callback = jest.fn()
        const request = repeatDelay(callback, 20)

        jest.runTimersToTime(200)
        expect(callback).toHaveBeenCalledTimes(10)
    })

    it('should handle extra parameters', () => {
        const callback = jest.fn()
        const request = repeatDelay(callback, 20, 'a', 'b')

        jest.runTimersToTime(200)
        expect(callback).toHaveBeenCalledTimes(10)
        expect(callback).toHaveBeenCalledWith('a', 'b')
    })
})