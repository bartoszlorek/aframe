import './.globals'
import waitTimeout from '../src/wait-timeout'
import clear from '../src/clear'

describe('waitTimeout', () => {
    it('should handle errors', () => {
        const falsy = expect.objectContaining({
            waitTimeout: expect.any(Function),
            id: -1
        })
        expect(waitTimeout()).toEqual(falsy)
        expect(waitTimeout(null)).toEqual(falsy)
        jest.runTimersToTime(100)
    })

    it('should call steps in sequence', () => {
        let counter = 0
        const stack = []
        const timer = setInterval(() => ++counter, 1)
        const step1 = jest.fn(() => stack.push(counter))
        const step2 = jest.fn(() => stack.push(counter))
        const step3 = jest.fn(() => stack.push(counter))
        const step4 = jest.fn(() => stack.push(counter))
        const request = waitTimeout(step1, 10)
            .waitTimeout(step2, 10)
            .waitTimeout(step3, 20)
            .waitTimeout(step4, 30)

        jest.runTimersToTime(200)
        expect(stack).toEqual([10, 20, 40, 70])
    })

    it('should stop after falsy output', () => {
        let limit = 2
        const callback = jest.fn(() => --limit > 0)
        const request = waitTimeout(callback, 10)
            .waitTimeout(callback, 10)
            .waitTimeout(callback, 20)
            .waitTimeout(callback, 30)

        jest.runTimersToTime(200)
        expect(callback).toHaveBeenCalledTimes(2)
    })

    it('should stop after 20 ms', () => {
        const callback = jest.fn()
        const request = waitTimeout(callback, 10)
            .waitTimeout(callback, 10)
            .waitTimeout(callback, 20)
            .waitTimeout(callback, 30)

        setTimeout(() => clear(request), 20)
        jest.runTimersToTime(200)
        expect(callback).toHaveBeenCalledTimes(2)
    })

    it('should handle extra parameters', () => {
        const callback = jest.fn()
        waitTimeout(callback, 10, 'a', 'b')
            .waitTimeout(callback, 20, 'c', 'd')
            .waitTimeout(callback, 30, 'e', 'f')

        jest.runTimersToTime(200)
        const { calls } = callback.mock
        expect(calls).toEqual([['a', 'b'], ['c', 'd'], ['e', 'f']])
    })
})
