import './.globals'
import setTaskout from '../src/set-taskout'
import clear from '../src/clear'

describe('setTaskout', () => {
    it('should handle errors', () => {
        expect(setTaskout()).toEqual({ id: -1 })
        expect(setTaskout(null)).toEqual({ id: -1 })
        jest.runTimersToTime(100)
    })

    it('should assign 0 to the falsy duration', () => {
        const callback = jest.fn()
        setTaskout(callback)

        jest.runTimersToTime(200)
        expect(callback).toHaveBeenCalledTimes(1)
        expect(callback).toHaveBeenCalledWith(1)
    })

    it('should assign 1 to the falsy steps', () => {
        const callback = jest.fn()
        setTaskout(callback, 10)

        jest.runTimersToTime(200)
        expect(callback).toHaveBeenCalledTimes(1)
        expect(callback).toHaveBeenCalledWith(1)
    })

    it('should call 4 times with progress', () => {
        const callback = jest.fn()
        setTaskout(callback, 50, 4)

        jest.runTimersToTime(200)
        const { calls } = callback.mock
        expect(calls).toEqual([[0.25], [0.5], [0.75], [1]])
    })

    it('should stop after 10 ms (inclusive)', () => {
        const callback = jest.fn()
        const request = setTaskout(callback, 20, 5)
        setTimeout(() => clear(request), 10)

        jest.runTimersToTime(200)
        const { calls } = callback.mock
        expect(calls).toEqual([[0.2], [0.4]])
    })

    it('should stop after 50% of progress', () => {
        const callback = jest.fn(progress => progress < 0.5)
        setTaskout(callback, 50, 20)

        jest.runTimersToTime(200)
        const { calls } = callback.mock
        expect(calls.length).toBe(10)
        expect(calls[0]).toEqual([0.05])
        expect(calls[3]).toEqual([0.2])
        expect(calls[6]).toEqual([0.35])
        expect(calls[9]).toEqual([0.5])
    })

    it('should handle extra parameters', () => {
        const callback = jest.fn()
        const request = setTaskout(callback, 10, 2, 'a', 'b')

        jest.runTimersToTime(200)
        const { calls } = callback.mock
        expect(calls).toEqual([[0.5, 'a', 'b'], [1, 'a', 'b']])
    })
})
