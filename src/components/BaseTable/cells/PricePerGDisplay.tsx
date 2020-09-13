import {NumericValue} from 'components/formatters';
import {TransactionModel} from 'components/transactions/types';
import {getItemCurrencyISOCode} from 'helpers';
import * as React from 'react';
import {useCurrenciesMap} from 'state/currencies';

export const PricePerGDisplay = ({item}: {item: TransactionModel}) => {
    const currencies = useCurrenciesMap();
    const currencyISOCode = getItemCurrencyISOCode({
        item,
        currencies,
    });

    return item.sum_per_weight != null ? (
        <React.Fragment>
            <NumericValue
                value={Math.abs(item.sum_per_weight)}
                currency={currencyISOCode}
            />
            /g
        </React.Fragment>
    ) : (
        <></>
    );
};
