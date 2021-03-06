import {ShiftDateOption} from 'app/dates/defs';
import {QueryParam} from 'app/QueryParam';
import {IncludeOption} from 'include/defs';
import moment from 'moment';
import {useQueryParamState} from 'app/url';

export const getStartDate = ({endDate, include}: {endDate: string; include: IncludeOption}): string => {
    let date: Date | null = moment(endDate).toDate();

    date.setHours(0, 0, 0, 0);

    switch (include) {
        case IncludeOption.monthToDate:
            date.setDate(1);
            break;
        case IncludeOption.weekToDate:
            date.setDate(date.getDate() - date.getDay() + 1);
            break;
        case IncludeOption.yearToDate:
            date = new Date(date.getFullYear(), 0, 1);
            break;
        default:
            date = null;
            break;
    }

    return date ? moment(date).toISOString() : '';
};

const getMomentArgsForDateShift = (option: ShiftDateOption, times = 1) => {
    const one = 1;

    switch (option) {
        case ShiftDateOption.oneDay:
            return [one * Number(times), 'day'];
        case ShiftDateOption.oneWeek:
            return [one * Number(times), 'week'];
        case ShiftDateOption.twoWeeks:
            return [2 * Number(times), 'week'];
        case ShiftDateOption.oneMonth:
            return [one * Number(times), 'month'];
        case ShiftDateOption.oneYear:
            return [one * Number(times), 'year'];
    }

    throw new Error(`${option} is not specified in ShiftDateOptions`);
};

export const shiftDateForward = (date: string | Date, by: ShiftDateOption, times?: number) =>
    moment(date)
        .add(...getMomentArgsForDateShift(by, times))
        .toDate();

export const shiftDateBack = (date: string | Date, by: ShiftDateOption, times?: number) =>
    moment(date)
        .subtract(...getMomentArgsForDateShift(by, times))
        .toDate();

export const endOfDayToISOString = (date = new Date(Date.now())) => {
    const workingDate = new Date(date);

    workingDate.setHours(23, 59, 59, 999);

    return moment(workingDate).toISOString();
};
export const getInitialEndDate = (): string => {
    const date = new Date();

    date.setDate(date.getDate() + 7);

    return endOfDayToISOString(date);
};

export const useEndDate = () => {
    return useQueryParamState(QueryParam.endDate, getInitialEndDate());
};
