import * as React from 'react';
import {useStocks} from 'stocks/state';
import {SelectFilter, SelectFilterProps} from 'transactions/filters/SelectFilter';

export const StockSymbolFilter = ({onChange, filter}: Pick<SelectFilterProps, 'onChange' | 'filter'>) => (
    <SelectFilter onChange={onChange} filter={filter} nameKey="symbol" allowNone={false} items={useStocks()} />
);
