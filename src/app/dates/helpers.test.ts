import {formatYMD} from './formatYMD';
import {shiftDateForward} from './helpers';
import {ShiftDateOption} from './defs';

describe('#shiftDateForward()', () => {
    it('should default times to 1', () => {
        expect(formatYMD(shiftDateForward('2018-01-01', ShiftDateOption.oneMonth))).toEqual('2018-02-01');
    });

    describe('When times is specified', () => {
        it('should shift that many times', () => {
            expect(formatYMD(shiftDateForward('2018-01-01', ShiftDateOption.oneMonth, 2))).toEqual('2018-03-01');
            expect(formatYMD(shiftDateForward('2018-01-01', ShiftDateOption.oneMonth, 3))).toEqual('2018-04-01');
            expect(formatYMD(shiftDateForward('2018-01-01', ShiftDateOption.oneMonth, 4))).toEqual('2018-05-01');
            expect(formatYMD(shiftDateForward('2018-01-01', ShiftDateOption.oneMonth, 5))).toEqual('2018-06-01');
        });
    });
});
