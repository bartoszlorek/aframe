import './.globals'
import setRandval from '../src/set-randval'
import clear from '../src/clear'

const expectToBeInRange = (value, a, b) => {
    expect(value).toBeGreaterThanOrEqual(a)
    expect(value).toBeLessThanOrEqual(b)
}

describe('setRandval', () => {
    it('should handle errors', () => {
        expect(setRandval()).toEqual({ id: -1 })
        expect(setRandval(null)).toEqual({ id: -1 })
        jest.runTimersToTime(100)
    })

    it('should assign 0 to the falsy delay', () => {
        const callback = jest.fn()
        setRandval(callback)

        jest.runTimersToTime(100)
        expect(callback).toHaveBeenCalledTimes(100)
    })

    it('should assign 0 to the falsy variation', () => {
        const callback = jest.fn()
        setRandval(callback, 10)

        jest.runTimersToTime(100)
        expect(callback).toHaveBeenCalledTimes(100)
    })

    it('should call 4 times with different delays', () => {
        const callback = jest.fn()
        setRandval(callback, 50, 10)

        jest.runTimersToTime(200)
        // min: 200 / (50 + 10) = ceil(3.33) - 1 = 3
        // max: 200 / (50 - 10) = 5 - 1 = 4
        // x-1 because callback is after conditional
        const { calls } = callback.mock
        expectToBeInRange(calls.length, 3, 4)
    })

    it('should stop repeats after 50 ms (inclusive)', () => {
        const callback = jest.fn()
        const request = setRandval(callback, 20, 5)
        setTimeout(() => clear(request), 50)

        // min: 50 / (20 + 5) = 2 - 1 = 1
        // max: 50 / (20 - 5) = ceil(3.33) - 1 = 3
        // x-1 because callback is after conditional
        jest.runTimersToTime(200)
        const { calls } = callback.mock
        expectToBeInRange(calls.length, 1, 3)
    })

    it('should handle extra parameters', () => {
        const callback = jest.fn()
        setRandval(callback, 50, 10, 'a', 'b')

        jest.runTimersToTime(200)
        expect(callback).toHaveBeenLastCalledWith('a', 'b')
    })
})
