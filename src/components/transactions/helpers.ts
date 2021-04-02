import {TransactionModel} from 'components/transactions/types';
import {IncludeOption} from 'defs';
import {QueryParam} from 'defs/url';
import {AccountStatus} from 'domain/accounts/defs';
import {endOfDayToISOString} from 'js/utils/dates';
import {sumArray} from 'js/utils/numbers';
import {flatten, map, mapValues, sortBy, uniq, uniqBy} from 'lodash';
import moment from 'moment';
import {Accounts} from 'types';
import {useQueryParamState} from 'utils/url';

export const mergeItems = (items: TransactionModel[]): Partial<TransactionModel> | null => {
    const [, ...rest] = items;

    // nothing to do for one transaction selected
    if (!rest.length) {
        return null;
    }

    // cannot merge transactions from different accounts
    if (uniqBy(items, 'money_location_id').length > 1) {
        return null;
    }

    const base = {
        categories: uniq(flatten(map(items, 'categories'))),
        favorite: Math.max(...map(items, 'favorite')),
        item: uniq(map(items, 'item')).join(', '),
        weight: sumArray(map(items, 'weight')),
        users: mapValues(
            map(items, 'users').reduce((acc, users) => {
                for (const id in users) {
                    acc[id] = (acc[id] || 0) + users[id];
                }

                return acc;
            }, {}),
            (value) => Math.round(value / items.length),
        ),
    };

    // add up quantity when a single price exists
    if (uniqBy(items, 'price').length === 1) {
        return {
            ...base,
            quantity: sumArray(map(items, 'quantity')),
        };
    }

    // add up price when a single quantity exists
    if (uniqBy(items, 'quantity').length === 1) {
        return {
            ...base,
            price: sumArray(map(items, 'price')),
        };
    }

    return null;
};

export const sortMoneyLocations = (items: Accounts) =>
    sortBy(items, (item) => `${Object.values(AccountStatus).indexOf(item.status)}#${item.name}`);

export const useIncludePending = (): [boolean, (v: boolean) => void] => {
    const [value, setValue] = useQueryParamState(QueryParam.includePending, 'false' as string);

    return [value === 'true', (nextValue) => setValue(String(nextValue))];
};

export const useInclude = () => useQueryParamState<IncludeOption>(QueryParam.include, IncludeOption.all);

export const getEndDateBasedOnIncludePreference = (endDate: string, include: IncludeOption) => {
    if (include === IncludeOption.untilToday) {
        return endOfDayToISOString();
    }

    if (include === IncludeOption.untilTomorrow) {
        return endOfDayToISOString(
            moment()
                .add(1, 'day')
                .toDate(),
        );
    }

    if (include === IncludeOption.untilYesterday) {
        return endOfDayToISOString(
            moment()
                .subtract(1, 'day')
                .toDate(),
        );
    }

    if (include === IncludeOption.untilNow) {
        return moment().toISOString();
    }

    return endDate;
};
