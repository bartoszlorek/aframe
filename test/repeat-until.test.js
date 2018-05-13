import './.globals'
import repeatUntil from '../src/.internal/repeat-until'

describe('repeatUntil', () => {
    it('should handle errors', () => {
        const request = repeatUntil()
        expect(request).toEqual({ id: -1 })
        jest.runTimersToTime(100)
    })

    it('should return request object', () => {
        const callback = jest.fn()
        const request = repeatUntil(callback)

        expect(request).toEqual(
            expect.objectContaining({
                id: expect.any(Number)
            })
        )
        jest.runTimersToTime(1)
        expect(callback).toHaveBeenCalledTimes(1)
    })

    it('should stop after falsy output', () => {
        let limit = 10
        const callback = jest.fn(() => --limit > 0)
        const request = repeatUntil(callback)

        jest.runTimersToTime(100)
        expect(callback).toHaveBeenCalledTimes(10)
    })

    it('should call 20 times', () => {
        const callback = jest.fn()
        const request = repeatUntil(callback)

        jest.runTimersToTime(20)
        expect(callback).toHaveBeenCalledTimes(20)
    })
})
