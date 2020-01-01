import {getInitialEndDate} from 'utils/dates';
import {TypePreferences} from 'types';

export const parsePreferences = (
    state: Partial<TypePreferences> = {},
): TypePreferences => {
    const endDateIncrement = state.endDateIncrement || '2w';
    const include = state.include || 'all';
    const endDate = state.endDate || getInitialEndDate();
    // @ts-ignore
    const includePending = state.includePending === 'true';

    return {includePending, endDateIncrement, include, endDate};
};

export const validatePreferences = (state: Partial<TypePreferences> = {}) => {
    if (state.endDateIncrement && state.include && state.endDate) {
        return state;
    }

    return parsePreferences(state);
};