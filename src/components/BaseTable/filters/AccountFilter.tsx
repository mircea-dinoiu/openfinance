import * as React from 'react';
import {SelectFilter} from './SelectFilter';
import {sortMoneyLocations} from 'components/transactions/helpers';
import {useMoneyLocations} from 'state/hooks';

export const AccountFilter = ({onChange, filter}) => (
    <SelectFilter
        onChange={onChange}
        filter={filter}
        allowNone={false}
        items={sortMoneyLocations(useMoneyLocations())}
    />
);
