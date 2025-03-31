import { sum } from '../src/utils/foo.js';

describe('Example', () => {
    it('should pass', () => {
        expect(true).toBe(true);
    });

    it('should sum', () => {
        expect(sum(1, 2)).toBe(3);
        expect(sum(2, 2)).toBe(4);
        //expect(sum(103, 2)).toBe(206);
    });
});
