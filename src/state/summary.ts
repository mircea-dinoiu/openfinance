import {createReducer} from '@reduxjs/toolkit';
import {useSelector} from 'react-redux';
import {Action} from 'state/defs';
import {GlobalState} from 'types';

export enum SummaryKey {
    BALANCE_BY_ACCOUNT,
}

export type Summary = Partial<{
    [SummaryKey.BALANCE_BY_ACCOUNT]: Record<number, number>;
}>;

export const summaryReducer = createReducer(
    {},
    {
        [Action.SUMMARY_ASSIGNED]: (state, {payload}) => {
            return {...state, [payload.key]: payload.value};
        },
    },
);

export const useSummary = <K extends SummaryKey>(key: K): Summary[K] => {
    return useSelector((s: GlobalState) => s.summary[key]);
};

export const summaryAssign = <K extends SummaryKey>(
    key: K,
    value: Summary[K],
) => {
    return {type: Action.SUMMARY_ASSIGNED, payload: {key, value}};
};
