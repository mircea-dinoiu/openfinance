import {TransactionModel} from 'components/transactions/types';
import {Currency, CurrencyMap} from 'domain/currencies/defs';

export const findCurrencyById = (id: number, currencies: CurrencyMap): Currency => currencies[String(id)];

export const getCurrencyByISOCode = (ISOCode: string, currencies: CurrencyMap) =>
    Object.values(currencies).find((each) => each.iso_code === ISOCode);

export const getItemCurrencyISOCode = ({
    item,
    currencies,
}: {
    item: Pick<TransactionModel, 'money_location'>;
    currencies: CurrencyMap;
}) => currencies[item.money_location.currency_id].iso_code;
